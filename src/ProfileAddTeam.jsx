import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "./assets/Vector.png";
import eyeOpen from "./assets/eye-open.svg";
import eyeClose from "./assets/eye-close.svg";

const ProfileAddTeam = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/verify-phone?type=add-team-member");
  };

  return (
    <div className="flex flex-col h-full bg-white max-h-[800px]" style={{ minHeight: 0, height: '100%' }}>
      <div className="flex items-center pt-8 pb-6 px-4">
        <Link to="/profile-team">
          <div>
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[20px] mb-0 text-[#222] tracking-wide">
            Register Team
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <form className="flex flex-col px-8 mt-6 w-full max-w-[420px] mx-auto" onSubmit={handleNext}>
        <label className="text-[13px] text-[#888] font-medium mt-4 mb-1">EMAIL</label>
        <div className="text-[15px] text-[#222] mb-2">Payton Pal</div>

        <label className="text-[13px] text-[#888] font-medium mb-1">NAME</label>
        <input className="border-b border-gray-200 text-[15px] py-2 mb-2 outline-none" placeholder="Enter your email" />

        <label className="text-[13px] text-[#888] font-medium mb-1">MOBILE</label>
        <input className="border-b border-gray-200 text-[15px] py-2 mb-2 outline-none" placeholder="Enter your email" />

        <label className="text-[13px] text-[#888] font-medium mb-1">PASSWORD</label>
        <div className="relative mb-2">
          <input type={showPassword ? "text" : "password"} className="border-b border-gray-200 text-[15px] py-2 pr-10 outline-none w-full" placeholder="Enter your password" />
          <span className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowPassword(v => !v)}>
            <img src={showPassword ? eyeOpen : eyeClose} alt="toggle" className="w-5 h-5" />
          </span>
        </div>

        <label className="text-[13px] text-[#888] font-medium mb-1">CONFIRM PASSWORD</label>
        <div className="relative mb-8">
          <input type={showConfirm ? "text" : "password"} className="border-b border-gray-200 text-[15px] py-2 pr-10 outline-none w-full" placeholder="Confirm your password" />
          <span className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowConfirm(v => !v)}>
            <img src={showConfirm ? eyeOpen : eyeClose} alt="toggle" className="w-5 h-5" />
          </span>
        </div>

        <button type="submit" className="w-full bg-[#18181B] text-white text-[18px] font-medium rounded-xl py-3 shadow-md mt-8">Next</button>
      </form>
    </div>
  );
};

export default ProfileAddTeam;
