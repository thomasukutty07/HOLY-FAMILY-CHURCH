import React, { useCallback } from "react";
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

const CommonForm = ({
  formControls,
  onSubmit,
  buttonText,
  formData,
  setFormData,
  customStyle,
  setFile,
}) => {
  const role = formData.role;

  const renderComponentByComponentType = useCallback(
    (control) => {
      if (
        ["email", "password"].includes(control.name) &&
        !["admin", "vicar"].includes(role)
      ) {
        return null;
      }

      const value = formData[control.name] ?? "";

      switch (control.componentType) {
        case "input":
          return (
            <Input
              type={control.type}
              name={control.name}
              id={control.name}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder={control.placeholder || ""}
              value={value}
              onChange={(e) => {
                const inputValue = e.target.value;
                let newValue;

                if (control.type === "file") {
                  return setFile(e.target.files[0]);
                }

                if (control.name === "password" || control.name === "email") {
                  newValue = inputValue;
                } else {
                  newValue =
                    inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                }

                setFormData({
                  ...formData,
                  [control.name]: newValue,
                });
              }}
            />
          );

        case "select":
          return (
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
              <SelectTrigger id={control.name} className="w-full">
                <SelectValue placeholder={`Select ${control.label}`} />
              </SelectTrigger>
              <SelectContent>
                {control.options?.map((opt, index) => (
                  <SelectItem key={index} value={String(opt.id)}>
                    {opt.label.includes(".")
                      ? opt.label.split(".")[0] +
                        "." +
                        opt.label.split(".")[1].charAt(0).toUpperCase() +
                        opt.label.split(".")[1].slice(1)
                      : opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case "date":
          return (
            <Input
              type={control.type}
              name={control.name}
              id={control.name}
              value={value}
              onChange={(e) =>
                setFormData({ ...formData, [control.name]: e.target.value })
              }
            />
          );

        default:
          return null;
      }
    },
    [formData, role, setFile, setFormData]
  );

  return (
    <form onSubmit={onSubmit}>
      <div
        className={`${
          customStyle ? customStyle : "grid grid-cols-1 md:grid-cols-2 gap-4"
        }`}
      >
        {formControls.map((control) => {
          // Skip email/password for non-admin/vicar roles
          if (
            ["email", "password"].includes(control.name) &&
            !["admin", "vicar"].includes(formData.role)
          ) {
            return null;
          }

          // Skip marriageDate if not married (boolean check)
          if (control.name === "marriageDate" && formData.married !== true) {
            return null;
          }

          // Skip dateOfDeath if still active (boolean check)
          if (control.name === "dateOfDeath" && formData.isActive !== false) {
            return null;
          }

          return (
            control.name && (
              <div key={control.name} className="flex flex-col space-y-1">
                <Label htmlFor={control.name}>{control.label}</Label>
                {renderComponentByComponentType(control)}
              </div>
            )
          );
        })}
      </div>
      <div className="flex items-center justify-center mt-5">
        <Button className="cursor-pointer" type="submit">{buttonText || "Submit"}</Button>
      </div>
    </form>
  );
};

export default CommonForm;
