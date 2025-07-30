import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Heart, Users } from "lucide-react";
import axios from "axios";
import { images } from "@/config";
import { motion, AnimatePresence } from "framer-motion";

const PUBLIC_ROLES = ["vicar", "coordinator", "teacher", "sister", "sister_superior"];

const AboutAndHistory = () => {
  const [publicMembers, setPublicMembers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/church/members/public-members")
      .then(res => setPublicMembers(res.data.members))
      .catch(() => setPublicMembers([]));

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector("#about-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const vicar = publicMembers.find(m => m.role?.toLowerCase() === "vicar");
  const coordinators = publicMembers.filter(m => m.role?.toLowerCase() === "coordinator");
  const teachers = publicMembers.filter(m => m.role?.toLowerCase() === "teacher");
  const sisters = publicMembers.filter(m => m.role?.toLowerCase() === "sister");
  const sisterSuperiors = publicMembers.filter(m => m.role?.toLowerCase() === "sister_superior");

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div id="about-section" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-20 bg-[#0A0A0A] overflow-hidden scroll-mt-36">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20 relative z-10"
        >
          <h2 className="text-sm font-medium text-indigo-400 mb-3 sm:mb-4">ABOUT US</h2>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Our Legacy of Faith
          </h1>
          <p className="max-w-2xl mx-auto mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400 px-4">
            Journey through time and discover how our church has grown and evolved,
            touching countless lives with God's love and grace since 1965.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start">
          {/* Left Column - Timeline and Team Members (on mobile) */}
          <motion.div 
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8 lg:space-y-12"
          >
            <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-400" />
                  <span className="text-indigo-400 font-medium text-sm lg:text-base">1965</span>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">The Beginning</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Holy Family Church was established in 1965, beginning its journey
                  as a spiritual beacon in the community. From humble beginnings,
                  we've grown into a vibrant center of faith and worship.
                </p>
              </motion.div>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium text-sm lg:text-base">1980s</span>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Growing Together</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Through dedication and faith, our community flourished, establishing
                  various ministries and programs to serve our growing congregation.
                </p>
              </motion.div>
            </div>

            {/* Team Members Section (Visible on mobile, hidden on lg) */}
            <div className="lg:hidden mb-6 sm:mb-8 md:mb-12">
              {/* First Row: Vicar and First Coordinator */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Vicar Card */}
                {vicar && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="group relative rounded-xl overflow-hidden shadow-lg h-[350px] sm:h-[450px] md:h-[550px] sm:w-2/3 w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                    <img
                      src={vicar.imageUrl}
                      alt={vicar.name}
                      className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{vicar.name}</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Vicar</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                  </motion.div>
                )}

                {/* First Coordinator Card (next to vicar on sm/md) */}
                {coordinators.slice(0, 1).map((member, index) => (
                   <motion.div 
                    key={member._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="group relative rounded-xl overflow-hidden shadow-lg h-[350px] sm:h-[450px] md:h-[550px] sm:w-1/3 w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Coordinator</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                  </motion.div>
                ))}
              </div>

              {/* Remaining Coordinators Grid */}
              {coordinators.slice(1).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coordinators.slice(1).map((member, index) => (
                    <motion.div 
                      key={member._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.2 }}
                      className="group relative rounded-xl overflow-hidden shadow-lg h-[250px] sm:h-[300px] md:h-[350px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                          <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Coordinator</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-1 gap-4 mt-6 sm:mt-8"
            >
              {/* Mother's Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="group relative rounded-xl overflow-hidden shadow-lg h-[350px] sm:h-[450px] md:h-[550px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <img
                  src={images.person4}
                  alt="Mother"
                  className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">Mother Superior</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Sister Superior</p>
                  </div>
                </div>
                <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
              </motion.div>

              {/* Sisters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sisters.slice(0, 2).map((sister, index) => (
                  <motion.div 
                    key={sister._id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                    className="group relative rounded-xl overflow-hidden shadow-lg h-[300px] sm:h-[350px] md:h-[400px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                    <img
                      src={sister.imageUrl}
                      alt={sister.name}
                      className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{sister.name}</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Sister</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Team Members (Visible only on lg and above) */}
          <motion.div 
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative -mt-4 sm:-mt-8 lg:-mt-12 hidden lg:block"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl"></div>
            
            {/* Content Container */}
            <div className="relative p-3 sm:p-4 lg:p-8">
              {/* Leadership Section for lg and above */}
              <div className="space-y-6">
                {/* First Row: Vicar and First Two Coordinators */}
                <div className="grid lg:grid-cols-[2fr_1fr] gap-4 items-start">
                  {/* Vicar Card */}
                  {vicar && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="group relative rounded-xl overflow-hidden shadow-lg h-[450px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                      <img
                        src={vicar.imageUrl}
                        alt={vicar.name}
                        className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{vicar.name}</h3>
                          <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Vicar</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                    </motion.div>
                  )}

                  {/* First Two Coordinators Stacked (within the second column of the first row) */}
                  <div className="flex flex-col gap-4 h-[450px]">
                    {coordinators.slice(0, 2).map((member, index) => (
                      <motion.div 
                        key={member._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        className="group relative rounded-xl overflow-hidden shadow-lg flex-1"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Coordinator</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Remaining Coordinators Grid - Below the first row */}
                {coordinators.slice(2).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {coordinators.slice(2).map((member, index) => (
                      <motion.div 
                        key={member._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                        className="group relative rounded-xl overflow-hidden shadow-lg h-[350px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover object-[center_30%] sm:object-center transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-indigo-200">Coordinator</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-8 sm:mt-12 lg:mt-20 text-center"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-full text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105"
          >
            <Link to="/church/leaders" className="flex items-center gap-2">
              Meet Our Leaders
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutAndHistory; 