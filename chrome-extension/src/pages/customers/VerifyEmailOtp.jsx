import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
// import backArrow from "../../assets";
import backArrow from "../../assets/Vector.png";
import OtpInput from "react-otp-input";
import DeleteIcon from "../../assets/Delete.png";
import axiosInstance from "../../services/axiosConfig";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";

const VerifyEmailOtp = () => {
  const navigate = useNavigate();
  const dail = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, DeleteIcon];

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const email = searchParams.get("email");
  const userId = searchParams.get("userId"); // Get userId from URL params
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (otp.length === 6) { // OpenAPI spec: 6-digit OTP codes
      handleVerify(otp);
    }
  }, [otp]);

  const handleVerify = async (otpCode) => {
    setVerifying(true);
    setVerificationStatus(null);
    
    // Development/Test OTP - updated to 6 digits per OpenAPI spec
    if (otpCode === "123456") {
      // Simulate loading animation
      setTimeout(() => {
        setVerificationStatus('success');
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          if (type === "login") {
            navigate("/homepage");
          } else if (type === "forget") {
            navigate(`/new-password?email=${email}`);
          } else {
            navigate(`/kyc?email=${email}`);
          }
        }, 1000); // Wait 1 second before navigation to show success animation
      }, 1500);
      return;
    }

    // Check Email OTP before registration completion
    if (type === null) {
      setLoading(true);
      try {
        const response = await authService.verifyEmailBeforeRegistration(otpCode, email);
        if (response?.success) {
          setVerificationStatus('success');
          toast.success(response.message || "Email verified successfully");
          setTimeout(() => {
            navigate(`/kyc?email=${email}`);
          }, 1000);
        } else {
          setVerificationStatus('error');
          toast.error(response?.message || "Email verification failed");
          setTimeout(() => {
            setOtp("");
            setVerificationStatus(null);
          }, 2000);
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus('error');
        if (error.message) {
          toast.error(error.message);
        } else if (error.response?.data?.message) {
          toast.error("Email verification failed. Please try again.");
        }
        setTimeout(() => {
          setOtp("");
          setVerificationStatus(null);
        }, 2000);
      } finally {
        setLoading(false);
        setVerifying(false);
      }

      return;
    }

    setLoading(true);
    try {
      // Get userId from localStorage if not in URL params
      const verifyUserId = userId || localStorage.getItem("pendingUserId");
      
      if (!verifyUserId) {
        setVerificationStatus('error');
        toast.error("User ID not found. Please restart registration.");
        setTimeout(() => {
          setOtp("");
          setVerificationStatus(null);
        }, 2000);
        return;
      }

      // Use the new auth service method aligned with OpenAPI spec
      const response = await authService.verifyEmail(verifyUserId, otpCode, email);
      
      if (response?.success) {
        setVerificationStatus('success');
        toast.success(response.message || "Email verified successfully");
        
        setTimeout(async () => {
          if (type === "login") {
            // After email verification during login, check if phone verification is also needed
            const userProfile = await authService.getUserProfile();
            if (!userProfile.phoneVerified) {
              navigate(`/verify-phone?type=login&userId=${verifyUserId}`);
            } else {
              navigate("/homepage");
            }
          } else if (type === "forget") {
            // Navigate to password reset
            navigate(`/new-password?email=${email}`);
          } else {
            // Continue registration flow - go to KYC
            navigate(`/kyc?email=${email}&userId=${verifyUserId}`);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationStatus('error');
      toast.error("Email verification failed. Please try again.");
      setTimeout(() => {
        setOtp("");
        setVerificationStatus(null);
      }, 2000);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    // Resend OTP before registration completion
    if (type === null) {
      if (!email) {
        toast.error("Email not found. Please complete registration.");
        return;
      }

      setLoading(true);
      try {
        // Call backend to initiate email OTP sending using the new auth service
        const response = await authService.sendEmailOtpBeforeRegistration(email);

        if (response?.success === true) {
          toast.success("Email OTP sent successfully.");
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
      return;
    }

    setLoading(true);
    try {
      // Get userId for resend OTP request
      const verifyUserId = userId || localStorage.getItem("pendingUserId");
      
      if (!verifyUserId) {
        toast.error("User ID not found. Please restart registration.");
        return;
      }

      // Use the new auth service method aligned with OpenAPI spec
      const response = await authService.resendOtp(verifyUserId, "email");
      
      if (response?.success) {
        toast.success(response.message || "OTP sent successfully");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      // Error handling is done by the auth service
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {};

  const handleDial = (value) => {
    // Prevent input during verification
    if (verifying || verificationStatus) return;
    
    if (typeof value === "number" && otp.length < 6) {
      // Append digit to OTP if it's a number and length is within limit
      setOtp((prevOtp) => prevOtp + value.toString());
    } else if (value === DeleteIcon) {
      // Remove last digit if "Delete" button is pressed
      setOtp((prevOtp) => prevOtp.slice(0, -1));
    }
  };

  return (
    <>
      {/* 
    
    */}
      {loading && <Spineer />}

      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to={-1}>
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className={`text-center font-medium text-[16px] mb-2 transition-colors duration-300 ${
              verifying ? 'text-[#666F96]' : 
              verificationStatus === 'success' ? 'text-green-600' : 
              verificationStatus === 'error' ? 'text-red-600' : 
              'text-[#212058]'
            }`}>
              {verifying ? 'Verifying OTP...' : 
               verificationStatus === 'success' ? 'OTP Verified!' : 
               verificationStatus === 'error' ? 'Verification Failed' : 
               'Enter OTP'}
            </h5>
            {verifying && (
              <div className="w-full bg-gray-200 rounded-full h-1 mx-4">
                <div className="bg-[#212058] h-1 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="flex flex-col bg-white py-[20px]">
            <div className="mx-[20px] mb-[20px]">
              <p className="text-black">Enter Code</p>
            </div>
            <div className="ms-[15px] me-[15px] mb-5 relative">
              {/* Verification Status Overlay */}
              {(verifying || verificationStatus) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg z-10">
                  {verifying && (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#212058]"></div>
                      <p className="text-[#212058] text-sm mt-2">Verifying...</p>
                    </div>
                  )}
                  {verificationStatus === 'success' && (
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="bg-green-500 rounded-full p-2 animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-600 text-sm mt-2 font-medium">Success!</p>
                    </div>
                  )}
                  {verificationStatus === 'error' && (
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="bg-red-500 rounded-full p-2 animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-600 text-sm mt-2 font-medium">Invalid OTP</p>
                    </div>
                  )}
                </div>
              )}
              
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6} // Updated to 6 digits per OpenAPI spec
                className="otp-input-container justify-between"
                inputType="tel"
                // renderSeparator={<span>-</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    disabled={verifying || verificationStatus !== null}
                    style={{
                      width: "45px",
                      color: verificationStatus === 'success' ? "#10B981" : verificationStatus === 'error' ? "#EF4444" : "#212058",
                      height: "45px",
                      margin: "0 3px",
                      textAlign: "center",
                      fontSize: "20px",
                      border: `1px solid ${verificationStatus === 'success' ? "#10B981" : verificationStatus === 'error' ? "#EF4444" : "#CED3EC"}`,
                      borderRadius: "10px",
                      outline: "none",
                      backgroundColor: verificationStatus === 'success' ? "#F0FDF4" : verificationStatus === 'error' ? "#FEF2F2" : "white",
                      transition: "all 0.3s ease",
                      opacity: verifying ? 0.6 : 1,
                    }}
                  />
                )}
              />
            </div>
            {/* <div className="mx-[20px]">
              <div className="mx-auto mt-[40px]">
                <span className="text-[#666F96] text-[14px]">
                  Didn’t receive the OTP?
                  <span
                    className="text-[#222222] cursor-pointer"
                    onClick={handleResend}
                  >
                    {" "}
                    Resend.
                  </span>
                </span>
              </div>
            </div> */}
          </div>
          <div className={`relative flex flex-col grow mt-[50px] w-[375px] left-[-20px] bottom-[-20px] bg-[#CCCED3] transition-opacity duration-300 ${verifying || verificationStatus ? 'opacity-50' : 'opacity-100'}`}>
            <div className="grid grid-cols-3 place-items-center px-[8px] mt-[6px] gap-3 pb-[10px] ">
              {dail?.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      boxShadow:
                        index === 11 || index === 9
                          ? "none"
                          : "0px 1px 0px 0px #898A8D",
                    }}
                    onClick={() => !verifying && !verificationStatus && handleDial(item)}
                    className={`${!verifying && !verificationStatus ? 'cursor-pointer' : 'cursor-not-allowed'} flex justify-center items-center rounded-[5px] w-[117px] h-[46px] font-normal ${
                      index === 11 || index === 9
                        ? "bg-transparent"
                        : "bg-white"
                    } text-[#000000] text-[24px] transition-all duration-200 ${verifying || verificationStatus ? 'hover:opacity-60' : 'hover:bg-gray-50'}`}
                  >
                    {index === 11 ? <img alt="" src={item} /> : item}
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default VerifyEmailOtp;