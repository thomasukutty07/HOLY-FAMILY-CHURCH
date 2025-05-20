import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFamily, uploadFamilyImage } from "@/Store/Family/familySlice";
import {
  createGroup,
  deleteGroupImage,
  fetchAllGroupNames,
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
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const { familyNames, familyLoading } = useSelector((state) => state.family);

  const resetImageState = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);
    setIsUploading(false);

    sessionStorage.removeItem("tempGroupImagePublicId");
    sessionStorage.removeItem("tempGroupImageUrl");
    sessionStorage.removeItem("tempGroupFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const updatedFormData = {
        ...formData,
        imageUrl: imageUrl || "",
        publicId: publicId || "",
      };

      const allFieldsFilled = Object.values(updatedFormData).every(
        (value) =>
          value !== null && value !== undefined && String(value).trim() !== ""
      );

      if (!allFieldsFilled) {
        toast.error("Please fill out all the fields.");
        return;
      }

      try {
        setIsFormSubmitted(true);

        const formToSubmit = new FormData();
        Object.entries(updatedFormData).forEach(([key, value]) =>
          formToSubmit.append(key, value)
        );

        const response = await dispatch(createGroup(formToSubmit));

        if (response?.payload?.success) {
          toast.success(
            response.payload.message || "Group created successfully"
          );
          setFormData(initialFormData);
          resetImageState();
          setFormKey((prev) => prev + 1);
          dispatch(fetchAllFamily());
          dispatch(fetchAllGroupNames());
        } else {
          const errorMessage =
            response?.payload?.message ||
            "Failed to create group. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error(
          error?.message || "An error occurred while adding the group."
        );
      } finally {
        setIsFormSubmitted(false);
      }
    },
    [formData, imageUrl, publicId, dispatch, resetImageState]
  );

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
        const errorMessage = response?.payload?.message || response?.error?.message || "Failed to delete image";
        console.error("Image deletion failed:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Image deletion error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while deleting the image";
      toast.error(errorMessage);
    } finally {
      setIsDeletingImage(false);
    }
  }, [publicId, dispatch, resetImageState]);

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
  }, [publicId]);

  useEffect(() => {
    dispatch(fetchAllFamily());
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        setIsUploading(true);
        const imageFormData = new FormData();
        imageFormData.append("image", file);

        const data = await dispatch(uploadFamilyImage(imageFormData));

        if (data?.payload?.success) {
          setImageUrl(data.payload.imageUrl);
          setPublicId(data.payload.publicId);
          toast.success(data.payload.message || "Image uploaded successfully");
        } else {
          toast.error(data?.payload?.message || "Failed to upload image");
          resetImageState();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("An error occurred while uploading the image");
        resetImageState();
      } finally {
        setIsUploading(false);
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
    groupLoading,
    familyLoading,
    isFormSubmitted,
    isUploading,
  };
};
