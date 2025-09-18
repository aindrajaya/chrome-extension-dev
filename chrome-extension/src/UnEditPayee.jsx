import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "./assets/Vector.png";
import axiosInstance from "./services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "./components/Spineer";

const UnEditPayee = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pID = queryParams.get("payee_id");
  const buttonType = useRef("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const [payees, setPayees] = useState([]);

  const fetchPayeeData = useCallback(async () => {
    setLoading(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.post("accountant-users/payee", {
        payee_id: pID,
      });
      if (response?.data?.success === true) {
        // console.log(response?.data?.data,"looopp")
        const data = response?.data?.data;
        const modify = {
          payeeName: data?.payee_name,
          address: data?.address,
          iban: data?.iban_number,
          beneficiaryName: data?.beneficiary_name,
          bicCode: data?.bic_code,
          accountNumber: data?.account_number,
          bankName: data?.bank_name,
        };
        reset(modify);
        setPayees(response?.data?.data);
        // toast.success(response?.data?.message);
        // Your other logic can go here
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading false when the API call finishes
    }
  }, [pID]); // This ensures the function is memoized based on `id`

  useEffect(() => {
    if (pID) {
      fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
    }
  }, [pID, fetchPayeeData]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`exe-add-payee`, {
        payee_name: data?.payeeName,
        address: data?.address,
        iban_number: data?.iban,
        beneficiary_name: data?.beneficiaryName,
        bic_code: data?.bicCode,
        account_number: data?.accountNumber,
        bank_name: data?.bankName,
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(
          `/enter-amount?id=${response?.data?.data?.payee_id}&newRoute=pay`
        );
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
    // const nextId = payees.length + 1 === 1 ? 1 : 2; // Unique ID based on the current length of the data
    // const newPayee = {
    //   ...data,
    //   id: nextId, // Assign the ID
    //   status: "DEPOSIT",
    //   sendAmount: 0.0,
    //   receivedAmount: 0.0,
    //   sName: data.payeeName
    //     ? `${data.payeeName.split(" ")[0]?.[0] || ""}${
    //         data.payeeName.split(" ")[1]?.[0] || ""
    //       }`
    //     : "", // Abbreviation from first letters of first and last name
    //   color: nextId === 1 ? "#FF7E60" : "#4DD771",
    //   date: new Date().toISOString(), // Date when the payee was created
    // };

    // let updatedPayees;

    // if (nextId === 2) {
    //   updatedPayees = [...payees];
    //   updatedPayees[1] = newPayee;
    // } else {
    //   updatedPayees = [...payees, newPayee];
    // }

    // const updatedPayees = [...payees, newPayee];
    // localStorage.setItem("payees", JSON.stringify(updatedPayees)); // Save updated payees list
    // setPayees(updatedPayees); // Update local state

    // if (buttonType.current === "pay") {
    //   navigate(`/enter-amount?id=${nextId}`);
    // } else if (buttonType.current === "save") {
    //   navigate("/transactions"); // replace with your actual path
    // }
    // Your form submission logic here
  };

  return (
    <>
      {/* 
    
    */}

      <div className="flex flex-col h-full">
        {loading && <Spineer />}
        <div className="flex items-center pb-2">
          <Link to="/transactions">
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
              New Payee
            </h5>
          </div>
        </div>
        <div className="bg-white rounded-[14px]  py-[14px] shadow h-full flex flex-col">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            <div className="mx-[40px]">
              <div className="mb-4">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="payeeName"
                >
                  Payee Name
                </label>
                <input
                  readOnly
                  type="text"
                  id="payeeName"
                  {...register("payeeName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.payeeName
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter payee name"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
              Payee Name
            </p>
            <p className="mb-0 text-[20px] font-normal text-[#212058]">
              Black Brewing GmbH
            </p> */}
              </div>
              <div className="mb-4">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  readOnly
                  type="text"
                  id="address"
                  {...register("address", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.address ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter address"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                Address
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                Rubersbach 59, 78132 Hornberg, Germany
              </p> */}
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="iban"
                >
                  IBAN Number
                </label>
                <input
                  readOnly
                  type="text"
                  id="iban"
                  {...register("iban", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.iban ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter IBAN number"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                IBAN number
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                US 25 687713 6441197855219732654
              </p> */}
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="beneficiaryName"
                >
                  Beneficiary Name
                </label>
                <input
                  readOnly
                  type="text"
                  id="beneficiaryName"
                  {...register("beneficiaryName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.beneficiaryName
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter beneficiary name"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                Beneficiary name
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                Black Brewing GmbH
              </p> */}
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="bicCode"
                >
                  BIC Code
                </label>
                <input
                  readOnly
                  type="text"
                  id="bicCode"
                  {...register("bicCode", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.bicCode ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter BIC code"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                BIC code
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                657122
              </p> */}
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="accountNumber"
                >
                  Account Number
                </label>
                <input
                  readOnly
                  type="text"
                  id="accountNumber"
                  {...register("accountNumber", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.accountNumber
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter account number"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                Account number
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                498736987
              </p> */}
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="bankName"
                >
                  Bank Name
                </label>
                <input
                  readOnly
                  type="text"
                  id="bankName"
                  {...register("bankName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full focus:outline-none bg-transparent ${
                    errors.bankName ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter bank name"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                Bank name
              </p>
              <p className="mb-0 text-[16px] font-normal text-[#212058]">
                Berlin International Bank”
              </p> */}
              </div>
            </div>
            <div className="flex justify-end mt-auto px-[20px]">
              {/* <Link to="/transactions">
                <button className="text-[16px] font-medium text-[#222222] w-[142px] h-[50px] rounded-[14px] bg-white  shadow">
                  Save Only
                </button>
              </Link> */}
              <button
                type="submit"
                // disabled={loading}
                onClick={() => {
                  navigate(`/enter-amount?id=${pID}&newRoute=pay`);
                  buttonType.current = "pay";
                }}
                className={`text-[16px] font-medium text-white w-[142px] h-[50px] rounded-[14px] bg-[#222222] shadow
                  ${
                    loading ? "opacity-100" : "opacity-100"
                  } bg-[#222222] shadow`}
              >
                {loading ? "Pay" : "Pay"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UnEditPayee;
