import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import BirthdayCard from "@/components/BirthdayCard";

const Birthdays = ({ variant = "today" }) => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:4000/church/members/birthdays", {
          withCredentials: true,
        });
        if (response.data.success) {
          setBirthdays(response.data.members || []);
        } else {
          setError("Failed to fetch birthdays");
        }
      } catch (error) {
        setError("Failed to fetch birthdays");
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  const today = new Date();
  const todayBirthdays = birthdays.filter(member => {
    if (!member?.dateOfBirth) return false;
    const birthDate = new Date(member.dateOfBirth);
    return birthDate.getDate() === today.getDate() && 
           birthDate.getMonth() === today.getMonth();
  });

  const upcomingBirthdays = birthdays.filter(member => {
    if (!member?.dateOfBirth) return false;
    const birthDate = new Date(member.dateOfBirth);
    const birthDateThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    return birthDateThisYear > today && birthDateThisYear <= new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }).sort((a, b) => {
    const dateA = new Date(a.dateOfBirth);
    const dateB = new Date(b.dateOfBirth);
    return dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading birthdays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const displayBirthdays = variant === "today" ? todayBirthdays : upcomingBirthdays;

  if (displayBirthdays.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {variant === "today" 
            ? "No birthdays today" 
            : "No upcoming birthdays this month"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayBirthdays.map((member) => (
        <BirthdayCard 
          key={member._id} 
          member={member} 
          variant={variant}
        />
      ))}
    </div>
  );
};

export default Birthdays; 