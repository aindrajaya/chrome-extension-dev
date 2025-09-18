import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../../assets/Vector.png";
import axiosInstance from "../../../services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "../../../components/Spineer";

const FoundingMember = () => {
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

  const [membershipData, setMembershipData] = useState(null);

  const fetchMembershipData = useCallback(async () => {
    setLoading2(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.get(
        "/extension-users/get-memberships"
      );
      if (response?.data?.success === true) {
        // console.log(response?.data?.data,"looopp")
        setMembershipData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false); // Set loading false when the API call finishes
    }
  }, []); // This ensures the function is memoized based on `id`

  useEffect(() => {
    // if (id) {
    fetchMembershipData(); // Trigger fetchPayeeData only when `id` is available
    // }
  }, [fetchMembershipData]);

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      user_id:accountantUser?.id,
      ...data
    }
    try {
      const response = await axiosInstance.post("/extension-users/set-membership", payload);
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/accountant-key`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Watch the sendAmount field for updates
  const membership_id = watch("membership_id");
  const fees= membershipData?.filter(item => item?.id == membership_id);
  // const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};

  return (
    // <div className="text-black flex flex-col  h-full">
    //   <div className="flex justify-start items-center pb-2">
    //     <Link to="/transactions">
    //       <div className="">
    //         <img alt="7772246" src={Icon} width={15} height={15} />
    //       </div>
    //     </Link>
    //     <div className="flex-grow">
    //       <h3 className="text-center font-medium text-lg mb-2 text-black">
    //         Enter Amount
    //       </h3>
    //     </div>
    //   </div>

    //   <div className="max-w-lg mx-auto flex flex-col h-full">
    //     <form
    //       onSubmit={handleSubmit(onSubmit)}
    //       className="flex flex-col h-full"
    //     >
    //       <div className=" px-6 py-2 bg-white rounded-lg shadow ">
    //         <div className="mt-4 ">
    //           <div className="grid grid-cols-[0.5fr,2.5fr] my-4">
    //             <div
    //               className="my-auto w-10 h-10 rounded-full text-white flex justify-center items-center"
    //               style={{ backgroundColor: avatarColor }} // Use the pre-calculated color
    //             >
    //               {payeeData?.payee_name
    //                 ? `${payeeData.payeeName.split(" ")[0]?.[0] || ""}${
    //                     payeeData.payeeName.split(" ")[1]?.[0] || ""
    //                   }`
    //                 : ""}
    //             </div>
    //             <div className="ps-2 my-auto">
    //               <h2 className="font-semibold text-xl text-black">
    //                 {payeeData?.payee_name}
    //               </h2>
    //             </div>
    //           </div>
    //         </div>
    //         {/* Send Amount */}
    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 font-medium text-xs"
    //             htmlFor="sendAmount"
    //           >
    //             AMOUNT
    //           </label>
    //           <div
    //             className={`flex items-center border-b ${
    //               errors.sendAmount
    //                 ? "focus-within:border-red-500"
    //                 : "focus-within:border-blue-500"
    //             } `}
    //           >
    //             <span className="text-3xl text-black px-2 font-bold">€</span>
    //             <input
    //               type="number"
    //               step="0.01"
    //               id="sendAmount"
    //               {...register("sendAmount", {
    //                 required: true,
    //                 min: {
    //                   value: 1,
    //                   message: "Amount must be greater than zero",
    //                 },
    //               })}
    //               className={`w-full focus:outline-none bg-transparent text-black text-2xl placeholder:text-xl ${
    //                 errors.sendAmount
    //                   ? "border-red-500"
    //                   : "focus:border-blue-500"
    //               }`}
    //               placeholder="Enter amount to send"
    //             />
    //           </div>
    //         </div>

    //         {/* Received Amount */}
    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 font-medium text-xs"
    //             htmlFor="receivedAmount"
    //           >
    //             AMOUNT
    //           </label>
    //           <div className="flex items-center border-b focus-within:border-blue-500">
    //             <span className="text-3xl text-black px-2 font-bold">£</span>
    //             <input
    //               type="number"
    //               readOnly
    //               id="receivedAmount"
    //               {...register("receivedAmount", { required: true })}
    //               className={`w-full bg-transparent text-black focus:outline-none text-2xl placeholder:text-xl ${
    //                 errors.receivedAmount
    //                   ? "border-red-500"
    //                   : "focus:border-blue-500"
    //               }`}
    //               placeholder="Enter received amount"
    //             />
    //           </div>
    //         </div>

    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 font-medium text-xs"
    //             htmlFor="REFERENCE"
    //           >
    //             REFERENCE
    //           </label>
    //           <div className="flex items-center border-b focus-within:border-blue-500">
    //             <input
    //               type="text"
    //               value={`Inv: 00${payeeData?.id}`}
    //               readOnly
    //               id="REFERENCE"
    //               // {...register("receivedAmount", { required: true })}
    //               className={`w-full bg-transparent text-black focus:outline-none text-xl placeholder:text-xl  ${
    //                 errors.receivedAmount
    //                   ? "border-red-500"
    //                   : "focus:border-blue-500"
    //               }`}
    //               placeholder=""
    //             />
    //           </div>
    //         </div>

    //         <div className="mb-2 text-lg text-black mt-8">
    //           <span className="text-gray-700">Exchange rate:</span>
    //           <span className="font-bold"> 1.19</span>
    //         </div>
    //         <div className="mb-8 text-lg text-black">
    //           <span className="text-gray-700">Transaction fee:</span>
    //           <span className="font-bold"> FREE</span>
    //         </div>
    //       </div>
    //       <div className="flex-grow flex items-end justify-end px-6">
    //         <button
    //           type="submit"
    //           className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-opacity-50"
    //         >
    //           Send
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <div className="flex flex-col h-full">
      {loading2 && <Spineer />}
      <div className="flex items-center pb-2">
        <Link to="/sign-in">
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            Founding Member
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="bg-white rounded-[14px] px-[20px] py-[14px] shadow">
          <div className="">
            <h1 className="text-[16px] font-normal text-center text-[#666F96]">
              Get them while they last
            </h1>
            <h1 className="text-[16px] font-normal text-center text-[#666F96]">
              Become a Founding Member and
            </h1>
            <h1 className="text-[16px] font-normal text-center text-[#666F96]">
              pay £1 fees forever!
            </h1>
            <div className="">
              <label
                className="mb-[10px] text-[14px] font-normal text-center text-[#666F96] mt-[15px] block"
                htmlFor="membership_id"
              >
                Select your yearly transaction volume
              </label>
              <div
                className={`flex items-center border-b ${
                  errors.membership_id

                    ? "focus-within:border-red-500"
                    : "focus-within:border-blue-500"
                } `}
              >
                <select
                  className="mx-auto mb-1 cursor-pointer text-center  bg-transparent focus:outline-none text-[18px] font-medium text-[#212058]"
                  {...register("membership_id", { required: true })}
                >
                  <option value="">Select</option>
                  {membershipData?.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.limit}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-[25px] text-[14px] font-normal text-center mb-[10px] text-[#666F96]">
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
              Use Company number as reference
            </h1>
            <h4 className="text-[#212058] text-center text-[20px] mb-[10px] font-medium">
              {accountantUser?.company_number}
            </h4>
            <h4 className="text-[#212058] text-center text-[28px] font-medium">
              {fees?.[0]?.fees ? fees?.[0]?.fees :"\u00A0"}
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

export default FoundingMember;
