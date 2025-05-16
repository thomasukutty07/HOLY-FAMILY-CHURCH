import React, { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "@/Store/Calendar/calendarSlice";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState("general");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState("12:00");

  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Add debugging logs
  useEffect(() => {
    console.log('Current events:', events);
    if (events.length > 0) {
      console.log('First event date:', new Date(events[0].date));
      console.log('Current date:', new Date());
    }
  }, [events]);

  const eventTypes = [
    { value: "general", label: "General" },
    { value: "mass", label: "Mass" },
    { value: "meeting", label: "Meeting" },
    { value: "celebration", label: "Celebration" },
    { value: "other", label: "Other" }
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      mass: "bg-purple-100 text-purple-800",
      meeting: "bg-green-100 text-green-800",
      celebration: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.general;
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        type: eventType
      };

      const result = await dispatch(addEvent(eventData)).unwrap();
      if (result?.success) {
        toast.success("Event added successfully");
        setIsAddEventOpen(false);
        resetForm();
      } else {
        throw new Error(result?.message || "Failed to add event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add event");
      console.error("Error adding event:", error);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent || !eventTitle || !eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        type: eventType
      };

      const result = await dispatch(updateEvent({ id: selectedEvent._id, eventData })).unwrap();
      if (result?.success) {
        toast.success("Event updated successfully");
        setIsEditEventOpen(false);
        resetForm();
      } else {
        throw new Error(result?.message || "Failed to update event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update event");
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const result = await dispatch(deleteEvent(eventId)).unwrap();
      if (result?.success) {
        toast.success("Event deleted successfully");
        setIsEditEventOpen(false);
      } else {
        throw new Error(result?.message || "Failed to delete event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventDate(new Date());
    setEventTime("12:00");
    setEventType("general");
    setSelectedEvent(null);
  };

  const openEditDialog = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || "");
    setEventDate(new Date(event.date));
    setEventTime(event.time);
    setEventType(event.type);
    setIsEditEventOpen(true);
  };

  if (loading && !events.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Church Calendar</h1>
        <Button
          onClick={() => setIsAddEventOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly View</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                event: (date) =>
                  events.some(
                    (event) =>
                      new Date(event.date).toDateString() === date.toDateString()
                  ),
              }}
              modifiersStyles={{
                event: {
                  backgroundColor: "rgb(79 70 229 / 0.1)",
                  color: "rgb(79 70 229)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  // Reset time components for accurate date comparison
                  eventDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event._id}
                    className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openEditDialog(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), "MMM dd, yyyy")} at {event.time}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(eventDate, "yyyy-MM-dd")}
                onChange={(e) => setEventDate(new Date(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddEventOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Event Title</Label>
              <Input
                id="edit-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={format(eventDate, "yyyy-MM-dd")}
                onChange={(e) => setEventDate(new Date(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditEventOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedEvent) {
                  handleDeleteEvent(selectedEvent._id);
                  setIsEditEventOpen(false);
                }
              }}
            >
              Delete
            </Button>
            <Button onClick={handleEditEvent} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar; 