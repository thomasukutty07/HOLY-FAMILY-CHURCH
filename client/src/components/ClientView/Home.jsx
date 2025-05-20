import React from "react";
import { images } from "../../config/index.js";
import { MapPin, ArrowDown, Calendar, Users, Heart } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

const ClientHome = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative flex items-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-20 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Main Content */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-compacta leading-none">
                  <span className="block text-white">Welcome to</span>
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Holy Family
                  </span>
                  <span className="block text-white">Church</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                  A place of worship, community, and spiritual growth. Join us in our journey of faith,
                  love, and service to God and our community.
                </p>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <Calendar className="w-6 h-6 text-indigo-400 mb-2" />
                  <h3 className="text-white font-medium">Sunday Mass</h3>
                  <p className="text-gray-400 text-sm">6:00 AM, 8:00 AM & 10:15 AM</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <Users className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="text-white font-medium">Community</h3>
                  <p className="text-gray-400 text-sm">Join Our Family</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <Heart className="w-6 h-6 text-pink-400 mb-2" />
                  <h3 className="text-white font-medium">Charity</h3>
                  <p className="text-gray-400 text-sm">Help & Support</p>
                </div>
              </div>

              {/* Location & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                  <MapPin className="text-indigo-400" size={20} />
                  <p className="text-white">
                    Idukki, Kiliyarkandam, 685604
                  </p>
                </div>
                
                <ScrollLink
                  to="history"
                  smooth={true}
                  duration={1000}
                  className="group flex items-center gap-2 text-white hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span className="text-lg">Discover More</span>
                  <ArrowDown className="group-hover:translate-y-1 transition-transform" size={20} />
                </ScrollLink>
              </div>
            </div>

            {/* Right Column - Image & Decorative Elements */}
            <div className="relative">
              <div className="relative z-10">
                <div className="relative">
                  <img
                    src={images.holy_family}
                    className="w-full rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500 border border-white/10"
                    alt="Holy Family Church"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
