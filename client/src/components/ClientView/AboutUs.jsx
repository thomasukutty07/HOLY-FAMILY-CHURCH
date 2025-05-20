import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Heart, Users } from "lucide-react";
import axios from "axios";

const PUBLIC_ROLES = ["vicar", "coordinator", "teacher", "sister", "sister_superior"];

const AboutUs = () => {
  const [publicMembers, setPublicMembers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/church/members/public-members")
      .then(res => setPublicMembers(res.data.members))
      .catch(() => setPublicMembers([]));
  }, []);

  const vicar = publicMembers.find(m => m.role?.toLowerCase() === "vicar");
  const coordinators = publicMembers.filter(m => m.role?.toLowerCase() === "coordinator");
  const teachers = publicMembers.filter(m => m.role?.toLowerCase() === "teacher");
  const sisters = publicMembers.filter(m => m.role?.toLowerCase() === "sister");
  const sisterSuperiors = publicMembers.filter(m => m.role?.toLowerCase() === "sister_superior");

  const MemberCard = ({ member, isLarge = false }) => {
    const isRightImage = member.role?.toLowerCase() === "vicar" || member.role?.toLowerCase() === "coordinator";
    const isVicar = member.role?.toLowerCase() === "vicar";
    
    return (
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {isRightImage ? (
            <div className="relative w-full">
              {/* Image Section */}
              <div className={`relative ${isVicar ? 'h-[600px]' : 'h-[400px]'}`}>
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className={`${isVicar ? 'text-4xl' : 'text-3xl'} font-bold text-white text-center px-4`}>
                    {member.name}
                  </h3>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-medium text-indigo-400 mb-4">ABOUT US</h2>
          <h1 className="text-5xl md:text-7xl font-compacta bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
            Our Story
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-400">
            Journey through time and discover how our church has grown and evolved,
            touching countless lives with God's love and grace since 1965.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Timeline */}
          <div className="space-y-8 lg:space-y-12">
            <div className="relative pl-8 border-l-2 border-indigo-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400" />
                  <span className="text-indigo-400 font-medium text-sm lg:text-base">1965</span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">The Beginning</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Holy Family Church was established in 1965, beginning its journey
                  as a spiritual beacon in the community. From humble beginnings,
                  we've grown into a vibrant center of faith and worship.
                </p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium text-sm lg:text-base">1980s</span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">Growing Together</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Through dedication and faith, our community flourished, establishing
                  various ministries and programs to serve our growing congregation.
                </p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-pink-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-pink-400" />
                  <span className="text-pink-400 font-medium text-sm lg:text-base">Present Day</span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">A Thriving Community</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Today, we continue to serve our community with three Sunday masses,
                  welcoming all to join us in worship at 6:00 AM, 8:00 AM, and 10:15 AM.
                  Our commitment to faith, family, and service remains stronger than ever.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Team Members */}
          <div className="relative -mt-8 lg:-mt-12">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl"></div>
            
            {/* Content Container */}
            <div className="relative p-4 lg:p-8">
              {/* Section Title */}
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">Our Leadership</h2>
                <div className="h-px w-16 lg:w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto"></div>
              </div>

              {/* New Grid Layout */}
              <div className="space-y-6">
                {/* First Row - Vicar and Two Coordinators */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Vicar Card */}
                  {vicar && (
                    <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                      <img
                        src={vicar.imageUrl}
                        alt={vicar.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{vicar.name}</h3>
                          <p className="text-lg sm:text-xl text-indigo-200">Vicar</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-colors duration-500"></div>
                    </div>
                  )}

                  {/* Two Coordinators Side by Side */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-[500px]">
                    {coordinators.slice(0, 2).map((member, index) => (
                      <div 
                        key={member._id} 
                        className="group relative rounded-xl overflow-hidden shadow-lg h-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                            <p className="text-sm lg:text-base text-indigo-200">Coordinator</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Second Row - Remaining Coordinators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {coordinators.slice(2).map((member, index) => (
                    <div 
                      key={member._id} 
                      className="group relative rounded-xl overflow-hidden shadow-lg h-[300px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                          <p className="text-sm lg:text-base text-indigo-200">Coordinator</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 lg:w-32 h-24 lg:h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 lg:w-32 h-24 lg:h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 lg:mt-20 text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 lg:px-8 py-4 lg:py-6 rounded-full text-base lg:text-lg transition-all duration-300 hover:scale-105"
          >
            <Link to="/church/leaders" className="flex items-center gap-2">
              Meet Our Leaders
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
