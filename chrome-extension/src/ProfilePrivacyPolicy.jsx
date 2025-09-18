import React from "react";
import { Link } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const ProfilePrivacyPolicy = () => {
	return (
		<div className="flex flex-col h-full bg-white max-h-[900px] overflow-y-auto" style={{ minHeight: 0, height: '100%' }}>
			<div className="flex items-center pt-8 pb-6 px-4">
				<Link to="/profile">
					<div>
						<img alt="backArrow" src={backArrow} />
					</div>
				</Link>
				<div className="flex-grow">
					<h5 className="text-center font-semibold text-[28px] mb-0 text-[#222] tracking-wide">
						Privacy Policy
					</h5>
				</div>
				<span className="w-8" />
			</div>
			<div className="flex flex-col px-6 pb-8">
				<h6 className="text-[18px] font-semibold mb-2 mt-4">1. Terms</h6>
				<p className="text-[15px] text-[#222] mb-6">
					By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, applicable laws and regulations and their compliance. If you disagree with any of the stated terms and conditions, you are prohibited from using or accessing this site. The materials contained in this site are secured by relevant copyright and trademark law.
				</p>
				<h6 className="text-[18px] font-semibold mb-2">2. Use Licence</h6>
				<p className="text-[15px] text-[#222] mb-2">
					Permission is allowed to temporarily download one duplicate of the materials (data or programming) on Company's site for individual and non-business use only. This is just a permit of license and not an exchange of title, and under this permit, you may not:
				</p>
				<ul className="list-disc pl-6 text-[15px] text-[#222] mb-6">
					<li>modify or copy the materials;</li>
					<li>use the materials for any commercial use, or for any public presentation (business or non-business);</li>
				</ul>
				{/* Add more sections as needed */}
			</div>
		</div>
	);
};

export default ProfilePrivacyPolicy;
