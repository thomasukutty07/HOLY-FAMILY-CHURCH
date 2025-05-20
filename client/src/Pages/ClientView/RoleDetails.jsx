import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, UserCircle, UserCog, GraduationCap } from "lucide-react";

const RoleDetails = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { roleConfig } = location.state || {};

  // If roleConfig is not available, redirect back to leaders page
  if (!roleConfig) {
    navigate('/church/leaders');
    return null;
  }

  const config = roleConfig[role];

  // If role is not found, redirect back to leaders page
  if (!config) {
    navigate('/church/leaders');
    return null;
  }

  // Map of role to icon component
  const roleIcons = {
    vicar: <UserCircle className="w-8 h-8" />,
    sister: <Users className="w-8 h-8" />,
    coordinator: <UserCog className="w-8 h-8" />,
    teacher: <GraduationCap className="w-8 h-8" />
  };

  const MemberCard = ({ member, className = "" }) => (
    <div className={`group relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transform hover:-translate-y-2 transition-all duration-500">
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span className="text-sm font-medium text-indigo-600">
                {member.role}
              </span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
            {member.name}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-16">
        <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${config.gradient} text-white`}>
          {roleIcons[role]}
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {config.title}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {config.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {config.members.map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default RoleDetails; 