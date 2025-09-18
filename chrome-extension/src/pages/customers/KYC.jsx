import React, { useState, useEffect, useCallback } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";

const KYC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //   const id = queryParams.get("id");
  //   const pID = queryParams.get("payee_id");
  //   const newRoute = queryParams.get("newRoute");
  //   const deposit = queryParams.get("deposit");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

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
  const [loading2, setLoading2] = useState(false); // Keep for potential future use

  const accountantUser =
    JSON.parse(localStorage.getItem("accountantUser")) || {};

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

  //   const fetchPayeeData = useCallback(async () => {
  //     setLoading2(true); // Set loading true when the API call starts
  //     try {
  //       let endpoint;
  //       let payload;
  //       if (newRoute) {
  //         // If 'newRoute' is true, set the endpoint and payload for that route
  //         endpoint = "accountant-users/payee"; // Example endpoint for newRoute
  //         payload = {
  //           payee_id: id,
  //         };
  //       } else {
  //         endpoint = "get-transaction"; // Example endpoint for newRoute
  //         payload = {
  //           transaction_id: id,
  //         };
  //       }
  //       const response = await axiosInstance.post(endpoint, payload);
  //       if (response?.data?.success === true) {
  //         // console.log(response?.data?.data,"looopp")
  //         setPayeeData(response?.data?.data);
  //         if (deposit) {
  //           setValue("sendAmount", response?.data?.data?.sending_amount || "");
  //         }
  //         // toast.success(response?.data?.message);
  //         // Your other logic can go here
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading2(false); // Set loading false when the API call finishes
  //     }
  //   }, [id]); // This ensures the function is memoized based on `id`

  //   useEffect(() => {
  //     if (id) {
  //       fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
  //     }
  //   }, [id, fetchPayeeData]); // The effect will run whenever `id` changes

  const [membershipData, setMembershipData] = useState({
    mainPurpose: [
      "Investment",
      "Trading",
      "Business operations",
      "Salary payments",
      "Vendor payments",
      "International transfers",
      "Property transactions",
      "Payment to suppliers"
    ],
    sourceOfFunds: [
      "salary",
      "business_income",
      "investment_returns", 
      "inheritance",
      "savings",
      "property_sale",
      "other"
    ],
    // Annual volume options - these values are validated by the EqualsMoney API
    annualVolume: [
      "Less than £10,000",
      "£10,000 - £50,000", 
      "£50,000 - £100,000",
      "£100,000 - £500,000",
      "£500,000 - £1,000,000",
      "More than £1,000,000"
    ],
    // Number of payments - these values MUST match the EqualsMoney API specification exactly
    numberOfPayments: [
      "Fewer than 5 payments",
      "5 - 10 payments", 
      "10 - 20 payments",
      "More than 20 payments",
      "250_500k"
    ]
  });

  // Remove the API call and use static data
  // const fetchMembershipData = useCallback(async () => {
  //   setLoading2(true);
  //   try {
  //     const response = await axiosInstance.get(
  //       "/extension-users/em-kyc-dropdown"
  //     );
  //     if (response?.data?.success === true) {
  //       console.log(response, "looopp");
  //       setMembershipData(response?.data?.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading2(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchMembershipData();
  // }, [fetchMembershipData]);

  console.log(membershipData, "membershipData");

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    // const payload = {
    //   user_id:accountantUser?.id,
    //   ...data
    // }
    try {
      //   const response = await axiosInstance.post("/extension-users/set-membership", payload);
      //   if (response?.data?.success === true) {
      // toast.success(response?.data?.message);
      navigate(`/currency?email=${email}`, {
        state: {
          data,
        },
      });
      //   navigate(`/kyc?email=${email}`);
      //   }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Watch the sendAmount field for updates
  //   const membership_id = watch("membership_id");
  //   const fees= membershipData?.filter(item => item?.id == membership_id);
  // const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};

  return (
    <div className="flex flex-col h-full">
      {/* {loading2 && <Spineer />} */}
      <div className="flex items-center pb-2">
        <Link to={-1}>
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            KYC
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="bg-white rounded-[14px] px-[20px] py-[14px] shadow">
          <div className="">
            <div className="mb-[40px]">
              <label
                className="mb-[10px] text-[16px] font-medium text-center text-[#000000] mt-[15px] block"
                htmlFor="sourceOfFunds"
              >
                What are the source of funds?
              </label>
              <div
                className={`flex items-center border-b ${
                  errors.sourceOfFunds
                    ? "focus-within:border-red-500"
                    : "focus-within:border-blue-500"
                } `}
              >
                <select
                  className="mx-auto mb-1 cursor-pointer text-center  bg-transparent focus:outline-none text-[16px] font-medium text-[#000000]"
                  {...register("sourceOfFunds", { required: true })}
                >
                  <option value="">Select</option>
                  {membershipData?.sourceOfFunds &&
                    membershipData?.sourceOfFunds?.length > 0 &&
                    membershipData?.sourceOfFunds?.map((item, index) => {
                      return (
                        <option 
                          className="bg-white text-[#222] hover:bg-[#F5F6FA] transition-colors" 
                          key={index} 
                          value={item}
                        >
                          {item}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="mb-[40px]">
              <label
                className="mb-[10px] text-[16px] font-medium text-center text-[#000000] mt-[15px] block"
                htmlFor="annualVolume"
              >
                Annual volume
              </label>
              <div
                className={`flex items-center border-b ${
                  errors.annualVolume
                    ? "focus-within:border-red-500"
                    : "focus-within:border-blue-500"
                } `}
              >
                <select
                  className="mx-auto mb-1 cursor-pointer text-center  bg-transparent focus:outline-none text-[16px] font-medium text-[#000000]"
                  {...register("annualVolume", { required: true })}
                >
                  <option value="">Select</option>
                  {membershipData?.annualVolume &&
                    membershipData?.annualVolume?.length > 0 &&
                    membershipData?.annualVolume?.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="mb-[40px]">
              <label
                className="mb-[10px] text-[16px] font-medium text-center text-[#000000] mt-[15px] block"
                htmlFor="numberOfPayments"
              >
                Number of payments for the year
              </label>
              <div
                className={`flex items-center border-b ${
                  errors.numberOfPayments
                    ? "focus-within:border-red-500"
                    : "focus-within:border-blue-500"
                } `}
              >
                <select
                  className="mx-auto mb-1 cursor-pointer text-center  bg-transparent focus:outline-none text-[16px] font-medium text-[#000000]"
                  {...register("numberOfPayments", { required: true })}
                >
                  <option value="">Select</option>
                  {membershipData?.numberOfPayments &&
                    membershipData?.numberOfPayments?.length > 0 &&
                    membershipData?.numberOfPayments?.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="mb-[40px]">
              <label
                className="mb-[10px] text-[16px] font-medium text-center text-[#000000] mt-[15px] block"
                htmlFor="mainPurpose"
              >
                Main purpose of payment
              </label>
              <div
                className={`flex items-center border-b ${
                  errors.mainPurpose
                    ? "focus-within:border-red-500"
                    : "focus-within:border-blue-500"
                } `}
              >
                <select
                  className="mx-auto mb-1 cursor-pointer text-center  bg-transparent focus:outline-none text-[16px] font-medium text-[#000000]"
                  defaultValue="Payment to suppliers"
                  {...register("mainPurpose", { required: true })}
                >
                  <option value="">Select</option>
                  {membershipData?.mainPurpose &&
                    membershipData?.mainPurpose?.length > 0 &&
                    membershipData?.mainPurpose?.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item === "Payment to suppliers" ? `${item} (default)` : item}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto my-auto h-full flex flex-col justify-end">
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

export default KYC;
