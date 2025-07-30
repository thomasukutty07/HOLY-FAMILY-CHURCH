import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/Common/Form";
import { addGroupFormControls } from "@/config";
import { updateGroup, deleteGroupImage, uploadGroupImage } from "@/Store/Group/groupSlice";
import UnsavedChangesAlert from "@/components/Common/Unsave";

const EditGroup = ({ currentGroup, isEditSheetOpen, setIsEditSheetOpen, handleGroupUpdate }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    imageUrl: "",
    publicId: "",
    groupName: "",
    leaderName: "",
    secretaryName: "",
    location: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);

  useEffect(() => {
    if (currentGroup) {
      const initialData = {
        imageUrl: currentGroup.imageUrl || "",
        publicId: currentGroup.publicId || "",
        groupName: currentGroup.groupName || "",
        leaderName: currentGroup.leaderName || "",
        secretaryName: currentGroup.secretaryName || "",
        location: currentGroup.location || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setImageUrl(currentGroup.imageUrl || null);
      setPublicId(currentGroup.publicId || null);
    }
  }, [currentGroup]);

  // Track form changes
  useEffect(() => {
    if (initialFormData) {
      const hasDataChanged = JSON.stringify(initialFormData) !== JSON.stringify(formData);
      const hasImageChanged = 
        (initialFormData.imageUrl !== imageUrl) || 
        (initialFormData.publicId !== publicId);
      setHasUnsavedChanges(hasDataChanged || hasImageChanged);
    }
  }, [formData, initialFormData, imageUrl, publicId]);

  const resetImageState = () => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);
    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  };

  const resetAllFormState = () => {
    if (initialFormData) {
      setFormData({ ...initialFormData });
    }
    resetImageState();
    setHasUnsavedChanges(false);
  };

  const handleDeleteImage = async () => {
    if (!publicId) {
      toast.error("No image to delete.");
      return;
    }

    try {
      setIsDeletingImage(true);
      const response = await dispatch(deleteGroupImage(publicId)).unwrap();
      if (response?.success) {
        toast.success(response.message || "Image deleted successfully");
        resetImageState();
        setFormData(prev => ({ ...prev, imageUrl: "", publicId: "" }));
        setHasUnsavedChanges(true);
      } else {
        toast.error(response?.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error(error?.message || "An error occurred while deleting the image");
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['groupName', 'leaderName', 'secretaryName', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };

    try {
      setIsSubmitting(true);
      const response = await dispatch(updateGroup({ 
        id: currentGroup._id, 
        groupData: updatedFormData 
      })).unwrap();

      if (response?.success) {
        toast.success(response.message || "Group updated successfully");
        handleGroupUpdate(response.group);
        setIsEditSheetOpen(false);
        setHasUnsavedChanges(false);
      } else {
        toast.error(response?.message || "Failed to update group. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "An error occurred while updating the group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      setHasUnsavedChanges(true);
    }
  };

  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        const response = await dispatch(uploadGroupImage(imageFormData)).unwrap();
        
        if (response?.success) {
          setImageUrl(response.imageUrl);
          setPublicId(response.publicId);
          setFormData(prev => ({
            ...prev,
            imageUrl: response.imageUrl,
            publicId: response.publicId
          }));
          toast.success(response.message || "Image uploaded successfully");
          setHasUnsavedChanges(true);
        } else {
          throw new Error(response?.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error?.message || "An error occurred while uploading the image");
        resetImageState();
      }
    };

    uploadImage();
  }, [dispatch, file]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesAlert(true);
    } else {
      setIsEditSheetOpen(false);
    }
  };

  const handleSaveChanges = async () => {
    setShowUnsavedChangesAlert(false);
    try {
      setIsSubmitting(true);
      const response = await dispatch(updateGroup({ 
        id: currentGroup._id, 
        groupData: {
          ...formData,
          imageUrl: imageUrl || "",
          publicId: publicId || "",
        }
      })).unwrap();

      if (response?.success) {
        toast.success(response.message || "Group updated successfully");
        handleGroupUpdate(response.group);
        setIsEditSheetOpen(false);
        setHasUnsavedChanges(false);
      } else {
        toast.error(response?.message || "Failed to update group. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "An error occurred while updating the group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedChangesAlert(false);
    resetAllFormState();
    setIsEditSheetOpen(false);
  };

  return (
    <>
      <Sheet open={isEditSheetOpen} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-gray-900">
              Edit Group
            </SheetTitle>
          </SheetHeader>

          {imageUrl && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Group preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium">Image Preview</h3>
                  <p className="text-gray-500 text-sm">
                    {selectedFileName || "Uploaded image"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={isDeletingImage}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <CommonForm
              formControls={addGroupFormControls}
              formData={formData}
              setFormData={(newData) => {
                setFormData(newData);
                setHasUnsavedChanges(true);
              }}
              onSubmit={handleSubmit}
              buttonText={isSubmitting ? "Updating..." : "Update Group"}
              setFile={setFile}
              handleDeleteImage={handleDeleteImage}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
              isDeletingImage={isDeletingImage}
              handleFileChange={handleFileChange}
              disabled={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <UnsavedChangesAlert
        isOpen={showUnsavedChangesAlert}
        setIsOpen={setShowUnsavedChangesAlert}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save them or discard?"
        continueEditingLabel="Continue Editing"
        saveChangesLabel="Save Changes"
        discardChangesLabel="Discard Changes"
        onContinueEditing={() => {
          setShowUnsavedChangesAlert(false);
        }}
        onSaveChanges={handleSaveChanges}
        onDiscardChanges={handleDiscardChanges}
        saveButtonProps={{
          className: "bg-indigo-600 hover:bg-indigo-700 text-white"
        }}
        discardButtonProps={{
          className: "bg-red-600 hover:bg-red-700 text-white"
        }}
      />
    </>
  );
};

export default EditGroup; 