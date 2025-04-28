import CommonForm from "@/components/Common/Form";
import { Button } from "@/components/ui/button";
import { addGroupFormControls } from "@/config";
import {
  fetchAllFamilyNames,
  uploadFamilyImage,
} from "@/Store/Family/familySlice";
import { createGroup, fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const initialFormData = {
  imageUrl: "",
  publicId: "",
  groupName: "",
  leaderName: "",
  secretaryName: "",
};
const CreateGroup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const [file, setFile] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const dispatch = useDispatch();

  // Form submit
  function handleSubmit(event) {
    console.log(formData);
    console.log("imageUrl", imageUrl);
    console.log("publicId", publicId);
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
    };
    const formToSubmit = new FormData();
    for (const key in updatedFormData) {
      formToSubmit.append(key, updatedFormData[key]);
    }
    for (const [key, value] of formToSubmit.entries()) {
      console.log(`${key}: ${value}`);
    }

    dispatch(createGroup(formToSubmit)).then((data) => {
      if (data?.payload?.success) {
        console.log(data);

        toast.success(data?.payload?.message);
        setFormData(initialFormData);
        setFormKey((prev) => prev + 1);
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllFamilyNames());
    dispatch(fetchAllGroupNames());
  }, [dispatch]);

  useEffect(() => {
    if (file) {
      const imageFileFormData = new FormData();
      imageFileFormData.append("image", file);
      dispatch(uploadFamilyImage(imageFileFormData)).then((data) => {
        if (data?.payload?.success) {
          setImageUrl(data?.payload?.imageUrl);
          setPublicId(data?.payload?.publicId);
          toast.success(data?.payload?.message);
          dispatch(fetchAllGroupNames());
        }
      });
    }
  }, [file]);
  return groupLoading ? (
    <div className="flex items-center justify-center h-[calc(100vh-105px)]">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ) : (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl mb-5 font-benzin">Create Group</h1>
        {groupNames && groupNames.length > 0 && (
          <Button>
            <Link to="/admin/groups">All Groups</Link>
          </Button>
        )}
      </div>
      <CommonForm
        key={formKey}
        formControls={addGroupFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        setFile={setFile}
      />
    </div>
  );
};

export default CreateGroup;
