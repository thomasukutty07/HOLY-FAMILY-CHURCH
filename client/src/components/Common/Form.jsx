import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Calendar,
  MailIcon,
  FileTextIcon,
  LockIcon,
  UserIcon,
  HomeIcon,
  UsersIcon,
  X,
  Image,
  Upload,
  Loader2,
} from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import { cn } from "@/lib/utils";

const CommonForm = ({
  formControls,
  onSubmit,
  buttonText,
  formData,
  setFormData,
  customStyle,
  setFile,
  handleDeleteImage,
  selectedFileName,
  setSelectedFileName,
  isDeletingImage = false,
  isUploading = false,
}) => {
  const role = formData.role;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const getFieldIcon = (fieldName) => {
    const iconMap = {
      email: <MailIcon className="h-4 w-4 text-gray-400" />,
      password: <LockIcon className="h-4 w-4 text-gray-400" />,
      name: <UserIcon className="h-4 w-4 text-gray-400" />,
      family: <HomeIcon className="h-4 w-4 text-gray-400" />,
      group: <UsersIcon className="h-4 w-4 text-gray-400" />,
      dateOfBirth: <Calendar className="h-4 w-4 text-gray-400" />,
      marriageDate: <Calendar className="h-4 w-4 text-gray-400" />,
      dateOfDeath: <Calendar className="h-4 w-4 text-gray-400" />,
      description: <FileTextIcon className="h-4 w-4 text-gray-400" />,
      imageUrl: <Image className="h-4 w-4 text-gray-400" />,
    };
    return iconMap[fieldName] || null;
  };

  const handleFileChange = (e, controlName) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setFile(file);
    } else {
      setSelectedFileName(null);
      setFile(null);
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    if (handleDeleteImage) {
      handleDeleteImage();
    }
  };

  const renderComponentByComponentType = useCallback(
    (control) => {
      const value = formData[control.name] ?? "";
      const fieldIcon = getFieldIcon(control.name);

      switch (control.componentType) {
        case "input":
          if (control.type === "file") {
            return (
              <div className="space-y-2">
                <div className="relative">
                  {fieldIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {fieldIcon}
                    </div>
                  )}
                  {!selectedFileName ? (
                    <div className="flex items-center">
                      <label
                        htmlFor={control.name}
                        className={`flex items-center justify-center w-full h-10 ${
                          fieldIcon ? "pl-10" : "pl-4"
                        } bg-white border border-gray-200 hover:bg-gray-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-30 rounded-md cursor-pointer text-gray-500 ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                          <Upload className="h-4 w-4" />
                          )}
                          {isUploading ? "Uploading..." : "Choose file"}
                        </span>
                        <Input
                          type="file"
                          name={control.name}
                          id={control.name}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, control.name)}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-md">
                      <div className="flex items-center gap-2 text-sm text-indigo-700 truncate max-w-xs">
                        <Image className="h-4 w-4" />
                        {selectedFileName}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50"
                        onClick={handleRemoveFile}
                        disabled={isDeletingImage || isUploading}
                      >
                        {isDeletingImage || isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {isDeletingImage ? "Deleting..." : isUploading ? "Uploading..." : "Remove file"}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
                {selectedFileName && (
                  <p className="text-xs text-gray-500">
                    Click the X to remove the selected file
                  </p>
                )}
              </div>
            );
          }

          return (
            <div className="relative">
              {fieldIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {fieldIcon}
                </div>
              )}
              <Input
                type={control.type}
                name={control.name}
                id={control.name}
                autoCapitalize="none"
                autoCorrect="off"
                placeholder={control.placeholder || ""}
                value={value}
                className={`${
                  fieldIcon ? "pl-10" : "pl-4"
                } bg-white border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-30 rounded-md`}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  let newValue =
                    control.name === "password" || control.name === "email"
                      ? inputValue
                      : inputValue.charAt(0).toUpperCase() +
                        inputValue.slice(1);
                  setFormData({ ...formData, [control.name]: newValue });
                }}
              />
            </div>
          );

        case "select":
          return (
            <div className="relative">
              {fieldIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  {fieldIcon}
                </div>
              )}
              <Select
                value={
                  formData[control.name] === true
                    ? "true"
                    : formData[control.name] === false
                    ? "false"
                    : formData[control.name] || undefined
                }
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    [control.name]:
                      val === "true" ? true : val === "false" ? false : val,
                  })
                }
              >
                <SelectTrigger
                  id={control.name}
                  className={`w-full ${
                    fieldIcon ? "pl-10" : "pl-4"
                  } bg-white border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-30`}
                >
                  <SelectValue placeholder={`Select ${control.label}`} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                  {(Array.isArray(control.options) ? control.options : []).map(
                    (opt, index) => (
                      <SelectItem
                        key={index}
                        value={String(opt.id)}
                        className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer"
                      >
                        {opt.label.includes(".")
                          ? opt.label.split(".")[0] +
                            "." +
                            opt.label.split(".")[1].charAt(0).toUpperCase() +
                            opt.label.split(".")[1].slice(1)
                          : opt.label.charAt(0).toUpperCase() +
                            opt.label.slice(1)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          );

        case "textarea":
          return (
            <div className="relative">
              {fieldIcon && (
                <div className="absolute left-3 top-4 pointer-events-none">
                  {fieldIcon}
                </div>
              )}
              <Textarea
                name={control.name}
                placeholder={control.placeholder || ""}
                value={value}
                className={`${
                  fieldIcon ? "pl-10" : "pl-4"
                } bg-white border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-30 rounded-md min-h-24`}
                onChange={(e) =>
                  setFormData({ ...formData, [control.name]: e.target.value })
                }
                rows={4}
              />
            </div>
          );

        case "date":
          return (
            <div className="relative">
              <CustomDatePicker
                value={formData[control.name]}
                onChange={(date) => {
                  setFormData({ ...formData, [control.name]: date });
                }}
                name={control.name}
              />
            </div>
          );

        default:
          return null;
      }
    },
    [formData, role, setFile, setFormData, selectedFileName, isDeletingImage, handleDeleteImage, isUploading, currentDate, setCurrentDate, open, setOpen]
  );

  const isFieldVisible = (control) => {
    const restrictedRoles = ["sister", "sister_superior", "vicar"];
    const isRestrictedField = [
      "married",
      "marriageDate",
      "family",
      "group",
    ].includes(control.name);
    if (restrictedRoles.includes(role) && isRestrictedField) return false;
    if (control.name === "marriageDate" && formData.married !== true)
      return false;
    if (control.name === "dateOfDeath" && formData.isActive !== false)
      return false;
    return true;
  };

  const groupFormControls = () => {
    const groups = {
      personal: [],
      account: [],
      relationship: [],
      other: [],
    };
    const personalFields = [
      "name",
      "sex",
      "baptismName",
      "dateOfBirth",
      "dateOfDeath",
      "isActive",
      "imageUrl",
    ];
    const accountFields = ["email", "password", "role"];
    const relationshipFields = ["married", "marriageDate", "family", "group"];

    formControls.forEach((control) => {
      if (!control.name || !isFieldVisible(control)) return;
      if (personalFields.includes(control.name)) groups.personal.push(control);
      else if (accountFields.includes(control.name))
        groups.account.push(control);
      else if (relationshipFields.includes(control.name))
        groups.relationship.push(control);
      else groups.other.push(control);
    });
    return groups;
  };

  const formGroups = groupFormControls();

  const renderFormControls = () => {
    return [].concat(
      formGroups.personal,
      formGroups.account,
      formGroups.relationship,
      formGroups.other
    ).map((control) => {
      if (!isFieldVisible(control)) return null;
      return (
        <div key={control.name} className="mb-2">
          <Label
            htmlFor={control.name}
            className="text-sm font-medium text-gray-700 mb-1.5 block"
          >
            {control.label}
          </Label>
          {renderComponentByComponentType(control)}
        </div>
      );
    });
  };

  return (
    <Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <CardContent className="p-6">
          <div className={customStyle || "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            {renderFormControls()}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t flex items-center justify-center">
          <Button
            type="submit"
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            {buttonText || "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CommonForm;
