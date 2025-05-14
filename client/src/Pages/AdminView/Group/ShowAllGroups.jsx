// All necessary imports
import { Button } from "@/components/ui/button";
import { deleteGroup, fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2, Users, Clock, ChevronRight, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import GroupDetails from "./GroupDetails";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "@/components/Common/DeletePopUp";
import { fetchFamilyWithGroup } from "@/Store/Family/familySlice";

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

  const transformCloudinaryUrl = (url) =>
    url?.replace("/upload/", "/upload/w_900,h_600,c_thumb,g_face/") ||
    "https://via.placeholder.com/900x600";

  const handleDeleteGroup = (id, name, e) => {
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
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Manage your family groups and connections
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
                Filter
              </button>
              <button
                onClick={() => navigate("/admin/create-group")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Group
              </button>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupNames?.map((group) => (
            <div
              key={group._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
              onMouseEnter={() => setHoveredGroup(group._id)}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={() => {
                setCurrentSelectedGroup(group);
                dispatch(fetchFamilyWithGroup(currentSelectedGroup._id));
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
                      dispatch(fetchFamilyWithGroup(currentSelectedGroup._id));
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

        {/* Empty State */}
        {groupNames?.length === 0 && (
          <div className="bg-white rounded-xl p-10 shadow-md border border-gray-200 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Groups Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't created any groups yet. Groups help you organize
              families together.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <Link to="/admin/create-group">Create Your First Group</Link>
            </Button>
          </div>
        )}

        {/* Pagination */}
        {groupNames?.length > 9 && (
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
              <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

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
