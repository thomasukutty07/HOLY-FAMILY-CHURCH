import React, { useState } from "react";
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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFamily, fetchAllFamily } from "@/Store/Family/familySlice";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/Common/DeletePopUp";

const FamilyDetails = ({ family, members, onBack }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const { familyLoading } = useSelector((state) => state.family);
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleEdit = () => {};

  const handleDeleteFamily = (event) => {
    event.stopPropagation();
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
        toast.error("An error occurred while deleting the member");
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

  return familyLoading ? (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-gray-50">
      <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
      <p className="text-gray-600 font-medium">Family Data Loading...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => onBack(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Families</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteFamily}
              className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Family Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Family Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
              {family?.imageUrl ? (
                <img
                  src={family.imageUrl}
                  alt={family?.familyName || "Family"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {family?.familyName?.charAt(0) || "F"}
                </div>
              )}
            </div>

            {/* Family Info */}
            <div className="flex-grow flex flex-col md:flex-row gap-10">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {family?.familyName || "Family Name"}
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  Head of Family:{" "}
                  <span className="font-semibold text-gray-800">
                    {family?.headOfFamily || "Unknown"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-blue-500" />
                  <span>{family?.location || "Location unknown"}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={18} className="text-blue-500" />
                  <span>{family?.contactNo || "No contact number"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-blue-50 px-4 text-sm text-gray-500">
              FAMILY MEMBERS
            </div>
          </div>
        </div>

        {/* Member Management */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Members{" "}
              <span className="text-gray-400">({members?.length || 0})</span>
            </h2>
            <p className="text-gray-500">
              Manage family members and their details
            </p>
          </div>

          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm">
            Add New Member
          </button>
        </div>

        {/* Members List */}
        {members && members.length > 0 ? (
          <div className="space-y-6">
            {members.map((member, index) => (
              <div
                key={member?._id || index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Member Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
                    {member?.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member?.name || "Member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {member?.name?.charAt(0) || "M"}
                      </div>
                    )}
                  </div>

                  {/* Member Main Info */}
                  <div className="flex-grow md:border-r border-gray-100 pr-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {member?.name || "Member Name"}
                        </h3>
                        {member?.baptismName && (
                          <p className="text-blue-600 font-medium">
                            {member.baptismName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} className="text-blue-500" />
                        <span>
                          Gender:{" "}
                          <span className="font-medium text-gray-800">
                            {member?.sex
                              ? member.sex.charAt(0).toUpperCase() +
                                member.sex.slice(1)
                              : "Unknown"}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Heart
                          size={16}
                          className={
                            member?.married ? "text-pink-500" : "text-gray-400"
                          }
                        />
                        <span>
                          {member?.married ? "Married" : "Not Married"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Member Timeline - FIXED SECTION */}
                  <div className="flex-shrink-0 w-full md:w-64 mt-6 md:mt-0">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      TIMELINE
                    </h4>
                    <div className="space-y-4 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="pl-2">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar size={14} className="text-gray-400" />
                            <span>
                              Born:{" "}
                              <span className="font-medium text-gray-800">
                                {member?.dateOfBirth
                                  ? formatDate(member.dateOfBirth)
                                  : "Unknown"}
                              </span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 pl-5">
                            Age:{" "}
                            {member?.dateOfBirth
                              ? calculateAge(member.dateOfBirth)
                              : "Unknown"}
                          </div>
                        </div>
                      </div>

                      {member?.married && member?.marriageDate && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-pink-500 absolute -left-0.5 mt-1.5"></div>
                          <div className="pl-2">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Heart size={14} className="text-pink-400" />
                              <span>
                                Married:{" "}
                                <span className="font-medium text-gray-800">
                                  {formatDate(member.marriageDate)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {member?.dateOfDeath && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-500 absolute -left-0.5 mt-1.5"></div>
                          <div className="pl-2">
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Calendar size={14} className="text-gray-400" />
                              <span>
                                Died:{" "}
                                <span className="font-medium text-gray-800">
                                  {formatDate(member.dateOfDeath)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Family Members Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't added any members to this family. Start by adding
              family members to keep track of everyone.
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm">
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
