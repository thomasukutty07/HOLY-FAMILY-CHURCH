import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import UnsavedChangesAlert from "@/components/Common/Unsave";
import {
  fetchAllFamily,
  updateFamily,
  uploadFamilyImage,
  deleteFamilyImage,
} from "@/Store/Family/familySlice";
import CommonForm from "@/components/Common/Form";
import { addFamilyFormControls } from "@/config";

const EditFamily = ({ family, groupNames, isOpen, onOpenChange, familyEdited }) => {
  const dispatch = useDispatch();
  const { familyNames, imageLoading } = useSelector((state) => state.family);

  const [isUnsavedAlertOpen, setIsUnsavedAlertOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [file, setFile] = useState(null);
  const [familyToEdit, setFamilyToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const filteredFamilyNames = familyNames.filter(
    (item) => item._id !== family?._id
  );

  const [selectedFileName, setSelectedFileName] = useState(
    family?.imageUrl ? family.imageUrl.split("/").pop() : ""
  );
  const [currentImageUrl, setCurrentImageUrl] = useState(
    family?.imageUrl || null
  );
  const [currentPublicId, setCurrentPublicId] = useState(
    family?.publicId || null
  );
  const [originalImageUrl, setOriginalImageUrl] = useState(
    family?.imageUrl || null
  );
  const [originalPublicId, setOriginalPublicId] = useState(
    family?.publicId || null
  );

  const editFormControls = addFamilyFormControls.map((field) => {
    if (field.name === "group") {
      return {
        ...field,
        options:
          groupNames?.map((group) => ({
            id: group._id,
            label: group.groupName,
          })) || [],
      };
    }
    if (field.name === "familyName") {
      return {
        ...field,
        filteredNames: filteredFamilyNames, 
      };
    }
    return field;
  });

  const handleEditFamily = (family) => {
    if (!family) return;

    setFamilyToEdit(family);
    const formData = {
      familyName: family.familyName || "",
      group: family.group || "",
      headOfFamily: family.headOfFamily || "",
      location: family.location || "",
      address: family.address || "",
      contactNo: family.contactNo || "",
    };
    setEditFormData(formData);
    setInitialFormData(formData);
  };

  useEffect(() => {
    if (family) {
      setOriginalImageUrl(family.imageUrl || null);
      setOriginalPublicId(family.publicId || null);
      setCurrentImageUrl(family.imageUrl || null);
      setCurrentPublicId(family.publicId || null);
      setSelectedFileName(
        family.imageUrl ? family.imageUrl.split("/").pop() : ""
      );
    }
  }, [family]);

  useEffect(() => {
    if (isOpen && family) {
      handleEditFamily(family);
    }
  }, [isOpen, family]);

  // Track form changes
  useEffect(() => {
    if (initialFormData && familyToEdit) {
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
    familyToEdit,
  ]);

  // Handle image upload
  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        const data = new FormData();
        data.append("image", file);
        const response = await dispatch(uploadFamilyImage(data)).unwrap();

        if (response?.success) {
          setCurrentImageUrl(response.imageUrl);
          setCurrentPublicId(response.publicId);
          setFile(null); // Clear the file after successful upload
          toast.success("Image uploaded successfully");
        } else {
          toast.error(response?.message || "Failed to upload image");
          resetImageState();
        }
      } catch (error) {
        toast.error("An error occurred while uploading the image");
        resetImageState();
      }
    };

    uploadImage();
  }, [file, dispatch]); // Remove editFormData from dependency array

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
  const handleSubmit = async () => {
    if (!familyToEdit?._id) return;

    try {
      const updatedFamilyData = {
        ...editFormData,
        imageUrl: currentImageUrl,
        publicId: currentPublicId,
      };

      const result = await dispatch(
        updateFamily({
          id: familyToEdit._id,
          familyData: updatedFamilyData,
        })
      ).unwrap();

      if (result?.success) {
        dispatch(fetchAllFamily());
        // Update the family prop with the new data
        const updatedFamily = {
          ...family,
          ...updatedFamilyData
        };
        onOpenChange(false);
        toast.success("Family updated successfully");
        setIsFormDirty(false);
        // Call the familyEdited prop with the updated family
        if (typeof familyEdited === 'function') {
          familyEdited(updatedFamily);
        }
      } else {
        toast.error(result?.message || "Failed to update family");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred while updating family");
    }
  };

  // Handle delete image
  const handleDeleteImage = async () => {
    if (!currentPublicId) {
      setCurrentImageUrl(null);
      setSelectedFileName("");
      return;
    }

    setIsDeletingImage(true);
    try {
      const result = await dispatch(
        deleteFamilyImage(currentPublicId)
      ).unwrap();

      if (result?.success) {
        setCurrentImageUrl(null);
        setCurrentPublicId(null);
        setSelectedFileName("");
        setFile(null);
        toast.success("Image removed successfully");
      } else {
        toast.error(result?.message || "Failed to remove image");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred while deleting image");
    } finally {
      setIsDeletingImage(false);
    }
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
      setFamilyToEdit(null);
      onOpenChange(false);
    }
    setPendingAction(null);
  };

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && isFormDirty) {
            handlePendingAction("close");
          } else if (!open) {
            resetAllFormState();
            onOpenChange(false);
          } else {
            onOpenChange(open);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Family Details</SheetTitle>
            <SheetDescription>
              Make changes to {family?.familyName || "family"}'s information
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {imageLoading || isDeletingImage ? (
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
                buttonText="Update Family"
                formData={editFormData}
                setFormData={setEditFormData}
                customStyle="grid grid-cols-1 gap-4"
                setFile={setFile}
                handleDeleteImage={handleDeleteImage}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
                isDeletingImage={isDeletingImage}
                showDeleteImageButton={!!currentImageUrl}
                currentImageUrl={currentImageUrl}
                filteredFamilyNames={filteredFamilyNames}
              />
            )}
          </div>

          <SheetFooter className="pt-4 border-t mt-4">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isFormDirty) {
                    handlePendingAction("close");
                  } else {
                    onOpenChange(false);
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Unsaved Changes Alert Dialog */}
      <UnsavedChangesAlert
        isOpen={isUnsavedAlertOpen}
        setIsOpen={setIsUnsavedAlertOpen}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save them or discard?"
        onContinueEditing={() => setIsUnsavedAlertOpen(false)}
        onSaveChanges={() => {
          handleSubmit();
          executePendingAction(pendingAction);
        }}
        onDiscardChanges={() => {
          resetAllFormState();
          executePendingAction(pendingAction);
        }}
      />
    </>
  );
};

export default EditFamily;
