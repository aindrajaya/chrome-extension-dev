import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { format, isToday } from "date-fns";
import backArrow from "./assets/Vector.png";
import plusIcon from "./assets/+.png";
import searchIcon from "./assets/search-icon.svg";
import Spineer from "./components/Spineer";
import axiosInstance from "./services/axiosConfig";
import toast from "react-hot-toast";
import profile from "./assets/profile.svg";

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const queryParams = new URLSearchParams(location.search);
  // // const status = queryParams.get("status");
  // const [payeeData, setPayeeData] = useState([]);
  // const [data, setData] = useState([]);
  // const [data2, setData2] = useState([]);
  // const navigate = useNavigate();

  // const fetchPayeeData = useCallback(() => {
  //   const savedPayees = JSON.parse(localStorage.getItem("payees")) || [];
  //   const savedData = JSON.parse(localStorage.getItem("payeesData1")) || [];
  //   const savedData2 = JSON.parse(localStorage.getItem("payeesData2")) || [];

  //   setPayeeData(savedPayees);
  //   setData(savedData);
  //   setData2(savedData2);
  // }, []);

  // useEffect(() => {
  //   fetchPayeeData();
  // }, [fetchPayeeData]);

  // MOCK DATA: Uncomment below to use mock data for UI testing
  /*
  const data1 = [
    {
      sName: "FP",
      name: "French Providore",
      status: "DEPOSIT",
      amount: "967.00",
      color: "#FF7E60",
    },
  ];
  const data = [
    {
      sName: "BB",
      name: "BonneBouffe",
      status: "PROCESSING",
      amount: "1287.00",
      color: "#4DD771",
    },
    {
      sName: "FH",
      name: "Felipe Harris SL",
      status: "PROCESSING",
      amount: "568.00",
      color: "#7C95FF",
    },
    {
      sName: "LF",
      name: "La Panier Francais",
      status: "COMPLETED",
      amount: "568.00",
      color: "#FCA659",
    },
  ];
  const data2 = [
    {
      sName: "FP",
      name: "French Providore",
      status: "COMPLETED",
      amount: "1142.00",
      color: "#FF7E60",
    },
    {
      sName: "FH",
      name: "Felipe Harris SL",
      status: "COMPLETED",
      amount: "742.00",
      color: "#7C95FF",
    },
    {
      sName: "BB",
      name: "BonneBouffe",
      status: "COMPLETED",
      amount: "681.00",
      color: "#4DD771",
    },
  ];
  */
  //   },
  //   {
  //     sName: "LF",
  //     name: "La Panier Francais",
  //     status: "COMPLETED",
  //     amount: "568.00",
  //     color: "#FCA659",
  //   },
  // ];

  // const data2 = [
  //   {
  //     sName: "FP",
  //     name: "French Providore",
  //     status: "COMPLETED",
  //     amount: "1142.00",
  //     color: "#FF7E60",
  //   },
  //   {
  //     sName: "FH",
  //     name: "Felipe Harris SL",
  //     status: "COMPLETED",
  //     amount: "742.00",
  //     color: "#7C95FF",
  //   },
  //   {
  //     sName: "BB",
  //     name: "BonneBouffe",
  //     status: "COMPLETED",
  //     amount: "681.00",
  //     color: "#4DD771",
  //   },
  // ];

  const [transactionsData, setTransactionsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // console.log(transactionsData, "transactionsDatatransactionsData");

  // Fetch the specific payee by ID from localStorage
  const fetchPayeeData = useCallback(async () => {
    setLoading(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.post(`customer-transaction-listing`);
      if (response?.data?.success === true) {
        // console.log(response?.data?.data,"looopp")
        setTransactionsData(response?.data?.data);
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

  // console.log(transactionsData, "transactionsDatatransactionsData");

  const [searchTerm, setSearchTerm] = useState(""); // State for the input value
  // const [filteredResults, setFilteredData] = useState([]); // State for the filtered results
  const [showDropdown, setShowDropdown] = useState(false); // To show/hide dropdown
  const [data, setData] = useState([]); // State for holding data fetched from API
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // State for debounced search term

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Set the debounced value after the delay
    }, 500); // Adjust 500ms delay as per your requirement

    // Cleanup the previous timer if the searchTerm changes again before 500ms
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data from API when the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.post("get-payee-customer", {
            search_data: debouncedSearchTerm, // Pass the search term or other params as needed
          });
          if (response?.data?.success === true) {
            setData(response?.data?.data || []);
            // console.log(response?.data?.data,"responseresponse")
          }
          // setData(response.data); // Set fetched data to the state
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setData([]); // Clear data if search term is empty
    }
  }, [debouncedSearchTerm]); // Trigger API request when debouncedSearchTerm changes

  // Function to handle input change and filter data
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Set the search term
    setShowDropdown(value.length > 0); // Show dropdown only when there's input
  };

  // Function to handle selection from the dropdown
  const handleSelect = (item) => {
    setSearchTerm(item.name); // Set the selected name in the input field
    setShowDropdown(false); // Close the dropdown
  };

  // Filter data based on search term after fetching from the API
  const filteredResults = data?.filter((item) =>
    item.payee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(filteredResults,"pppppp");

  const handleCancel = async (delId) => {
    setLoading(true); // Set loading true when the API call starts
    try {
      const response = await axiosInstance.post(`delete-transaction`, {
        transaction_id: delId,
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        fetchPayeeData();
        // console.log(response?.data?.data,"looopp")
        // setTransactionsData(response?.data?.data);
        // Your other logic can go here
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading false when the API call finishes
    }
  };

  return (
    <div className="flex flex-col h-full">
      {loading && <Spineer />}
      <div className="flex items-center pb-2">
        <Link to="/profile">
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow flex items-end justify-center mb-2">
          <h5 className="flex-grow text-center font-medium text-[16px] mb-0 text-[#212058] ">
            Transactions
          </h5>
          <img className="cursor-pointer" onClick={()=>{
            navigate("/profile")
          }} alt="profile" src={profile}/>
        </div>
      </div>
      <div className="flex justify-end items-end mb-4">
        {/* <h3 className="font-semibold mb-2">Transactions</h3> */}

        <div className="flex-grow mr-4 border-b flex items-end relative">
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
                  // onClick={() => handleSelect(item)}
                  onClick={() => {
                    navigate(`/edit-payee?payee_id=${item?.payee_id}`)
                    // navigate(`/enter-amount?id=${item?.payee_id}&newRoute=pay`);
                  }}
                >
                  {item.payee_name}
                </div>
              ))}
            </div>
          )}

          {/* Optionally, show 'No results' when no matches are found */}
          {showDropdown && filteredResults.length === 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10 p-2 text-gray-500 text-[14px]">
              No results found
            </div>
          )}
        </div>
        {/* <Link to="/new-payee"> */}
        <Link to="/payee-country">
          <div className="cursor-pointer w-[40px] h-[40px] rounded-full bg-[#222222] text-white text-2xl flex justify-center items-center">
            <img alt="" src={plusIcon} />
          </div>
        </Link>
      </div>

      <div className="overflow-y-auto">
        <div className="pe-2">
          {transactionsData && Object.keys(transactionsData).length > 0 ? (
            Object?.keys(transactionsData)?.map((dateKey) => {
              const data = transactionsData[dateKey];

              return (
                <div key={dateKey}>
                  <h6 className="text-[#000000] text-[14px] font-bold mb-[14px]">
                    {dateKey} {/* Render the key name directly */}
                  </h6>
                  {data?.length > 0 ? (
                    [...data]?.map((item, index) => (
                      <div
                        key={index}
                        className="flex mb-[14px] cursor-pointer"
                        onClick={() => {
                          navigate(
                            `${
                              item?.status === "deposit"
                                ? `/enter-amount?id=${item?.transaction_id}&payee_id=${item?.payee_id}`
                                : `/enter-amount?id=${item?.transaction_id}&payee_id=${item?.payee_id}`
                            }`
                          );
                        }}
                      >
                        <div
                          className="uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white"
                          style={{ backgroundColor: item.color }}
                        >
                          {item?.payee_name
                            ? `${item.payee_name.split(" ")[0]?.[0] || ""}${
                                item.payee_name.split(" ")[1]?.[0] || ""
                              }`
                            : ""}
                          {/* {item?.payee_name[0]} Initials of payee */}
                        </div>
                        <div className="flex-grow ms-[14px]">
                          <p className="mb-0 text-[14px] text-[#000000]">
                            {item?.payee_name}
                          </p>
                          <p
                            onClick={
                              item?.status === "deposit"
                                ? (e) => {
                                  e.stopPropagation();
                                    navigate(
                                      `/deposit?id=${item?.transaction_id}`
                                    );
                                  }
                                : undefined
                            }
                            className={`mb-0 text-[10px]  font-medium ${
                              item?.status === "deposit"
                                ? "text-[#21C628]"
                                : "text-[#BFBFBF]"
                            }`}
                          >
                            {item?.status.toUpperCase()}
                          </p>
                        </div>
                        {item?.status === "deposit" && (
                          <div>
                            <p
                              className="mb-0 text-[10px] text-[#FF3C3C] font-bold me-[15px] mt-2"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up to the parent click
                                handleCancel(item?.transaction_id); // Call the cancel action
                              }}
                            >
                              CANCEL
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="mb-0 text-[16px] text-[#000000] font-normal">
                            {item?.sending_amount ? item?.sending_amount : "0"}{" "}
                            EUR
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] mb-4 text-[#000000] font-normal">
                      No Transactions
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="mb-0 text-[14px] text-[#000000] text-center mt-4">
              No Transactions found.
            </p>
          )}
        </div>
        {/* <div className="pe-2">
          <h6 className="text-[#000000] text-[14px] font-bold mb-[14px]">
            Today
          </h6>
          {payeeData?.length > 0 ? (
            [...payeeData].reverse()?.map((item, index) => {
              return (
                <div key={index} className="flex mb-[14px] cursor-pointer"
                onClick={() => {
                  navigate(`/enter-amount?id=${item?.id}`);
                }}
                >
                  <div
                    className="uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item?.sName}
                  </div>
                  <div className="flex-grow ms-[14px]">
                    <p className="mb-0 text-[14px] text-[#000000]">
                      {item?.payeeName}
                    </p>
                    <p
                      className={`mb-0 text-[10px] font-medium ${
                        item?.status === "DEPOSIT"
                          ? "text-[#21C628]"
                          : "text-[#BFBFBF]"
                      }`}
                    >
                      {item?.status}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 text-[10px] text-[#FF3C3C] font-bold me-[15px] mt-2">
                      CANCEL
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 text-[16px] text-[#000000] font-normal">
                      {item?.sendAmount} EUR
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-[12px] mb-4 text-[#000000] font-normal">
              No Transactions
            </p>
          )}
        </div> */}

        {/* <div className="pe-2">
          <h6 className="text-[#000000] text-[14px] font-bold mb-[14px]">
            Oct 17, 2024
          </h6>
          {data?.map((item, index) => {
            return (
              <div key={index} className="flex mb-[14px] cursor-pointer"
              onClick={() => {
                navigate(`/enter-amount?id=${item?.id}&get=payeesData1`);
              }}
              >
                <div
                  className="uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item?.sName}
                </div>
                <div className="flex-grow ms-[14px]">
                  <p className="mb-0 text-[14px] text-[#000000]">
                    {item?.payeeName}
                  </p>
                  <p
                    className={`mb-0 text-[10px] font-medium text-[#000000] ${
                      item?.status === "PROCESSING"
                        ? "text-[#FCA659]"
                        : "text-[#BFBFBF]"
                    }`}
                  >
                    {item?.status}
                  </p>
                </div>
                <div>
                  <p className="mb-0 text-[16px] text-[#000000] font-normal">
                    {item?.sendAmount} EUR
                  </p>
                </div>
              </div>
            );
          })}
        </div> */}

        {/* <div className="pe-2">
          <h6 className="text-[#000000] text-[14px] font-bold mb-[14px]">
            Sep 22, 2024
          </h6>
          {data2?.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex mb-[14px] cursor-pointer`}
                onClick={() => {
                  navigate(`/enter-amount?id=${item?.id}&get=payeesData2`);
                }}
              >
                <div
                  className="uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item?.sName}
                </div>
                <div className="flex-grow ms-[14px]">
                  <p className="mb-0 text-[14px] text-[#000000]">
                    {item?.payeeName}
                  </p>
                  <p
                    className={`mb-0 text-[10px] font-medium text-[#000000] ${
                      item?.status === "PROCESSING"
                        ? "text-[#FCA659]"
                        : "text-[#BFBFBF]"
                    }`}
                  >
                    {item?.status}
                  </p>
                </div>
                <div>
                  <p className="mb-0 text-[16px] text-[#000000] font-normal">
                    {item?.sendAmount} EUR
                  </p>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>

      {/* <div className=" mt-4 flex-grow overflow-y-auto">
        {sortedPayeeData.map((item, index) => {
          const transactionDate = new Date(item.date);
          const formattedDate = isToday(transactionDate)
            ? "Today"
            : format(transactionDate, "MMM dd, yyyy");
          const showDateHeader = formattedDate !== lastDate;
          lastDate = formattedDate;

          const nameParts = item?.payeeName ? item.payeeName.split(" ") : [];
          const initials =
            nameParts.length > 1
              ? `${nameParts[0][0]}${nameParts[1][0]}`
              : item.payeeName?.[0] || "";

          return (
            <div key={index}>
              {showDateHeader && (
                <h2 className="font-semibold text-lg mb-2 text-black">
                  {formattedDate}
                </h2>
              )}
              <div
                className={`grid ${
                  item?.status === "Deposit"
                    ? "grid-cols-[0.5fr,2.5fr,1fr,2fr]"
                    : "grid-cols-[0.5fr,2.5fr,2fr]"
                } my-4 cursor-pointer`}
                onClick={() => {
                  handleAdd(item);
                }}
              >
                <div
                  className="my-auto w-10 h-10 rounded-full text-white flex justify-center items-center"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {initials}
                </div>
                <div className="ps-2">
                  <h2 className="font-semibold mb-0">
                    {item?.payeeName || ""}
                  </h2>
                  <p
                    className={` uppercase text-xs font-semibold ${
                      item?.status === "Deposit"
                        ? "text-green-500"
                        : "text-gray-600"
                    }`}
                  >
                    {item?.status || ""}
                  </p>
                </div>
                {item?.status === "Deposit" && (
                  <div className="ps-4 my-auto">
                    <p
                      className={`text-red-500 font-semibold uppercase text-xs`}
                    >
                      Cancel
                    </p>
                  </div>
                )}
                <div className="my-auto">
                  <h2 className="font-medium text-end text-black">
                    {item?.sendAmount} EUR &nbsp; &nbsp;
                  </h2>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Transactions;
