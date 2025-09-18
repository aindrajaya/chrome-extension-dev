import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import eyeOpen from "../../../assets/eye-open.svg";
import eyeClose from "../../../assets/eye-close.svg";
import xero from "../../../assets/xero 1.svg";
import sageLogo from "../../../assets/sage-logo 1.svg";
import intuitQuickBooks from "../../../assets/Intuit_QuickBooks_logo 1.svg";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";

const LinkAccountingSoftware = () => {
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
  const accountantUser =
    JSON.parse(localStorage.getItem("accountantUser")) || {};

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `extension-users/link-accounting-software`,
        {
          email: data?.email,
          password: data?.password,
          user_id: accountantUser?.id,
        }
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/transactions`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading2(true);
    try {
      const response = await axiosInstance.post(
        `extension-users/link-accounting-software`,
        {
          skip: "true",
          user_id: accountantUser?.id,
        }
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        accountantUser.user_type === "partner_user"
          ? navigate("/clients")
          : navigate("/transactions");
        // navigate(`/transactions`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false);
    }
  };
  const handleClick = (software) => {
    localStorage.setItem("selectedSoftware", software); // Save in localStorage
    navigate(`/accounting-software`);
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
                Link to your accounting software?
              </h1>
              <div className="mt-[87px] text-center">
                <h4
                  className="text-[#212058] text-[20px] font-medium mb-[20px] cursor-pointer"
                  onClick={() => handleClick("xero")}
                >
                  Xero
                </h4>
                <h4
                  className="text-[#212058] text-[20px] font-medium mb-[20px] cursor-pointer"
                  onClick={() => handleClick("quickbooks")}
                >
                  Quickbooks
                </h4>
                <h4
                  className="text-[#212058] text-[20px] font-medium mb-[20px] cursor-pointer"
                  onClick={() => handleClick("sage")}
                >
                  Sage
                </h4>
              </div>
            </div>
            <div className="flex justify-between px-[20px] mt-auto">
              <button
                onClick={handleSkip}
                type="button"
                disabled={loading2}
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] ${
                  loading2 ? "opacity-70" : "opacity-100"
                }   shadow`}
              >
                Skip
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LinkAccountingSoftware;
