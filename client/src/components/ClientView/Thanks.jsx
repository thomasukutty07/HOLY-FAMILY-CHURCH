import React from "react";
import {
  Heart,
  Users,
  Star,
  Church,
  BookOpen,
  Code,
} from "lucide-react";

const Thanks = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-300 shadow-lg">
              <Church className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            With Gratitude
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We extend our heartfelt thanks to all those who have contributed to
            making this digital home for our church community at Holy Family
            Church, Kiliyarkandam.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Founders Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Star className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Founders</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Rev. Fr. George Perumalil
                </h3>
                <p className="text-gray-400 text-sm">
                  For his visionary leadership and guidance in establishing this
                  digital platform for our church community. His dedication to
                  modernizing our church's outreach has been instrumental in
                  bringing our community closer together.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Thomasukutty Reji
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">
                    A skilled developer who crafted our church's digital platform with expertise in modern web technologies. His work combines elegant design with robust functionality, creating an intuitive experience that serves our community's needs while maintaining scalability for future growth.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">Web Development</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">UI/UX Design</span>
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs">System Architecture</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Technical Leadership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Contributors</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Parish Council
                </h3>
                <p className="text-gray-400 text-sm">
                  For their invaluable input and support in shaping the
                  website's content and features. Their deep understanding of
                  our community's needs has helped create a platform that truly
                  serves our parishioners.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Parish Community
                </h3>
                <p className="text-gray-400 text-sm">
                  For their continuous support and feedback in making this
                  platform better. The active participation of our community
                  members has been crucial in creating a website that truly
                  reflects our church's spirit.
                </p>
              </div>
            </div>
          </div>

          {/* Special Thanks Section */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-500/20 rounded-xl">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Special Thanks</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Technical Support
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  To Keyshell for providing reliable hosting services and
                  technical infrastructure. Their expertise in web hosting has
                  ensured our website remains accessible and secure for our
                  community.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Content Contributors
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  To everyone who contributed their time and effort in creating
                  and reviewing the website content. Their dedication to
                  accuracy and detail has helped maintain the authenticity of
                  our church's digital presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Thanks;
 