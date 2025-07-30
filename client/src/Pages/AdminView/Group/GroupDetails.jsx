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
  Edit,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditGroup from "./EditGroup";
import { toast } from "sonner";

const Button = React.memo(({
  children,
  variant = "default",
  className = "",
  onClick,
  size,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-700 p-0 h-auto",
  };

  const sizeStyles = size === "sm" ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

const GroupFamiliesTable = React.memo(({ families = [], onViewFamily }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "name_asc",
    sortOrder: "asc",
  });
  const [showSortOptions, setShowSortOptions] = useState(false);
  const itemsPerPage = 10;

  const sortOptions = [
    { label: "Name (A to Z)", value: "name_asc" },
    { label: "Name (Z to A)", value: "name_desc" },
    { label: "Recently Added", value: "date_desc" },
    { label: "Oldest First", value: "date_asc" },
  ];

  const filteredFamilies = useMemo(() => {
    let result = [...(families || [])];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (family) =>
          family?.familyName?.toLowerCase().includes(term) ||
          family?.headOfFamily?.toLowerCase().includes(term) ||
          family?.contactNo?.toLowerCase().includes(term) ||
          family?.address?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (filters.sortBy) {
        case "name_asc":
          return (a.familyName || "").localeCompare(b.familyName || "");
        case "name_desc":
          return (b.familyName || "").localeCompare(a.familyName || "");
        case "date_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "date_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });
  }, [families, searchTerm, filters]);

  const paginatedFamilies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFamilies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFamilies, currentPage]);

  const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);

  const handleSort = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
    setShowSortOptions(false);
  };

  const getSortLabel = (value) => {
    return sortOptions.find(option => option.value === value)?.label || "Sort by";
  };

  const handleExport = () => {
    try {
      const csvContent = [
        // Headers
        ["Family Name", "Head of Family", "Contact", "Address"].join(","),
        // Data rows
        ...filteredFamilies.map(family => [
          family.familyName,
          family.headOfFamily,
          family.contactNo || "N/A",
          family.address || "N/A"
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `group-families-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const renderTableRow = useCallback((family) => (
    <tr key={family._id} className="hover:bg-gray-50 transition-colors">
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
          />
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
          <MapPin size={14} className="mr-1 flex-shrink-0 text-gray-400" />
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
          onClick={() => onViewFamily(family)}
        >
          View
        </Button>
      </td>
    </tr>
  ), [onViewFamily]);

  const renderEmptyState = useCallback(() => (
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
  ), [searchTerm]);

  return (
    <div className="space-y-4">
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
          <div className="relative">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 flex items-center gap-2"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <Filter size={16} />
              <span>{getSortLabel(filters.sortBy)}</span>
            </Button>
            
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                      filters.sortBy === option.value ? "text-indigo-600 bg-indigo-50" : "text-gray-700"
                    }`}
                    onClick={() => handleSort(option.value)}
                  >
                    <span>{option.label}</span>
                    {filters.sortBy === option.value && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

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
            {paginatedFamilies?.length > 0
              ? paginatedFamilies.map(renderTableRow)
              : renderEmptyState()}
          </tbody>
        </table>
      </div>

      {filteredFamilies?.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredFamilies.length)}
            </span> of{" "}
            <span className="font-medium">{filteredFamilies.length}</span>{" "}
            families
          </p>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={`h-8 ${
                  currentPage === page
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

const GroupDetails = React.memo(({ group, families = [], onBack }) => {
  const { familyLoading } = useSelector((state) => state.family);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(group);
  const navigate = useNavigate();

  const transformCloudinaryUrl = useCallback((url) =>
    url?.replace("/upload/", "/upload/w_300,h_300,c_thumb,g_face/") ||
    "https://via.placeholder.com/300"
  , []);

  const getGroupColor = useCallback(() => {
    if (!currentGroup?.groupName) return "rgb(99, 102, 241)";
    const hash = currentGroup.groupName.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 60%)`;
  }, [currentGroup?.groupName]);

  const handleGroupUpdate = (updatedGroup) => {
    setCurrentGroup(updatedGroup);
  };

  const handleViewFamily = (family) => {
    navigate(`/admin/family/${family._id}`);
  };

  const handleAddFamily = () => {
    navigate("/admin/create-family", { 
      state: { 
        groupId: currentGroup._id,
        groupName: currentGroup.groupName 
      } 
    });
  };

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

  const color = getGroupColor();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 space-y-8">
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
          <Button 
            variant="outline" 
            className="text-gray-700 flex items-center gap-2"
            onClick={() => setIsEditSheetOpen(true)}
          >
            <Edit size={16} />
            <span>Edit Group</span>
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleAddFamily}
          >
            Add Family
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="h-4" style={{ backgroundColor: color }} />

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="absolute -inset-1 rounded-full opacity-20"
                style={{ backgroundColor: color }}
              />
              <img
                src={transformCloudinaryUrl(currentGroup?.imageUrl)}
                alt={currentGroup?.groupName || "Group"}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {currentGroup?.groupName || "Group Details"}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Leader: </span>
                    <span className="font-medium text-gray-900">
                      {currentGroup?.leaderName || "Not assigned"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Secretary: </span>
                    <span className="font-medium text-gray-900">
                      {currentGroup?.secretaryName || "Not assigned"}
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
                      {currentGroup?.location || "No location"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Families in this Group
          </h2>
        </div>

        <GroupFamiliesTable 
          families={families} 
          onViewFamily={handleViewFamily}
        />
      </div>

      <EditGroup
        currentGroup={currentGroup}
        isEditSheetOpen={isEditSheetOpen}
        setIsEditSheetOpen={setIsEditSheetOpen}
        handleGroupUpdate={handleGroupUpdate}
      />
    </div>
  );
});

export default GroupDetails;
