import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { fetchAllFamily } from "@/Store/Family/familySlice";
import { fetchAllMembers } from "@/Store/User/memberSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UsersRound, Building2, Calendar, Clock, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { members, memberLoading } = useSelector((state) => state.member);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAllGroupNames()),
          dispatch(fetchAllFamily()),
          dispatch(fetchAllMembers())
        ]);
      } catch (error) {
        toast.error("Failed to load dashboard data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const stats = [
    {
      title: "Total Groups",
      value: groupNames?.length || 0,
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-blue-50",
      textColor: "text-blue-700",
      link: "/admin/groups"
    },
    {
      title: "Total Families",
      value: familyNames?.length || 0,
      icon: <Users className="h-6 w-6" />,
      color: "bg-indigo-50",
      textColor: "text-indigo-700",
      link: "/admin/families"
    },
    {
      title: "Total Members",
      value: members?.length || 0,
      icon: <UsersRound className="h-6 w-6" />,
      color: "bg-purple-50",
      textColor: "text-purple-700",
      link: "/admin/members"
    }
  ];

  const quickActions = [
    {
      title: "Add New Member",
      description: "Register a new member to a family",
      icon: <UserPlus className="h-5 w-5" />,
      color: "bg-purple-50",
      textColor: "text-purple-700",
      link: "/admin/add-member"
    },
    {
      title: "Add New Family",
      description: "Register a new family in the system",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-50",
      textColor: "text-green-700",
      link: "/admin/create-family"
    },
    {
      title: "Create New Group",
      description: "Organize families into a new group",
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-blue-50",
      textColor: "text-blue-700",
      link: "/admin/create-group"
    },
    {
      title: "Add New Event",
      description: "Schedule a new church event",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-orange-50",
      textColor: "text-orange-700",
      link: "/admin/calendar"
    },
    {
      title: "Create Admin Account",
      description: "Create a new administrator account",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-indigo-50",
      textColor: "text-indigo-700",
      link: "/admin/create-admin"
    }
  ];

  // Show loading state if any of the data is still loading
  if (loading || groupLoading || familyLoading || memberLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-white">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // Show error state if no data is available
  if (!groupNames && !familyNames && !members) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Data</h2>
          <p className="text-gray-600 max-w-md">
            We're having trouble loading the dashboard data. This could be due to a network issue or server problem.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="default">
              Try Again
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-full min-h-screen bg-white">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your church community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                className={`mt-4 text-sm ${stat.textColor} hover:bg-gray-50`}
                onClick={() => navigate(stat.link)}
              >
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className={`p-3 rounded-lg ${action.color} w-fit mb-4`}>
                  <div className={action.textColor}>{action.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <Button
                  variant="outline"
                  className={`w-full border-gray-200 ${action.textColor} hover:bg-gray-50`}
                  onClick={() => navigate(action.link)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {familyNames?.slice(0, 5).map((family, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-indigo-50 mr-4">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{family.familyName}</p>
                      <p className="text-sm text-gray-500">{family.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(family.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;