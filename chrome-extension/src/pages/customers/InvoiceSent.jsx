import React from "react";
import { useNavigate } from "react-router-dom";
import EnvelopeImg from "../../assets/invoice-sent.png"; // Place your envelope image here

const InvoiceSent = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate("/");
  };

  return (
    <div className="p-5 flex flex-col h-full bg-white rounded-[20px] px-[24px] py-[0px] shadow justify-center items-center">
      <div className="flex flex-col items-center justify-center flex-grow w-full mt-[40px]">
        <img
          alt="Invoice Sent"
          src={EnvelopeImg}
          className="mx-auto mb-[16px] mt-[16px] w-[180px] h-[180px]"
          style={{ objectFit: "contain" }}
        />
        <span className="text-center text-xl text-[#212058] font-bold mb-[16px]">
          Thank You!
        </span>
        <p className="text-center text-sm font-normal text-[#222222] mb-[32px] px-[8px]">
          We will now process your request<br />and update you via&nbsp; email
        </p>
      </div>
      <div className="w-full flex justify-center mb-[32px]">
        <button
          onClick={handleDone}
          className="text-[16px] font-medium text-white w-full h-[40px] rounded-[14px] bg-[#222222] shadow"
          style={{ maxWidth: "340px" }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default InvoiceSent;
