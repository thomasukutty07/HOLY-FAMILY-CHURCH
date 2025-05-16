import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Gift, Calendar } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        console.log("Fetching birthdays...");
        const response = await axios.get("http://localhost:4000/church/members/birthdays", {
          withCredentials: true,
        });
        console.log("Birthdays response:", response.data);
        if (response.data.success) {
          setBirthdays(response.data.members || []);
          console.log("Set birthdays:", response.data.members);
        } else {
          setError("Failed to fetch birthdays");
          console.error("Failed response:", response.data);
        }
      } catch (error) {
        setError("Failed to fetch birthdays");
        console.error("Error fetching birthdays:", error);
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
      <div className="min-h-screen bg-[#F3F3F1] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <p className="text-gray-600 font-compacta">Loading birthdays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F3F1] flex items-center justify-center">
        <p className="text-red-600 font-compacta">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F1] py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-compacta text-center mb-8">
          Birthday Celebrations
        </h1>
        <p className="max-w-lg mx-auto mt-4 text-[16px] md:text-[17px] text-center text-gray-700 mb-12">
          Join us in celebrating the special days of our church members. 
          Let's share joy and blessings with those who make our community special.
        </p>
        
        {/* Today's Birthdays */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-lg">
            <CardTitle className="text-white flex items-center gap-2 font-compacta text-2xl">
              <Gift className="h-6 w-6" />
              Today's Celebrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {todayBirthdays.length > 0 ? (
              <div className="grid gap-4">
                {todayBirthdays.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-compacta text-xl text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600 font-europa">
                        {member.family?.familyName || "No Family"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-pink-600 font-europa">
                        {format(new Date(member.dateOfBirth), "MMMM d")}
                      </p>
                      <p className="text-xs text-gray-500 font-europa">
                        {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-europa">No birthdays today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Birthdays */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-lg">
            <CardTitle className="text-white flex items-center gap-2 font-compacta text-2xl">
              <Calendar className="h-6 w-6" />
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {upcomingBirthdays.length > 0 ? (
              <div className="grid gap-4">
                {upcomingBirthdays.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-compacta text-xl text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600 font-europa">
                        {member.family?.familyName || "No Family"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600 font-europa">
                        {format(new Date(member.dateOfBirth), "MMMM d")}
                      </p>
                      <p className="text-xs text-gray-500 font-europa">
                        {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 font-europa">No upcoming birthdays this month</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Birthdays; 