// hooks/useAddMemberLogic.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMember,
  deleteMemberImage,
  fetchAllMembers,
  uploadMemberImage,
} from "@/Store/User/memberSlice";
import { toast } from "sonner";
import { addMemberFormControls } from "@/config";

const initialFormData = {
  imageUrl: "",
  publicId: "",
  sex: "",
  role: "",
  name: "",
  dateOfBirth: "",
  baptismName: "",
  married: "",
  marriageDate: "",
  isActive: "",
  dateOfDeath: "",
  family: "",
  group: "",
};

export const useAddMemberLogic = () => {
  const { members, memberLoading, imageLoading } = useSelector((state) => state.member);
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Flag to track form submission status
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Reset image-related state
  const resetImageState = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setPublicId(null);
    setSelectedFileName(null);
    setIsUploading(false);

    // Clean up sessionStorage
    sessionStorage.removeItem("tempMemberImagePublicId");
    sessionStorage.removeItem("tempMemberImageUrl");
    sessionStorage.removeItem("tempMemberFileName");

    const fileInput = document.getElementById("imageUrl");
    if (fileInput) fileInput.value = "";
  }, []);

  // Image deletion
  const handleDeleteImage = useCallback(async () => {
    if (!publicId) {
      toast.error("No image to delete.");
      return;
    }

    try {
      setIsDeletingImage(true);
      const response = await dispatch(deleteMemberImage(publicId));
      if (response?.payload?.success) {
        toast.success(response.payload.message || "Image deleted successfully");
        resetImageState();
      } else {
        toast.error(response.payload?.message || "Failed to delete image");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image");
    } finally {
      setIsDeletingImage(false);
    }
  }, [publicId, dispatch, resetImageState]);

  // Form submission logic
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      let updatedFormData = {
        ...formData,
        imageUrl: imageUrl || "",
        publicId: publicId || "",
        isActive: formData.isActive === "true" || formData.isActive === true,
        married: formData.married === "true" || formData.married === true
      };

      // Using the same validation approach as useCreateGroupLogic
      const allFieldsFilled = Object.keys(updatedFormData).every((key) => {
        // Skip validation for optional fields
        if (
          key === "imageUrl" ||
          key === "publicId" ||
          key === "marriageDate" ||
          key === "dateOfDeath" ||
          key === "family" ||
          key === "group"
        ) {
          return true;
        }

        // Skip fields based on role
        const exemptRoles = ["vicar", "sister", "sister_superior"];
        const excludeForExempt = ["group", "family", "marriageDate", "married"];

        if (
          exemptRoles.includes(updatedFormData.role) &&
          excludeForExempt.includes(key)
        ) {
          return true;
        }

        const value = updatedFormData[key];
        return (
          value !== null && value !== undefined && String(value).trim() !== ""
        );
      });

      if (!allFieldsFilled) {
        return toast.error("Please fill out all the required fields.");
      }

      try {
        setIsFormSubmitted(true);
        console.log("Submitting member data:", updatedFormData);

        const response = await dispatch(createMember(updatedFormData));

        if (response?.payload?.success) {
          toast.success(response.payload.message || "Member added successfully");
          setFormData(initialFormData);
          resetImageState();
          dispatch(fetchAllMembers());
          setFormKey((prev) => prev + 1);
        } else {
          const errorMsg = response.payload?.message || "Failed to add member";
          console.error("Member creation failed:", response.payload);
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An error occurred while adding the member");
      } finally {
        setIsFormSubmitted(false);
      }
    },
    [formData, imageUrl, publicId, dispatch, resetImageState]
  );

  // Update form controls with dynamic options
  const updatedFormDataControls = addMemberFormControls.map((field) => {
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

  // Using sessionStorage to persist publicId during page refreshes
  useEffect(() => {
    const storedPublicId = sessionStorage.getItem("tempMemberImagePublicId");
    if (storedPublicId && !publicId) {
      setPublicId(storedPublicId);
      const storedImageUrl = sessionStorage.getItem("tempMemberImageUrl");
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      }

      const storedFileName = sessionStorage.getItem("tempMemberFileName");
      if (storedFileName) {
        setSelectedFileName(storedFileName);
      }
    }
  }, []);

  // Save publicId to sessionStorage whenever it changes
  useEffect(() => {
    if (publicId) {
      sessionStorage.setItem("tempMemberImagePublicId", publicId);
      if (imageUrl) {
        sessionStorage.setItem("tempMemberImageUrl", imageUrl);
      }
      if (selectedFileName) {
        sessionStorage.setItem("tempMemberFileName", selectedFileName);
      }
    }
  }, [publicId, imageUrl, selectedFileName]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  // Handle image upload
  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        setIsUploading(true);
        const data = new FormData();
        data.append("image", file);
        const response = await dispatch(uploadMemberImage(data));

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
      } finally {
        setIsUploading(false);
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
    memberLoading,
    familyLoading,
    groupLoading,
    members,
    handleDeleteImage,
    selectedFileName,
    setSelectedFileName,
    isDeletingImage,
    imageLoading,
    imageUrl,
    publicId,
    isFormSubmitted,
    isUploading,
  };
};
