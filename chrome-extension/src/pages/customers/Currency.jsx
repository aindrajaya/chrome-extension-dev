
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";
import { useRegistration } from "../../context/RegsitrationContext";

const Currency = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registration } = useRegistration();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [currencyData, setCurrencyData] = useState(null);
  const [loading2, setLoading2] = useState(false);

  // Use registration context for all required data
  const data = registration;
  const email = registration?.email;

  console.log("DATA PROVIDED: ",registration)

  const onSubmit = async () => {
    if (!email) {
      toast.error("User email not found. Please complete registration.");
      return;
    }
    if (selectedCurrencies.length === 0) {
      toast.error("The currencies field is required.");
      return;
    }
    
    // Ensure selectedCurrencies contains only strings
    const validatedCurrencies = selectedCurrencies.filter(c => typeof c === 'string' && c.length > 0);
    
    console.log("📊 Preparing account registration data for Success page:", {
      registration: registration,
      selectedCurrencies,
      validatedCurrencies,
      currenciesAreStrings: validatedCurrencies.every(c => typeof c === 'string')
    });

    if (validatedCurrencies.length === 0) {
      toast.error("Please select at least one valid currency.");
      return;
    }

    // Prepare EqualsMoney account registration data according to OpenAPI spec
    const firstName = registration.f_name || registration.adminName?.split(' ')[0] || '';
    const lastName = registration.l_name || registration.adminName?.split(' ').slice(1).join(' ') || '';
    const companyName = registration.companyName || 'Unknown Company';
    const companyNumber = registration.companyNumber || '';
    const address = registration.address || 'Unknown Address';
    const adminPhone = registration.adminPhone || registration.phoneNo || '';

    const accountRegistrationData = {
      market: registration.country === "gb" ? "UK" : "EU",
      features: ["payments"],
      accountType: "business", // Changed from "Business" to "business"
      contact: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: adminPhone,
        dob: "01/01/1980",
        address: {
          addressLine1: address ? address.split(',')[0] : "Contact Address",
          addressLine2: "",
          townCity: "London",
          postCode: "SW1A 1AA",
          countryCode: registration.country?.toUpperCase() || "GB"
        }
      },
      account: {
        companyName: companyName,
        companyNumber: companyNumber,
        incorporationDate: "2020-01-01",
        type: "ltd",
        website: "https://www.example.com",
        onboardingDetail: "Chrome extension registration",
        address: {
          addressLine1: address ? address.split(',')[0] : "Business Address",
          addressLine2: "",
          townCity: "London",
          postCode: "SW1A 1AA",
          countryCode: registration.country?.toUpperCase() || "GB"
        }
      },
      kyc: {
        mainPurpose: ["Investment"],
        sourceOfFunds: ["salary"],
        destinationOfFunds: [registration.country?.toUpperCase() || "GB"],
        currenciesRequired: validatedCurrencies, // Use validated string array
        annualVolume: "Less than £10,000",
        numberOfPayments: "Fewer than 5 payments"
      }
    };

    console.log("📤 Storing account registration data for Success page:", accountRegistrationData);

    // Store the account registration data in localStorage for the Success page
    localStorage.setItem("accountRegistrationData", JSON.stringify(accountRegistrationData));
    
    // Navigate to success page
    toast.success("Registration data prepared successfully!");
    navigate("/success");
  };

  const handleCheckboxChange = (code) => {
    setSelectedCurrencies((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const fetchCurrencyData = useCallback(async () => {
    setLoading2(true);
    try {
      console.log('🔍 Fetching currencies from OpenAPI endpoint...');
      
      // Use the OpenAPI endpoint for currencies (Development Mode - No Auth Required)
      const response = await authService.getSupportedCurrencies();
      console.log('📦 Currency API Response:', response);
      
      if (response?.success === true) {
        setCurrencyData(response.currencies);
        console.log("✅ Currencies loaded successfully:", response.currencies);
        toast.success(response.message || "Currencies loaded successfully");
      } else {
        console.warn('⚠️ Currency API returned unsuccessful response:', response);
        toast.error(response?.message || "Failed to load currencies");
      }
    } catch (error) {
      console.error("❌ Currency fetch error:", error);
      console.log("🔄 Using fallback currency data for development...");
      
      // Fallback currencies if API fails
      const fallbackCurrencies = [
        { code: "GBP", name: "British Pound Sterling", enabled: true },
        { code: "USD", name: "US Dollar", enabled: true },
        { code: "EUR", name: "Euro", enabled: true },
        { code: "CAD", name: "Canadian Dollar", enabled: true },
        { code: "AUD", name: "Australian Dollar", enabled: true },
        { code: "CHF", name: "Swiss Franc", enabled: true },
        { code: "JPY", name: "Japanese Yen", enabled: true }
      ];
      
      setCurrencyData(fallbackCurrencies);
      toast.success("Fallback currencies loaded for development");
    } finally {
      setLoading2(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);


  return (
    <>
      {loading2 && <Spineer />}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center pb-2">
            <Link to={-1}>
              <div className="">
                <img alt="backArrow" src={backArrow} />
              </div>
            </Link>
            <div className="flex-grow">
              <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058] ">
                {/* {type === "business" ? "Sign up" : ""} */}
                Currencies
              </h5>
            </div>
          </div>
          <div className="h-full flex flex-col">
            <div className=" bg-white rounded-[14px] py-[5px] shadow">
              <div className="mx-[25px] my-[20px]">
                <div className="max-h-[400px] min-h-[400px] overflow-y-auto divide-y divide-gray-200">
                  {currencyData?.map((currency) => {
                    // Use 'code' field as per OpenAPI spec, fallback to 'currency_code' for compatibility
                    const currencyCode = currency.code || currency.currency_code;
                    const currencyName = currency.name;
                    const checked = selectedCurrencies.includes(currencyCode);
                    
                    return (
                      <div
                        key={currencyCode}
                        className="grid grid-cols-[40px_70px_1fr_30px] items-center px-4 py-3 hover:bg-gray-50"
                      >
                        {/* Flag - use fallback if flag_image not available */}
                        {currency.flag_image ? (
                          <img
                            src={`https://app.senda.ventures/public/${currency.flag_image}`}
                            alt={currencyCode}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">
                            {currencyCode?.substring(0, 2)}
                          </div>
                        )}

                        {/* Code */}
                        <div className="text-[12px] bg-[#EDF7FF] px-2 py-[2px] rounded text-center w-fit">
                          {currencyCode}
                        </div>

                        {/* Name */}
                        <div className="text-[14px] font-medium truncate">
                          {currencyName}
                        </div>

                        {/* Custom Checkbox */}
                        <label className="relative flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxChange(currencyCode)}
                            className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                          />
                          <span
                            className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center
                              ${checked ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}
                              transition-colors duration-200
                            `}
                          >
                            {checked && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col ">
              <div className="flex justify-between px-[20px] mt-auto">
                <button
                  type="submit"
                  className="text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Currency;
