import React from "react";
import { useNavigate } from "react-router-dom";
import ResetMsgImg from "../../assets/reset-message.png";

const ResetMessage = () => {
  const navigate = useNavigate();

  const changeRoute = () => {
      navigate("/sign-in");
  };

  return (
    <div className="flex flex-col h-full bg-white px-[20px] py-[14px]">
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
        <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[20px]">
          Qui ex aute ipsum duis. Incididunt adipisicing voluptate laborum
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

export default ResetMessage;
