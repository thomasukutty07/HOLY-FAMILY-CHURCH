import React from "react";
import { format } from "date-fns";
import { Gift, Calendar } from "lucide-react";

const BirthdayCard = ({ member, variant = "today" }) => {
  const isToday = variant === "today";
  const age = new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear();

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="group relative flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200">
      {/* Left Section - Name and Family */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          isToday 
            ? 'bg-gray-100 text-gray-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {isToday ? (
            <Gift className="w-5 h-5" />
          ) : (
            <Calendar className="w-5 h-5" />
          )}
        </div>

        {/* Name and Family Info */}
        <div>
          <h3 className="font-medium text-gray-900">
            {member.name}
          </h3>
          <p className="text-sm text-gray-600">
            {member.family?.familyName || capitalizeFirstLetter(member.role)}
          </p>
        </div>
      </div>

      {/* Right Section - Date and Age */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-700">
          {format(new Date(member.dateOfBirth), "MMMM d")}
        </p>
        <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isToday 
            ? 'bg-gray-100 text-gray-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {age} {age === 1 ? 'year' : 'years'}
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${
        isToday ? 'bg-gray-400' : 'bg-gray-300'
      }`} />
    </div>
  );
};

export default BirthdayCard;