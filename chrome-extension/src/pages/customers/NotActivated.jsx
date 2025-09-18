import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProcessingImg from "../../assets/img-processing.png";
import SuccessImg from "../../assets/img-success.png";
import DeclinedImg from "../../assets/x-button.png"; // Using x-button for declined state

const NotActivated = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending"); // Default to pending

  // Get status from URL params or localStorage
  useEffect(() => {
    const statusParam = searchParams.get("status");
    const storedStatus = localStorage.getItem("accountStatus");
    
    if (statusParam && ["success", "pending", "declined"].includes(statusParam)) {
      setStatus(statusParam);
    } else if (storedStatus && ["success", "pending", "declined"].includes(storedStatus)) {
      setStatus(storedStatus);
    }
  }, [searchParams]);

  // Content configuration for each status
  const statusConfig = {
    pending: {
      image: ProcessingImg,
      title: "Pending",
      description: "Click below to check what is required to complete ID and activate your account or contact us at helpdesk@senda.ventures",
      primaryButton: {
        text: "Check status",
        action: () => navigate("/profile"),
        style: "px-2 py-1 rounded-[8px] bg-[#F0D433] text-[#222222] text-[15px] font-medium shadow-none mb-[32px] w-[220px]"
      },
      secondaryButton: {
        text: "Later",
        action: () => navigate("/"),
        style: "text-[16px] font-medium text-white w-full h-[40px] rounded-[14px] bg-[#222222] shadow"
      }
    },
    declined: {
      image: ProcessingImg,
      title: "Declined",
      description: "TThe documents you submitted have not passed. Please upload other documents or contact us at helpdesk@senda.ventures",
      primaryButton: {
        text: "Upload New Documents",
        action: () => navigate("/kyc"),
        style: "px-2 py-1 rounded-[8px] bg-[#EF4444] text-white text-[15px] font-medium shadow-none mb-[32px] w-[220px]"
      },
      secondaryButton: {
        text: "Contact Support",
        action: () => window.open("mailto:helpdesk@senda.ventures", "_blank"),
        style: "text-[16px] font-medium text-white w-full h-[40px] rounded-[14px] bg-[#666F96] shadow"
      }
    },
    success: {
      image: ProcessingImg,
      title: "Success",
      description: "Congratulations and welcome to Senda. Your account is now active and ready to use.\nYou may now Login",
      primaryButton: {
        text: "Login",
        action: () => navigate("/login"),
        style: "px-2 py-1 rounded-[8px] bg-[#10B981] text-white text-[15px] font-medium shadow-none mb-[32px] w-[220px]"
      },
      secondaryButton: {
        text: "Go to Homepage",
        action: () => navigate("/homepage"),
        style: "text-[16px] font-medium text-white w-full h-[40px] rounded-[14px] bg-[#212058] shadow"
      }
    }
  };

  const currentConfig = statusConfig[status];

  return (
    <div className="flex flex-col h-full bg-white rounded-[20px] px-[24px] py-[0px] shadow justify-center items-center">
      <div className="flex flex-col items-center justify-center flex-grow w-full mt-[40px]">
        <img
          alt={currentConfig.title}
          src={currentConfig.image}
          className="mx-auto mb-[32px] mt-[16px] w-[80px] h-[80px]"
          style={{ objectFit: "contain" }}
        />
        <span className={`text-center text-xl font-bold mb-[16px] ${
          status === 'success' ? 'text-[#10B981]' : 
          status === 'declined' ? 'text-[#EF4444]' : 
          'text-[#212058]'
        }`}>
          Status: {currentConfig.title}
        </span>
        <p className="text-center text-sm font-normal text-[#222222] mb-[32px] px-[8px]">
          {currentConfig.description.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < currentConfig.description.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
        {status === 'success' ? (
            <button
              onClick={currentConfig.primaryButton.action}
              className={currentConfig.primaryButton.style}
              style={{ boxShadow: status === 'pending' ? "0px 2px 8px 0px #F0D43333" : "none" }}
            >
              {currentConfig.primaryButton.text}
            </button>
          ):(
            null
          )
        }
      </div>
      {status === 'success' ? (
        <div className="w-full flex justify-center mb-[32px]">
          <button
            onClick={currentConfig.secondaryButton.action}
            className={currentConfig.secondaryButton.style}
            style={{ maxWidth: "340px" }}
          >
            {currentConfig.secondaryButton.text}
          </button>
        </div>
      ):
        null
      }
      
      
      {/* Demo buttons for testing different states - remove in production */}
      <div className="w-full flex justify-center gap-2 mb-[16px]">
        <button 
          onClick={() => setStatus('pending')}
          className="px-2 py-1 text-xs bg-gray-200 rounded"
        >
          Pending
        </button>
        <button 
          onClick={() => setStatus('declined')}
          className="px-2 py-1 text-xs bg-gray-200 rounded"
        >
          Declined
        </button>
        <button 
          onClick={() => setStatus('success')}
          className="px-2 py-1 text-xs bg-gray-200 rounded"
        >
          Success
        </button>
      </div>
    </div>
  );
};

export default NotActivated;
