// CustomHook/useCreateFamilyLogic.js
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFamily,
  deleteFamilyImage,
  uploadFamilyImage,
} from "@/Store/Family/familySlice";
import { toast } from "sonner";
import { addFamilyFormControls } from "@/config";
import { fetchFamilyByGroupName } from "@/Store/Group/groupSlice";

const initialFormData = {
  familyName: "",
  group: "",
  contactNo: "",
  imageUrl: "",
  publicId: "",
  headOfFamily: "",
  address: "",
};

export const useCreateFamilyLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const dispatch = useDispatch();
  const { familyNames, groupNames, loading } = useSelector(
    (state) => state.group
  );
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Reset image-related state
  const resetImageState = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);

    // Clean up sessionStorage
    sessionStorage.removeItem("tempFamilyImagePublicId");
    sessionStorage.removeItem("tempFamilyImageUrl");
    sessionStorage.removeItem("tempFamilyFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedFormData = {
        ...formData,
        imageUrl: imageUrl || "",
        publicId: publicId || "",
      };

      const formToSubmit = new FormData();
      Object.entries(updatedFormData).forEach(([key, value]) =>
        formToSubmit.append(key, value)
      );

      const response = await dispatch(createFamily(formToSubmit));

      if (response?.payload?.success) {
        setIsFormSubmitted(true);
        toast.success(response.payload.message || "Family added successfully");
        setFormData(initialFormData);
        resetImageState();
        dispatch(fetchFamilyByGroupName());
        setFormKey((prev) => prev + 1);
      } else {
        const errorMsg =
          response.payload?.message ||
          response.error?.message ||
          "Failed to add family";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while adding the family");
    }
  };

  // Image deletion
  const handleDeleteImage = useCallback(async () => {
    if (!publicId) {
      toast.error("No image to delete.");
      return;
    }

    try {
      setIsDeletingImage(true);
      const response = await dispatch(deleteFamilyImage(publicId));
      if (response?.payload?.success) {
        toast.success(response.payload.message || "Image deleted successfully");
        resetImageState();
      } else {
        console.error("Image deletion failed:", response);
        toast.error(response.payload?.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Image deletion error:", error);
      toast.error("An error occurred while deleting the image");
    } finally {
      setIsDeletingImage(false);
    }
  }, [publicId, dispatch, resetImageState]);

  const updatedFormDataControls = (addFamilyFormControls || []).map((field) =>
    field.name === "group"
      ? {
          ...field,
          options:
            groupNames?.map((group) => ({
              id: group._id,
              label: group.groupName,
            })) || [],
        }
      : field
  );

  // Initial data
  useEffect(() => {
    dispatch(fetchFamilyByGroupName());
  }, [dispatch]);

  // Using sessionStorage to persist publicId during page refreshes
  useEffect(() => {
    const storedPublicId = sessionStorage.getItem("tempFamilyImagePublicId");
    if (storedPublicId && !publicId) {
      setPublicId(storedPublicId);

      const storedImageUrl = sessionStorage.getItem("tempFamilyImageUrl");
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      }

      const storedFileName = sessionStorage.getItem("tempFamilyFileName");
      if (storedFileName) {
        setSelectedFileName(storedFileName);
      }
    }
  }, [publicId]);

  // Save publicId to sessionStorage whenever it changes
  useEffect(() => {
    if (publicId) {
      sessionStorage.setItem("tempFamilyImagePublicId", publicId);
      if (imageUrl) {
        sessionStorage.setItem("tempFamilyImageUrl", imageUrl);
      }
      if (selectedFileName) {
        sessionStorage.setItem("tempFamilyFileName", selectedFileName);
      }
    }
  }, [publicId, imageUrl, selectedFileName]);

  // Handle image upload
  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        const data = new FormData();
        data.append("image", file);

        const response = await dispatch(uploadFamilyImage(data));

        if (response?.payload?.success) {
          const uploadedPublicId = response.payload.publicId;
          const uploadedImageUrl = response.payload.imageUrl;

          setImageUrl(uploadedImageUrl);
          setPublicId(uploadedPublicId);
          toast.success(
            response.payload.message || "Image uploaded successfully"
          );
        } else {
          toast.error(response.payload?.message || "Failed to upload image");
          resetImageState();
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("An error occurred while uploading the image");
        resetImageState();
      }
    };

    uploadImage();
  }, [file, dispatch, resetImageState]);

  return {
    formData,
    setFormData,
    handleSubmit,
    formKey,
    setFile,
    updatedFormDataControls,
    loading,
    familyNames,
    handleDeleteImage,
    selectedFileName,
    setSelectedFileName,
    isDeletingImage,
    imageUrl,
  };
};

export default useCreateFamilyLogic;
