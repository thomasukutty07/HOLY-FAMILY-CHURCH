import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Users, Clock, MapPin, ChevronRight, Loader2, Search, Download, PlusCircle, RefreshCw, ArrowLeft } from "lucide-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FamilyDetails from "./FamilyDetails";
import { fetchFamilyWithMembers } from "@/Store/User/memberSlice";
import { fetchAllFamily } from "@/Store/Family/familySlice";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FamilyFilter from "@/components/AdminView/FamilyFilter";
import familyImage from "@/assets/family.png";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

const ShowAllFamilies = () => {
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupedFamilyMembers } = useSelector((state) => state.member);
  const { groupNames } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [familySelected, setFamilySelected] = useState(false);
  const [currentSelectedFamily, setCurrentSelectedFamily] = useState(null);
  const [familyMembers, setFamilyMembers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllFamily());
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(fetchAllFamily()).then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  }, [dispatch]);

  const fetchMembersForAllFamilies = useCallback(async () => {
    if (!familyNames?.length) return;

    const fetchPromises = familyNames.map(async (family) => {
      try {
        const result = await dispatch(fetchFamilyWithMembers(family._id));
        if (result.payload?.members) {
          return { familyId: family._id, members: result.payload.members };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching members for family ${family._id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);
    const newFamilyMembers = results.reduce((acc, result) => {
      if (result) {
        acc[result.familyId] = result.members;
      }
      return acc;
    }, {});

    setFamilyMembers(newFamilyMembers);
  }, [familyNames, dispatch]);

  useEffect(() => {
    fetchMembersForAllFamilies();
  }, [fetchMembersForAllFamilies]);

  const handleFamilyClick = useCallback(async (family) => {
    try {
      await dispatch(fetchFamilyWithMembers(family._id));
      setCurrentSelectedFamily(family);
      setFamilySelected(true);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  }, [dispatch]);

  const handleFamilyUpdate = useCallback(async (updatedFamily) => {
    try {
      // Update current selected family
      setCurrentSelectedFamily(updatedFamily);
      
      // Update the family in the familyNames array
      setFamilyNames(prevFamilies => 
        prevFamilies.map(family => 
          family._id === updatedFamily._id ? updatedFamily : family
        )
      );

      // Refetch all family members
      await fetchMembersForAllFamilies();
    } catch (error) {
      console.error('Error updating family:', error);
      // Don't show error toast here as it's handled in EditFamily component
    }
  }, [fetchMembersForAllFamilies]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  }, []);

  const getFamilyColor = useCallback((index) => {
    return `hsl(${(index * 60) % 360}, 70%, 60%)`;
  }, []);

  const transformCloudinaryUrl = useCallback((url) =>
    url?.replace("/upload/", "/upload/w_900,h_600,c_thumb,g_face/") ||
    familyImage
  , []);

  const filteredAndSortedFamilies = useMemo(() => {
    if (!familyNames) return [];

    let result = [...familyNames];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(family => 
        family.familyName.toLowerCase().includes(term) ||
        family.headOfFamily.toLowerCase().includes(term) ||
        family.location.toLowerCase().includes(term)
      );
    }

    // Apply group filter
    if (activeGroup !== "all") {
      result = result.filter(family => family.group === activeGroup);
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.familyName || "").localeCompare(b.familyName || "");
        case "name_desc":
          return (b.familyName || "").localeCompare(a.familyName || "");
        case "date_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "date_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "members_desc":
          return (familyMembers[b._id]?.length || 0) - (familyMembers[a._id]?.length || 0);
        case "members_asc":
          return (familyMembers[a._id]?.length || 0) - (familyMembers[b._id]?.length || 0);
        default:
          return 0;
      }
    });
  }, [familyNames, searchTerm, activeGroup, sortBy, familyMembers]);

  const paginatedFamilies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedFamilies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedFamilies, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredAndSortedFamilies.length / ITEMS_PER_PAGE)
  , [filteredAndSortedFamilies]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const exportToCsv = useCallback(() => {
    const headers = [
      "Family Name",
      "Head of Family",
      "Location",
      "Members",
      "Created Date",
      "Group"
    ];

    const csvData = filteredAndSortedFamilies.map((family) => [
      family.familyName,
      family.headOfFamily,
      family.location,
      familyMembers[family._id]?.length || 0,
      formatDate(family.createdAt),
      groupNames?.find(g => g._id === family.group)?.groupName || "-"
    ]);

    let csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "family-directory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredAndSortedFamilies, familyMembers, groupNames, formatDate]);

  const renderFamilyCard = useCallback((family, index) => {
    const color = getFamilyColor(index);
    const members = familyMembers[family._id] || [];

    return (
      <div
        onClick={() => handleFamilyClick(family)}
        key={family._id}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
      >
        <div className="h-48 overflow-hidden relative">
          <img
            src={family.imageUrl ? transformCloudinaryUrl(family.imageUrl) : familyImage}
            alt={family.familyName}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: "scale(1)",
            }}
            onError={(e) => {
              e.target.src = familyImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h2 className="text-xl font-bold text-white">
              {family.displayName || family.familyName}
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={14} className="mr-1" />
                  <span>{members.length} members</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>Created on {formatDate(family.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-2" />
              <span>{family.location}</span>
            </div>
          </div>

          <div className="flex -space-x-2 mb-4">
            {members.slice(0, 4).map((member) => (
              <div
                key={member._id}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
              >
                <img
                  src={member.imageUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=random`;
                  }}
                />
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{members.length - 4}
              </div>
            )}
          </div>

          <button
            onClick={() => handleFamilyClick(family)}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center font-medium text-sm transition-colors duration-200"
          >
            <span>View Family</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  }, [handleFamilyClick, formatDate, getFamilyColor, familyMembers, transformCloudinaryUrl]);

  const renderAddFamilyCard = useCallback(() => (
    <div
      onClick={() => navigate("/admin/create-family")}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-gray-50"
    >
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
  ), [navigate]);

  if (familyLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  if (familySelected) {
    return (
      <FamilyDetails
        family={currentSelectedFamily}
        members={groupedFamilyMembers}
        onBack={setFamilySelected}
        onFamilyUpdate={handleFamilyUpdate}
      />
    );
  }

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/dashboard")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Family Directory
                </CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Complete list of all registered families with their details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border-0"
                onClick={exportToCsv}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => navigate("/admin/create-family")}
                className="bg-white text-indigo-700 hover:bg-blue-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Family
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="bg-white p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            <FamilyFilter
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              groupNames={groupNames}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-700 mr-2">
              {filteredAndSortedFamilies?.length || 0}
            </span>
            families found
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFamilies.map((family, index) => renderFamilyCard(family, index))}
            {renderAddFamilyCard()}
          </div>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex justify-between items-center py-4 px-6 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredAndSortedFamilies.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {familyNames?.length || 0}
              </span>{" "}
              families
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ShowAllFamilies;