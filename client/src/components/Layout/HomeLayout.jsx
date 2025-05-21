import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ClientHeader from "../ClientView/Header";
import AboutAndHistory from "../ClientView/AboutAndHistory";
import Contact from "../ClientView/Contact";
import ClientHome from "../ClientView/ClientHome";
import { Element, scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../Store/Calendar/calendarSlice";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Calendar, Loader2, ArrowUp, Gift } from "lucide-react";
import Thanks from "../ClientView/Thanks";
import Birthdays from "../../Pages/ClientView/Birthdays";

const HomeLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);

    if (location.state?.scrollTo) {
      const { target, duration = 1000 } = location.state;
      scroller.scrollTo(target, {
        duration: duration,
        smooth: "easeInOutQuart",
        offset: -100,
        spy: true,
        hashSpy: true
      });
    }
  }, [location]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Add scroll event listener to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      <ClientHeader />
      <main className="flex-grow relative">
        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Home Section */}
          <Element name="home">
            <ClientHome />
          </Element>

          {/* About Section */}
          <Element name="about">
            <div className="scroll-mt-24">
              <AboutAndHistory />
            </div>
          </Element>

          {/* Birthdays Section */}
          <Element name="birthdays">
            <div className="scroll-mt-24">
              <div className="min-h-screen bg-[#0A0A0A] py-20 px-4 md:px-20">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold text-white mb-4">Birthday Celebrations</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Join us in celebrating the special days of our church members. 
                      Let's share joy and blessings with those who make our community special.
                    </p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Today's Birthdays */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white flex items-center gap-2 font-compacta text-2xl">
                          <Gift className="h-6 w-6 text-pink-400" />
                          Today's Celebrations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Birthdays variant="today" />
                      </CardContent>
                    </Card>

                    {/* Upcoming Birthdays */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white flex items-center gap-2 font-compacta text-2xl">
                          <Calendar className="h-6 w-6 text-indigo-400" />
                          Upcoming Birthdays
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Birthdays variant="upcoming" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Element>

          {/* Contact Section */}
          <Element name="contact">
            <div className="scroll-mt-24">
              <Contact />
            </div>
          </Element>

          {/* Thanks Section */}
          <Element name="thanks">
            <div className="scroll-mt-24">
              <Thanks />
            </div>
          </Element>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
    </div>
  );
};

export default HomeLayout;
