import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import backArrow from "../../assets/Vector.png";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";
import authService from "../../services/authService";

const VerifyChoose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const phoneNo = queryParams.get("phoneNo");
  const [loading, setLoading] = useState(false);

  const handleGoogleAuthenticator = () => {
    // Navigate to Google Authenticator setup page
    navigate(`/verify-authenticator?email=${encodeURIComponent(email)}&phoneNo=${encodeURIComponent(phoneNo)}`);
  };

  const handleEmailOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please complete registration.");
      return;
    }

    setLoading(true);
    try {
      // Call backend to initiate email OTP sending using the new auth service
      const response = await authService.sendEmailOtpBeforeRegistration(email);

      if (response?.success === true) {
        // Navigate to Email OTP verification page
        navigate(`/verify-email?email=${encodeURIComponent(email)}&phoneNo=${encodeURIComponent(phoneNo)}`);
      } else {
        toast.error(response?.message || "Failed to send email OTP.");
      }
      
    } catch (error) {
      console.error("❌ Send email OTP process error:", error);

      // Handle different types of errors
      if (error.message) {
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Send email OTP failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spineer />}
      <div className="h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center pb-2">
            <Link to={-1}>
              <div className="">
                <img alt="backArrow" src={backArrow} />
              </div>
            </Link>
            <div className="flex-grow">
              <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058]">
                Choose
              </h5>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col space-y-4 pb-4">
            {/* Google Authenticator Option */}
            <button
              onClick={handleGoogleAuthenticator}
              className="w-full bg-white py-[20px] px-[25px] hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <p className="text-[16px] font-medium text-[#212058]">
                  Google Authenticator
                </p>
              </div>
            </button>

            {/* Email OTP Option */}
            <button
              onClick={handleEmailOTP}
              className="w-full bg-white py-[20px] px-[25px] hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <p className="text-[16px] font-medium text-[#212058]">
                  Email OTP
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyChoose;