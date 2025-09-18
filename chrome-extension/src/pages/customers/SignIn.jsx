import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import eyeOpen from "../../assets/eye-open.svg";
import eyeClose from "../../assets/eye-close.svg";
import sendaLogo from "../../assets/senda-logo.png";
import axiosInstance from "../../services/axiosConfig";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const SignIn = () => {
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

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("🔄 Starting login process with:", { email: data.email });
    
    try {
      // Use the new auth service for login (aligned with OpenAPI spec)
      const response = await authService.login(data.email, data.password, "user");
      
      console.log("📥 Login response:", response);
      
      if (response?.success) {
        toast.success("Login successful");
        
        // Store user data
        const user = response.user;
        localStorage.setItem("accountantUser", JSON.stringify(user));
        
        // Clear the lastVisitedRoute to prevent RouteManager from redirecting back
        localStorage.removeItem("lastVisitedRoute");
        console.log("🧹 Cleared lastVisitedRoute from localStorage");
        
        console.log("👤 User stored:", user);
        
        // Check if user needs verification based on email/phone verification status
        console.log("🔍 Getting user profile...");
        try {
          const userProfile = await authService.getUserProfile();
          
          console.log("📋 User profile:", userProfile);
          
          if (!userProfile.emailVerified) {
            // Navigate to email verification
            console.log("📧 Navigating to email verification");
            navigate(`/verify-email?type=login&email=${user.email}&userId=${user.id}`);
          } else if (!userProfile.phoneVerified) {
            // Navigate to phone verification
            console.log("📱 Navigating to phone verification");
            navigate(`/verify-phone?type=login&userId=${user.id}`);
          } else {
            // User is fully verified, navigate to main app
            console.log("✅ User fully verified, navigating to homepage");
            navigate("/homepage");
          }
        } catch (profileError) {
          // If we can't get profile, but login was successful, still go to homepage
          console.log("⚠️ Could not fetch user profile, navigating to homepage anyway");
          console.error("Profile fetch error:", profileError);
          navigate("/homepage");
        }
      } else {
        // Handle different failure scenarios
        if (response?.isActive === false) {
          console.log("⏳ Account not active, navigating to processing page");
          toast.error(response.message || "Account is not active yet. Please wait for account activation.");
          navigate("/processing");
        } else if (response?.requiresEqualsMoneySetup) {
          console.log("💰 EqualsMoneyAccount setup required");
          toast.error(response.message || "Account setup incomplete.");
          // You might want to navigate to an EqualsMoneyAccount setup page
          // navigate("/setup-equalsmoney");
          navigate("/processing"); // For now, redirect to processing
        } else {
          console.log("❌ Login failed - other reason:", response);
          toast.error(response.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error details:", error.response?.data);
      
      // Handle network errors and other exceptions
      if (error.response?.status === 401) {
        // This might be handled by authService now, but keep as fallback
        toast.error("Invalid credentials. Please check your email and password.");
      } else if (!error.response) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 
    
    */}

      <div className="px-5 flex flex-col h-full items-center justify-center">
        <div className="absolute top-0 left-0 p-4">
          <Link to="/" className="p-2">
            <img alt="backArrow" src={backArrow} />
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8 mt-16">
          <img alt="Senda Logo" src={sendaLogo} className="w-24 h-auto mb-4" />
          <p className="text-[#212058] text-[40px] font-medium text-center">
            Welcome back
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <div className="bg-white py-[25px] px-[25px]">
            <div className="mb-5">
              <label
                className="mb-2 text-[10px] font-medium text-[#666F96] block uppercase"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 ${
                  errors.email ? "border-red-500" : "focus:border-blue-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-5">
              <label
                className="mb-2 text-[10px] font-medium text-[#666F96] block uppercase"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", { required: true })}
                  className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 bg-transparent focus:outline-none py-2 pe-10 ${
                    errors.password
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  <img
                    alt={showPassword ? "Hide password" : "Show password"}
                    src={!showPassword ? eyeClose : eyeOpen}
                    className="w-5 h-5"
                  />
                </span>
              </div>
            </div>
            <div className="mb-5 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 text-[#212058] focus:ring-0 rounded border-gray-300"
              />
              <label
                className="text-[14px] font-normal text-[#666F96] ms-2"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
            <div className="flex justify-center mt-[16px]">
              <button
                type="submit"
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] 
                  ${
                    loading ? "opacity-70" : "opacity-100"
                  } bg-[#222222] shadow`}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-[30px] text-center mb-30">
          <Link to="/forget-password">
            <p className="font-medium text-[14px] text-[#212058] cursor-pointer mb-4">
              Forgot password?
            </p>
          </Link>
          <span className="text-[#666F96] text-[14px] font-normal">
            No account?{" "}
            <span
              className="text-[#222222] cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              Register now
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default SignIn;
