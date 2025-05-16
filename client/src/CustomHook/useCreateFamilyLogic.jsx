// CustomHook/useCreateFamilyLogic.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFamily,
  deleteFamilyImage,
  fetchAllFamily,
  uploadFamilyImage,
} from "@/Store/Family/familySlice";
import { toast } from "sonner";
import { addFamilyFormControls } from "@/config";

const initialFormData = {
  familyName: "",
  group: "",
  contactNo: "",
  imageUrl: "",
  publicId: "",
  headOfFamily: "",
  address: "",
  location: "",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const useCreateFamilyLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames } = useSelector((state) => state.group);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    // Keep only for compatibility, but remove validation logic
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
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

    setFormKey((prev) => prev + 1);
  }, []);

  const resetImageState = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
      publicId: "",
    }));

    // Clean up sessionStorage
    sessionStorage.removeItem("tempFamilyImagePublicId");
    sessionStorage.removeItem("tempFamilyImageUrl");
    sessionStorage.removeItem("tempFamilyFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };

    const allFieldsFilled = Object.keys(updatedFormData).every((key) => {
      // Skip image fields checking if they're optional
      if (key === "imageUrl" || key === "publicId") return true;

      const value = updatedFormData[key];
      return (
        value !== null && value !== undefined && String(value).trim() !== ""
      );
    });

    if (!allFieldsFilled) {
      return toast.error("Please fill out all the fields.");
    }

    setIsSubmitting(true);

    try {
      const formToSubmit = new FormData();
      Object.entries(updatedFormData).forEach(([key, value]) =>
        formToSubmit.append(key, value)
      );

      const response = await dispatch(createFamily(formToSubmit));

      if (response?.payload?.success) {
        toast.success(response.payload.message || "Family added successfully");
        resetForm();
        dispatch(fetchAllFamily());
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed");
      return;
    }

    setFile(selectedFile);
    setSelectedFileName(selectedFile.name);
  };

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

  const updatedFormDataControls = useMemo(() => {
    return (addFamilyFormControls || []).map((field) =>
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
  }, [groupNames]);

  useEffect(() => {
    dispatch(fetchAllFamily());
  }, [dispatch]);

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

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("tempFamilyImagePublicId");
      sessionStorage.removeItem("tempFamilyImageUrl");
      sessionStorage.removeItem("tempFamilyFileName");
    };
  }, []);

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
          setFormData((prev) => ({
            ...prev,
            imageUrl: uploadedImageUrl,
            publicId: uploadedPublicId,
          }));
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
    handleInputChange,
    handleBlur,
    formKey,
    setFile: handleFileChange,
    updatedFormDataControls,
    familyLoading,
    familyNames,
    handleDeleteImage,
    selectedFileName,
    setSelectedFileName,
    isDeletingImage,
    imageUrl,
    isSubmitting,
    resetForm,
  };
};

export default useCreateFamilyLogic;
