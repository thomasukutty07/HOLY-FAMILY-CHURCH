import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Users, BookOpen, UserCircle, UserCog, GraduationCap, Home, Phone, Mail } from "lucide-react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Leaders = () => {
  const [publicMembers, setPublicMembers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/church/members/public-members")
      .then(res => {
        console.log("Public members data:", res.data.members);
        setPublicMembers(res.data.members);
      })
      .catch(error => {
        console.error("Error fetching public members:", error);
        setPublicMembers([]);
      });
  }, []);

  const vicar = publicMembers.find(m => m.role?.toLowerCase() === "vicar");
  const coordinators = publicMembers.filter(m => m.role?.toLowerCase() === "coordinator");
  const teachers = publicMembers.filter(m => m.role?.toLowerCase() === "teacher");
  const sisters = publicMembers.filter(m => m.role?.toLowerCase() === "sister");
  const sisterSuperiors = publicMembers.filter(m => m.role?.toLowerCase() === "sister_superior");

  const MemberImage = ({ src, alt }) => (
    <div className="relative w-full aspect-[3/4]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-top rounded-lg"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Church Leadership
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated individuals who guide and serve our church community
            with faith, wisdom, and compassion.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Vicar Section */}
          {vicar && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="max-w-sm mx-auto">
                  <MemberImage src={vicar.imageUrl} alt={vicar.name} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{vicar.name}</h2>
                  <p className="text-lg font-medium text-blue-600 mb-6">Parish Priest</p>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Leading our spiritual journey with wisdom and guidance, our parish priest
                    provides pastoral care and spiritual direction to our community.
                  </p>
                  <div className="space-y-3">
                    {vicar.phone && (
                      <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <Phone className="w-5 h-5 mr-3" />
                        <span className="text-base">{vicar.phone}</span>
                      </div>
                    )}
                    {vicar.email && (
                      <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <Mail className="w-5 h-5 mr-3" />
                        <span className="text-base">{vicar.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Leaders */}
          <div className="space-y-12">
            {/* Coordinators Section */}
            {coordinators.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Coordinators</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {coordinators.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <MemberImage src={member.imageUrl} alt={member.name} />
                      <div className="p-6">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                        <p className="text-base font-medium text-blue-600 mb-3">Coordinator</p>
                        {member.phone && (
                          <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teachers Section */}
            {teachers.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Teachers</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teachers.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <MemberImage src={member.imageUrl} alt={member.name} />
                      <div className="p-6">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                        <p className="text-base font-medium text-blue-600 mb-3">Teacher</p>
                        {member.phone && (
                          <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Router Outlet */}
      <Outlet />
    </div>
  );
};

export default Leaders;