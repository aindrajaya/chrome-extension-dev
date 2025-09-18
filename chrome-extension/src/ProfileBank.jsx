import React from "react";
import { Link } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const ProfileBank = () => {
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
            Your Bank
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <div className="flex flex-col px-8 mt-16">
        <div className="text-[20px] text-[#222] font-medium mb-6">Universal Products Ltd</div>
        <div className="text-[15px] text-[#222] mb-1">Bank: Equals Money</div>
        <div className="text-[15px] text-[#222] mb-1">Sort code: 563076</div>
        <div className="text-[15px] text-[#222] mb-1">Account: 2608260876</div>
      </div>
    </div>
  );
};

export default ProfileBank;
