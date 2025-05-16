import React from "react";
import { images } from "@/config";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, MapPin } from "lucide-react";

const ClientHome = () => {
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

            <div className="flex items-center gap-4 text-gray-400">
              <MapPin className="w-5 h-5" />
              <p>123 Church Street, Your City, State</p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative group">
              <img
                src={images.marpapa}
                alt="Church Interior"
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-6 rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            <Link to="/church/events" className="flex items-center gap-2">
              View Upcoming Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientHome; 