import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import eyeOpen from "../../assets/eye-open.svg";
import eyeClose from "../../assets/eye-close.svg";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const buttonType = useRef("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data,"dadtadtdta");

  };

  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const [showPassword2, setShowPassword2] = useState(true);

  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevState) => !prevState);
  };

  const [showPassword3, setShowPassword3] = useState(true);

  const togglePasswordVisibility3 = () => {
    setShowPassword3((prevState) => !prevState);
  };

  const [showPassword4, setShowPassword4] = useState(true);

  const togglePasswordVisibility4 = () => {
    setShowPassword4((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to="/sign-up">
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
              Your business details
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="h-full flex flex-col bg-white rounded-[14px] py-[25px] shadow">
            <div className="mx-auto mb-[20px]">
              <p className="text-[#666F96]">
                Did your accountant give you a code?
              </p>
            </div>
            <div className="mx-[25px]">
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="payeeName"
                >
                  Key
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="payeeName"
                    {...register("payeeName", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.payeeName
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Leave blank if you don’t have one"
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
                  htmlFor="address"
                >
                  Business Name
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    id="address"
                    {...register("address", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.address
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="ABC Enterprises Ltd"
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
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="iban"
                >
                  BUSINESS ID
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword3 ? "text" : "password"}
                    id="iban"
                    {...register("iban", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.iban ? "border-red-500" : "focus:border-blue-500"
                    }`}
                    placeholder="Company number or similar"
                  />
                  <span
                    onClick={togglePasswordVisibility3}
                    className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                  >
                    <img
                      alt={showPassword3 ? "Hide password" : "Show password"}
                      src={!showPassword3 ? eyeClose : eyeOpen}
                    />
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <label
                  className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                  htmlFor="beneficiaryName"
                >
                  COMPANY ADDRESS
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword4 ? "text" : "password"}
                    id="beneficiaryName"
                    {...register("beneficiaryName", { required: true })}
                    className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                      errors.beneficiaryName
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={togglePasswordVisibility4}
                    className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                  >
                    <img
                      alt={showPassword4 ? "Hide password" : "Show password"}
                      src={!showPassword4 ? eyeClose : eyeOpen}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-[20px] mt-[16px]">
            <button
              type="submit"
              onClick={() => (buttonType.current = "pay")}
              className="text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessDetails;
