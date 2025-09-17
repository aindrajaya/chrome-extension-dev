import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MoneyFlyImg from "./assets/vector image.png"; // Make sure this image exists
import TimeImg from "./assets/timeImg.svg"
import CheckCircle from "./assets/tick.png"; // Make sure this image exists
import axiosInstance from "./services/axiosConfig";
import backArrow from "./assets/Vector.png";

const RequestSaved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [payeeData, setPayeeData] = useState(null);

  // Fetch payee data for display
  const fetchPayeeData = useCallback(async () => {
    try {
      const response = await axiosInstance.post(`get-transaction`, {
        transaction_id: id,
      });
      if (response?.data?.success === true) {
        setPayeeData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPayeeData();
    }
  }, [id, fetchPayeeData]);

  // Fallbacks for demo if no data
  const amount = payeeData?.sending_amount || "472.00";
  const currency = "EUR";
  const payee = payeeData?.payee_name || "Black Brewing GmbH";

  return (
    <div className="flex flex-col h-full bg-white items-center justify-between py-0">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-4 pt-6 pb-2">
          <Link to="/homepage">
            <div className="">
              <img alt="backArrow" src={backArrow} />
            </div>
          </Link>
          <span className="font-medium text-[17px] text-center flex-1">Request Saved</span>
          <span className="w-8" />
        </div>
        {/* Image and checkmark */}
        <div className="flex flex-col items-center mt-8 mb-2">
          <img src={TimeImg} alt="Money flying" className="w-[120px] h-[100px] mb-2" style={{objectFit:'contain'}} />
          <div className="w-[48px] h-[48px] rounded-full bg-[#3DDC97] flex items-center justify-center mb-2">
            <img src={CheckCircle} alt="Check" className="w-[24px] h-[24px]" />
          </div>
        </div>
        {/* Amount and payee */}
        <div className="flex flex-col items-center mt-2 mb-2">
          <span className="text-2xl font-bold text-[#222] leading-none">{amount} <span className="text-[18px] font-normal">{currency}</span></span>
          <span className="text-xl text-[#666] mt-1 mb-1">to</span>
          <span className="text-l font-semibold text-[#222] mb-2">{payee}</span>
        </div>
        {/* Explanatory text */}
        <div className="flex flex-col items-center px-8 mt-2 mb-2">
          <span className="text-sm text-[#222] text-center">
            Your request has been saved and is now<br />waiting deposit.<br />
            The rates will hold for 5 minutes and will<br />need to be repriced thereafter.
          </span>
        </div>
      </div>
      {/* Home button */}
      <div className="w-full flex justify-center mb-8 mt-8">
        <button
          onClick={() => navigate("/homepage")}
          className="w-[90%] max-w-[340px] h-[48px] rounded-[14px] bg-[#222222] text-white text-[17px] font-medium shadow"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default RequestSaved;