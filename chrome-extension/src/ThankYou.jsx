import React from "react";
import { Link } from "react-router-dom";
import thankYouIcon from "./assets/thank-you.png";
import MoneyFlyImg from "./assets/vector image.png"; // Make sure this image exists

const ThankYou = () => {
  return (
    <div className="max-w-lg mx-auto px-5 py-2 bg-white h-full flex flex-col">
      <img
        className=" mx-auto mb-4 mt-20"
        alt="thankYouIcon"
        src={MoneyFlyImg}
      />

      <div className="">
        <h2 className="text-center font-medium text-[32px] my-8 text-[#212058]">
          Thank You!
        </h2>
        <p className="text-center text-[#666F96] mb-2 font-normal text-[20px]">
          Once your payment is received, we will process your request and update you via email
        </p>
      </div>
      <div className="flex flex-col flex-grow justify-center">
        {/* <Link to="/transactions"> */}
        <Link to="/homepage">
          <div className=" my-auto">
            <button
              type="submit"
              className="text-[16px] text-white w-[295px] h-[50px] rounded-[14px] bg-[#222222] mx-auto shadow"
            >
              Done
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
