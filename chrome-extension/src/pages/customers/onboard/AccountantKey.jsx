import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "../../../components/Spineer";

const AccountantKey = () => {
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

  // Fetch the specific payee by ID from localStorage
  // const fetchPayeeData = async() => {
  //   setLoading2(true);
  //   try {
  //     const response = await axiosInstance.post(`get-transaction`, {
  //       transaction_id: id,
  //     });
  //     if (response?.data?.success === true) {
  //       toast.success(response?.data?.message);
  //       // navigate(`/enter-amount?id=${response?.data?.transaction_id}`);
  //       // if(response?.accountant_user?.user_type === "partner"){}
  //       // localStorage.setItem(
  //       //   "partnerData",
  //       //   JSON.stringify(response?.data?.partner || {})
  //       // );
  //       // navigate(`/verify-email?type=login&email=${response?.data?.data}`);
  //       // if (response?.data?.is_verified) {
  //       //   navigate("/pass-code");
  //       // } else {
  //       //   navigate(
  //       //     `/verify-phone?phoneNo=${response?.data?.data?.phoneNo}&email=${response?.data?.data?.email}`
  //       //   );
  //       // }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading2(false);
  //   }
  //   // let payee = null;
  //   // if (get1 === "payeesData1") {
  //   //   const savedPayees = JSON.parse(localStorage.getItem("payeesData1")) || [];
  //   //   payee = savedPayees.find((payee) => payee?.id === parseInt(id));
  //   // } else if (get1 === "payeesData2") {
  //   //   const savedPayees = JSON.parse(localStorage.getItem("payeesData2")) || [];
  //   //   payee = savedPayees.find((payee) => payee?.id === parseInt(id));
  //   // } else if (id && !get1) {
  //   //   const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
  //   //   payee = savedPayees.find((payee) => payee?.id === parseInt(id));
  //   // }
  //   // if (payee) {
  //   //   setPayeeData(payee);
  //   //   reset({
  //   //     ...payee,
  //   //     sendAmount: "",
  //   //     reference: "",
  //   //   }); // Only reset form if the payee data is found
  //   // }
  // };

  const fetchPayeeData = useCallback(async () => {
    setLoading2(true); // Set loading true when the API call starts
    try {
      let endpoint;
      let payload;
      if (newRoute) {
        // If 'newRoute' is true, set the endpoint and payload for that route
        endpoint = "accountant-users/payee"; // Example endpoint for newRoute
        payload = {
          payee_id: id,
        };
      } else {
        endpoint = "get-transaction"; // Example endpoint for newRoute
        payload = {
          transaction_id: id,
        };
      }
      const response = await axiosInstance.post(endpoint, payload);
      if (response?.data?.success === true) {
        // console.log(response?.data?.data,"looopp")
        setPayeeData(response?.data?.data);
        if (deposit) {
          setValue("sendAmount", response?.data?.data?.sending_amount || "");
        }
        // toast.success(response?.data?.message);
        // Your other logic can go here
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false); // Set loading false when the API call finishes
    }
  }, [id]); // This ensures the function is memoized based on `id`

  useEffect(() => {
    if (id) {
      fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
    }
  }, [id, fetchPayeeData]); // The effect will run whenever `id` changes

  const [loading, setLoading] = useState(false);
  const key = watch("key");
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};

  // Handle form submission
  const onSubmit = async (data) => {
    // console.log(data,"addadaddada")
    // let route
    setLoading(true);
    try {
      let endpoint;
      let payload;
      if (newRoute) {
        // If 'newRoute' is true, set the endpoint and payload for that route
        // endpoint = "transaction"; // Example endpoint for newRoute
        // payload = {
        //   sending_amount: data?.sendAmount,
        //   recieving_amount: data?.receivedAmount,
        //   transaction_id: id,
        // };
        endpoint = "repeat-transaction"; // Example endpoint for other route
        payload = {
          sending_amount: data?.sendAmount,
          recieving_amount: data?.receivedAmount,
          payee_id: id,
        };
      } else if (deposit) {
        endpoint = "transaction"; // Example endpoint for newRoute
        payload = {
          sending_amount: data?.sendAmount,
          recieving_amount: data?.receivedAmount,
          transaction_id: id,
        };
      } else {
        // If 'newRoute' is false, set the endpoint and payload for a different route
        endpoint = "repeat-transaction"; // Example endpoint for other route
        payload = {
          sending_amount: data?.sendAmount,
          recieving_amount: data?.receivedAmount,
          payee_id: pID,
        };
      }
      const response = await axiosInstance.post(endpoint, payload);
      // const response = await axiosInstance.post(`transaction`, {
      //   sending_amount: data?.sendAmount,
      //   recieving_amount: data?.receivedAmount,
      //   transaction_id: id,
      // });
      if (response?.data?.success === true) {
        // toast.success(response?.data?.message);
        if (newRoute) {
          // Navigate to the route for the newRoute condition
          navigate(
            `/deposit?id=${response?.data?.transaction_id}&newRoute=pay`
          );
        } else {
          navigate(`/deposit?id=${response?.data?.transaction_id}`);
          // Navigate to a default route
        }
        // navigate(`/deposit?id=${response?.data?.transaction_id}`);

        // navigate(`/enter-amount?id=${response?.data?.transaction_id}`);
        // if(response?.accountant_user?.user_type === "partner"){}
        // localStorage.setItem(
        //   "partnerData",
        //   JSON.stringify(response?.data?.partner || {})
        // );
        // navigate(`/verify-email?type=login&email=${response?.data?.data}`);
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

  // Watch the sendAmount field for updates
  useEffect(() => {
    if (key?.length === 4) {
      callApi(key);
    }
  }, [key]);

  const callApi = async (data) => {
    setLoading(true);
    const body = { 
      user_id:accountantUser?.id,
      key:data };
    try {
      const response = await axiosInstance.post(
        `/extension-users/save-key`,
        body
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate("/add-bank")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (

    <div className="flex flex-col h-full">
      {loading && <Spineer />}
      <div className="flex items-center pb-2">
        <Link to={-1}>
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
          Accountant Key
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex flex-col h-full">
            <div className="flex flex-col bg-white rounded-[14px] py-[5px] shadow ">
              <div className="mx-[25px]">
              <h1 className="text-[16px] mt-[7px] font-normal text-center text-[#666F96]">
              Do you have an Accountant’s Key?
            </h1>
                <div className="mb-[70px] text-center mt-[35px]">
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
                      required: "Company number is required",
                      pattern: {
                        value: /^[0-9]{4}$/, // Validation: Exactly 8 digits
                        message: "Company number must be exactly 4 digits",
                      },
                    })}
                    className={`pb-[10px] mb-0 text-center text-[20px] font-medium text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[20px] ${
                      errors.company_number
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Enter 4 Digit"
                  />
                </div>
              </div>
            </div>
            <div className=" text-center mt-[10px]">
            </div>
            <div className="flex justify-between px-[20px] mt-[auto]">
                <Link className="w-full" to="/add-bank">
              <button
                type="submit"
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow 
                  
                  `}
                // disabled={companyDetails?.company_number ? false : true}
              >
                {/* {loading ? "Please wait..." : "Select"} */}
                No I don’t
              </button>
                </Link>
            </div>
          </div>
      </form>
    </div>
  );
};

export default AccountantKey;
