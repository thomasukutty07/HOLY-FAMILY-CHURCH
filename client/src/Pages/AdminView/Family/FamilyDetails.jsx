import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Heart,
  User,
  Users,
  Edit,
  Trash2,
  Loader2,
  Plus,
  Mail,
  Home,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFamily, fetchAllFamily } from "@/Store/Family/familySlice";
import { fetchFamilyWithMembers } from "@/Store/User/memberSlice";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/Common/DeletePopUp";
import EditFamily from "./EditFamily";
import { useNavigate } from "react-router-dom";
import familyImage from "@/assets/family.png";

const FamilyDetails = ({ family, members, onBack, onFamilyUpdate }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [currentFamily, setCurrentFamily] = useState(family);
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
  });

  const { familyLoading } = useSelector((state) => state.family);
  const { groupNames } = useSelector((state) => state.group);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentFamily(family);
  }, [family]);

  useEffect(() => {
    if (currentFamily?._id) {
      dispatch(fetchFamilyWithMembers(currentFamily._id));
    }
  }, [currentFamily?._id, dispatch]);

  const handleFamilyUpdate = async (updatedFamily) => {
    try {
      // First update the local state
      setCurrentFamily(updatedFamily);
      
      // Then fetch updated members
      const result = await dispatch(fetchFamilyWithMembers(updatedFamily._id)).unwrap();
      
      if (result) {
        // Only call onFamilyUpdate if the fetch was successful
        if (onFamilyUpdate) {
          onFamilyUpdate(updatedFamily);
        }
      } else {
        throw new Error('Failed to fetch updated members');
      }
    } catch (error) {
      console.error('Error updating family:', error);
      // Don't show error toast here as it's handled in EditFamily component
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleEdit = () => {
    setIsEditSheetOpen(true);
  };

  const handleDeleteFamily = (event) => {
    if (event) event.stopPropagation();
    setDialogConfig({
      title: "Delete Family",
      description: `Are you sure you want to delete ${
        family?.familyName || "this family"
      }?`,
      message:
        "This will permanently remove the family and unlink all associated families. This action cannot be undone.",
      confirmLabel: "Delete Family",
    });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!family?._id) return;
    setIsDeleteDialogOpen(false);
    dispatch(deleteFamily(family?._id))
      .then((response) => {
        if (response.error) {
          toast.error(response.error.message || "Failed to delete family");
          return;
        }
        toast.success(response?.payload?.message);
        onBack(false);
        dispatch(fetchAllFamily());
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting the family");
      });
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

  if (familyLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-xl shadow-lg flex items-center gap-4">
          <Loader2 className="animate-spin w-6 h-6 text-indigo-600" />
          <p className="text-gray-700 font-medium">Loading Family Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => onBack(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Families</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium text-sm"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteFamily}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-medium text-sm"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* EditFamily component */}
      <EditFamily
        onBack={onBack}
        family={currentFamily}
        groupNames={groupNames}
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        familyEdited={handleFamilyUpdate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Family Header Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="px-6 sm:px-8 pt-6 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Family Image */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-indigo-100 -mt-20 flex-shrink-0 mx-auto md:mx-0">
                {currentFamily?.imageUrl ? (
                  <img
                    src={currentFamily.imageUrl}
                    alt={currentFamily?.familyName || "Family"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = familyImage;
                    }}
                  />
                ) : (
                  <img
                    src={familyImage}
                    alt={currentFamily?.familyName || "Family"}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Family Info */}
              <div className="flex-grow flex flex-col md:flex-row gap-6 text-center md:text-left mt-2 md:mt-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {currentFamily?.familyName || "Family Name"}
                  </h1>

                  <p className="text-gray-600 mt-1">
                    <span className="text-gray-500">Head of Family:</span>{" "}
                    <span className="font-medium">
                      {currentFamily?.headOfFamily || "Unknown"}
                    </span>
                  </p>

                  <div className="inline-flex mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                    ID: {currentFamily?._id?.substring(0, 8) || "Unknown"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:ml-auto gap-5 mt-4 md:mt-0">
                  {currentFamily?.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <MapPin size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-sm">{currentFamily.location}</span>
                    </div>
                  )}

                  {currentFamily?.contactNo && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Phone size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-sm">{currentFamily.contactNo}</span>
                    </div>
                  )}

                  {currentFamily?.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Mail size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-sm truncate max-w-xs">
                        {currentFamily.email}
                      </span>
                    </div>
                  )}

                  {currentFamily?.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Home size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-sm truncate max-w-xs">
                        {currentFamily.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Family Members
              <span className="ml-2 text-sm py-1 px-3 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                {members?.length || 0}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage family members and their details
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/add-member")}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        {/* Members List */}
        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {members.map((member, index) => (
              <div
                key={member?._id || index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100 to-transparent opacity-70 rounded-bl-full"></div>

                <div className="flex gap-5">
                  {/* Member Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-indigo-50 flex-shrink-0 border-2 border-indigo-100">
                    {member?.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member?.name || "Member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                        {member?.name?.charAt(0) || "M"}
                      </div>
                    )}
                  </div>

                  {/* Member Main Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {member?.name || "Member Name"}
                        </h3>
                        {member?.baptismName && (
                          <p className="text-indigo-600 text-sm font-medium">
                            {member.baptismName}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member?.married
                              ? "bg-pink-50 text-pink-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {member?.married ? "Married" : "Single"}
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            member?.sex?.toLowerCase() === "male"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {member?.sex
                            ? member.sex.charAt(0).toUpperCase() +
                              member.sex.slice(1)
                            : "Unknown"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-indigo-500" />
                        <span className="text-sm">
                          Born: {formatDate(member?.dateOfBirth) || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} className="text-indigo-500" />
                        <span className="text-sm">
                          Age:{" "}
                          {member?.dateOfBirth
                            ? `${calculateAge(member.dateOfBirth)} years`
                            : "Unknown"}
                        </span>
                      </div>

                      {member?.married && member?.marriageDate && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart size={14} className="text-pink-500" />
                          <span className="text-sm">
                            Married: {formatDate(member.marriageDate)}
                          </span>
                        </div>
                      )}

                      {member?.dateOfDeath && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-500" />
                          <span className="text-sm">
                            Died: {formatDate(member.dateOfDeath)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-10 shadow-md border border-gray-100 text-center">
            <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-5">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              No Family Members Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              This family doesn't have any members added yet. Start by adding
              family members to keep track of everyone.
            </p>
            <button
              onClick={() => navigate("/admin/add-member")}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2 mx-auto shadow-sm"
            >
              <Plus size={16} />
              Add First Member
            </button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default FamilyDetails;
