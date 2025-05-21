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
    <div id="about-section" className="py-32 px-6 md:px-20 bg-[#0A0A0A] overflow-hidden scroll-mt-36">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative z-10"
        >
          <h2 className="text-sm font-medium text-indigo-400 mb-4">ABOUT US</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Legacy of Faith
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-400">
            Journey through time and discover how our church has grown and evolved,
            touching countless lives with God's love and grace since 1965.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Timeline */}
          <motion.div 
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 lg:space-y-12"
          >
            <div className="relative pl-8 border-l-2 border-indigo-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500"></div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-colors duration-300"
              >
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
              </motion.div>
            </div>

            <div className="relative pl-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium text-sm lg:text-base">1980s</span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">Growing Together</h3>
                <p className="text-sm lg:text-base text-gray-400">
                  Through dedication and faith, our community flourished, establishing
                  various ministries and programs to serve our growing congregation.
                </p>
              </motion.div>
            </div>

            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-1 gap-4 mt-8"
            >
              {/* Mother's Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="group relative rounded-xl overflow-hidden shadow-lg h-[500px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <img
                  src={images.person4}
                  alt="Mother"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">Mother Superior</h3>
                    <p className="text-sm lg:text-base text-indigo-200">Sister Superior</p>
                  </div>
                </div>
                <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
              </motion.div>

              {/* Sisters Grid */}
              <div className="grid grid-cols-2 gap-4">
                {sisters.slice(0, 2).map((sister, index) => (
                  <motion.div 
                    key={sister._id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                    className="group relative rounded-xl overflow-hidden shadow-lg h-[300px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                    <img
                      src={sister.imageUrl}
                      alt={sister.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">{sister.name}</h3>
                        <p className="text-sm lg:text-base text-indigo-200">Sister</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Team Members */}
          <motion.div 
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative -mt-8 lg:-mt-12"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl"></div>
            
            {/* Content Container */}
            <div className="relative p-4 lg:p-8">
              {/* Leadership Grid */}
              <div className="space-y-6">
                {/* First Row - Vicar and Two Coordinators */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Vicar Card - Larger */}
                  {vicar && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="group relative rounded-xl overflow-hidden shadow-lg h-[500px] lg:col-span-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                      <img
                        src={vicar.imageUrl}
                        alt={vicar.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 line-clamp-1">{vicar.name}</h3>
                          <p className="text-sm lg:text-base text-indigo-200">Vicar</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                    </motion.div>
                  )}

                  {/* Two Coordinators - Stacked */}
                  <div className="grid grid-cols-1 gap-4 h-[500px]">
                    {coordinators.slice(0, 2).map((member, index) => (
                      <motion.div 
                        key={member._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                        className="group relative rounded-xl overflow-hidden shadow-lg h-[240px]"
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
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Second Row - Remaining Coordinators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coordinators.slice(2).map((member, index) => (
                    <motion.div 
                      key={member._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
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
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 lg:w-32 h-24 lg:h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 lg:w-32 h-24 lg:h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 lg:mt-20 text-center"
        >
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 lg:px-8 py-4 lg:py-6 rounded-full text-base lg:text-lg transition-all duration-300 hover:scale-105"
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