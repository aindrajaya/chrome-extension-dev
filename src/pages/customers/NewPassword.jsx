import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
// import backArrow from "../../assets";
import backArrow from "../../assets/Vector.png";
import eyeOpen from "../../assets/eye-open.svg";
import eyeClose from "../../assets/eye-close.svg";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";

const NewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Call the /accountant-users/password-reset endpoint as per OpenAPI spec
      const response = await axiosInstance.post(
        `/accountant-users/password-reset`,
        {
          email: email,
          password: data?.password,
          password_confirmation: data?.password_confirmation,
        }
      );
      toast.success(response?.data?.message || "Password has been reset.");
      navigate("/reset-message");
    } catch (error) {
      const backendMsg = error?.response?.data?.message;
      toast.error(backendMsg || "Failed to reset password. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevState) => !prevState);
  };

  return (
    <>
      {/* 
    
    */}

      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to={-1}>
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
              Reset Password
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className=" flex flex-col bg-white rounded-[14px] py-[25px] shadow pb-[90px]">
            <div className="mx-[25px] mb-[20px]">
              <p className="text-[#666F96]">Enter your new password</p>
            </div>
            <div className="mx-[25px]">
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="password"
                >
                  New Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.password
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                  >
                    <img
                      alt={showPassword ? "Hide password" : "Show password"}
                      src={!showPassword ? eyeClose : eyeOpen}
                    />
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="password_confirmation"
                >
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    id="password_confirmation"
                    {...register("password_confirmation", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === getValues("password") || "Passwords do not match",
                    })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.password_confirmation
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <span
                    onClick={togglePasswordVisibility2}
                    className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                  >
                    <img
                      alt={showPassword2 ? "Hide password" : "Show password"}
                      src={!showPassword2 ? eyeClose : eyeOpen}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-[20px] flex-grow items-end">
            <button
              type="submit"
              className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow ${
                loading ? "opacity-70" : "opacity-100"
              }`}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewPassword;
