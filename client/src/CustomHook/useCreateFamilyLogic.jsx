// CustomHook/useCreateFamilyLogic.js
import { useCallback, useEffect, useState } from "react";
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
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames, groupLoading } = useSelector((state) => state.group);

  // Reset all form state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);
    setErrors({});

    // Clean up sessionStorage
    sessionStorage.removeItem("tempFamilyImagePublicId");
    sessionStorage.removeItem("tempFamilyImageUrl");
    sessionStorage.removeItem("tempFamilyFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";

    setFormKey((prev) => prev + 1);
  }, []);

  // Reset image-related state
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

  // Validate form fields
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.familyName.trim()) {
      newErrors.familyName = "Family name is required";
    }

    if (!data.group) {
      newErrors.group = "Group is required";
    }

    if (!data.contactNo) {
      newErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(data.contactNo)) {
      newErrors.contactNo = "Contact number must be 10 digits";
    }

    if (!data.headOfFamily.trim()) {
      newErrors.headOfFamily = "Head of family is required";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!data.location.trim()) {
      newErrors.location = "Location is required";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Object.values(formErrors).forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);

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

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchAllFamily());
  }, [dispatch]);

  // Load stored image data from sessionStorage
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

  // Save image data to sessionStorage
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

  // Cleanup sessionStorage on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("tempFamilyImagePublicId");
      sessionStorage.removeItem("tempFamilyImageUrl");
      sessionStorage.removeItem("tempFamilyFileName");
    };
  }, []);

  // Handle image upload when file changes
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
    errors,
    resetForm,
  };
};

export default useCreateFamilyLogic;
