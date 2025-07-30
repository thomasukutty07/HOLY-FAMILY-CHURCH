import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../Store/Calendar/calendarSlice";
import { format } from "date-fns";
import { Card } from "../ui/card";
import { Calendar, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const currentDate = new Date();
      eventDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      return eventDate >= currentDate;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">No Upcoming Events</h2>
          <p className="text-gray-400">Check back later for new events and celebrations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-compacta text-white mb-4">Upcoming Events</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join us for our upcoming events and celebrations. We look forward to seeing you there!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card
              key={event._id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>{format(new Date(event.date), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events; 