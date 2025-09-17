import React from "react";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "./assets/Vector.png";
import editIcon from "./assets/edit-icon.png";

const mockPayees = [
  {
    businessName: "Universal Products Ltd",
    address: "42 York St Twickenham TW1 3BW",
    iban: "US 25 687713 6441197855219732654",
    beneficiary: "Black Brewing GmbH",
    bic: "657122",
    account: "498736987",
    bank: "Berlin International Bank",
    name: "Black Brewing GmbH"
  },
  {
    businessName: "Universal Products Ltd",
    address: "42 York St Twickenham TW1 3BW",
    iban: "US 25 687713 6441197855219732654",
    beneficiary: "French Providore",
    bic: "657122",
    account: "498736987",
    bank: "Berlin International Bank",
    name: "French Providore"
  },
  {
    businessName: "Universal Products Ltd",
    address: "42 York St Twickenham TW1 3BW",
    iban: "US 25 687713 6441197855219732654",
    beneficiary: "BonneBouffe",
    bic: "657122",
    account: "498736987",
    bank: "Berlin International Bank",
    name: "BonneBouffe"
  },
  {
    businessName: "Universal Products Ltd",
    address: "42 York St Twickenham TW1 3BW",
    iban: "US 25 687713 6441197855219732654",
    beneficiary: "Felipe Harris SL",
    bic: "657122",
    account: "498736987",
    bank: "Berlin International Bank",
    name: "Felipe Harris SL"
  },
  {
    businessName: "Universal Products Ltd",
    address: "42 York St Twickenham TW1 3BW",
    iban: "US 25 687713 6441197855219732654",
    beneficiary: "La Panier Francais",
    bic: "657122",
    account: "498736987",
    bank: "Berlin International Bank",
    name: "La Panier Francais"
  },
];

const ProfilePayees = () => {
  const navigate = useNavigate();
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
            Payees
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <div className="flex flex-col px-6">
        {mockPayees.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between mb-8">
            <div className="text-[15px] text-[#222] font-medium leading-tight">{item.name}</div>
            <img
              src={editIcon}
              alt="edit"
              className="w-[16px] h-[16px] cursor-pointer"
              onClick={() => navigate('/profile-edit-payee', { state: { payee: item } })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePayees;
