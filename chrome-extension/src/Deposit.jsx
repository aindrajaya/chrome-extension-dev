import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import backArrow from "./assets/Vector.png";
// import Spineer from "./components/Spineer";

const Deposit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data for deposits
  const [payeeData] = useState([
    {
      payee_name: "French Providore",
      sending_amount: 815.92,
      color: "#FF9B7A",
    },
    {
      payee_name: "Black Brewing GmbH",
      sending_amount: 396.64,
      color: "#55D6F6",
    },
  ]);

  const totalSendAmount = payeeData?.reduce((sum, item) => sum + Number(item.sending_amount), 0);

  const [loading2, setLoading2] = useState(false);
  const onSubmit = () => {
    setLoading2(true);
    setTimeout(() => {
      setLoading2(false);
      navigate('/thank-you');
    }, 800);
  };

  return (
    <div className="flex flex-col bg-white h-[600px]">
      {/* Header */}
      <div className="flex items-center pt-6 pb-2 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <img alt="backArrow" src={backArrow} />
        </button>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
            Deposit List
          </h5>
        </div>
        <span className="w-8" />
      </div>
      {/* Deposit List */}
      <div className="px-6 mt-6">
        {payeeData?.map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <div
              className="w-[40px] h-[40px] rounded-full flex justify-center items-center text-[18px] text-white font-bold mr-3 uppercase"
              style={{ backgroundColor: item.color }}
            >
              {item?.payee_name
                ? `${item.payee_name.split(" ")[0]?.[0] || ""}${item.payee_name.split(" ")[1]?.[0] || ""}`
                : ""}
            </div>
            <div className="flex-1">
              <div className="font-medium text-[15px]">{item?.payee_name}</div>
              <div className="text-[#21C628] text-xs font-bold mt-[-2px]">DEPOSIT</div>
            </div>
            <div className="font-medium text-[16px] ml-2">{item.sending_amount.toFixed(2)} GBP</div>
          </div>
        ))}
      </div>
      {/* Total */}
      <div className="flex justify-end items-center px-6 mt-2">
        <span className="text-[18px] font-medium mr-2">Total</span>
        <span className="font-bold text-[20px] text-[#000]">{totalSendAmount.toFixed(2)} GBP</span>
      </div>
      
      {/* Spacer to push content to bottom */}
      <div className="flex-grow"></div>
      
      {/* Bank Details - Bottom Section */}
      <div className="px-6 mb-6">
        <div className="text-[18px] font-semibold mb-2">Universal Products Ltd</div>
        <div className="text-[15px] text-[#222] mb-1">Bank: Equals Money</div>
        <div className="text-[15px] text-[#222] mb-1">Sort code: 563076</div>
        <div className="text-[15px] text-[#222] mb-1">Account: 2608260876</div>
      </div>
      
      {/* Action Button - Bottom */}
      <div className="w-full flex justify-center mb-8">
        <button
          disabled={loading2}
          onClick={onSubmit}
          className={`w-[90%] max-w-[340px] h-[48px] rounded-[14px] bg-[#222222] text-white text-[17px] font-medium shadow ${loading2 ? "opacity-70" : "opacity-100"}`}
        >
          {loading2 ? "Please wait..." : "Yes I've Paid"}
        </button>
      </div>
    </div>
  );
};

export default Deposit;
