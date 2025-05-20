import React, { useEffect, useState } from "react";
import { images } from "@/config";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, MapPin, Church } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

const ClientHome = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events
    axios.get("http://localhost:4000/church/calendar/events")
      .then(res => {
        const currentDate = new Date();
        const upcomingEvents = res.data.events
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(upcomingEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-compacta bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent mb-6">
            Welcome to Holy Family Church
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Join us in worship and fellowship as we celebrate our faith together.
            Established in 1965, we continue to serve our community with love and devotion.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
            <MapPin className="w-5 h-5" />
            <span>Idukki Kiliyarkandam, 685604</span>
          </div>
        </div>

        {/* Mass Schedule Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white">Mass Schedule</h2>
              <p className="text-gray-400">
                Join us for our regular Sunday masses. All are welcome to participate
                in our worship services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <p className="text-indigo-400 font-medium">6:00 AM</p>
                </div>
                <p className="text-gray-300">Early Morning Mass</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <p className="text-indigo-400 font-medium">8:00 AM</p>
                </div>
                <p className="text-gray-300">Morning Mass</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <p className="text-indigo-400 font-medium">10:15 AM</p>
                </div>
                <p className="text-gray-300">Late Morning Mass</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative group">
              <img
                src={images.holy_family}
                alt="Holy Family Church"
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Events Section - Only show if there are events */}
        {!loading && events.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-4">Upcoming Events</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join us for these special occasions and celebrations in our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
                >
                  {/* Event Header with Type Indicator */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10 text-center">
                      <Church className="w-12 h-12 text-white/80 mx-auto mb-3" />
                      <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm">
                        {event.type?.charAt(0).toUpperCase() + event.type?.slice(1) || 'Event'}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-indigo-400 mb-3">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 rounded-2xl transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHome; 