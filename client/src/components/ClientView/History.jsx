import React, { useEffect } from "react";
import { images } from "@/config";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Heart, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllMembers } from "@/Store/User/memberSlice";

const History = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.member) || {};
  const vicar = members?.find((m) => m.role === "vicar" && m.imageUrl);
  const coordinators = members?.filter((m) => m.role === "coordinator" && m.imageUrl).slice(0, 5) || [];

  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  return (
    <div className="min-h-screen py-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-medium text-indigo-400 mb-4">OUR STORY</h2>
          <h1 className="text-5xl md:text-7xl font-compacta bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
            A Legacy of Faith
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

          {/* Right Column - Vicar & Coordinator Images + Image Gallery */}
          <div className="relative">
            {/* Vicar & Coordinator Images */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {vicar && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg">
                  <img src={vicar.imageUrl} alt={vicar.name} className="w-full h-full object-cover" />
                </div>
              )}
              {coordinators.map((coordinator) => (
                <div key={coordinator._id} className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-400 shadow-md">
                  <img src={coordinator.imageUrl} alt={coordinator.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="relative group">
                  <img
                    src={images.marpapa}
                    alt="Church History"
                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                </div>
              </div>
              <div className="relative group">
                <img
                  src={images.person2}
                  alt="Community"
                  className="w-full h-[200px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              </div>
              <div className="relative group">
                <img
                  src={images.person3}
                  alt="Events"
                  className="w-full h-[200px] object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              </div>
            </div>
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

export default History;
