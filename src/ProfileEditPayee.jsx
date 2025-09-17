import React from "react";
import { Link, useLocation } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const fallbackPayee = {
  businessName: "Universal Products Ltd",
  address: "42 York St Twickenham TW1 3BW",
  iban: "US 25 687713 6441197855219732654",
  beneficiary: "Black Brewing GmbH",
  bic: "657122",
  account: "498736987",
  bank: "Berlin International Bank"
};

const ProfileEditPayee = () => {
  const location = useLocation();
  const payee = location.state?.payee || fallbackPayee;
  return (
    <div className="flex flex-col h-full bg-white max-h-[800px]" style={{ minHeight: 0, height: '100%' }}>
      <div className="flex items-center pt-8 pb-6 px-4">
        <Link to="/profile-payee">
          <div>
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
            Edit Payee
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <div className="flex flex-col px-8 mt-6">
        <div className="mb-6">
          <div className="text-[13px] text-[#888] mb-1">Business Name</div>
          <div className="text-[18px] text-[#222] font-medium mb-2">{payee.businessName}</div>
          <div className="text-[13px] text-[#888] mb-1">Address</div>
          <div className="text-[15px] text-[#222] mb-2">{payee.address}</div>
        </div>
        <div className="mb-4">
          <div className="text-[13px] text-[#888] mb-1">IBAN number</div>
          <div className="text-[15px] text-[#222] mb-4">{payee.iban}</div>
          <div className="text-[13px] text-[#888] mb-1">Beneficiary name</div>
          <div className="text-[15px] text-[#222] mb-4">{payee.beneficiary}</div>
          <div className="text-[13px] text-[#888] mb-1">BIC code</div>
          <div className="text-[15px] text-[#222] mb-4">{payee.bic}</div>
          <div className="text-[13px] text-[#888] mb-1">Account number</div>
          <div className="text-[15px] text-[#222] mb-4">{payee.account}</div>
          <div className="text-[13px] text-[#888] mb-1">Bank name</div>
          <div className="text-[15px] text-[#222] mb-4">{payee.bank}</div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="text-[#FF3C3C] text-[15px] font-semibold">DELETE</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPayee;
