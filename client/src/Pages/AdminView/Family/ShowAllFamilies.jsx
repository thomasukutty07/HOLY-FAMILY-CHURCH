import { images } from "@/config";
import { fetchFamilyByGroupName } from "@/Store/Group/groupSlice";
import {
  MoreHorizontal,
  Users,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShowAllFamilies = () => {
  const { familyNames } = useSelector((state) => state.family);
  const dispatch = useDispatch();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFamilyByGroupName);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    console.log("Edit", id);
    setOpenMenuId(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    console.log("Delete", id);
    setOpenMenuId(null);
  };

  // Mock data for location and date display
  const getLocationText = (index) => {
    const locations = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Miami",
      "Seattle",
      "Boston",
    ];
    return locations[index % locations.length];
  };

  const getFormattedDate = (index) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const randomMonth = months[index % months.length];
    const randomDay = (index % 28) + 1;
    return `${randomMonth} ${randomDay}, 2023`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Families</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Manage your family connections and explore family groups
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
                Filter
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                Add Family
              </button>
            </div>
          </div>
        </div>

        {/* Family Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyNames?.map((family, index) => (
            <div
              key={family._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {/* Color Banner - different color for each card */}
              <div
                className="h-3"
                style={{
                  background: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                }}
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                      style={{
                        background: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                        boxShadow: `0 0 0 4px hsl(${
                          (index * 60) % 360
                        }, 70%, 95%)`,
                      }}
                    >
                      {family.familyName?.charAt(0) || "F"}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {family.familyName}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        <span>{(index % 10) + 2} members</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => toggleMenu(family._id, e)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenuId === family._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200"
                      >
                        <button
                          onClick={(e) => handleEdit(family._id, e)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit Family
                        </button>
                        <button
                          onClick={(e) => handleDelete(family._id, e)}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete Family
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Information Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-2" />
                    <span>Created on {getFormattedDate(index)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2" />
                    <span>{getLocationText(index)}</span>
                  </div>
                </div>

                {/* Preview Image Section */}
                <div className="flex -space-x-2 mb-4">
                  {[...Array(Math.min(4, (index % 5) + 2))].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/men/${
                          (index + i) % 99
                        }.jpg`}
                        alt="Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {(index % 5) + 2 > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                      +{(index % 5) + 2 - 4}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center font-medium text-sm transition-colors duration-200">
                  <span>View Family</span>
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Family Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-gray-50">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Add New Family
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Create a new family group to connect with loved ones
            </p>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white font-medium">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ShowAllFamilies;
