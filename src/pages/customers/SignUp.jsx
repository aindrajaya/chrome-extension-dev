import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import backArrow from "../../assets";
import backArrow from "../../assets/Vector.png";
import eyeOpen from "../../assets/eye-open.svg";
import eyeClose from "../../assets/eye-close.svg";
import toast, { Toaster } from "react-hot-toast";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";

import { useRegistration } from "../../context/RegsitrationContext";
import axiosInstance from "../../services/axiosConfig";

const phoneUtil = PhoneNumberUtil.getInstance();
// const BASE_URL = process.env.REACT_APP_API_URL;

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SignUp = () => {
  const navigate = useNavigate();
  const buttonType = useRef("");
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();

  const editDate = watch("phoneNo");
  const emailValue = watch("email");
  const isValid = isPhoneValid(editDate);
  const [changeScreen, setChangeScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null, 'available', 'taken', 'invalid'
  const [emailMessage, setEmailMessage] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const company_number = queryParams.get("company_number");
  const company_name = queryParams.get("company_name");
  const address = queryParams.get("address");
  const country = queryParams.get("country");
  const directorsParam = queryParams.get("directors");
  
  // Parse directors data from URL parameter
  const directors = directorsParam ? JSON.parse(decodeURIComponent(directorsParam)) : [];
  
  const { registration, setRegistration } = useRegistration();

  // Determine the correct default country for phone input
  const defaultPhoneCountry = country ? country.toUpperCase() : registration.country?.toUpperCase() || "GB";

  // Function to check email availability
  const checkEmailAvailability = async (email) => {
    if (!email || email.trim() === '') {
      setEmailStatus(null);
      setEmailMessage("");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus('invalid');
      setEmailMessage("Please enter a valid email format");
      return;
    }

    setEmailCheckLoading(true);
    
    try {
      const response = await axiosInstance.get(`/auth/check-email/${encodeURIComponent(email)}`);
      
      if (response.data.success) {
        if (response.data.available) {
          setEmailStatus('available');
          setEmailMessage(response.data.message);
          // Show success toast for available email
          toast.success(response.data.message || "Email is available!", {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#F0FDF4',
              color: '#166534',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            icon: '✅',
          });
          // Clear any existing email errors
          clearErrors("email");
        } else {
          setEmailStatus('taken');
          setEmailMessage(response.data.message);
          // Show toast notification for taken email
          toast.error(response.data.message || "This email is already registered. Please use a different email or sign in.", {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            icon: '⚠️',
          });
          // Set form error for email field
          setError("email", {
            type: "manual",
            message: response.data.message
          });
        }
      } else {
        setEmailStatus('invalid');
        setEmailMessage(response.data.message);
        setError("email", {
          type: "manual", 
          message: response.data.message
        });
      }
    } catch (error) {
      console.error("Email check error:", error);
      setEmailStatus('invalid');
      setEmailMessage("Unable to check email availability. Please try again.");
      setError("email", {
        type: "manual",
        message: "Unable to check email availability"
      });
    } finally {
      setEmailCheckLoading(false);
    }
  };

  // Debounced email checking
  useEffect(() => {
    if (!emailValue) {
      setEmailStatus(null);
      setEmailMessage("");
      return;
    }

    const timeoutId = setTimeout(() => {
      checkEmailAvailability(emailValue);
    }, 500); // 500ms delay after user stops typing

    return () => clearTimeout(timeoutId);
  }, [emailValue]);

  const onSubmit = async (data) => {
    console.log("🚀 Form submission started");
    console.log("📧 Email status:", emailStatus);
    console.log("📝 Form data:", data);
    
    // Check if email is available before proceeding
    if (emailStatus === 'taken' || emailStatus === 'invalid') {
      toast.error("Please fix the email issues before proceeding");
      return;
    }
    
    // Allow submission if email validation is still loading or completed successfully
    if (emailStatus !== 'available' && emailStatus !== null && emailCheckLoading) {
      toast.error("Please wait for email validation to complete");
      return;
    }

    // Determine user type and registration method based on type parameter
    let user_type = "";
    let registrationMethod = "company"; // Default to company registration
    
    switch (type) {
      case "business":
        user_type = "customer";
        registrationMethod = "company";
        break;
      case "business-user":
        user_type = "customer_user";
        registrationMethod = "team-member"; // This would be team member registration
        break;
      case "accountant-user":
        user_type = "partner_user";
        registrationMethod = "team-member";
        break;
      case "accountant":
        user_type = "partner";
        registrationMethod = "company";
        break;
      default:
        user_type = "customer";
        registrationMethod = "company";
    }
    
    setChangeScreen(false);
    setLoading(true);

    try {
      console.log("📝 Storing registration data locally:", {
        registrationMethod,
        userData: {
          name: `${data.f_name || ''} ${data.l_name || ''}`.trim(),
          email: data.email,
          phoneNo: data.phoneNo,
          f_name: data.f_name,
          l_name: data.l_name
        },
        companyData: {
          company_number,
          company_name,
          address,
          directors: directors?.length || 0,
          country,
          businessType: registration.businessType
        }
      });

      // Store all registration data in context for the Currency page to use
      setRegistration((prev) => ({
        ...prev,
        // User data
        name: `${data.f_name || ''} ${data.l_name || ''}`.trim(),
        f_name: data.f_name,
        l_name: data.l_name,
        email: data.email,
        phoneNo: data.phoneNo,
        password: data.password,
        adminName: `${data.f_name || ''} ${data.l_name || ''}`.trim(),
        adminPhone: data.phoneNo,
        adminEmail: data.email,
        
        // Company data from URL params
        companyNumber: company_number,
        companyName: company_name,
        address: address,
        directors: directors || [],
        country: country,
        
        // Registration metadata
        userType: user_type,
        registrationMethod: registrationMethod,
        businessType: registration.businessType || "business",
        
        // Store raw form data for backend registration
        formData: {
          ...data,
          company_number,
          company_name,
          address,
          directors,
          country,
          user_type,
          businessType: registration.businessType || "business"
        }
      }));
      
      console.log("✅ Registration data stored locally. Proceeding to verification.");
      toast.success("Registration data saved. Proceeding to next step...");
      
      // Navigate to verification choice page
      navigate(`/verify-choose?email=${encodeURIComponent(data.email)}&phoneNo=${encodeURIComponent(data.phoneNo)}`);
      
    } catch (error) {
      console.error("❌ Error storing registration data:", error);
      toast.error("Failed to save registration data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword5, setShowPassword5] = useState(false);

  const togglePasswordVisibility5 = () => {
    setShowPassword5((prevState) => !prevState);
  };

  const [showPassword6, setShowPassword6] = useState(false);

  const togglePasswordVisibility6 = () => {
    setShowPassword6((prevState) => !prevState);
  };

  // const [showPassword, setShowPassword] = useState(true);

  // const togglePasswordVisibility = () => {
  //   setShowPassword((prevState) => !prevState);
  // };

  // const [showPassword2, setShowPassword2] = useState(true);

  // const togglePasswordVisibility2 = () => {
  //   setShowPassword2((prevState) => !prevState);
  // };

  // const [showPassword3, setShowPassword3] = useState(true);

  // const togglePasswordVisibility3 = () => {
  //   setShowPassword3((prevState) => !prevState);
  // };

  // const [showPassword4, setShowPassword4] = useState(true);

  // const togglePasswordVisibility4 = () => {
  //   setShowPassword4((prevState) => !prevState);
  // };

  console.log(isValid, "number check");

  return (
    <>
      {!changeScreen ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <Toaster />
          <div className="flex flex-col h-full">
            <div className="flex items-center pb-2">
              <Link to={-1}>
                <div className="">
                  <img alt="backArrow" src={backArrow} />
                </div>
              </Link>
              <div className="flex-grow">
                <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
                  {/* {type === "business" ? "Sign up" : ""} */}
                  Sign up
                </h5>
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className=" bg-white py-[5px]">
                {/* {type === "accountant" && (
                  <p className="text-[#212058] text-[40px] font-medium text-center ">
                    Sign up!
                  </p>
                )} */}
                <div className="mx-[25px] my-[20px]">
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email format"
                          }
                        })}
                        className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                          errors.email || emailStatus === 'taken' || emailStatus === 'invalid'
                            ? "border-red-500"
                            : emailStatus === 'available'
                            ? "border-green-500"
                            : "focus:border-blue-500"
                        }`}
                        placeholder="Enter your email"
                      />
                      {emailCheckLoading && (
                        <div className="absolute right-0 top-[50%] transform -translate-y-[50%]">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Email status message */}
                    {emailMessage && (
                      <div className={`mt-1 text-xs ${
                        emailStatus === 'available' 
                          ? 'text-green-600' 
                          : 'text-red-500'
                      }`}>
                        {emailMessage}
                      </div>
                    )}
                    
                    {/* Form validation error */}
                    {errors.email && !emailMessage && (
                      <div className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="f_name"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="f_name"
                      {...register("f_name", { 
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters"
                        }
                      })}
                      className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                        errors.f_name ? "border-red-500" : "focus:border-blue-500"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.f_name && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.f_name.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="l_name"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="l_name"
                      {...register("l_name", { 
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters"
                        }
                      })}
                      className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                        errors.l_name ? "border-red-500" : "focus:border-blue-500"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.l_name && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.l_name.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="phoneNo"
                    >
                      Mobile
                    </label>
                    {/* <input
                      type="text"
                      id="phoneNo"
                      {...register("phoneNo", { required: true })}
                      className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                        errors.phoneNo
                          ? "border-red-500"
                          : "focus:border-blue-500"
                      }`}
                      placeholder="Enter your mobile"
                    /> */}
                    <div
                      className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                        errors.phoneNo
                          ? "border-red-500"
                          : "focus-within:border-blue-500"
                      }`}
                    >
                        <PhoneInput
                        key={`phone-${defaultPhoneCountry}`}
                        {...register("phoneNo", {
                          required: "Phone number is required", // Required field validation
                          validate: (value) =>
                            isPhoneValid(value) || "Invalid phone number", // Custom validation
                        })}
                        defaultCountry="gb" // Hard code to GB
                        value={editDate}
                        placeholder="Enter your mobile"
                        onChange={(e) => {
                          setValue("phoneNo", e);
                          if (isPhoneValid(e)) {
                            console.log("adilllllddd");
                            clearErrors("phoneNo");
                          }
                        }}
                        inputStyle={{
                          marginBottom: "0", // Matches `mb-0`
                          fontSize: "14px", // Matches `text-[14px]`
                          borderRadius: "0px",
                          color: "#212058", // Matches `text-[#212058]`
                          width: "100%", // Takes up full width
                          border: "none", // Removes additional borders
                          outline: "none", // Removes focus outline
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword5 ? "text" : "password"}
                        id="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                          errors.password
                            ? "border-red-500"
                            : "focus:border-blue-500"
                        }`}
                        placeholder="Enter your password"
                      />
                      <span
                        onClick={togglePasswordVisibility5}
                        className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                      >
                        <img
                          alt={
                            showPassword5 ? "Hide password" : "Show password"
                          }
                          src={!showPassword5 ? eyeClose : eyeOpen}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="mb-[20px]">
                    <label
                      className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                      htmlFor="password_confirmation"
                    >
                      Confirm Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword6 ? "text" : "password"}
                        id="password_confirmation"
                        {...register("password_confirmation", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === getValues("password") ||
                            "Passwords do not match",
                        })}
                        className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                          errors.password_confirmation
                            ? "border-red-500"
                            : "focus:border-blue-500"
                        }`}
                        placeholder="Confirm your password"
                      />
                      <span
                        onClick={togglePasswordVisibility6}
                        className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                      >
                        <img
                          alt={
                            showPassword6 ? "Hide password" : "Show password"
                          }
                          src={!showPassword6 ? eyeClose : eyeOpen}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full flex flex-col ">
                <div className="flex justify-between px-[20px] mt-auto">
                  <button
                    type="submit"
                    className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow 
                      ${loading ? "opacity-70" : "opacity-100"}
                      `}
                    disabled={loading ? true : false}
                  >
                    {loading ? "Please wait..." : "Next"}
                  </button>
                </div>
                {/* {type === "accountant" && (
                  <div className="mx-auto mt-[10px]">
                    <span className="text-[#666F96] text-[14px]">
                      Already have an account?{" "}
                      <span
                        className="text-[#222222] cursor-pointer text-[16px] font-medium"
                        onClick={() => {
                          navigate("/sign-in");
                        }}
                      >
                        Sign in.
                      </span>
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <>
          {/* <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col h-full">
              <div className="flex items-center pb-2">
                <Link to="/sign-up">
                  <div
                    className=""
                    onClick={() => {
                      setChangeScreen(false);
                      buttonType.current = "";
                    }}
                  >
                    <img alt="backArrow" src={backArrow} />
                  </div>
                </Link>
                <div className="flex-grow">
                  <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
                    Your business details
                  </h5>
                </div>
              </div>
              <div className="    h-full flex flex-col">
                <div className="h-full flex flex-col bg-white rounded-[14px] py-[25px] shadow">
                  <div className="mx-[25px] mb-[20px]">
                    <p className="text-[#666F96]">
                      Did your accountant give you a code?
                    </p>
                  </div>
                  <div className="mx-[25px]">
                    <div className="mb-5">
                      <label
                        className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                        htmlFor="extension_user_pin"
                      >
                        Key
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="extension_user_pin"
                          {...register("extension_user_pin", {
                            required: false,
                          })}
                          className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                            errors.extension_user_pin
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
                            alt={
                              showPassword ? "Hide password" : "Show password"
                            }
                            src={!showPassword ? eyeClose : eyeOpen}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <label
                        className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                        htmlFor="business_name"
                      >
                        Business Name
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showPassword2 ? "text" : "password"}
                          id="business_name"
                          {...register("business_name", { required: true })}
                          className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                            errors.business_name
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
                            alt={
                              showPassword2 ? "Hide password" : "Show password"
                            }
                            src={!showPassword2 ? eyeClose : eyeOpen}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <label
                        className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                        htmlFor="business_id"
                      >
                        BUSINESS ID
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showPassword3 ? "text" : "password"}
                          id="business_id"
                          {...register("business_id", { required: true })}
                          className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                            errors.business_id
                              ? "border-red-500"
                              : "focus:border-blue-500"
                          }`}
                          placeholder="Company number or similar"
                        />
                        <span
                          onClick={togglePasswordVisibility3}
                          className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                        >
                          <img
                            alt={
                              showPassword3 ? "Hide password" : "Show password"
                            }
                            src={!showPassword3 ? eyeClose : eyeOpen}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <label
                        className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase"
                        htmlFor="business_address"
                      >
                        COMPANY ADDRESS
                      </label>
                      <div className="relative w-full">
                        <input
                          type={showPassword4 ? "text" : "password"}
                          id="business_address"
                          {...register("business_address", { required: true })}
                          className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
                            errors.business_address
                              ? "border-red-500"
                              : "focus:border-blue-500"
                          }`}
                          placeholder="Enter your company address"
                        />
                        <span
                          onClick={togglePasswordVisibility4}
                          className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
                        >
                          <img
                            alt={
                              showPassword4 ? "Hide password" : "Show password"
                            }
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
                    className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow  ${
                      loading ? "opacity-70" : "opacity-100"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </div>
          </form> */}
        </>
      )}
    </>
  );
};

export default SignUp;
