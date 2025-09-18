import React from "react";
import { useNavigate } from "react-router-dom";
import briefcaseImg from "../../../assets/img-success.png";

const SuccessRegisterTeam = () => {
	const navigate = useNavigate();

	const handleDone = () => {
		navigate("/");
	};

	return (
		<div className="flex flex-col h-full bg-white rounded-[20px] px-[24px] py-0 shadow justify-center items-center">
			<div className="flex flex-col items-center justify-center flex-grow w-full mt-[60px]">
				<img
					alt="Briefcase"
					src={briefcaseImg}
					className="mx-auto mb-[32px] mt-[16px] w-[90px] h-[70px]"
					style={{ objectFit: "contain" }}
				/>
				<span className="text-center text-xl text-[#212058] font-bold mb-[16px]">
					Account Created!
				</span>
				<p className="text-center text-sm font-normal text-[#222] mb-[8px] px-[8px]">
					You have been registered as a Team<br />Member of
				</p>
				<div className="text-center text-lg font-medium text-[#222] mb-[32px]">Universal Products Ltd</div>
			</div>
			<div className="w-full flex justify-center mb-[32px]">
				<button
					onClick={handleDone}
					className="text-[16px] font-medium text-white w-full h-[48px] rounded-[14px] bg-[#222222] shadow"
					style={{ maxWidth: "340px" }}
				>
					Done
				</button>
			</div>
		</div>
	);
};

export default SuccessRegisterTeam;
