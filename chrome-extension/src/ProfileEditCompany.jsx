import React from "react";
import { Link } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const ProfileEditCompany = () => {
	// Mock data for demonstration
	const companyNumber = "17483762";
	const companyName = "Universal Products Ltd";
	const address = "42 York St\nTwickenham TW1 3BW";
	const directors = ["Shane Warne", "Ricky Ponting"];

	return (
		<div className="flex flex-col h-full bg-white max-h-[900px] overflow-y-auto" style={{ minHeight: 0, height: '100%' }}>
			<div className="flex items-center pt-8 pb-6 px-4">
				<Link to="/profile-company">
					<div>
						<img alt="backArrow" src={backArrow} />
					</div>
				</Link>
				<div className="flex-grow">
					<h5 className="text-center font-semibold text-[22px] mb-0 text-[#222] tracking-wide">
						Edit Company
					</h5>
				</div>
				<span className="w-8" />
			</div>
			<div className="flex flex-col items-center px-8 pb-8 w-full max-w-[420px] mx-auto">
				<div className="text-[13px] text-[#888] font-medium mb-1 mt-6">Company number</div>
				<div className="text-[28px] font-semibold text-[#222] mb-4">{companyNumber}</div>
				<hr className="border-t border-gray-200 w-full mb-6" />
				<div className="text-[15px] text-[#222] font-medium mb-2">Lookup results</div>
				<div className="text-[15px] text-[#222] whitespace-pre-line mb-2">{companyNumber}\n{companyName}\n{address}</div>
				<div className="text-[15px] text-[#222] mb-6">
					{directors.map((d, i) => (
						<div key={i}>Director: {d}</div>
					))}
				</div>
				<button className="bg-[#FFE066] text-[#222] font-semibold rounded-md px-6 py-2 mb-8" style={{ minWidth: 120 }}>Try again</button>
				<button className="w-full bg-[#18181B] text-white text-[18px] font-medium rounded-xl py-3 shadow-md mt-auto">Select</button>
			</div>
		</div>
	);
};

export default ProfileEditCompany;
