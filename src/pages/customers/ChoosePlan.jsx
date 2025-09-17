import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";

const ChoosePlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const type = searchParams.get("type"); // Get the 'type' parameter
  const email = searchParams.get("email");
  const encryptedUserType  = searchParams.get("user_type");
  let user_type = ""
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // const onSubmit = (data) => {

  // };
  try {
    user_type = atob(decodeURIComponent(encryptedUserType ));
  } catch (error) {
    console.error("Error decrypting user_type:", error);
  }
  const defaultPlan = user_type === "customer"? 1:3
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan); 

  const plans = user_type === "customer"
  ? [
      {
        id: 1,
        label: "Start Pack",
        des: "2 FREE transactions weekly",
        price: "£99",
        color: "#4DD0F1",
      },
      {
        id: 2,
        label: "Pro Pack",
        des: "5 FREE transactions weekly",
        price: "£299",
        color: "#4DD771",
      },
    ]
  : user_type === "partner"
  ? [
      {
        id: 3,
        label: "Branding",
        des: "Add your firm’s logo",
        price: "£299",
        color: "rgb(252,166,89)",
      },
    ]
  : []; 

  

  const submitPlan = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `accountant-users/purchasing-plan`,
        {
          email: email,
          accountant_purchasing_plan_id: id,
        }
      );
      console.log(response,'responseresponse')
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate(`/success`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans?.find((plan) => plan?.id === selectedPlan);

  return (
    <>
      {loading && <Spineer />}
      <div className="flex flex-col h-full">
        <div className="flex items-center pb-2">
          <Link to={`/verify-email?email=${email}`}>
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
              Choose your plan 
            </h5>
          </div>
        </div>
        <div className="bg-white rounded-[14px]  py-[14px] shadow h-full flex flex-col">
          <div className="h-full flex flex-col">
            <div className="px-[20px] flex flex-col h-full justify-evenly">
              {/* <div className=""> */}
              {plans?.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan?.id);
                    submitPlan(plan?.id);
                  }}
                  // onClick={() => setSelectedPlan(plan.id)}
                  className={`h-[55px] px-[25px] flex  justify-between items-center py-[6px] rounded-[10px] mx-auto w-[281px] cursor-pointer ${plan?.id !=3 ? `bg-[${plan?.color}]`:"bg-[rgb(252,166,89)]"}
                      `}
                >
                  <div className="">
                    <p className="font-bold text-[20px] text-[#000000] mb-0">
                      {plan.label}
                    </p>
                    <p className="font-normal text-[12px] text-[#000000] mb-0">
                      {plan.des}
                    </p>
                  </div>
                  <div>
                    <p className="font-normal text-[24px] text-[#000000] mb-0">
                      {plan.price}
                    </p>
                  </div>
                </div>
              ))}
              {/* </div> */}
              <div className="px-8">
                <div className="text-xl mb-4 font-semibold">
                  <h4 className="text-[#212058] text-[20px] font-medium">
                    {/* Senda Ventures Ltd */}
                    &nbsp;
                  </h4>
                </div>
                <div className="text-[#212058] text-[16px] font-medium">
                  {/* <span>Bank: </span>
                  <span>Barclays Twickenham</span> */}
                  &nbsp;
                </div>
                <div className="text-[#212058] text-[16px] font-medium">
                  {/* <span>Sort code: </span>
                  <span>563076</span> */}
                  &nbsp;
                </div>
                <div className="text-[#212058] text-[16px] font-medium">
                  {/* <span>Account: </span>
                  <span>2608260876</span> */}
                  &nbsp;
                </div>
              </div>
              <div className="mt-[4px]">
                <p className="text-[32px] text-[#212058] text-center font-medium">
                  {currentPlan?.price + ".00"}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-auto px-[20px]">
              <button
                type="button"
                onClick={() => {
                  navigate(`/success`);
                }}
                className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow 
                  `}
                //   ${
                //   loading ? "opacity-70" : "opacity-100"
                // }
                // disabled={loading}
              >
                Skip
                {/* {loading ? "Please wait..." : "Skip"} */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChoosePlan;
