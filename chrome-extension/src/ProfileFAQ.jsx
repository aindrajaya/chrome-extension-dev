import React, { useState } from "react";
import { Link } from "react-router-dom";
import backArrow from "./assets/Vector.png";

const faqs = [
	{
		question: "Can I deposit a check using the app?",
		answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu dolor in repreh enderit lla cca ecat cupidatat non proiden paria.",
	},
	{
		question: "Can I manage my credit card through the app?",
		answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu dolor in repreh enderit lla cca ecat cupidatat non proiden paria.",
	},
	{
		question: "How do I transfer money between accounts?",
		answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu dolor in repreh enderit lla cca ecat cupidatat non proiden paria.",
	},
	{
		question: "Can I set up alerts for account activity?",
		answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu dolor in repreh enderit lla cca ecat cupidatat non proiden paria.",
	},
	{
		question: "What if I have a question or need assistance with the app?",
		answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu dolor in repreh enderit lla cca ecat cupidatat non proiden paria.",
	},
];

const ProfileFAQ = () => {
	const [openIdx, setOpenIdx] = useState(2); // open the 3rd by default
	return (
		<div className="flex flex-col h-full bg-white max-h-[900px] overflow-y-auto" style={{ minHeight: 0, height: '100%' }}>
			<div className="flex items-center pt-8 pb-6 px-4">
				<Link to="/profile">
					<div>
						<img alt="backArrow" src={backArrow} />
					</div>
				</Link>
				<div className="flex-grow">
					<h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
						FAQ
					</h5>
				</div>
				<span className="w-8" />
			</div>
			<div className="flex flex-col px-6 pb-8">
				{faqs.map((faq, idx) => (
					<div key={idx} className="mb-4">
						<button
							className={`w-full text-left text-[15px] font-medium text-[#222] flex items-center justify-between py-4 px-2 rounded-[12px] ${openIdx === idx ? 'bg-[#FAFAFA] shadow' : ''}`}
							onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
						>
							<span>{faq.question}</span>
							<span className="ml-2 text-[20px]">{openIdx === idx ? "\u25B2" : "\u25BC"}</span>
						</button>
						{openIdx === idx && (
							<div className="bg-white rounded-[12px] shadow px-4 py-4 text-[15px] text-[#222] mt-2">
								{faq.answer}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ProfileFAQ;
