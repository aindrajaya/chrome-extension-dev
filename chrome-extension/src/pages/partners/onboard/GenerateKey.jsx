import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "../../../components/Spineer";

const GenerateKey = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const pID = queryParams.get("payee_id");
  const newRoute = queryParams.get("newRoute");
  const deposit = queryParams.get("deposit");

  // console.log(pID,newRoute,"poopopopop")
  const navigate = useNavigate();

  // console.log(id,"ddd")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [payeeData, setPayeeData] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};


  const fetchPayeeData = useCallback(async () => {
    setLoading2(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.get("extension-users/generate-key");
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
      setValue("key", response?.data?.data);
        // Your other logic can go here
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false); // Set loading false when the API call finishes
    }
  }, []); // This ensures the function is memoized based on `id`

  useEffect(() => {
    // if (id) {
      fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
    // }
  }, [fetchPayeeData]); // The effect will run whenever `id` changes

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const payload ={
      key: data?.key.toString(),
      user_id: accountantUser?.id,
    }
    try {
      const response = await axiosInstance.post("extension-users/save-partnerKey", payload);
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate("/upload-logo")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const key =watch("key")

  

  return (
    <div className="flex flex-col h-full">
      {loading2 && <Spineer />}
      <div className="flex items-center pb-2">
        <Link to="/accountant-key-partner">
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
          Generate Key
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="bg-white rounded-[14px] px-[20px] py-[14px] shadow">
          <div className="">
            <h1 className="text-[16px] font-normal text-center text-[#666F96]">
            Here’s your key. It will be activated once
            </h1>
            <h1 className="text-[16px] font-normal text-center text-[#666F96]">
            payment is received.
            </h1>
            <div className="text-center mt-[35px]">
                  <label
                    className="mb-[10px] text-[14px] text-center font-normal text-[#666F96] block"
                    htmlFor="key"
                  >
                    Enter Key
                  </label>
                  <input
                    type="tel"
                    id="key"
                    {...register("key", {
                      required: "key is required",
                      pattern: {
                        value: /^[0-9]{4}$/, // Validation: Exactly 8 digits
                        message: "Company number must be exactly 4 digits",
                      },
                    })}
                    className={`pb-[10px] mb-0 text-center text-[20px] font-medium text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[20px] ${
                      errors.key
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Enter 4 Digit"
                  />
                </div>
          </div>
        </div>
        <h1 className="mt-[25px] text-[14px] font-normal text-center mb-[12px] text-[#666F96]">
          Make payment to
        </h1>
        <div className="px-14">
          <div className="text-xl mb-4 font-semibold">
            <h4 className="text-[#212058] text-[20px] font-medium">
              Senda Ventures Ltd
            </h4>
          </div>
          <div className="text-[#212058] text-[16px] font-medium">
            <span>Bank: </span>
            <span>Barclays Twickenham</span>
          </div>
          <div className="text-[#212058] text-[16px] font-medium">
            <span>Sort code: </span>
            <span>563076</span>
          </div>
          <div className="text-[#212058] text-[16px] mb-[10px] font-medium">
            <span>Account: </span>
            <span>2608260876</span>
          </div>
          <div className="text-xl mb-4 font-semibold">
            <h1 className="text-[14px] font-normal text-center mb-[10px] text-[#666F96]">
            Use Key as reference
            </h1>
            <h4 className="text-[#212058] text-center text-[20px] mb-[10px] font-medium">
              {key ? key :"\u00A0"}
            </h4>
            <h4 className="text-[#212058] text-center text-[28px] font-medium">
            £299.00
            </h4>
          </div>
        </div>
        <div className="mx-auto my-auto">
          <button
            type="submit"
            className={`text-[16px] text-white w-[295px] h-[50px] rounded-[14px] bg-[#222222] mx-auto shadow
               ${loading ? "opacity-70" : "opacity-100"} bg-[#222222] shadow`}
          >
            {loading ? "Please wait..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateKey;
