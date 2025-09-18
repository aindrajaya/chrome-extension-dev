import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import eyeClose from "../../../assets/eye-close.svg";
import eyeOpen from "../../../assets/eye-open.svg";
import backArrow from "../../../assets/Vector.png";

const RegisterTeam = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "Payton Pal",
		},
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			// navigate to next step or show success
			navigate(-1);
		}, 800);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-white">
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center pb-2 pt-6 px-4">
					<Link to={-1}>
						<div>
							<img alt="backArrow" src={backArrow} />
						</div>
					</Link>
					<div className="flex-grow">
						<h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
							Register Team
						</h5>
					</div>
					<span className="w-8" />
				</div>
				{/* Form Fields */}
				<div className="mx-[25px] my-[20px] flex-1">
					<div className="mb-[20px]">
						<label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="email">
							Email
						</label>
						<input
							type="text"
							id="email"
							{...register("email", { required: true })}
							className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
								errors.email ? "border-red-500" : "focus:border-blue-500"
							}`}
							readOnly
						/>
					</div>
					<div className="mb-[20px]">
						<label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="name">
							Name
						</label>
						<input
							type="text"
							id="name"
							{...register("name", { required: true })}
							className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
								errors.name ? "border-red-500" : "focus:border-blue-500"
							}`}
							placeholder="Enter your email"
						/>
					</div>
					<div className="mb-[20px]">
						<label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="mobile">
							Mobile
						</label>
						<input
							type="text"
							id="mobile"
							{...register("mobile", { required: true })}
							className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
								errors.mobile ? "border-red-500" : "focus:border-blue-500"
							}`}
							placeholder="Enter your email"
						/>
					</div>
					<div className="mb-[20px]">
						<label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="password">
							Password
						</label>
						<div className="relative w-full">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								{...register("password", { required: true })}
								className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
									errors.password ? "border-red-500" : "focus:border-blue-500"
								}`}
								placeholder="Enter your password"
							/>
							<span
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
							>
								<img alt={showPassword ? "Hide password" : "Show password"} src={!showPassword ? eyeClose : eyeOpen} />
							</span>
						</div>
					</div>
					<div className="mb-[20px]">
						<label className="mb-0 text-[10px] font-medium text-[#666F96] block uppercase" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<div className="relative w-full">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								{...register("confirmPassword", {
									required: true,
									validate: (value) => value === getValues("password") || "Passwords do not match",
								})}
								className={`pb-[10px] mb-0 text-[14px] font-normal text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[14px] ${
									errors.confirmPassword ? "border-red-500" : "focus:border-blue-500"
								}`}
								placeholder="Confirm your password"
							/>
							<span
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								className="absolute right-0 top-[30%] transform -translate-y-[30%] cursor-pointer"
							>
								<img alt={showConfirmPassword ? "Hide password" : "Show password"} src={!showConfirmPassword ? eyeClose : eyeOpen} />
							</span>
						</div>
					</div>
				</div>
				{/* Button */}
				<div className="flex justify-between px-[20px] mt-auto mb-8">
					<button
						type="submit"
						className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow ${loading ? "opacity-70" : "opacity-100"}`}
						disabled={loading}
					>
						{loading ? "Please wait..." : "Next"}
					</button>
				</div>
			</div>
		</form>
	);
};

export default RegisterTeam;
