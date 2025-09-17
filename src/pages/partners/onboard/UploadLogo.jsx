import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";

const UploadLogo = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};

  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("user_id", accountantUser?.id);
    formData.append("logo", data?.logo[0]);

    setLoading(true);
    try {
      const response = await axiosInstance.post(`extension-users/upload-logo`, formData);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // navigate(`/add-bank`);
        navigate(`/link-accounting-software`);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Failed to upload logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const watchedFile = watch("logo");


  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center pb-2">
        <Link to={-1}>
          <div>
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058]">
            Upload logo
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        <div className="flex flex-col h-full">
          <div className="text-center bg-white rounded-[14px] shadow px-[20px] py-[14px]">
            <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[10px]">
              Did you want to upload your logo now?
            </p>
            <p className="text-[16px] font-normal text-[#666F96] mb-[10px]">
              You can do it later
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            id="logoUpload"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("logo", { required: !watchedFile?.[0] })}
          />

          {/* Clickable Select Image Button */}
          <label
            htmlFor="logoUpload"
            className="mx-auto w-[208px] rounded-[8px] h-[34px] mt-[25px] cursor-pointer bg-[#F0D433] flex justify-center items-center"
          >
            <p className="mb-0 text-[14px] font-medium text-[#222222]">
              Select image
            </p>
          </label>

          {/* Error Message */}
          {errors.logo && !watchedFile?.[0] &&  (
            <p className="text-red-500 text-center text-sm mt-2">
              {/* {errors.logo.message} */}
              Logo is requried.
            </p>
          )}

          {/* Image Preview */}
          {watchedFile && watchedFile[0] &&(
            <div className="mt-4 flex justify-center">
              <img 
                  src={URL.createObjectURL(watchedFile[0])}
              // src={preview} 
              alt="Preview" className="w-32 h-32 rounded-lg shadow" />
            </div>
          )}
          {/* {preview && ( */}

          <div className="flex justify-between mt-auto">
            <Link to="/link-accounting-software">
              <button className="text-[16px] font-medium text-white w-[164px] h-[50px] rounded-[14px] bg-[#222222] shadow">
                Do it Later
              </button>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className={`text-[16px] font-medium text-white w-[164px] h-[50px] rounded-[14px] bg-[#222222] shadow ${
                loading ? "opacity-70" : "opacity-100"
              }`}
            >
              {loading ? "Please wait..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadLogo;
