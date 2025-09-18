import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const ProfileEditTeam = () => {
  const location = useLocation();
  const member = location.state?.member || { email: "Payton Pal", name: "", mobile: "" };
  const [invited, setInvited] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white max-h-[800px]" style={{ minHeight: 0, height: '100%' }}>
      <div className="flex items-center pt-8 pb-6 px-4">
        <Link to="/profile-team">
          <div>
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
            Edit Team
          </h5>
        </div>
        <span className="w-8" />
      </div>
      <div className="flex flex-col px-8 mt-6">
        <div className="mb-6">
          <label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="email">
            EMAIL
          </label>
          <input
            type="text"
            id="email"
            value={member.email}
            readOnly
            className="pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="name">
            NAME
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your email"
            className="pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC]"
            defaultValue={member.name}
          />
        </div>
        <div className="mb-6">
          <label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="mobile">
            MOBILE
          </label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your email"
            className="pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC]"
            defaultValue={member.mobile}
          />
        </div>
        <div className="flex flex-col items-center mt-8">
          {!invited ? (
            <button
              className="text-[#21C628] text-[15px] font-semibold mb-8 bg-transparent"
              onClick={() => setInvited(true)}
            >
              Send Invite
            </button>
          ) : (
            <div className="w-full flex justify-center mb-8">
              <div className="bg-[#21C628] text-black text-[16px] font-semibold rounded-[14px] w-full py-3 text-center">
                Invitation sent
              </div>
            </div>
          )}
          <button className="text-[#FF3C3C] text-[15px] font-semibold mt-2">DELETE</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditTeam;
