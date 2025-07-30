import React from "react";
import CommonForm from "@/components/Common/Form";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Trash2, Users, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateFamilyLogic } from "@/CustomHook/useCreateFamilyLogic";

const CreateFamily = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    handleSubmit,
    formKey,
    setFile,
    updatedFormDataControls,
    familyLoading,
    familyNames,
    handleDeleteImage,
    selectedFileName,
    setSelectedFileName,
    isDeletingImage,
    imageUrl,
    groupLoading,
    isFormSubmitted,
    groupNames,
    isUploading,
  } = useCreateFamilyLogic();

  if (familyLoading || groupLoading || isFormSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)] bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl mx-auto my-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Family</h1>
          </div>
        </div>

        {familyNames?.length > 0 && (
          <Button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <Link to="/admin/families" className="text-white">
              View All Families
            </Link>
          </Button>
        )}
      </div>

      {imageUrl && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-24 h-24 rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt="Family preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium">Image Preview</h3>
              <p className="text-gray-500 text-sm">
                {selectedFileName || "Uploaded image"}
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteImage}
              disabled={isDeletingImage}
              className="flex items-center gap-2"
            >
              {isDeletingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Image</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div>
        <CommonForm
          key={formKey}
          formControls={updatedFormDataControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          setFile={setFile}
          handleDeleteImage={handleDeleteImage}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          isDeletingImage={isDeletingImage}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
};

export default CreateFamily;
