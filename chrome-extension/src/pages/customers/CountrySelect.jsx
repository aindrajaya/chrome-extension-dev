import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegistration } from "../../context/RegsitrationContext";
import backArrow from "../../assets/Vector.png";

const CountrySelect = () => {
  const {setRegistration} = useRegistration()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCountrySelect = (country) => {
    setRegistration((prev) => ({...prev, country}));
    // Navigate to company number with country parameter
    navigate(`/company-number?type=business&country=${country}`);    
  }

  const onSubmit = (data) => {};

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to="/">
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            Which country are you sending from?
            </h5>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="    h-full flex flex-col"
        >
          <div className="flex flex-col mt-[55px] h-full  pt-[40px] pb-[24px] bg-white rounded-[10px]">
            <div
              onClick={() => handleCountrySelect("gb")}
              className="px-5 cursor-pointer h-[55px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              United Kingdom
              </p>
            </div>
            {/* <div
              onClick={() => handleCountrySelect("ng")}
              className="px-5 cursor-pointer h-[55px] mt-[20px] mx-auto rounded-[8px] flex justify-center items-center"
            >
              <p className="text-[16px] font-medium text-[#000000]">
              Nigeria
              </p>
            </div> */}
          </div>
        </form>
        <p className="item-center text-center">Team Register</p>
      </div>
    </>
  );
};

export default CountrySelect;
