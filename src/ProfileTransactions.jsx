import React from "react";
import { Link } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const mockTransactions = [
  {
    name: "Adalyn Roth",
    desc: "Money transfer",
    amount: "195.00",
    currency: "EUR",
  },
  {
    name: "Amazon",
    desc: "Online payments",
    amount: "268.47",
    currency: "EUR",
  },
  {
    name: "Paypal",
    desc: "Deposits",
    amount: "800.00",
    currency: "USD",
  },
  {
    name: "+17869871235",
    desc: "Mobile payments",
    amount: "15.00",
    currency: "EUR",
  },
  {
    name: "Amazon",
    desc: "Online payments",
    amount: "268.47",
    currency: "UAD",
  },
];

const ProfileTransactions = () => {
  return (
    <div className="flex flex-col h-full bg-white max-h-[800px]" style={{ minHeight: 0, height: '100%' }}>
      <div className="flex items-center pt-8 pb-6 px-4">
        <Link to="/profile">
          <div>
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
            Transactions
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <div className="flex flex-col px-6">
        {mockTransactions.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[15px] text-[#222] font-medium leading-tight">{item.name}</div>
              <div className="text-[13px] text-[#888] leading-tight">{item.desc}</div>
            </div>
            <div className="text-[15px] text-[#222] font-medium whitespace-nowrap">
              {item.amount} {item.currency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTransactions;
