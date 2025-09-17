import React from "react";
import { Link, useNavigate } from "react-router-dom";
import editIcon from "./assets/edit-icon.png";
import backArrow from "./assets/Vector.png";

const ProfileCompanyInfo = () => {
	const navigate = useNavigate();
	// Mock data
	const company = {
		name: "Universal Products Ltd",
		address: "42 York St Twickenham TW1 3BW",
		contact: "Gene Hackman",
		mobile: "+44 97851838354",
		email: "cfo@universalproducts.co.uk",
	};

	return (
		<div className="flex flex-col h-full bg-white max-h-[900px] overflow-y-auto" style={{ minHeight: 0, height: '100%' }}>
			<div className="flex items-center pt-8 pb-6 px-4">
				<Link to="/profile">
					<div>
						<img alt="backArrow" src={backArrow} />
					</div>
				</Link>
				<div className="flex-grow">
					<h5 className="text-center font-semibold text-[22px] mb-0 text-[#222] tracking-wide">
						Company Details
					</h5>
				</div>
				<span className="w-8" />
			</div>
			<div className="flex flex-col px-8 pb-8 w-full max-w-[420px] mx-auto">
				{/* Company Details Section */}
				<div className="flex items-center justify-between mt-6 mb-1">
					<span className="text-[13px] text-[#888] font-medium">Company Details</span>
					<img src={editIcon} alt="edit" className="w-4 h-4 cursor-pointer opacity-60" onClick={() => navigate('/profile-edit-company')} />
				</div>
				<div className="text-[20px] font-semibold text-[#222] mb-2">{company.name}</div>
				<div className="text-[13px] text-[#888] font-medium mb-1">Address</div>
				<div className="text-[15px] text-[#222] mb-6">{company.address}</div>

				<hr className="border-t border-gray-200 mb-6" />

				{/* Contact Section */}
				<div className="flex items-center justify-between mb-1">
					<span className="text-[13px] text-[#888] font-medium">Contact</span>
					<img src={editIcon} alt="edit" className="w-4 h-4 cursor-pointer opacity-60" onClick={() => navigate('/profile-edit-contact-company')} />
				</div>
				<div className="text-[15px] text-[#222] mb-4">{company.contact}</div>

				<div className="text-[13px] text-[#888] font-medium mb-1">Mobile</div>
				<div className="text-[15px] text-[#222] mb-4">{company.mobile}</div>

				<div className="text-[13px] text-[#888] font-medium mb-1">Email</div>
				<div className="text-[15px] text-[#222]">{company.email}</div>
			</div>
		</div>
	);
};

export default ProfileCompanyInfo;
