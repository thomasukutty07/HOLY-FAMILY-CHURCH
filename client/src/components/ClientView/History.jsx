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

        {/* Timeline Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Timeline */}
          <div className="space-y-12">
            <div className="relative pl-8 border-l-2 border-indigo-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-400 font-medium">1965</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">The Beginning</h3>
                <p className="text-gray-400">
                  Holy Family Church was established in 1965, beginning its journey
                  as a spiritual beacon in the community. From humble beginnings,
                  we've grown into a vibrant center of faith and worship.
                </p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium">1980s</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Growing Together</h3>
                <p className="text-gray-400">
                  Through dedication and faith, our community flourished, establishing
                  various ministries and programs to serve our growing congregation.
                </p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-pink-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-500"></div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span className="text-pink-400 font-medium">Present Day</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">A Thriving Community</h3>
                <p className="text-gray-400">
                  Today, we continue to serve our community with three Sunday masses,
                  welcoming all to join us in worship at 6:00 AM, 8:00 AM, and 10:15 AM.
                  Our commitment to faith, family, and service remains stronger than ever.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Classic Card Grid with Standard Text Style */}
          <div className="relative w-full grid grid-cols-2 gap-8 items-stretch">
            {/* Vicar - Large, left column, spans two rows */}
            {vicar && (
              <div className="row-span-2 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border-2 border-indigo-400 p-4">
                <img
                  src={vicar.imageUrl}
                  alt={vicar.name}
                  className="w-full h-[380px] object-cover rounded-lg shadow"
                />
                <div className="text-center mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{vicar.name || "Vicar"}</h3>
                  <p className="text-base text-gray-500 font-medium">{vicar.role || "Vicar"}</p>
                </div>
              </div>
            )}

            {/* Other Leaders - Simple Card Grid with Standard Text */}
            {[...coordinators, ...teachers, ...sisters, ...sisterSuperiors].map((member) => (
              <div
                key={member._id}
                className="flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 p-3"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-[160px] object-cover rounded-lg shadow"
                />
                <span className="text-base font-semibold text-gray-900 mt-2">{member.name}</span>
                <span className="text-sm text-gray-500 mt-1">{member.role}</span>
              </div>
            ))}

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-6 rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            <Link to="/church/leaders" className="flex items-center gap-2">
              Meet Our Leaders
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
