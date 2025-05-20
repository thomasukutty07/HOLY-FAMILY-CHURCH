// All necessary imports
import { Button } from "@/components/ui/button";
import { deleteGroup, fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2, Users, Clock, ChevronRight, PlusCircle, Search, Download, RefreshCw, ArrowLeft } from "lucide-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import GroupDetails from "./GroupDetails";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "@/components/Common/DeletePopUp";
import { fetchFamilyWithGroup } from "@/Store/Family/familySlice";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GroupFilter from "@/components/AdminView/GroupFilter";

const ITEMS_PER_PAGE = 6;

const ShowAllGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupNames } = useSelector((state) => state.group);
  const { groupedFamilyNames, familyLoading } = useSelector(
    (state) => state.family
  );

  const [groupSelected, setGroupSelected] = useState(false);
  const [currentSelectedGroup, setCurrentSelectedGroup] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(fetchAllGroupNames()).then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  }, [dispatch]);

  const transformCloudinaryUrl = useCallback((url) =>
    url?.replace("/upload/", "/upload/w_900,h_600,c_thumb,g_face/") ||
    "https://via.placeholder.com/900x600"
  , []);

  const handleDeleteGroup = useCallback((id, name, e) => {
    e.stopPropagation();
    setDialogConfig({
      title: "Delete Group",
      description: `Are you sure you want to delete ${name}?`,
      message:
        "This will permanently remove the group and unlink all associated families. This action cannot be undone.",
      confirmLabel: "Delete Group",
      onConfirm: () => {
        dispatch(deleteGroup(id)).then((data) => {
          if (data?.payload?.success) {
            toast.success(data?.payload?.message);
            dispatch(fetchAllGroupNames());
            setConfirmDialogOpen(false);
          }
        });
      },
    });
    setConfirmDialogOpen(true);
  }, [dispatch]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  }, []);

  const filteredAndSortedGroups = useMemo(() => {
    if (!groupNames) return [];

    let result = [...groupNames];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(group => 
        group.groupName.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.groupName || "").localeCompare(b.groupName || "");
        case "name_desc":
          return (b.groupName || "").localeCompare(a.groupName || "");
        case "date_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "date_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "families_desc":
          return (b.totalFamilies || 0) - (a.totalFamilies || 0);
        case "families_asc":
          return (a.totalFamilies || 0) - (b.totalFamilies || 0);
        default:
          return 0;
      }
    });
  }, [groupNames, searchTerm, sortBy]);

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedGroups, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredAndSortedGroups.length / ITEMS_PER_PAGE)
  , [filteredAndSortedGroups]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const exportToCsv = useCallback(() => {
    const headers = [
      "Group Name",
      "Total Families",
      "Created Date"
    ];

    const csvData = filteredAndSortedGroups.map((group) => [
      group.groupName,
      group.totalFamilies || 0,
      formatDate(group.createdAt)
    ]);

    let csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "group-directory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredAndSortedGroups, formatDate]);

  if (familyLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return groupSelected ? (
    <GroupDetails
      group={currentSelectedGroup}
      families={groupedFamilyNames}
      onBack={setGroupSelected}
    />
  ) : (
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
                  Group Directory
                </CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Complete list of all registered groups with their details
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
                onClick={() => navigate("/admin/create-group")}
                className="bg-white text-indigo-700 hover:bg-blue-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Group
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
                placeholder="Search by group name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            <GroupFilter
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-700 mr-2">
              {filteredAndSortedGroups?.length || 0}
            </span>
            groups found
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={() => setHoveredGroup(group._id)}
                onMouseLeave={() => setHoveredGroup(null)}
                onClick={() => {
                  setCurrentSelectedGroup(group);
                  dispatch(fetchFamilyWithGroup(group._id));
                  setGroupSelected(true);
                }}
              >
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={transformCloudinaryUrl(group.imageUrl)}
                    alt={group.groupName}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{
                      transform:
                        hoveredGroup === group._id ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h2 className="text-xl font-bold text-white">
                      {group.groupName}
                    </h2>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={16} className="mr-2" />
                        <span>{group.totalFamilies} families</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-2" />
                        <span>Created on {formatDate(group.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSelectedGroup(group);
                        dispatch(fetchFamilyWithGroup(group._id));
                        setGroupSelected(true);
                      }}
                      className="flex-1 mr-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 flex items-center justify-center transition-colors"
                    >
                      View
                      <ChevronRight size={16} className="ml-1" />
                    </Button>

                    <Button
                      onClick={(e) =>
                        handleDeleteGroup(group._id, group.groupName, e)
                      }
                      className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg py-2 px-3 transition-colors"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Group Card */}
            {groupNames?.length > 1 && (
              <div
                onClick={() => navigate("/admin/create-group")}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-gray-50 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <PlusCircle size={28} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Create New Group
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Organize families into a new group
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex justify-between items-center py-4 px-6 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredAndSortedGroups.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {groupNames?.length || 0}
              </span>{" "}
              groups
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

      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={dialogConfig.onConfirm}
      />
    </div>
  );
};

export default ShowAllGroups;
