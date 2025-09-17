import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import xero from "../../../assets/xero 1.svg";
import sageLogo from "../../../assets/sage-logo 1.svg";
import intuitQuickBooks from "../../../assets/Intuit_QuickBooks_logo 1.svg";

const SoftwareSuccess = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const software = localStorage.getItem("selectedSoftware") || "";
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};
  const newRoute = queryParams.get("newRoute");
  const navigate = useNavigate();

  const [payeeData, setPayeeData] = useState(null);

  // Fetch the specific payee by ID from localStorage
  const fetchPayeeData = useCallback(() => {
    const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
    const payee = savedPayees.find((payee) => payee?.id === parseInt(id));
    if (payee) {
      setPayeeData(payee);
    }
  }, [id]);

  // Call fetchPayeeData when `id` changes
  useEffect(() => {
    if (id) {
      fetchPayeeData();
    }
  }, [id, fetchPayeeData]);

  const onSubmit = (data) => {
    console.log(data);
    // Your form submission logic here
  };

  const changeRoute = () => {
    accountantUser.user_type === "partner_user" ? navigate("/clients") :
    navigate("/transactions");
  };

  // Define transactions state to hold data and colors

  return (
    <div className="flex flex-col h-full bg-white rounded-[14px] px-[20px] py-[14px] shadow">
      <div className="text-center grow flex flex-col">
        <span
          className="text-center text-[32px] text-[#212058] mt-[90px]"
          style={{ fontWeight: "500" }}
        >
         Success!
        </span>
        <div className="mb-[48px]">
            {software === "xero" && <img alt={"xero"} src={xero} className="mx-auto mt-[51px]" />}
                        {software === "sage" && <img
                          alt={"sageLogo"}
                          src={sageLogo}
                          className="mx-auto mt-[51px]"
                        />}
                         {software === "quickbooks" &&
                        <img
                          alt={"intuitQuickBooks"}
                          src={intuitQuickBooks}
                          className="mx-auto mt-[51px]"
                        />}
        </div>
        <p className="mb-0 text-[16px] font-normal text-[#666F96]">
        Now all your money transfer will automatically sync to your accounting software
        </p>
      </div>
      <div className="flex justify-between mt-auto">
        <button
          onClick={() => {
            changeRoute();
          }}
          className="text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SoftwareSuccess;
