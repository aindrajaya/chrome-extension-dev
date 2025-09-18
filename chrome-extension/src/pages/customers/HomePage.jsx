import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../../assets/Vector.png";
import plusIcon from "../../assets/+.png";
import searchIcon from "../../assets/search-icon.svg";
import profile from "../../assets/profile.svg";

const todoItems = [
  {
    initials: "BF",
    name: "Black Brewing GmbH",
    status: "PENDING",
    color: "#55D6F6",
    amount: "472.00",
    currency: "EUR",
    statusColor: "#FF7A59",
    countdown: "3:47"
  },
  {
    initials: "FP",
    name: "French Providore",
    status: "PENDING",
    color: "#55D6F6",
    amount: "967.00",
    currency: "EUR",
    statusColor: "#21C628",
    isReprice: true
  }
];

const recentPayees = [
  { initials: "BF", name: "Black Brewing GmbH", color: "#55D6F6", amount: "967.00", currency: "EUR", status: "PENDING" },
  { initials: "FP", name: "French Providore", color: "#FF9B7A", amount: "967.00", currency: "EUR", status: "COMPLETED" },
  { initials: "BB", name: "BonneBouffe", color: "#5EDB8A", amount: "967.00", currency: "EUR", status: "CANCELLED" },
  { initials: "FH", name: "Felipe Harris SL", color: "#7A8BFF", amount: "967.00", currency: "EUR", status: "COMPLETED" },
  { initials: "LF", name: "La Panier Francais", color: "#FFC47A", amount: "967.00", currency: "EUR", status: "DECLINED" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // Clear all authentication tokens and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.clear();
    
    // Navigate to login or home page
    navigate('/sign-in');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  // Placeholder for filtered results
  const allItems = [...todoItems, ...recentPayees];
  const filteredResults = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center pb-2">
        <button onClick={() => navigate(-1)} className="mr-2">
          <img alt="backArrow" src={backArrow} />
        </button>
        <div className="flex-grow flex items-end justify-center mb-2">
          <h5 className="flex-grow text-center font-medium text-[16px] mb-0 text-[#212058] ">
            Home
          </h5>
          <button 
            onClick={handleLogout}
            className="text-[#FF3B30] text-sm font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Search */}
      <div className="flex justify-center items-end mb-4">
        <div className="flex-grow border-b flex items-end relative">
          <img alt="" src={searchIcon} className="mb-2 mr-0" />
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 rounded-lg bg-transparent pb-1 focus:outline-none"
          />
          {/* Dropdown */}
          {showDropdown && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 text-[14px] bg-white border rounded-sm shadow z-10">
              {filteredResults?.map((item, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchTerm(item.name);
                    setShowDropdown(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
          {showDropdown && filteredResults.length === 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10 p-2 text-gray-500 text-[14px]">
              No results found
            </div>
          )}
        </div>
      </div>
      {/* To Do */}
      <div className="px-5 mt-2">
        <div className="font-bold text-[15px] mb-2">To Do</div>
        {todoItems.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2"
            onClick={() => navigate("/deposit")}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-3" style={{background:item.color, color:'#fff', fontWeight:'bold', fontSize:'18px'}}>{item.initials}</div>
            <div className="flex-1">
              <div className="font-medium text-[15px]">{item.name}</div>
            </div>
            {item.status === 'PENDING' && (
              <span 
                className="text-[#FF3B30] font-bold cursor-pointer text-xs mr-3"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle cancel action here
                  console.log('Cancel clicked for:', item.name);
                }}
              >
                CANCEL
              </span>
            )}
            <div className="text-right">
              <div className="font-bold text-[15px]">{item.amount} {item.currency}</div>
              <div className="flex items-center justify-end gap-2 text-xs mt-1">
                <span className="font-bold" style={{color: item.isReprice ? '#FF7A59' : '#21C628'}}>
                  {item.isReprice ? 'REPRICE' : 'DEPOSIT'}
                </span>
                {item.countdown && (
                  <span className="font-bold text-[#FF7A59]">{item.countdown}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <hr className="border-t border-[#E5E5E5] my-4" />
      </div>
      {/* Recent Payees */}
      <div className="px-5">
        <div className="font-bold text-[15px] mb-2">Recent Payees</div>
        {recentPayees.map((item, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{background:item.color, color:'#fff', fontWeight:'bold', fontSize:'15px'}}>{item.initials}</div>
            <div className="flex-1">
              <div className="font-medium text-[15px]">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[15px]">{item.amount} {item.currency}</div>
              <div className="text-xs mt-1">
                <span className="font-bold" style={{
                  color: item.status === 'PENDING' ? '#FF7A59' : 
                         item.status === 'COMPLETED' ? '#21C628' : 
                         item.status === 'CANCELLED' ? '#FF3B30' : 
                         item.status === 'DECLINED' ? '#FF3B30' : '#666'
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="px-5 mt-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Add New Payee Section */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/payee-country")} 
              className="cursor-pointer w-[40px] h-[40px] rounded-full bg-[#222222] text-white flex justify-center items-center"
            >
              <img alt="plus" src={plusIcon} className="w-5 h-5" />
            </button>
            <span className="text-[15px] font-medium">Add New Payee</span>
          </div>
          
          {/* Settings Button */}
          <button 
            onClick={() => navigate("/profile")}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full border border-gray-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.08-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="#666"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Action Button */}
      {/* <div className="w-full flex justify-center mt-6 mb-4">
        <button className="w-[320px] h-[48px] rounded-[10px] bg-[#3DDC97] text-white text-[17px] font-bold shadow-md">Please Reprice or Cancel</button>
      </div> */}
    </div>
  );
};

export default HomePage;
