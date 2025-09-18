import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import backArrow from "../../assets";
import backArrow from "../../assets/Vector.png";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `accountant-users/reset-password`,
        {
          email: data?.email,
        }
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/verify-email?type=forget&email=${data?.email}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              Forgot password
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="flex flex-col bg-white rounded-[14px] py-[25px] shadow">
            <div className="mx-[25px] mb-[20px]">
              <p className="text-[#666F96]">
                Please enter your email address. You will receive an OTP to
                verify your email.
              </p>
            </div>
            <div className="mx-[25px]">
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                  className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                    errors.email ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex justify-between px-[20px] mt-[20px]">
              <button
                type="submit"
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow ${
                  loading ? "opacity-70" : "opacity-100"
                }`}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Send"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
