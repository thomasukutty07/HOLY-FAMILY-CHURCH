import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CommonForm from "@/components/Common/Form";
import { Button } from "@/components/ui/button";
import { addMemberFormControls } from "@/config";
import { fetchAllFamilyNames } from "@/Store/Family/familySlice";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import {
  createUser,
  fetchAllUsers,
  uploadUserImage,
} from "@/Store/User/userSlice";
import { Loader2 } from "lucide-react";

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
  familyId: "",
  groupId: "",
};

const AddUser = () => {
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const { users, userLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const updatedFormDataControls = addMemberFormControls.map((field) => {
    if (field.name === "familyId") {
      return {
        ...field,
        options: Array.isArray(familyNames)
          ? familyNames.map((family) => ({
              id: family._id,
              label: family.familyName,
            }))
          : [],
      };
    } else if (field.name === "groupId") {
      return {
        ...field,
        options: Array.isArray(groupNames)
          ? groupNames.map((group) => ({
              id: group._id,
              label: group.groupName,
            }))
          : [],
      };
    }
    return field;
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const formToSubmit = new FormData();
    const updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };

    for (const key in updatedFormData) {
      formToSubmit.append(key, updatedFormData[key]);
    }

    dispatch(createUser(formToSubmit)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setFormData(initialFormData);
        setImageUrl(null);
        setPublicId(null);
        setFile(null);
        dispatch(fetchAllUsers());
        setFormKey((prev) => prev + 1);
        navigate("/admin/add-user");
      } else {
        toast.error(data.error.message);
      }
    });
  };

  useEffect(() => {
    if (file) {
      const data = new FormData();
      data.append("image", file);
      dispatch(uploadUserImage(data)).then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setImageUrl(data?.payload?.imageUrl);
          setPublicId(data?.payload?.publicId);
        } else {
          toast.error(data?.payload?.message);
        }
      });
    }
  }, [file]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllFamilyNames());
    dispatch(fetchAllGroupNames());
  }, [dispatch]);
  return userLoading || familyLoading || groupLoading ? (
    <div className="flex items-center justify-center h-[calc(100vh-105px)]">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ) : (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl mb-5 font-benzin">Add Member</h1>
        {users && users.length > 0 && (
          <Button>
            <Link to="/admin/users">All Members</Link>
          </Button>
        )}
      </div>
      <CommonForm
        key={formKey}
        formControls={updatedFormDataControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        setFile={setFile}
      />
    </div>
  );
};

export default AddUser;
