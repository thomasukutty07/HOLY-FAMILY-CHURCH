import { images } from "@/config";
import {
  Loader2,
  ChevronLeft,
  Users,
  Phone,
  MapPin,
  Mail,
  Search,
  Download,
  Filter,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-700 p-0 h-auto",
  };

  const sizeStyles =
    props.size === "sm" ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const GroupFamiliesTable = ({ families }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFamilies = families?.filter(
    (family) =>
      family?.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family?.headOfFamily?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family?.contactNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search and Export Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search families..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Custom Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider w-16">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Family Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Head of Family
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFamilies?.length > 0 ? (
              filteredFamilies.map((family, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="relative">
                      <img
                        src={family?.imageUrl || images.familyImage}
                        alt={family?.familyName || "Family"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                        title="Active"
                      ></span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-indigo-700">
                      {family?.familyName}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {family?.headOfFamily}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-gray-400" />
                      {family?.contactNo || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    <div className="flex items-center">
                      <MapPin
                        size={14}
                        className="mr-1 flex-shrink-0 text-gray-400"
                      />
                      <span className="truncate">
                        {family?.address || "No address provided"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  {searchTerm ? (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <Search size={36} className="text-gray-300 mb-2" />
                      <p>No families found matching "{searchTerm}"</p>
                      <Button
                        variant="link"
                        onClick={() => setSearchTerm("")}
                        className="mt-1 text-indigo-600"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <Users size={36} className="text-gray-300 mb-2" />
                      <p>No families in this group</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredFamilies?.length > 10 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">{filteredFamilies.length}</span>{" "}
            families
          </p>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-indigo-50 text-indigo-700 border-indigo-200"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const GroupDetails = ({ group, families, onBack }) => {
  const { familyLoading } = useSelector((state) => state.family);

  const transformCloudinaryUrl = (url) =>
    url?.replace("/upload/", "/upload/w_300,h_300,c_thumb,g_face/") ||
    "https://via.placeholder.com/300";

  if (familyLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
          <p className="text-gray-600 font-medium">Loading group details...</p>
        </div>
      </div>
    );
  }

  // Generate a dynamic color based on the group name
  const getGroupColor = () => {
    if (!group?.groupName) return "rgb(99, 102, 241)";
    const hash = group.groupName.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 60%)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          onClick={() => onBack(false)}
          variant="outline"
          className="flex items-center gap-2 text-gray-700 w-max"
        >
          <ChevronLeft size={16} />
          <span>Back to Groups</span>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-700">
            Edit Group
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link to="/admin/create-family">Add Family</Link>{" "}
          </Button>
        </div>
      </div>

      {/* Group Info Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Color Banner */}
        <div className="h-4" style={{ backgroundColor: getGroupColor() }}></div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="absolute -inset-1 rounded-full opacity-20"
                style={{ backgroundColor: getGroupColor() }}
              ></div>
              <img
                src={transformCloudinaryUrl(group?.imageUrl)}
                alt={group?.groupName || "Group"}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {group?.groupName || "Group Details"}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Leader: </span>
                    <span className="font-medium text-gray-900">
                      {group?.leaderName || "Not assigned"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Secretary: </span>
                    <span className="font-medium text-gray-900">
                      {group?.secretaryName || "Not assigned"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Families: </span>
                    <span className="font-medium text-gray-900">
                      {families?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Location: </span>
                    <span className="font-medium text-gray-900">
                      {group?.location || "No location"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="hidden lg:flex lg:items-start lg:space-x-6 border-l border-gray-200 pl-6 ml-4">
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-indigo-600">
                  {families?.length || 0}
                </div>
                <div className="text-sm text-gray-500">Families</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Families Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Families in this Group
          </h2>
        </div>

        <GroupFamiliesTable families={families} />
      </div>
    </div>
  );
};

export default GroupDetails;
