import CommonForm from "@/components/Common/Form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/Store/User/authSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  email: "",
  password: "",
  role: "admin",
};

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormData);
  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);

    console.log(formData);
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }
  return (
    <div className="w-[400px] flex flex-col gap-3">
      <div>
        <h1 className="font-corporates text-5xl bg-clip-text text-transparent bg-gradient-to-br from-[#A22FCE] to-[#FF7000]">
          Admin Login
        </h1>
        <p> Authorized users only. Please authenticate to proceed</p>
      </div>
      <CommonForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        formControls={loginFormControls}
        buttonText={"Sign In"}
        customStyle={"flex flex-col gap-3"}
      />
    </div>
  );
};

export default Login;
