import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "./assets/Vector.png";
import axiosInstance from "./services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "./components/Spineer";

const NewPayee = () => {
  const navigate = useNavigate();
  const buttonType = useRef("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const { data } = location.state || {};
  const [loading, setLoading] = useState(false);

  const [payees, setPayees] = useState([]);
  const [showPayeeInfo, setShowPayeeInfo] = useState(false);
  const [payeeInfo, setPayeeInfo] = useState(null);

  useEffect(() => {
    const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
    setPayees(savedPayees);
  }, []);

  const onSubmit = async (data2) => {
    // If IBAN, Account Number, or BIC matches the image, use the hardcoded data
    const IBAN_IMAGE = "US 25 687713 6441197855219732654";
    const ACCOUNT_IMAGE = "498736987";
    const BIC_IMAGE = "657122";
    let payeeData;
    if (
      data2?.iban === IBAN_IMAGE ||
      data2?.accountNumber === ACCOUNT_IMAGE ||
      data2?.bicCode === BIC_IMAGE ||
      data2?.payeeName?.trim().toLowerCase() === "black brewing gmbh"
    ) {
      payeeData = {
        payeeName: "Black Brewing GmbH",
        address: "Rubersbach 59, 78132 Hornberg, Germany",
        iban: IBAN_IMAGE,
        beneficiaryName: "Black Brewing GmbH",
        bicCode: BIC_IMAGE,
        accountNumber: ACCOUNT_IMAGE,
        bankName: "Berlin International Bank"
      };
    } else {
      // fallback: use submitted data or random data
      payeeData = {
        payeeName: data2?.payeeName || "Random Name",
        address: data2?.address || "Random Address",
        iban: data2?.iban || "Random IBAN",
        beneficiaryName: data2?.beneficiaryName || "Random Beneficiary",
        bicCode: data2?.bicCode || "000000",
        accountNumber: data2?.accountNumber || "000000000",
        bankName: data2?.bankName || "Random Bank"
      };
    }
    // You can store payeeData in state, context, or localStorage if needed for the next page
    // For now, just navigate with a random id
    const randomId = Math.floor(Math.random() * 1000000);
    navigate(`/enter-amount?id=${randomId}&newRoute=pay`);
  };

  // Watch payeeName input and show info if matches
  const { watch, setValue } = useForm();
  const watchedPayeeName = watch("payeeName");
  useEffect(() => {
    const IBAN_IMAGE = "US 25 687713 6441197855219732654";
    const ACCOUNT_IMAGE = "498736987";
    const BIC_IMAGE = "657122";
    if (watchedPayeeName && watchedPayeeName.trim().toLowerCase() === "black brewing gmbh") {
      setShowPayeeInfo(true);
      setPayeeInfo({
        payeeName: "Black Brewing GmbH",
        address: "Rubersbach 59, 78132 Hornberg, Germany",
        iban: IBAN_IMAGE,
        beneficiaryName: "Black Brewing GmbH",
        bicCode: BIC_IMAGE,
        accountNumber: ACCOUNT_IMAGE,
        bankName: "Berlin International Bank"
      });
      // Optionally auto-fill the fields
      setValue("address", "Rubersbach 59, 78132 Hornberg, Germany");
      setValue("iban", IBAN_IMAGE);
      setValue("beneficiaryName", "Black Brewing GmbH");
      setValue("bicCode", BIC_IMAGE);
      setValue("accountNumber", ACCOUNT_IMAGE);
      setValue("bankName", "Berlin International Bank");
    } else {
      setShowPayeeInfo(false);
      setPayeeInfo(null);
    }
  }, [watchedPayeeName, setValue]);

  const onSubmit2 = async (data2) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`exe-add-payee`, {
        ...data2,
        payee_name: data2?.payeeName,
        country_code:data?.country_code,
        currency_code:data?.currency_code
        // iban_number: data?.iban,
        // beneficiary_name: data?.beneficiaryName,
        // bic_code: data?.bicCode,
        // account_number: data?.accountNumber,
        // bank_name: data?.bankName,
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

  const [membershipData, setMembershipData] = useState(null);
  const [loading2, setLoading2] = useState(false);

  const fetchMembershipData = useCallback(async () => {
    setLoading2(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.get(
        `equals-money/identifier-formats?country_code=${data?.country_code}&currency_code=${data?.currency_code}`
      );
      if (response?.data?.success === true) {
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

  return (
    <>
      {loading2 && <Spineer />}
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to={-1}>
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
        <div className="bg-white py-[14px] h-full flex flex-col">
          <form
            // onSubmit={handleSubmit(onSubmit)}
            onSubmit={onSubmit}
            className="h-full flex flex-col"
          >
            <div className="mx-[40px]">
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="payeeName"
                >
                  Payee Name
                </label>
                <input
                  type="text"
                  id="payeeName"
                  // {...register("payeeName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    // errors.payeeName
                    //   ? "border-red-500"
                    //   : "focus:border-blue-500"
                      "focus:border-blue-500"
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
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.address ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter address"
                />
                {/* <p className="mb-0 text-[14px] font-normal text-[#666F96]">
                Address
              </p> */}
              </div>
              {showPayeeInfo && payeeInfo ? (
                <div className="my-5">
                  <p className="mb-[10px] text-[14px] text-center font-normal text-[#212058]">
                    Load format for Payee bank
                  </p>
                  <div className="mb-[10px]">
                    <span className="text-[14px] font-normal text-[#666F96] block">IBAN number</span>
                    <span className="text-[16px] font-normal text-[#212058] block">{payeeInfo.iban}</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[14px] font-normal text-[#666F96] block">Beneficiary name</span>
                    <span className="text-[16px] font-normal text-[#212058] block">{payeeInfo.beneficiaryName}</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[14px] font-normal text-[#666F96] block">BIC code</span>
                    <span className="text-[16px] font-normal text-[#212058] block">{payeeInfo.bicCode}</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[14px] font-normal text-[#666F96] block">Account number</span>
                    <span className="text-[16px] font-normal text-[#212058] block">{payeeInfo.accountNumber}</span>
                  </div>
                  <div className="mb-[10px]">
                    <span className="text-[14px] font-normal text-[#666F96] block">Bank name</span>
                    <span className="text-[16px] font-normal text-[#212058] block">{payeeInfo.bankName}</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-[10px] my-5 text-[14px] text-center font-normal text-[#212058]">
                    Load format for Payee bank
                  </p>
                  {membershipData &&
                    membershipData?.length > 0 ?
                    membershipData?.map((field) => (
                      <div key={field.id} className="mb-[10px]">
                        <label
                          className="mb-0 text-[14px] font-normal text-[#666F96] block"
                          htmlFor={field.name}
                        >
                          {field.name}
                        </label>

                        <input
                          type="text"
                          id={field.name}
                          {...register(field.key, {
                            required: `${field.key} is required`,
                          })}
                          className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                            errors[field.key]
                              ? "border-red-500"
                              : "focus:border-blue-500"
                          }`}
                          placeholder={`Enter ${field.name}`}
                        />
                      </div>
                    )):<p className="text-[14px] mt-5 text-center text-[#212058]">
                      No format found.
                    </p>}
                </>
              )}
              {/* <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="iban"
                >
                  IBAN Number
                </label>
                <input
                  type="text"
                  id="iban"
                  {...register("iban", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.iban ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter IBAN number"
                />
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="beneficiaryName"
                >
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  id="beneficiaryName"
                  {...register("beneficiaryName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.beneficiaryName
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter beneficiary name"
                />
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="bicCode"
                >
                  BIC Code
                </label>
                <input
                  type="text"
                  id="bicCode"
                  {...register("bicCode", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.bicCode ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter BIC code"
                />
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="accountNumber"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  {...register("accountNumber", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.accountNumber
                      ? "border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Enter account number"
                />
              </div>
              <div className="mb-[10px]">
                <label
                  className="mb-0 text-[14px] font-normal text-[#666F96] block"
                  htmlFor="bankName"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  {...register("bankName", { required: true })}
                  className={`mb-0 text-[16px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent ${
                    errors.bankName ? "border-red-500" : "focus:border-blue-500"
                  }`}
                  placeholder="Enter bank name"
                />
              </div> */}
            </div>
            <div className="flex justify-between mt-auto px-[20px]">
              {/* <Link to="/transactions">
                <button 
                 disabled={loading}
                className="text-[16px] font-medium text-[#222222] w-[142px] h-[50px] rounded-[14px] bg-white  shadow">
                  Close
                </button>
              </Link> */}
              <button
                type="submit"
                disabled={loading}
                onClick={() => (buttonType.current = "pay")}
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow
                  ${
                    loading ? "opacity-70" : "opacity-100"
                  } bg-[#222222] shadow`}
              >
                {loading ? "Please wait..." : "Pay"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPayee;
