import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./assets/logo1.png";
import SendaWord from "./assets/senda-word-b 1.png";
import NumberEmo from "./assets/number-emo.png";
const BACKEND_IMAGE_URL = import.meta.env.VITE_APP_BACKEND_IMAGE_URL;

const PassCode = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState([]);
  const [error, setError] = useState(""); // Track error message
  const dail = [1, 2, 3, 4, 5, 6, 7, 8, 9, NumberEmo, 0, "x"];

  // Handle the dial number input
  const handleDial = (value) => {
    if (count.length < 4 && typeof value === "number") {
      setCount((prevCount) => [...prevCount, value]);
      setError("");
    }
  };

  // Handle the backspace functionality
  const handleBackspace = () => {
    setCount((prevCount) => prevCount.slice(0, -1));
    setError("");
  };

  const data = [
    {
      id: 1,
      sName: "BB",
      payeeName: "BonneBouffe",
      status: "PROCESSING",
      sendAmount: "1287.00",
      color: "#4DD771",
    },
    {
      id: 2,
      sName: "FH",
      payeeName: "Felipe Harris SL",
      status: "PROCESSING",
      sendAmount: "568.00",
      color: "#7C95FF",
    },
    {
      id: 3,
      sName: "LF",
      payeeName: "La Panier Francais",
      status: "COMPLETED",
      sendAmount: "568.00",
      color: "#FCA659",
    },
  ];

  const data2 = [
    {
      id: 1,
      sName: "FP",
      payeeName: "French Providore",
      status: "COMPLETED",
      sendAmount: "1142.00",
      color: "#FF7E60",
    },
    {
      id: 2,
      sName: "FH",
      payeeName: "Felipe Harris SL",
      status: "COMPLETED",
      sendAmount: "742.00",
      color: "#7C95FF",
    },
    {
      id: 3,
      sName: "BB",
      payeeName: "BonneBouffe",
      status: "COMPLETED",
      sendAmount: "681.00",
      color: "#4DD771",
    },
  ];

  const handleSubmit = () => {
    const passcode = count.join("");
    if (passcode === "3578") {
      localStorage.setItem("payeesData1", JSON.stringify(data));
      localStorage.setItem("payeesData2", JSON.stringify(data2));
      localStorage.removeItem("payees");
      // navigate("/transactions");
      navigate("/homepage");
    } else {
      setError("Incorrect passcode.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      } else if (event.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [count]);

  const [partnerData, setPartnerData] = useState({});

  const fetchPayeeData = useCallback(() => {
    const partnerData = JSON.parse(localStorage.getItem("partnerData")) || {};

    setPartnerData(partnerData);
  }, []);

  useEffect(() => {
    fetchPayeeData();
  }, [fetchPayeeData]);

  return (
    // <div className="">
    <div className="flex flex-col h-full bg-white rounded-[14px] px-[20px] py-[14px] shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {partnerData?.logo ? (
            <div className="rounded-full w-[47px] h-[47px] flex justify-center items-center overflow-hidden">
              <img
                alt="Logo"
                src={BACKEND_IMAGE_URL + partnerData?.logo}
              />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-black w-[47px] h-[47px] flex justify-center items-center overflow-hidden">
                <img
                  alt="Logo"
                  src={Logo}
                />
              </div>
              <div className="ms-[6px]">
                <img alt="SendaWord" src={SendaWord} />
              </div>
            </>
          )}
        </div>
        {/* <Link to="/" className="text-black hover:text-black"> */}

        <p
          onClick={handleSubmit}
          className="text-center font-medium text-[14px] cursor-pointer text-[#222222]"
        >
          Login
        </p>
        {/* </Link> */}
      </div>
      <h4 className="text-center font-medium text-[20px] text-[#212058]">
        {partnerData?.name || "Payton Parks"}
      </h4>
      <p className="text-center font-normal text-[16px] text-[#212058]  mb-[10px]">
        {partnerData?.email || "paytonparks@mail.com"}{" "}
      </p>
      <div className="flex justify-center items-center gap-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-[8px] h-[8px] rounded-full ${
              index < count.length ? "bg-[#212058]" : "bg-[#d3d2de]"
            }`}
          ></div>
        ))}
      </div>
      <div className="px-16 py-2">
        <div className="flex justify-end items-center pb-3 text-sm h-4 mt-1">
          {error && (
            <div className="text-center text-red-500 flex-grow">{error}</div>
          )}

          {/* <span
            onClick={handleBackspace}
            className="w-6 h-6 flex justify-center items-center rounded-full bg-black text-white cursor-pointer pb-1 hover:bg-gray-600 active:bg-gray-700"
          >
            &#x2190;
          </span> */}
        </div>
      </div>
      <div className="w-[220px] mx-auto">
        <div className="grid grid-cols-3 place-items-center gap-3 pb-[10px]">
          {dail?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => handleDial(item)}
                className="cursor-pointer flex justify-center items-center border border-[#CED3EC] rounded-[14px] w-[65px] h-[65px] font-normal hover:bg-[#F2F4FA] text-[#212058] text-[24px]"
              >
                {index === 9 ? <img alt="" src={item} /> : item}
              </div>
            );
          })}
        </div>
      </div>
      <div className="my-auto">
        <p className="text-center font-medium text-[14px] text-[#222222]">
          Lost your password?
        </p>
        <Link to="/" className="w-full text-black hover:text-black">
          <p className="text-center font-medium text-[14px] mt-1">
            Switch User
          </p>
        </Link>
      </div>
      <div className="flex justify-between items-center gap-3 px-6 mt-2">
        {/* <Link to="/" className="w-full">
          <div className="text-center">
            <button className="w-full py-2 px-4 bg-[#f1f5f6] text-black font-semibold rounded-lg hover:bg-[#d1d8da] focus:outline-none focus:ring-opacity-50">
              Back
            </button>
          </div>
        {/* <Link to="/" className="w-full">
        </Link> */}
        {/* <Link to="/transactions" className="w-full"> */}
        {/* <div className="text-center w-full" onClick={handleSubmit}>
          <button className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-opacity-50">
            Submit
          </button>
        </div> */}
        {/* </Link> */}
      </div>
    </div>
    // </div>
  );
};

export default PassCode;
