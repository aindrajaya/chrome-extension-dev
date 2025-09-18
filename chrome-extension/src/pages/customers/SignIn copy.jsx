import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import eyeOpen from "../../assets/eye-open.svg";
import eyeClose from "../../assets/eye-close.svg";
import axiosInstance from "../../services/axiosConfig";
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
    try {
      const response = await axiosInstance.post(`accountant-users/login`, {
        email: data?.email,
        password: data?.password,
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        // if(response?.accountant_user?.user_type === "partner"){}
        // localStorage.setItem(
        //   "partnerData",
        //   JSON.stringify(response?.data?.partner || {})
        // );
        navigate(`/verify-email?type=login&email=${response?.data?.data}`);
        // if (response?.data?.is_verified) {
        //   navigate("/pass-code");
        // } else {
        //   navigate(
        //     `/verify-phone?phoneNo=${response?.data?.data?.phoneNo}&email=${response?.data?.data?.email}`
        //   );
        // }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 
    
    */}

      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to="/">
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
              &nbsp;
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="h-full flex flex-col bg-white rounded-[14px] py-[25px] shadow">
            <p className="text-[#212058] text-[40px] font-medium text-center my-[40px]">
              Welcome back
            </p>
            <div className="mx-[25px]">
              <div className="mb-5">
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
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="pb-[2px] mb-0 w-[16px] h-[16px] font-normal text-[#212058] focus:outline-none bg-transparent"
                  />
                  <label
                    className="mb-0 text-[14px] font-normal text-[#666F96] ms-2"
                    htmlFor="rememberMe"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <Link to="/forget-password">
                    <p className="font-medium text-[14px] text-[#212058] cursor-pointer">
                      Lost your password?
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-[20px] mt-[16px]">
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
            <div className="mx-auto mt-[30px]">
              <span className="text-[#666F96] text-[14px] font-normal">
                No account?{" "}
                <span
                  className="text-[#222222] cursor-pointer"
                  onClick={() => {
                    navigate("/business-type");
                  }}
                >
                  Register now
                </span>
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
