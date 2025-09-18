import React from "react";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "./assets/Vector.png";
import editIcon from "./assets/edit-icon.png";
import plusIcon from "./assets/+.png";

const mockTeam = [
  { name: "Ricky Ponting", email: "ricky.ponting@email.com", mobile: "" },
  { name: "Alan Border", status: "Invited", email: "alan.border@email.com", mobile: "" },
  { name: "Michelle Pfeiffer", email: "michelle.pfeiffer@email.com", mobile: "" },
  { name: "Kate Bush", status: "Expired", email: "kate.bush@email.com", mobile: "" },
  { name: "Meryl Streep", email: "meryl.streep@email.com", mobile: "" },
];

const ProfileTeam = () => {
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
            Team
          </h5>
        </div>
        <div>
          <div className="w-[40px] h-[40px] rounded-full bg-[#222] flex items-center justify-center cursor-pointer">
            <img src={plusIcon} alt="add" className="w-[22px] h-[22px]" onClick={() => navigate('/profile-add-team')} />
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6">
        {mockTeam.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="text-[15px] text-[#222] font-medium leading-tight mr-2">{item.name}</span>
              {item.status === "Invited" && (
                <span className="text-[13px] text-[#21C628] font-medium ml-2">Invited</span>
              )}
              {item.status === "Expired" && (
                <span className="text-[13px] text-[#FF3C3C] font-medium ml-2">Expired</span>
              )}
            </div>
            <img
              src={editIcon}
              alt="edit"
              className="w-[16px] h-[16px] cursor-pointer"
              onClick={() => navigate('/profile-edit-team', { state: { member: item } })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTeam;
