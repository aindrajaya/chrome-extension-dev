import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import qrCodeImg from "../../assets/qrcode.png";
import OtpInput from "react-otp-input";
import authLogo from "../../assets/google-authenticator-logo.png";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";

const VerifyAuthenticator = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const email = searchParams.get("email");
  const phoneNo = searchParams.get("phoneNo");
  const userId = searchParams.get("userId");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("enter"); // "enter" or "scan"

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp]);

  const handleVerify = async (otpCode) => {
    // Development/Test OTP - updated to 5 digits per OpenAPI spec
    if (otpCode === "12345") {
      toast.success("Authenticator verified successfully!");
      navigate(`/verify-phone?email=${email}&phoneNo=${phoneNo}`);
      return;
    }

    setLoading(true);
    try {
      // Here you would integrate with your authenticator verification API
      // For now, showing success for any 5-digit code
      toast.success("Authenticator verified successfully!");
      navigate(`/verify-phone?email=${email}&phoneNo=${phoneNo}`);
    } catch (error) {
      console.error("Authenticator verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (otp.length === 6) {
      handleVerify(otp);
    } else {
      toast.error("Please enter the 6-digit code");
    }
  };

  return (
    <>
      {loading && <Spineer />}
      <div className="h-[600px] flex flex-col">
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
                Add Authenticator
              </h5>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="flex flex-col space-y-6">
              {/* Enter Code Section */}
              <div className="flex flex-col bg-white py-[20px]">
                <div className="mx-[20px] mb-[20px]">
                  <p className="text-black">Enter Code</p>
                </div>
                <div className="mb-5">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    className="otp-input-container justify-between"
                    inputType="tel"
                    // renderSeparator={<span>-</span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        // onChange={(e)=>{
                        //   const value = e.target.value;
                        //   if (value === "1" || value === "2" || value === "3") {
                        //     setOtp((prevOtp) => prevOtp + value);
                        //     console.log(typeof +value, value);
                        //   }
                        // }}
                        style={{
                          width: "45px",
                          color: "#212058",
                          height: "45px",
                          margin: "0 3px",
                          textAlign: "center",
                          fontSize: "20px",
                          border: "1px solid #CED3EC",
                          borderRadius: "10px",
                          outline: "none",
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

              {/* Google Authenticator Section */}
              <div className="bg-white py-[20px] px-[20px] text-center">
                <div className="mb-4">
                  {/* Google Authenticator Icon */}
                  <div className="w-24 h-24 mx-auto mb-2 rounded-lg flex items-center justify-center">
                    <img src={authLogo} alt="Google Auth Logo"/>
                  </div>
                </div>
                
                {/* Tab Options */}
                <div className="bg-white py-[20px] px-[20px] text-center">
                  <h6 className="text-[16px] font-medium text-[#212058] mb-4">
                    Scan this QR code
                  </h6>
                  <div className="w-48 h-48 mx-auto lex items-center justify-center mb-4">
                    {/* Placeholder for QR Code - you'll need to generate actual QR code */}
                    <div className="text-[#666F96] text-center">
                      <img src={qrCodeImg} alt="QR Code" />
                      <p className="text-sm">QR Code</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#666F96]">
                    Open Google Authenticator and scan this QR code
                  </p>
                </div>
                <div className="space-y-3">
                  
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Fixed Bottom Button */}
        <div className="flex-shrink-0 p-4">
          <button
            onClick={() => onSubmit()}
            disabled={loading || otp.length !== 6}
            className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow transition-opacity ${
              loading || otp.length !== 6 ? "opacity-50" : "opacity-100"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyAuthenticator;
