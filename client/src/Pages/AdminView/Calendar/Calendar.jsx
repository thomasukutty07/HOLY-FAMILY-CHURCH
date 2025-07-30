import React, { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchEvents, addEvent, updateEvent, deleteEvent } from "@/Store/Calendar/calendarSlice";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "@/components/Common/DeletePopUp";

const Calendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState("general");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState("12:00");
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
  });

  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

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
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (!eventId) {
      console.error("No event ID provided for deletion");
      return;
    }

    const eventToDelete = events.find(event => event._id === eventId);
    if (!eventToDelete) {
      console.error("Event not found:", eventId);
      return;
    }

    setSelectedEvent(eventToDelete);
    setDialogConfig({
      title: "Delete Event",
      description: `Are you sure you want to delete "${eventToDelete.title}"?`,
      message: "This action cannot be undone. The event will be permanently removed from the calendar.",
      confirmLabel: "Delete Event",
    });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent?._id) {
      console.error("No event selected for deletion");
      return;
    }

    try {
      console.log("Attempting to delete event:", selectedEvent._id);
      const result = await dispatch(deleteEvent(selectedEvent._id)).unwrap();
      console.log("Delete result:", result);
      
      if (result?.success) {
        toast.success("Event deleted successfully");
        setIsDeleteDialogOpen(false);
        setIsEditEventOpen(false);
        resetForm();
      } else {
        throw new Error(result?.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Failed to delete event");
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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Church Calendar
            </h1>
            <p className="text-gray-600 mt-1">Manage and schedule church events</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddEventOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Monthly View</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
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
                  fontWeight: "600",
                },
              }}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-400 opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {events
                .filter((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  eventDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event._id}
                    className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer bg-white/50 backdrop-blur-sm"
                    onClick={() => openEditDialog(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(event.date), "MMM dd, yyyy")} at {event.time}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="border-gray-200 focus:border-indigo-500">
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
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(eventDate, "yyyy-MM-dd")}
                onChange={(e) => setEventDate(new Date(e.target.value))}
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">Time</Label>
              <Input
                id="time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
                className="border-gray-200 focus:border-indigo-500 min-h-[100px]"
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
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddEvent} 
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Event...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Event Title</Label>
              <Input
                id="edit-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type" className="text-sm font-medium text-gray-700">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="border-gray-200 focus:border-indigo-500">
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
              <Label htmlFor="edit-date" className="text-sm font-medium text-gray-700">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={format(eventDate, "yyyy-MM-dd")}
                onChange={(e) => setEventDate(new Date(e.target.value))}
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-time" className="text-sm font-medium text-gray-700">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="border-gray-200 focus:border-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                id="edit-description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
                className="border-gray-200 focus:border-indigo-500 min-h-[100px]"
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
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedEvent) {
                  handleDeleteEvent(selectedEvent._id);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
            <Button 
              onClick={handleEditEvent} 
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Calendar; 