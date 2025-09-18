import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "./assets/vector image.png";
import Tick from "./assets/tick.png";
import axiosInstance from "./services/axiosConfig";
import Spineer from "./components/Spineer";

const RequestSaved = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const newRoute = queryParams.get("newRoute");
  const navigate = useNavigate();

  // const [payeeData, setPayeeData] = useState(null);
    const [payeeData, setPayeeData] = useState(null);
    const [loading2, setLoading2] = useState(false);

  // Fetch the specific payee by ID from localStorage
  const fetchPayeeData = useCallback(async () => {
    setLoading2(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.post(`get-transaction`, {
        transaction_id: id,
      });
      if (response?.data?.success === true) {
        // console.log(response?.data?.data,"looopp")
        setPayeeData(response?.data?.data);
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
      // console.log("tuututututu")
      fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
    }
  }, [id, fetchPayeeData]); 

    const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // const idsArray = payeeData?.map(item => item?.transaction_id);
    // console.log(idsArray, "idsArray");
    setLoading(true);
    try {
      const response = await axiosInstance.post(`multi-transaction`, {
        transaction_ids: [id],
        status:"completed"
      });
      if (response?.data?.success === true) {
      navigate(`/thank-you`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  const changeRoute = () => {
    if (newRoute) {
      navigate("/paid");
    }else{
      navigate("/paid");
      // onSubmit();
      // navigate("/thank-you");
    }
  };

  // Define transactions state to hold data and colors

  return (
    // <div className="max-w-lg mx-auto px-6 py-2 bg-white rounded-lg shadow">
    //   <img className=" mx-auto my-8" alt="Icon2" src={Icon2} />
    //   <div className="">
    //     <div className="mb-4 mx-auto w-14 h-14 rounded-full bg-[#25A199] flex justify-center items-center">
    //       <img
    //         alt="Icon"
    //         src={Icon}
    //         width={23}
    //         height={23}
    //         className="text-white text-2xl"
    //       ></img>
    //     </div>
    //     <h3 className="text-center font-semibold text-2xl mb-2 text-black">
    //       {payeeData?.sendAmount}{" "}
    //       <span className="font-normal text-lg">EUR</span>
    //     </h3>
    //     <p className="text-center text-gray-500 mb-0">Your money transfer to</p>
    //     <h3 className="text-center font-semibold text-2xl mb-0">
    //       {payeeData?.payeeName}
    //     </h3>
    //     <p className="text-center text-gray-500 mb-2">has been sent!</p>
    //     <div className="flex justify-between items-center gap-3 px-6 mt-8">
    //       <Link to="/transactions" className="w-full">
    //         <button
    //           type="button"
    //           className=" w-full py-2 px-4 bg-white shadow text-black font-semibold rounded-lg focus:outline-none focus:ring-opacity-50"
    //         >
    //           Close
    //         </button>
    //       </Link>

    //       <Link to={`/paid?id=${id}`} className="w-full">
    //         <button
    //           type="submit"
    //           className="w-full py-2 px-4 my-4 bg-black text-white font-semibold rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-opacity-50"
    //         >
    //           Deposite
    //         </button>
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col h-full bg-white rounded-[14px] px-[20px] py-[14px] shadow">
            {loading2 && <Spineer />}
      <div className="">
        <img alt="Header" src={Header} className="mx-auto" />
      </div>
      <div className="mx-auto mt-[20px] w-[60px] h-[60px] rounded-full bg-[#2AABA3] flex items-center justify-center">
        <img alt="Tick" src={Tick} className="" />
      </div>
      <div className="text-center">
        <h1 className="mb-0 text-[24px] font-medium  mt-[10px] text-[#212058]">
          {payeeData?.sending_amount}
          <span className="ms-2 text-[16px]" style={{ fontWeight: "500" }}>
            EUR
          </span>
        </h1>
        <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[20px]">
        Your request has been sent
        </p>
        <h1 className="mb-0 text-[24px] font-medium text-[#212058]">
          {payeeData?.payee_name}
        </h1>
        {/* <p className="mb-0 text-[16px] font-normal text-[#666F96]">
          has been sent!
        </p> */}
      </div>
      <div className="flex justify-between mt-auto">
        <Link to="/transactions">
          <button className="text-[16px] font-medium text-[#222222] w-[142px] h-[50px] rounded-[14px] bg-white  shadow">
            Close
          </button>
        </Link>

        <button
          onClick={() => {
            changeRoute();
          }}
          disabled={loading}
          className={`text-[16px] font-medium text-white w-[142px] h-[50px] rounded-[14px] bg-[#222222] shadow ${
            loading ? "opacity-70" : "opacity-100"
          } bg-[#222222] shadow`}>
            {loading ? "Please wait..." : "Deposit"}
          
        </button>
      </div>
    </div>
  );
};

export default RequestSaved;
