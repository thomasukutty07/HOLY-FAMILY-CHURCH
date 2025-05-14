import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/Common/DeletePopUp";
import {
  deleteMember,
  deleteMemberImage,
  fetchAllMembers,
  uploadMemberImage,
} from "@/Store/User/memberSlice";
import CommonForm from "@/components/Common/Form";

const EditAndDeleteMember = ({
  memberToEdit,
  setMemberToEdit,
  editFormData,
  setEditFormData,
  handleEditMember,
  handleUpdateMember,
  member,
  familyNames,
  groupNames,
}) => {
  const dispatch = useDispatch();
  const { imageLoading } = useSelector((state) => state.member);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    message: "",
    confirmLabel: "",
  });
  const [selectedFileName, setSelectedFileName] = useState(
    member?.imageUrl ? member.imageUrl.split("/").pop() : ""
  );
  const [file, setFile] = useState(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  // Add missing state for image handling
  const [imageUrl, setImageUrl] = useState(member?.imageUrl || null);
  const [publicId, setPublicId] = useState(member?.publicId || null);

  const editFormControls = [
    {
      name: "name",
      label: "Full Name",
      componentType: "input",
      type: "text",
      placeholder: "Enter full name",
    },
    {
      name: "role",
      label: "Role",
      componentType: "select",
      options: [
        { id: "member", label: "Member" },
        { id: "vicar", label: "Vicar" },
        { id: "sister", label: "Sister" },
        { id: "mother", label: "Mother" },
        { id: "teacher", label: "Teacher" },
        { id: "coordinator", label: "Coordinator" },
        { id: "group-leader", label: "Group Leader" },
        { id: "group-secretary", label: "Group Secretary" },
      ],
    },
    {
      name: "sex",
      label: "Sex",
      componentType: "select",
      options: [
        { id: "male", label: "Male" },
        { id: "female", label: "Female" },
      ],
    },
    {
      name: "baptismName",
      label: "Baptism Name",
      componentType: "input",
      type: "text",
      placeholder: "Enter baptism name",
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      componentType: "date",
    },
    {
      name: "isActive",
      label: "Status",
      componentType: "select",
      options: [
        { id: "true", label: "Active" },
        { id: "false", label: "Not Active" },
      ],
    },
    {
      name: "dateOfDeath",
      label: "Date of Death",
      componentType: "date",
    },
    {
      name: "married",
      label: "Marital Status",
      componentType: "select",
      options: [
        { id: "true", label: "Married" },
        { id: "false", label: "Single" },
      ],
    },
    {
      name: "marriageDate",
      label: "Marriage Date",
      componentType: "date",
    },
    {
      name: "family",
      label: "Family",
      componentType: "select",
      options: familyNames.map((family) => ({
        id: family._id,
        label: family.familyName,
      })),
    },
    {
      name: "group",
      label: "Group",
      componentType: "select",
      options: groupNames.map((group) => ({
        id: group._id,
        label: group.groupName,
      })),
    },
    {
      name: "imageUrl",
      label: "Profile Image",
      componentType: "input",
      type: "file",
    },
  ];

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
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting the member");
      });
  };

  const handleDeleteImage = async () => {
    if (!memberToEdit?._id) return;

    setIsDeletingImage(true);

    try {
      dispatch(deleteMemberImage(memberToEdit?.publicId)).then((data) => {
        console.log(data);
      });
      const updatedFormData = {
        ...editFormData,
        imageUrl: null,
        publicId: null,
      };

      // Update editFormData state
      setEditFormData(updatedFormData);
      setSelectedFileName("");
      setFile(null);
    } catch (error) {
      console.error("Image deletion error:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsDeletingImage(false);
    }
  };

  const resetImageState = () => {
    setFile(null);
    setSelectedFileName(
      member?.imageUrl ? member.imageUrl.split("/").pop() : ""
    );
  };

  const handleSubmit = () => {
    if (!memberToEdit?._id) return;
    const updatedMemberData = {
      ...editFormData,
    };
    if (imageUrl !== member?.imageUrl) {
      updatedMemberData.imageUrl = imageUrl;
      updatedMemberData.publicId = publicId;
    }
    handleUpdateMember(updatedMemberData);
  };

  useEffect(() => {
    if (!file) return;

    const uploadImage = async () => {
      try {
        const data = new FormData();
        data.append("image", file);

        const response = await dispatch(uploadMemberImage(data));

        if (response?.payload?.success) {
          const uploadedPublicId = response.payload.publicId;
          const uploadedImageUrl = response.payload.imageUrl;

          setImageUrl(uploadedImageUrl);
          setPublicId(uploadedPublicId);

          // Also update the form data
          setEditFormData({
            ...editFormData,
            imageUrl: uploadedImageUrl,
            publicId: uploadedPublicId,
          });

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
  }, [file, dispatch]);

  // Remove the top-level loader condition - we'll only show loaders inside the sheet

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Sheet
        open={memberToEdit?._id === member?._id}
        onOpenChange={(open) =>
          open ? handleEditMember(member) : setMemberToEdit(null)
        }
      >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[500px] sm:max-w-[95vw] md:max-w-[500px] overflow-y-auto">
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

          {/* Add the CommonForm component here */}
          <div className="py-4">
            {imageLoading ? (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                <Loader2 className="animate-spin w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-gray-600">Uploading image...</span>
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
              />
            )}
          </div>

          <SheetFooter className="pt-4 border-t mt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
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
        onClick={(event) => {
          handleDeleteMember(event);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default EditAndDeleteMember;
