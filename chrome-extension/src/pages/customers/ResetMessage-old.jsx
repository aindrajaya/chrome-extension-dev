import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ResetMsgImg from "../../assets/reset-message.png";

const ResetMessage = () => {
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
      navigate("/sign-in");
  };

  // Define transactions state to hold data and colors

  return (
    <div className="flex flex-col h-full bg-white rounded-[14px] px-[20px] py-[14px] shadow">
      <div className="text-center grow flex flex-col justify-center">
        <div className="mb-[30px]">
          <img alt="ResetMsgImg" src={ResetMsgImg} className="mx-auto" />
        </div>
        <span
          className="text-center text-[32px] text-[#212058] px-[20px]"
          style={{ fontWeight: "500" }}
        >
          Your Password Has Been Reset!
        </span>
        {/* <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[20px]">
        Qui ex aute ipsum duis. Incididunt adipisicing voluptate laborum
        </p> */}
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

export default ResetMessage;
