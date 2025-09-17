import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SuccessImg from "../../assets/img-success.png";
import authService from "../../services/authService";

const Success = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const newRoute = queryParams.get("newRoute");
  const navigate = useNavigate();

  const [payeeData, setPayeeData] = useState(null);
  const [accountRegistrationData, setAccountRegistrationData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch the specific payee by ID from localStorage
  const fetchPayeeData = useCallback(() => {
    const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
    const payee = savedPayees.find((payee) => payee?.id === parseInt(id));
    if (payee) {
      setPayeeData(payee);
    }
  }, [id]);

  // Load account registration data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("accountRegistrationData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAccountRegistrationData(parsedData);
        console.log("📥 Account registration data loaded in Success page:", parsedData);
      } catch (error) {
        console.error("❌ Error parsing account registration data:", error);
      }
    }
  }, []);

  // Call fetchPayeeData when `id` changes
  useEffect(() => {
    if (id) {
      fetchPayeeData();
    }
  }, [id, fetchPayeeData]);

  const onSubmit = (data) => {
    console.log(data);
    // Your form submission logic here
  };

  const changeRoute = () => {
    navigate("/sign-in");
  };

  // Handle Upload ID Documents button click with API call
  const handleUploadDocuments = async () => {
    if (!accountRegistrationData) {
      toast.error("Registration data not found. Please complete the registration process again.");
      return;
    }

    setIsUploading(true);

    try {
      console.log("📤 Starting EqualsMoney account registration process...");
      console.log("📊 Account registration data:", accountRegistrationData);

      // Register with EqualsMoney using /auth/register/account endpoint
      const response = await authService.onboardEqualsMoneyAccount(accountRegistrationData);
      
      console.log("📥 EqualsMoney registration response:", response);
      
      if (response?.success === true) {
        toast.success("Registration completed successfully!");
        // Clear the stored registration data after successful API call
        localStorage.removeItem("accountRegistrationData");
        // Navigate to processing page
        navigate("/processing");
      } else {
        toast.error(response?.message || "EqualsMoney registration failed. Please try again.");
      }
      
    } catch (error) {
      console.error("❌ Registration process error:", error);
      
      // Handle different types of errors
      if (error.message) {
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please check your details and try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Define transactions state to hold data and colors

  return (
    <div className="flex flex-col h-full bg-white rounded-[20px] px-[24px] py-[0px] shadow justify-center items-center">
      <div className="flex flex-col items-center justify-center flex-grow w-full mt-[40px]">
        <img
          alt="SuccessImg"
          src={SuccessImg}
          className="mx-auto mb-[32px] mt-[16px] w-[80px] h-[80px]"
          style={{ objectFit: "contain" }}
        />
        <span className="text-center text-xl text-[#212058] font-bold mb-[16px]">
          Account Created!
        </span>
        <p className="text-center text-sm font-normal text-[#666F96] mb-[32px] px-[8px]">
          Your account has been created successfully. Your account will be activated once you upload the ID documents, and they are accepted by the banking partners.
        </p>
        <div className="w-full flex justify-center">
          <button
            onClick={handleUploadDocuments}
            disabled={isUploading}
            className={`px-2 py-1 rounded-[8px] text-[15px] font-medium shadow-none mb-[32px] ${
              isUploading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#F0D433] text-[#222222]'
            }`}
            style={{ boxShadow: "0px 2px 8px 0px #F0D43333" }}
          >
            {isUploading ? "Processing..." : "Upload ID documents"}
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center mb-[32px]">
        <button
          onClick={changeRoute}
          className="text-[16px] font-medium text-white w-full h-[40px] rounded-[14px] bg-[#222222] shadow"
          style={{ maxWidth: "340px" }}
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default Success;
