import React, { useEffect } from "react";
import { Element, scroller } from "react-scroll";
import ClientHome from "../ClientView/Home";
import AboutUs from "../ClientView/AboutUs";
import Birthdays from "../../Pages/ClientView/Birthdays";
import Contact from "../ClientView/Contact";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "@/Store/Calendar/calendarSlice";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, Gift } from "lucide-react";
import Thanks from "../ClientView/Thanks";

const HomeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);

  useEffect(() => {
    if (location.state?.scrollTo) {
        scroller.scrollTo(location.state.scrollTo, {
        duration: 300,
        smooth: true,
        offset: -100,
        });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const getEventTypeColor = (type) => {
    const colors = {
      general: "bg-neutral-100 text-neutral-700",
      mass: "bg-neutral-100 text-neutral-700",
      meeting: "bg-neutral-100 text-neutral-700",
      celebration: "bg-neutral-100 text-neutral-700",
      other: "bg-neutral-100 text-neutral-700"
    };
    return colors[type] || colors.general;
  };

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      eventDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="relative">
      {/* Main Content Sections */}
      <Element name="home" className="relative">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <ClientHome />
      </Element>
      
      <Element name="about" className="relative scroll-mt-[200px]" data-scroll="about">
        <AboutUs />
      </Element>

      {/* Events Section */}
      <Element name="events" className="relative scroll-mt-[200px]" data-scroll="events">
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Join us for our upcoming events and celebrations at Holy Family Church.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-600" />
                  <p className="text-neutral-600">Loading events...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Card key={event._id} className="overflow-hidden bg-white border border-neutral-200 hover:shadow-lg transition-all duration-300">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className={`h-1 ${getEventTypeColor(event.type).split(' ')[0]}`}></div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                              <CardTitle className="text-lg font-semibold text-neutral-900 line-clamp-1">
                                {event.title}
                              </CardTitle>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm">
                              {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-neutral-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm">{event.time}</span>
                          </div>
                          {event.description && (
                            <div className="pt-2 border-t border-neutral-100">
                              <p className="text-sm text-neutral-600 line-clamp-2">
                                {event.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neutral-600 text-lg">
                      No upcoming events scheduled at the moment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </Element>

      {/* Birthdays Section */}
      <Element name="birthdays" className="relative scroll-mt-[200px]" data-scroll="birthdays">
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                Celebrations
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Birthday Celebrations
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join us in celebrating the special days of our church family members
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Today's Birthdays */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Today's Celebrations
                    </h3>
                  </div>
                  <div className="p-6">
                    <Birthdays variant="today" />
                  </div>
                </div>

                {/* Upcoming Birthdays */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming Birthdays
                    </h3>
                  </div>
                  <div className="p-6">
                    <Birthdays variant="upcoming" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* Contact Section */}
      <Element name="contact" className="relative scroll-mt-[200px]" data-scroll="contact">
        <Contact />
      </Element>

      {/* Thanks Section */}
      <Element name="thanks" className="relative scroll-mt-[200px]" data-scroll="thanks">
        <Thanks />
      </Element>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
      </div>
    </div>
  );
};

export default HomeLayout;
