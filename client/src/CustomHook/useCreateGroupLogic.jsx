import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFamilyImage } from "@/Store/Family/familySlice";
import {
  createGroup,
  deleteGroupImage,
  fetchFamilyByGroupName,
} from "@/Store/Group/groupSlice";
import { toast } from "sonner";
import { addGroupFormControls as updatedFormDataControls } from "@/config";

const initialFormData = {
  imageUrl: "",
  publicId: "",
  groupName: "",
  leaderName: "",
  secretaryName: "",
  location: "",
};
export const useCreateGroupLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { groupNames, familyNames, loading ,groupData} = useSelector(
    (state) => state.group
  );

  // Reset image-related state
  const resetImageState = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);

    // Clean up sessionStorage
    sessionStorage.removeItem("tempGroupImagePublicId");
    sessionStorage.removeItem("tempGroupImageUrl");
    sessionStorage.removeItem("tempGroupFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    const updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };

    const formToSubmit = new FormData();
    Object.entries(updatedFormData).forEach(([key, value]) =>
      formToSubmit.append(key, value)
    );

    dispatch(createGroup(formToSubmit)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message);
        setFormData(initialFormData);
        resetImageState();
        setFormKey((prev) => prev + 1);
        dispatch(fetchFamilyByGroupName());
      }
    });
  };

  const handleDeleteImage = useCallback(async () => {
    if (!publicId) {
      toast.error("No image to delete.");
      return;
    }

    try {
      setIsDeletingImage(true);
      const response = await dispatch(deleteGroupImage(publicId));
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

  // Manage session storage for temporary image data
  useEffect(() => {
    if (publicId) {
      sessionStorage.setItem("tempGroupImagePublicId", publicId);
      if (imageUrl) {
        sessionStorage.setItem("tempGroupImageUrl", imageUrl);
      }
      if (selectedFileName) {
        sessionStorage.setItem("tempGroupFileName", selectedFileName);
      }
    }
  }, [publicId, imageUrl, selectedFileName]);

  // Restore image data from session storage
  useEffect(() => {
    const storedPublicId = sessionStorage.getItem("tempGroupImagePublicId");
    if (storedPublicId && !publicId) {
      setPublicId(storedPublicId);
      const storedImageUrl = sessionStorage.getItem("tempGroupImageUrl");
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      }
      const storedFileName = sessionStorage.getItem("tempGroupFileName");
      if (storedFileName) {
        setSelectedFileName(storedFileName);
      }
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchFamilyByGroupName());
  }, [dispatch]);

  // Handle file upload
  useEffect(() => {
    if (!file) return;
    const uploadImage = async () => {
      try {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        dispatch(uploadFamilyImage(imageFormData)).then((data) => {
          if (data?.payload?.success) {
            setImageUrl(data.payload.imageUrl);
            setPublicId(data.payload.publicId);
            toast.success(data.payload.message);
          }
        });
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("An error occurred while uploading the image");
        resetImageState();
      }
    };
    uploadImage();
  }, [dispatch, file, resetImageState]);

  return {
    formData,
    setFormData,
    handleSubmit,
    formKey,
    setFile,
    updatedFormDataControls,
    familyNames,
    groupNames,
    handleDeleteImage,
    selectedFileName,
    setSelectedFileName,
    isDeletingImage,
    imageUrl,
    publicId,
    loading,
    groupData
  };
};
