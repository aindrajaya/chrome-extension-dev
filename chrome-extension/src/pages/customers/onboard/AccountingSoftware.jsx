import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import eyeOpen from "../../../assets/eye-open.svg";
import eyeClose from "../../../assets/eye-close.svg";
import xero from "../../../assets/xero 1.svg";
import sageLogo from "../../../assets/sage-logo 1.svg";
import intuitQuickBooks from "../../../assets/Intuit_QuickBooks_logo 1.svg";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";

const AccountingSoftware = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};
  const software = localStorage.getItem("selectedSoftware") || "";


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`extension-users/link-accounting-software`, {
        email: data?.email,
        password: data?.password,
        user_id:accountantUser?.id,
        accounting_software:software
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/software-success`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () =>{
    setLoading2(true);
    try {
      const response = await axiosInstance.post(`extension-users/link-accounting-software`, {
        skip:"true",
        user_id:accountantUser?.id
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/transactions`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false);
    }
  }

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
              Accounting software
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="h-full flex flex-col bg-white rounded-[14px] py-[25px] shadow">
            <div className="mx-[25px]">
              <h1 className="text-[16px] font-normal text-center text-[#666F96]">
              Linking to 
              </h1>
              {software === "xero" && <img alt={"xero"} src={xero} className="mx-auto mt-[66px]" />}
              {software === "sage" && <img
                alt={"sageLogo"}
                src={sageLogo}
                className="mx-auto mt-[66px]"
              />}
               {software === "quickbooks" &&
              <img
                alt={"intuitQuickBooks"}
                src={intuitQuickBooks}
                className="mx-auto mt-[66px]"
              />}
              <div className="my-5 pt-[30px]">
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
                  className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.email ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b bg-transparent focus:outline-none pe-5 ${
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
            </div>
            <div className="flex justify-between px-[20px] mt-auto">                
                        <button
                        type="submit"
                          disabled={loading}
                          className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow ${
                            loading ? "opacity-70" : "opacity-100"
                          } bg-[#222222] shadow`}>
                            {loading ? "Please wait..." : "Link"}
                          
                        </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AccountingSoftware;
