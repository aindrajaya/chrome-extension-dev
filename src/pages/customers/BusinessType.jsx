import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegistration } from "../../context/RegsitrationContext";

const BusinessType = () => {
  const navigate = useNavigate();
  const { setRegistration } = useRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleBusinessTypeSelection = (type) => {
    // Set businessType in registration context based on selection
    let businessType = "business"; // Default to business
    
    switch (type) {
      case "business":
      case "business-user":
        businessType = "business";
        break;
      case "accountant":
      case "accountant-user":
        businessType = "accountant";
        break;
      default:
        businessType = "business";
    }
    
    // Update registration context with businessType
    setRegistration((prev) => ({
      ...prev,
      businessType: businessType,
      userType: type
    }));
    
    // Navigate to company number with type parameter
    navigate(`/company-number?type=${type}`);
  };

  const onSubmit = (data) => {};

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            Select your login type
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="flex flex-col mt-[55px] h-full  pt-[40px] pb-[24px] bg-white rounded-[10px]">
            <div
              onClick={() => handleBusinessTypeSelection("business")}
              className="px-5 cursor-pointer h-[55px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              I’m a Business that makes transfers
              </p>
            </div>
            <div
              onClick={() => handleBusinessTypeSelection("business-user")}
              className="px-5 cursor-pointer h-[55px] mt-[20px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              I work for a Business
              </p>
            </div>
            <div
              onClick={() => handleBusinessTypeSelection("accountant-user")}
              className="px-5 cursor-pointer h-[55px] mt-[20px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              I’m an Accountant
              </p>
            </div>
            <div
              onClick={() => handleBusinessTypeSelection("accountant")}
              className="px-5 cursor-pointer h-[55px] mt-[20px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              I’m an Accountant and make transfers
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessType;
