import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/Common/DeletePopUp";
import UnsavedChangesAlert from "@/components/Common/Unsave";
import {
  deleteMember,
  deleteMemberImage,
  fetchAllMembers,
  uploadMemberImage,
  updateMember,
} from "@/Store/User/memberSlice";
import CommonForm from "@/components/Common/Form";
import { addMemberFormControls } from "@/config";

const EditAndDeleteMember = ({ member, familyNames, groupNames }) => {
  const dispatch = useDispatch();
  const { imageLoading } = useSelector((state) => state.member);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUnsavedAlertOpen, setIsUnsavedAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [file, setFile] = useState(null);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const [selectedFileName, setSelectedFileName] = useState(
    member?.imageUrl ? member.imageUrl.split("/").pop() : ""
  );
  const [currentImageUrl, setCurrentImageUrl] = useState(
    member?.imageUrl || null
  );
  const [currentPublicId, setCurrentPublicId] = useState(
    member?.publicId || null
  );
  const [originalImageUrl, setOriginalImageUrl] = useState(
    member?.imageUrl || null
  );
  const [originalPublicId, setOriginalPublicId] = useState(
    member?.publicId || null
  );

  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
  });

  const editFormControls = addMemberFormControls.map((field) => {
    if (field.name === "family") {
      return {
        ...field,
        options:
          familyNames?.map((family) => ({
            id: family._id,
            label: family.familyName,
          })) || [],
      };
    } else if (field.name === "group") {
      return {
        ...field,
        options:
          groupNames?.map((group) => ({
            id: group._id,
            label: group.groupName,
          })) || [],
      };
    }
    return field;
  });

  const handleEditMember = (member) => {
    setMemberToEdit(member);
    const formData = {
      name: member.name,
      role: member.role,
      sex: member.sex,
      baptismName: member.baptismName || "",
      dateOfBirth: member.dateOfBirth
        ? new Date(member.dateOfBirth).toISOString().split("T")[0]
        : "",
      marriageDate: member.marriageDate
        ? new Date(member.marriageDate).toISOString().split("T")[0]
        : "",
      family: member.family,
      group: member.group,
      dateOfDeath: member.dateOfDeath
        ? new Date(member.dateOfDeath).toISOString().split("T")[0]
        : "",
      married: member.married ? "true" : "false",
      isActive: member.isActive ? "true" : "false",
      imageUrl: member.imageUrl || "",
      publicId: member.publicId || ""
    };
    setEditFormData(formData);
    setInitialFormData(formData);
  };

  // Update image details when member changes
  useEffect(() => {
    if (member) {
      setOriginalImageUrl(member.imageUrl || null);
      setOriginalPublicId(member.publicId || null);
      setCurrentImageUrl(member.imageUrl || null);
      setCurrentPublicId(member.publicId || null);
      setSelectedFileName(
        member.imageUrl ? member.imageUrl.split("/").pop() : ""
      );
    }
  }, [member]);

  // Track form changes
  useEffect(() => {
    if (initialFormData && memberToEdit) {
      const hasDataChanged =
        JSON.stringify(initialFormData) !== JSON.stringify(editFormData);
      const hasImageChanged =
        originalImageUrl !== currentImageUrl ||
        originalPublicId !== currentPublicId;
      setIsFormDirty(hasDataChanged || hasImageChanged);
    }
  }, [
    editFormData,
    initialFormData,
    currentImageUrl,
    currentPublicId,
    originalImageUrl,
    originalPublicId,
    memberToEdit,
  ]);

  // Handle image upload
  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        const data = new FormData();
        data.append("image", file);
        const response = await dispatch(uploadMemberImage(data));

        if (response?.payload?.success) {
          setCurrentImageUrl(response.payload.imageUrl);
          setCurrentPublicId(response.payload.publicId);
          setEditFormData({
            ...editFormData,
            imageUrl: response.payload.imageUrl,
            publicId: response.payload.publicId,
          });
          toast.success("Image uploaded successfully");
        } else {
          toast.error(response.payload?.message || "Failed to upload image");
          resetImageState();
        }
      } catch (error) {
        toast.error("An error occurred while uploading the image");
        resetImageState();
      }
    };

    uploadImage();
  }, [file, dispatch]);

  // Reset image state to original
  const resetImageState = () => {
    setCurrentImageUrl(originalImageUrl);
    setCurrentPublicId(originalPublicId);
    setFile(null);
    setSelectedFileName(
      originalImageUrl ? originalImageUrl.split("/").pop() : ""
    );
  };

  // Reset all form state
  const resetAllFormState = () => {
    if (initialFormData) {
      setEditFormData({ ...initialFormData });
    }
    resetImageState();
    setIsFormDirty(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!memberToEdit?._id) return;

    const updatedMemberData = {
      id: memberToEdit._id,
      ...editFormData,
      imageUrl: currentImageUrl,
      publicId: currentPublicId,
    };

    dispatch(updateMember(updatedMemberData)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllMembers());
        toast.success("Member updated successfully");
        setIsFormDirty(false);
      }
    });
  };

  // Handle delete image
  const handleDeleteImage = async () => {
    setIsDeletingImage(true);
    try {
      if (currentPublicId) {
        await dispatch(deleteMemberImage(currentPublicId));
      }
      setCurrentImageUrl(null);
      setCurrentPublicId(null);
      setSelectedFileName("");
      setFile(null);
      setEditFormData({
        ...editFormData,
        imageUrl: null,
        publicId: null,
      });
      toast.success("Image removed successfully");
    } catch (error) {
      toast.error("Failed to remove image");
    } finally {
      setIsDeletingImage(false);
    }
  };

  // Handle delete member
  const handleDeleteMember = (event) => {
    event.stopPropagation();
    setDialogConfig({
      title: `Delete ${
        member?.role.charAt(0).toUpperCase() + member?.role.slice(1) || "Member"
      }`,
      description: `Are you sure you want to delete ${
        member?.name || "this member"
      }?`,
      message:
        "This will permanently remove this person and unlink all associated data. This action cannot be undone.",
      confirmLabel: "Delete",
    });
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!member?._id) return;
    setIsDeleteDialogOpen(false);

    dispatch(deleteMember(member?._id))
      .then((response) => {
        if (response.error) {
          toast.error(response.error.message || "Failed to delete member");
          return;
        }
        toast.success("Member deleted successfully");
        dispatch(fetchAllMembers());
      })
      .catch(() => {
        toast.error("An error occurred while deleting the member");
      });
  };

  // Handle pending actions with unsaved changes
  const handlePendingAction = (actionType) => {
    if (isFormDirty) {
      setPendingAction(actionType);
      setIsUnsavedAlertOpen(true);
    } else {
      executePendingAction(actionType);
    }
  };

  // Execute pending actions
  const executePendingAction = (actionType) => {
    if (actionType === "close") {
      resetAllFormState();
      setMemberToEdit(null);
    }
    setPendingAction(null);
  };

  // Handle sheet open/close
  const handleSheetChange = (open) => {
    if (open) {
      handleEditMember(member);
    } else {
      if (isFormDirty) {
        setPendingAction("close");
        setIsUnsavedAlertOpen(true);
      } else {
        resetAllFormState();
        setMemberToEdit(null);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Sheet
        open={memberToEdit?._id === member?._id}
        onOpenChange={handleSheetChange}
        modal={true}
      >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          className="w-[500px] sm:max-w-[95vw] md:max-w-[500px] overflow-y-auto"
          onInteractOutside={(e) => {
            // Prevent closing when interacting with the calendar
            if (e.target.closest('[data-radix-popper-content-wrapper]')) {
              e.preventDefault();
            }
          }}
        >
          <SheetHeader>
            <SheetTitle>
              Edit{" "}
              {member?.role.charAt(0).toUpperCase() + member?.role.slice(1)}{" "}
              Details
            </SheetTitle>
            <SheetDescription>
              Make changes to {member?.name || "member"}'s profile
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {imageLoading ? (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                <Loader2 className="animate-spin w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-gray-600">
                  {isDeletingImage ? "Deleting image..." : "Uploading image..."}
                </span>
              </div>
            ) : (
              <CommonForm
                formControls={editFormControls}
                onSubmit={handleSubmit}
                buttonText="Update Member"
                formData={editFormData}
                setFormData={setEditFormData}
                customStyle="grid grid-cols-1 gap-4"
                setFile={setFile}
                handleDeleteImage={handleDeleteImage}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
                isDeletingImage={isDeletingImage}
                showDeleteImageButton={!!currentImageUrl}
              />
            )}
          </div>

          <SheetFooter className="pt-4 border-t mt-4">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  if (isFormDirty) {
                    e.preventDefault();
                    handlePendingAction("close");
                  }
                }}
              >
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Button */}
      <Button
        variant="destructive"
        size="icon"
        className="h-8 w-8"
        onClick={handleDeleteMember}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Confirmation Dialog for Delete Member */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={handleConfirmDelete}
      />

      {/* Unsaved Changes Alert Dialog */}
      <UnsavedChangesAlert
        isOpen={isUnsavedAlertOpen}
        setIsOpen={setIsUnsavedAlertOpen}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save them or discard?"
        continueEditingLabel="Continue Editing"
        saveChangesLabel="Save Changes"
        discardChangesLabel="Discard Changes"
        onContinueEditing={() => {
          setIsUnsavedAlertOpen(false);
          setPendingAction(null);
        }}
        onSaveChanges={async () => {
          await handleSubmit();
          executePendingAction(pendingAction);
        }}
        onDiscardChanges={() => {
          resetAllFormState();
          executePendingAction(pendingAction);
        }}
        saveButtonProps={{
          className: "bg-indigo-600 hover:bg-indigo-700 text-white"
        }}
        discardButtonProps={{
          className: "bg-red-600 hover:bg-red-700 text-white"
        }}
      />
    </div>
  );
};

export default EditAndDeleteMember;
