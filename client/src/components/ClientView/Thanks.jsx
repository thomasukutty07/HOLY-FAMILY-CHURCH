import React from "react";
import {
  Heart,
  Users,
  Star,
  Award,
  Church,
  BookOpen,
  Code,
} from "lucide-react";

const Thanks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300 shadow-lg">
              <Church className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            With Gratitude
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We extend our heartfelt thanks to all those who have contributed to
            making this digital home for our church community at Holy Family
            Church, Kiliyarkandam.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Founders Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Star className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Founders</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Rev. Fr. George Perumalil
                </h3>
                <p className="text-gray-400">
                  For his visionary leadership and guidance in establishing this
                  digital platform for our church community. His dedication to
                  modernizing our church's outreach has been instrumental in
                  bringing our community closer together.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Thomasukutty Reji
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-400">
                    A visionary developer who has masterfully crafted our church's digital presence. His innovative approach combines cutting-edge technology with intuitive design, creating a seamless experience for our community. Through his expertise in modern web development and system architecture, he has built a robust platform that not only serves our current needs but is also scalable for future growth. His commitment to excellence and attention to detail has resulted in a website that truly reflects the spirit and values of Holy Family Church.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">Web Development</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">UI/UX Design</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">System Architecture</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Technical Leadership</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Innovation</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Problem Solving</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Contributors</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Parish Council
                </h3>
                <p className="text-gray-400">
                  For their invaluable input and support in shaping the
                  website's content and features. Their deep understanding of
                  our community's needs has helped create a platform that truly
                  serves our parishioners.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Parish Community
                </h3>
                <p className="text-gray-400">
                  For their continuous support and feedback in making this
                  platform better. The active participation of our community
                  members has been crucial in creating a website that truly
                  reflects our church's spirit.
                </p>
              </div>
            </div>
          </div>

          {/* Special Thanks Section */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Special Thanks</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Technical Support
                  </h3>
                </div>
                <p className="text-gray-400">
                  To Keyshell for providing reliable hosting services and
                  technical infrastructure. Their expertise in web hosting has
                  ensured our website remains accessible and secure for our
                  community.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Content Contributors
                  </h3>
                </div>
                <p className="text-gray-400">
                  To everyone who contributed their time and effort in creating
                  and reviewing the website content. Their dedication to
                  accuracy and detail has helped maintain the authenticity of
                  our church's digital presence.
                </p>
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              This website represents our commitment to building a stronger,
              more connected church community at Holy Family Church,
              Kiliyarkandam. As we continue to grow and evolve, we remain
              dedicated to enhancing our digital presence to better serve our
              parishioners and reach out to those seeking spiritual guidance.
              Our goal is to create a welcoming digital space that reflects the
              warmth and inclusivity of our physical church community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Thanks;
 