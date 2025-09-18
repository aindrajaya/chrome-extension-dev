import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "./assets/Vector.png";
import axiosInstance from "./services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "./components/Spineer";

const EnterAmount = () => {
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
      const response = await axiosInstance.post(endpoint,payload);
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

  const onSubmit = async (data) => {
    // Handle form submission
    setLoading(true)
    navigate("/payment-sent")
  };  

  // Handle form submission
  const onSubmit2 = async (data) => {
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

    // if (!get1) {
    //   const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
    //   const updatedPayees = savedPayees.map((payee) => {
    //     if (payee.id === parseInt(id)) {
    //       return { ...payee, ...data, status: "DEPOSIT" }; // Update the specific payee
    //     }
    //     return payee;
    //   });
    //   localStorage.setItem("payees", JSON.stringify(updatedPayees));
    //   navigate(`/deposit?id=${id}&newRoute=pay`);
    // } else {
    //   const payees = JSON.parse(localStorage.getItem("payees")) || [];
    //   const nextId = payees.length + 1 === 1 ? 1 : 2; // Unique ID based on the current length of the data
    //   const newPayee = {
    //     ...data,
    //     id: nextId, // Assign the ID
    //     status: "DEPOSIT",
    //     color: nextId === 1 ? "#FF7E60" : "#4DD771",
    //     date: new Date().toISOString(), // Date when the payee was created
    //   };

    //   let updatedPayees;

    //   if (nextId === 2) {
    //     updatedPayees = [...payees];
    //     updatedPayees[1] = newPayee;
    //   } else {
    //     updatedPayees = [...payees, newPayee];
    //   }

    //   // const updatedPayees = [...payees, newPayee];
    //   localStorage.setItem("payees", JSON.stringify(updatedPayees));
    //   navigate(`/deposit?id=${nextId}`);
    //   // localStorage.setItem("payees", JSON.stringify(updatedPayees));
    // }
  };

  // Watch the sendAmount field for updates
  const sendAmount = watch("sendAmount");

  useEffect(() => {
    // Ensure sendAmount is a valid number and not empty
    const amount = parseFloat(sendAmount);
    if (!isNaN(amount) && amount > 0) {
      const newReceivedAmount = parseFloat((amount * 0.86).toFixed(2));
      setValue("receivedAmount", newReceivedAmount);
    } else {
      setValue("receivedAmount", "");
    }
  }, [sendAmount, setValue]);

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
    <div className="flex flex-col h-full p-5">
      {loading2 && <Spineer />}
      <div className="flex items-center pb-2">
        <Link to="/homepage">
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            Enter Amount
          </h5>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="bg-white px-[20px] py-[14px]">
          <div className="flex mb-[14px] items-center">
            <div
              className={`uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white`}
              style={{ backgroundColor: payeeData?.color || '#55D6F6' }}
            >
              {payeeData?.payee_name
                ? `${payeeData.payee_name.split(" ")[0]?.[0] || ""}${
                    payeeData.payee_name.split(" ")[1]?.[0] || ""
                  }`
                : "BF"}
            </div>
            <div className="flex-grow ms-[14px]">
              <h4 className="mb-0 text-[20px] text-[#000000] font-medium">
                {payeeData?.payee_name || 'Black Brewing GmbH'}
              </h4>
            </div>
          </div>
          {/* AMOUNT */}
          <div className="mb-2 mt-6">
            <label className="mb-0 text-[11px] font-medium text-[#666F96] block" htmlFor="sendAmount">AMOUNT</label>
            <div className="flex items-end border-b border-[#CED3EC] pb-1">
              <input
                type="number"
                step="0.01"
                id="sendAmount"
                {...register("sendAmount", {
                  required: true,
                  min: { value: 1, message: "Amount must be greater than zero" },
                })}
                className="text-[40px] text-[#222] font-light w-full focus:outline-none bg-transparent placeholder:text-3xl text-right pr-2"
                placeholder="0.00"
              />
              <span className="text-[20px] text-[#222] font-medium ml-2 mb-1">EUR</span>
            </div>
          </div>
          {/* Exchange rate and fee */}
          <div className="flex justify-between text-[15px] text-[#666F96] mt-4 mb-2">
            <div>Exchange rate:</div>
            <div className="text-[#222] font-medium">0.86 GBP</div>
          </div>
          <div className="flex justify-between text-[15px] text-[#666F96] mb-4">
            <div>Transaction fee:</div>
            <div className="text-[#222] font-medium">2.50 GBP</div>
          </div>
          {/* TOTAL */}
          <div className="mb-2 mt-6">
            <label className="mb-0 text-[11px] font-medium text-[#666F96] block" htmlFor="receivedAmount">TOTAL</label>
            <div className="flex items-end border-b border-[#CED3EC] pb-1">
              <input
                type="number"
                readOnly
                id="receivedAmount"
                {...register("receivedAmount", { required: true })}
                className="text-[40px] text-[#222] font-light w-full focus:outline-none bg-transparent placeholder:text-3xl text-right pr-2"
                placeholder="0.00"
              />
              <span className="text-[20px] text-[#222] font-medium ml-2 mb-1">GBP</span>
            </div>
          </div>
          {/* REFERENCE */}
          <div className="mb-2 mt-6">
            <label className="mb-0 text-[11px] font-medium text-[#666F96] block" htmlFor="REFERENCE">REFERENCE</label>
            <div className="flex items-center border-b border-[#CED3EC] pb-1">
              <input
                type="text"
                id="REFERENCE"
                {...register("reference", { required: false })}
                className="text-[20px] font-normal text-[#222] w-full bg-transparent focus:outline-none placeholder:text-xl"
                placeholder="Inv: TC846"
              />
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-end justify-end px-6 mt-8">
          <button
            type="submit"
            className={`w-full py-3 rounded-[14px] bg-[#222222] text-white text-[17px] font-medium shadow ${loading ? "opacity-70" : "opacity-100"}`}
            style={{ maxWidth: 340 }}
          >
            {loading ? "Please wait..." : "Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterAmount;
