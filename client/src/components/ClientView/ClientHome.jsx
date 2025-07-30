import React, { useEffect } from "react";
import { images } from "@/config";
import { Button } from "../ui/button";
import { scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../Store/Calendar/calendarSlice";
import { format } from "date-fns";
import { Card } from "../ui/card";
import { Calendar, Clock, Loader2 } from "lucide-react";

const ClientHome = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleScrollTo = (target) => {
    scroller.scrollTo(target, {
      duration: 1000,
      smooth: "easeInOutQuart",
      offset: -100,
    });
  };

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-compacta text-white">
              Welcome to Holy Family Church
            </h1>
            <p className="text-[16px] md:text-[17px] text-gray-400">
              A place of worship, community, and spiritual growth. Join us in celebrating our faith and building meaningful connections.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => handleScrollTo("contact")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative group">
              <img
                src={images.holy_family}
                alt="Holy Family Church"
                className="w-full h-[600px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-20" id="events">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-compacta text-white mb-4">Upcoming Events</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join us for our upcoming events and celebrations. We look forward to seeing you there!
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHome; 