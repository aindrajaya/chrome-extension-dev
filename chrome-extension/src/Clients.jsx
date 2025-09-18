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

const Clients = () => {
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

  // const getRandomColor = () => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  // const handleAdd = (item) => {
  //   if (item?.status === "Completed") {
  //     const nextId = payeeData.length + 1; // Unique ID based on the current length of the data
  //     const newPayee = {
  //       ...item,
  //       id: nextId, // Assign the ID
  //       status: "",
  //       date: new Date().toISOString(), // Date when the payee was created
  //     };

  //     const updatedPayees = [...payeeData, newPayee];
  //     localStorage.setItem("payees", JSON.stringify(updatedPayees)); // Save updated payees list
  //     setPayeeData(updatedPayees); // Update local state
  //     navigate(`/enter-amount?id=${nextId}`);
  //   } else {
  //     navigate(`/enter-amount?id=${item?.id}`);
  //   }
  // };

  // const sortedPayeeData = [...payeeData].sort(
  //   (a, b) => new Date(b.date) - new Date(a.date)
  // );
  // let lastDate = null;

  // const data1 = [
  //   {
  //     sName: "FP",
  //     name: "French Providore",
  //     status: "DEPOSIT",
  //     amount: "967.00",
  //     color: "#FF7E60",
  //   },
  // ];
  // const data = [
  //   {
  //     sName: "BB",
  //     name: "BonneBouffe",
  //     status: "PROCESSING",
  //     amount: "1287.00",
  //     color: "#4DD771",
  //   },
  //   {
  //     sName: "FH",
  //     name: "Felipe Harris SL",
  //     status: "PROCESSING",
  //     amount: "568.00",
  //     color: "#7C95FF",
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
      const response = await axiosInstance.post(`get-clients`);
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
          const response = await axiosInstance.post("get-clients", {
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
        <Link to="/sign-in">
          <div className="">
            <img alt="backArrow" src={backArrow} />
          </div>
        </Link>
        <div className="flex-grow flex items-end justify-center mb-2">
          <h5 className="flex-grow text-center font-medium text-[16px] mb-0 text-[#212058] ">
            Your clients
          </h5>
          <img
            className=" cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
            alt="profile"
            src={profile}
          />
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
            // onChange={handleSearch}
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
                    navigate(`/edit-payee?payee_id=${item?.payee_id}`);
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
        <div className="w-[40px] h-[40px] rounded-full bg-[#222222] text-white text-2xl flex justify-center items-center">
          <img alt="" src={plusIcon} />
        </div>
        {/* </Link> */}
      </div>

      <div className="overflow-y-auto mt-[46px]">
        <div className="pe-2">
          {transactionsData && transactionsData.length > 0 ? (
            transactionsData?.map((item, index) => {
              const randomColor = `#${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`;
              const bgColor = item.color || randomColor;
              return (
                <div key={index}>
                  <div className="flex mb-[14px] cursor-pointer">
                    <div
                      className="uppercase w-[40px] h-[40px] rounded-full flex justify-center items-center text-[20px] text-white"
                      style={{ backgroundColor: bgColor }}
                    >
                      {item?.name
                        ? `${item.name.split(" ")[0]?.[0] || ""}${
                            item.name.split(" ")[1]?.[0] || ""
                          }`
                        : ""}
                      {/* {item?.payee_name[0]} Initials of payee */}
                    </div>
                    <div className="flex-grow ms-[14px]">
                      <p className="mb-0 text-[14px] text-[#000000]">
                        {item?.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="mb-0 text-[14px] text-[#000000] text-center mt-4">
              No Clients found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
