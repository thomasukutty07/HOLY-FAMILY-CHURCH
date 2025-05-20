import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembers, updateMember } from "@/Store/User/memberSlice";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  Calendar,
  HeartPulse,
  Search,
  Filter,
  Download,
  PlusCircle,
  RefreshCw,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAllFamily } from "@/Store/Family/familySlice";
import { useNavigate } from "react-router-dom";
import MemberSort from "@/components/AdminView/MemberFilter";
import EditAndDelete from "./EditDeleteMember";

const ShowAllMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const { members, memberLoading } = useSelector((state) => state.member);
  const { groupNames, familyLoading } = useSelector((state) => state.group);
  const { familyNames } = useSelector((state) => state.family);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllMembers());
    dispatch(fetchAllGroupNames());
    dispatch(fetchAllFamily());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(fetchAllMembers()).then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const getGroupName = (id) => {
    const group = groupNames.find((group) => group._id === id);
    return group ? group.groupName : "-";
  };

  const getFamilyName = (id) => {
    const family = familyNames.find((family) => family._id === id);
    return family ? family.familyName : "-";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "-";
  };
  const calculateAge = (dob) => {
    if (!dob) return "Unknown";

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "Invalid date";

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    const charSum = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charSum % colors.length];
  };

  const filteredAndSortedMembers = useMemo(() => {
    if (!members) return [];

    let result = [...members];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(term) ||
        member.role?.toLowerCase().includes(term) ||
        member.baptismName?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "date_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "date_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "role_asc":
          return (a.role || "").localeCompare(b.role || "");
        case "role_desc":
          return (b.role || "").localeCompare(a.role || "");
        case "age_desc":
          return calculateAge(b.dateOfBirth) - calculateAge(a.dateOfBirth);
        case "age_asc":
          return calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth);
        default:
          return 0;
      }
    });
  }, [members, searchTerm, sortBy]);

  const exportToCsv = () => {
    const headers = [
      "Name",
      "Role",
      "Sex",
      "Baptism Name",
      "Date of Birth",
      "Marriage Date",
      "Family",
      "Group",
      "Status",
    ];

    const csvData = filteredAndSortedMembers.map((member) => [
      member.name,
      member.role,
      member.sex,
      member.baptismName || "-",
      formatDate(member.dateOfBirth),
      formatDate(member.marriageDate),
      getFamilyName(member.family),
      getGroupName(member.group),
      member.isActive ? "Active" : "Inactive",
    ]);

    let csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "member-directory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (memberLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
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
                  Member Directory
                </CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Complete list of all registered members with their details
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
                onClick={() => {
                  navigate("/admin/add-member");
                }}
                className="bg-white text-indigo-700 hover:bg-blue-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Member
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
                placeholder="Search by name, role, or baptism name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            <MemberSort
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-700 mr-2">
              {filteredAndSortedMembers?.length || 0}
            </span>
            members found
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="py-4 font-semibold text-gray-700 w-12"></TableHead>
                  {[
                    "Name",
                    "Role",
                    "Sex",
                    "Baptism Name",
                    "Date of Birth",
                    "Age",
                    "Passing",
                    "Marriage Date",
                    "Family",
                    "Group",
                    "Status",
                    "Action",
                  ].map((items, index) => (
                    <TableHead
                      key={index}
                      className="py-4 font-semibold text-gray-700"
                    >
                      {items}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedMembers && filteredAndSortedMembers.length > 0 ? (
                  filteredAndSortedMembers.map((member) => (
                    <TableRow
                      key={member._id}
                      className={`hover:bg-blue-50 transition-colors duration-150 group border-b ${
                        !member.isActive ? "bg-gray-50/50 text-gray-500" : ""
                      }`}
                    >
                      <TableCell className="pl-4">
                        {/* Show initials if no image is present */}
                        <div
                          className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-medium ${
                            member.imageUrl
                              ? "hidden"
                              : getAvatarColor(member.name)
                          }`}
                        >
                          {getInitials(member.name)}
                        </div>

                        {/* Show circular image if imageUrl is present */}
                        <div
                          className={`${member?.imageUrl ? "block" : "hidden"}`}
                        >
                          <img
                            className="rounded-full w-10 h-10 object-cover"
                            src={member?.imageUrl}
                            alt="Profile"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        {member.name}
                        {!member.isActive && (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300 ml-2"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "admin"
                              ? "destructive"
                              : member.role === "moderator"
                              ? "default"
                              : "outline"
                          }
                          className="font-medium capitalize"
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{member.sex}</TableCell>
                      <TableCell>{member.baptismName || "-"}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatDate(member.dateOfBirth)}
                      </TableCell>

                      <TableCell>{calculateAge(member.dateOfBirth)}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatDate(member.dateOfDeath)}
                      </TableCell>
                      <TableCell>{formatDate(member.marriageDate)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {getFamilyName(member.family)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {getGroupName(member.group)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!member.isActive && member.dateOfDeath ? (
                          <div className="flex items-center gap-1 text-gray-500">
                            <HeartPulse className="h-3 w-3 text-rose-400" />
                            {formatDate(member.dateOfDeath)}
                          </div>
                        ) : (
                          <Badge
                            variant={member.isActive ? "success" : "secondary"}
                            className={
                              member.isActive
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <EditAndDelete
                          member={member}
                          familyNames={familyNames}
                          groupNames={groupNames}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-medium mt-2">
                          No members found
                        </p>
                        <p className="text-gray-500 text-sm max-w-md">
                          {searchTerm
                            ? `No results found for "${searchTerm}". Try adjusting your search or filters.`
                            : `Try adding members or adjusting your filter settings.`}
                        </p>
                        <Button
                          onClick={() => {
                            navigate("/admin/add-member");
                          }}
                          className="mt-3"
                          variant="outline"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {filteredAndSortedMembers && filteredAndSortedMembers.length > 0 && (
          <CardFooter className="flex justify-between items-center py-4 px-6 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredAndSortedMembers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {members.length}
              </span>{" "}
              members
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ShowAllMembers;
