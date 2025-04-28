import CommonForm from "@/components/Common/Form";
import { Button } from "@/components/ui/button";
import { addFamilyFormControls } from "@/config";
import {
  createFamily,
  fetchAllFamilyNames,
  uploadFamilyImage,
} from "@/Store/Family/familySlice";
import { fetchAllGroupNames } from "@/Store/Group/groupSlice";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const initialFormData = {
  familyName: "",
  groupId: "",
  contactNo: "",
  imageUrl: "",
  publicId: "",
};
const CreateFamily = () => {
  const { familyNames, familyLoading } = useSelector((state) => state.family);
  const { groupNames, groupLoading } = useSelector((state) => state.group);
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [publicId, setPublicId] = useState(null);
  const dispatch = useDispatch();
  function handleSubmit(event) {
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

    dispatch(createFamily(formToSubmit)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setFormData(initialFormData);
        setImageUrl(null);
        setPublicId(null);
        setFormKey((prev) => prev + 1);
      }
    });
  }
  const updatedFormControls = addFamilyFormControls.map((field) => {
    if (field.name === "groupId") {
      return {
        ...field,
        options: Array.isArray(groupNames)
          ? groupNames.map((group) => {
              return { id: group._id, label: group.groupName };
            })
          : [],
      };
    }
    return field;
  });

  useEffect(() => {
    if (file) {
      const imageFileFormData = new FormData();
      data.append("image", file);
      dispatch(uploadFamilyImage(imageFileFormData)).then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setFile(null);
          setPublicId(data?.payload?.publicId);
          setImageUrl(data?.payload?.imageUrl);
          dispatch(fetchAllFamilyNames());
        }
      });
    }
  }, [file]);

  useEffect(() => {
    dispatch(fetchAllFamilyNames());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchAllGroupNames()).then((data) => {
      console.log(data);
    });
  }, []);

  return familyLoading || groupLoading ? (
    <div className="flex items-center justify-center w-full h-[calc(100vh-105px)]">
      <Loader2 className="w-10 h-10 animate-spin " />
    </div>
  ) : (
    <div>
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl mb-5 font-benzin">Create Family</h1>
        {familyNames && familyNames.length > 0 && (
          <Button>
            <Link to="/admin/families">All Families</Link>
          </Button>
        )}
      </div>
      <CommonForm
        key={formKey}
        formControls={updatedFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        setFile={setFile}
      />
    </div>
  );
};

export default CreateFamily;
