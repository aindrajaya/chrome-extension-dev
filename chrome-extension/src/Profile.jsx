import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { format, isToday } from "date-fns";
import backArrow from "./assets/backArrowWhite.png";
import Spineer from "./components/Spineer";
import transactions from "./assets/transaction-icon.png";
import payees from "./assets/payees-icon.png";
import companyInfo from "./assets/company-info-icon.png";
import team from "./assets/team-icon.png";
import helpDesk from "./assets/helpdesk-icon.png";
import bank from "./assets/bank-icon.png";
import terms from "./assets/tos-icon.png";
import { logout } from "./services/Apis";
import toast from "react-hot-toast";
import axiosInstance from "./services/axiosConfig";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accountantUser = JSON.parse(localStorage.getItem("accountantUser")) || {};

  const [subscriptionCheck, setSubscriptionCheck] = useState("0");
  const [loading, setLoading] = useState(false);

    // Fetch the specific payee by ID from localStorage
    const fetchPayeeData = useCallback(async () => {
      setLoading(true); // Set loading true when the API call starts
      try {
        const response = await axiosInstance.get(`get-founding-member-setting`);
        if (response?.data?.success === true) {
          // console.log(response?.data?.data,"looopp")
          setSubscriptionCheck(response?.data?.data);
          // toast.success(response?.data?.message);
          // Your other logic can go here
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading false when the API call finishes
      }
    }, []); // This ensures the function is memoized based on `id`
  
    useEffect(() => {
      // if (id) {
      fetchPayeeData(); // Trigger fetchPayeeData only when `id` is available
      // }
    }, [fetchPayeeData]);


    // console.log(subscriptionCheck,"subscriptionChecksubscriptionCheck")

    const cards = [
      {
        text: "Transactions",
        icon: transactions,
        color: "#DDF4E3",
        rightText: "",
        link: accountantUser?.user_type !== "partner_user" ? "/profile-transactions" : undefined,
      },
      {
        text: "Payees",
        icon: payees,
        color: "#DBF3F9",
        rightText: "",
        link: "/profile-payee"
      },
      {
        text: "Company info",
        icon: companyInfo,
        color: "#FEE9E4",
        rightText: "",
        link: "/profile-company"
      },
      {
        text: "Users",
        icon: team,
        color: "#EAEEFF",
        rightText: "",
        link: "/profile-team"
      },
      // subscriptionCheck === "1" ? 
      // {
      //   text: "Subscriptions",
      //   icon: users,
      //   color: "#EAEEFF",
      //   rightText: "",
      // }:null,
      {
        text: "Helpdesk",
        icon: helpDesk,
        color: "#FBE7D5",
        rightText: "",
        link: "/profile-faq"
      },
      {
        text: "Bank",
        icon: bank,
        color: "#E7EAF3",
        rightText: "",
        link: "/profile-bank"
      },
      // {
      //   text: "Terms of service",
      //   icon: terms,
      //   color: "#FFE8FF",
      //   rightText: "",
      // },
      {
        text: "Privacy policy",
        icon: terms,
        color: "#FFE8FF",
        rightText: "",
        link: "/profile-privacy-policy"
      },
    ]?.filter(Boolean);

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-[#000] mb-30" style={{ minHeight: 0, height: '100%' }}>
      {loading && <Spineer />}
      {/* Header section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-[#000] mb-8">
        <div className="flex items-center w-full mb-2">
          <Link to={'/homepage'}>
            <div>
              <img alt="xButton" src={backArrow}/>
            </div>
          </Link>
          {/* X button */}
          {/* <button
            className="ml-2 w-8 h-8 flex items-center justify-center rounded bg-[#F6F6F6] text-[#222] text-[20px] font-bold border border-gray-200 hover:bg-gray-200 transition"
            onClick={() => navigate("/")}
            type="button"
            aria-label="Close"
          >
            &#10005;
          </button> */}
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[18px] mb-0 text-white tracking-wide">
              Profile
            </h5>
          </div>
          <span className="w-8" />
        </div>
        <div className="flex flex-col items-center w-full">
          <h3 className="font-semibold mb-1 text-center text-[20px] text-white">
            {accountantUser?.company_name || "Universal Products Ltd"}
          </h3>
          <p className="font-medium mb-[1px] text-center text-[15px] text-white">
            {accountantUser?.company_number || "17483762"}
          </p>
          <p className="font-normal mb-0 text-center text-[14px] text-white">
            {accountantUser?.address || "42 York St Twickenham TW1 3BW"}
          </p>
        </div>
      </div>
      {/* White card for menu */}
  <div className="flex-1 w-full bg-white pt-6 pb-2 px-0 mt-[-24px] shadow-lg max-h-[700px] overflow-y-auto">
        <div className="pe-2">
          {cards?.map((item, index) => (
            <div
              key={index}
              className={`flex items-center mb-[8px] px-6 py-2 ${item?.link ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (item?.link) {
                  navigate(item.link);
                }
              }}
            >
              <div
                className="w-[38px] h-[38px] rounded-full flex justify-center items-center bg-[#F6F6F6] mr-4"
              >
                <img alt={item?.icon} src={item?.icon} className="w-[22px] h-[22px]" />
              </div>
              <div className="flex-grow">
                <p className="mb-0 font-medium text-[15px] text-[#222]">{item?.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Logout at bottom */}
      <div className="w-full flex justify-center items-center py-6 bg-white">
        <button
          className="text-[16px] font-medium text-[#222] bg-transparent shadow-none outline-none"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("accountantUser");
            toast.success("Logout Successfully");
            localStorage.setItem("lastVisitedRoute", "/sign-in");
            navigate("/sign-in");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
