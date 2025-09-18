import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import SuccessImg from "../../../assets/success.png";
import backArrow from "../../../assets/Vector.png";

const AccountantKeyPartner = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const newRoute = queryParams.get("newRoute");
  const navigate = useNavigate();

  const [payeeData, setPayeeData] = useState(null);

  // Fetch the specific payee by ID from localStorage
  const fetchPayeeData = useCallback(() => {
    const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
    const payee = savedPayees.find((payee) => payee?.id === parseInt(id));
    if (payee) {
      setPayeeData(payee);
    }
  }, [id]);

  // Call fetchPayeeData when `id` changes
  useEffect(() => {
    if (id) {
      fetchPayeeData();
    }
  }, [id, fetchPayeeData]);

  const onSubmit = (data) => {
    console.log(data);
    // Your form submission logic here
  };

  const changeRoute = () => {
    navigate("/upload-logo");
  };

  // Define transactions state to hold data and colors

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center pb-2">
        <Link to={"/sign-in"}>
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
            Accountant Key
          </h5>
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="text-center  bg-white rounded-[14px] shadow px-[20px] py-[14px]">
          <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[10px]">
            Do you want your clients to see your logo?
          </p>
          <p className="mb-0 text-[16px] font-normal text-[#666F96] mt-[30px]">
            It costs £299 to setup,
          </p>
          <p className="mb-0 text-[16px] font-normal text-[#666F96]">
            and £99 each year after
          </p>
        </div>
        <div className="grow flex flex-col">
          <div onClick={()=>{
            navigate("/generate-key");
          }} className="mx-auto w-[208px] rounded-[8px] h-[34px] mt-[132px]  cursor-pointer bg-[#F0D433] flex justify-center items-center">
            <p className="mb-0  text-[14px] font-medium text-[#222222] ">
            Yes please generate my key
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-auto">
          <button
            onClick={() => {
              changeRoute();
            }}
            className="text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow"
          >
           No I don’t
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountantKeyPartner;
