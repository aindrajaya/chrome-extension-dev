import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "./assets/Vector.png";
import authService from "./services/authService";
import toast from "react-hot-toast";

const PayeeCountry = () => {
  const navigate = useNavigate();
  const [currencyData, setCurrencyData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);

  // Default popular currencies to show first
  const popularCurrencies = ["GBP", "EUR", "USD", "NGN"];

  // Example currencies - always available
  const exampleCurrencies = [
    { currency_code: "GBP", currency_name: "British Pound Sterling" },
    { currency_code: "EUR", currency_name: "Euro" },
    { currency_code: "USD", currency_name: "US Dollar" },
    { currency_code: "NGN", currency_name: "Nigerian Naira" },
    { currency_code: "CAD", currency_name: "Canadian Dollar" },
    { currency_code: "AUD", currency_name: "Australian Dollar" },
    { currency_code: "JPY", currency_name: "Japanese Yen" },
    { currency_code: "CHF", currency_name: "Swiss Franc" },
    { currency_code: "SEK", currency_name: "Swedish Krona" },
    { currency_code: "NOK", currency_name: "Norwegian Krone" },
    { currency_code: "DKK", currency_name: "Danish Krone" },
    { currency_code: "PLN", currency_name: "Polish Zloty" },
    { currency_code: "CZK", currency_name: "Czech Koruna" },
    { currency_code: "HUF", currency_name: "Hungarian Forint" },
    { currency_code: "RON", currency_name: "Romanian Leu" },
    { currency_code: "BGN", currency_name: "Bulgarian Lev" },
    { currency_code: "HRK", currency_name: "Croatian Kuna" },
    { currency_code: "RSD", currency_name: "Serbian Dinar" },
    { currency_code: "TRY", currency_name: "Turkish Lira" },
    { currency_code: "ZAR", currency_name: "South African Rand" },
    { currency_code: "KES", currency_name: "Kenyan Shilling" },
    { currency_code: "GHS", currency_name: "Ghanaian Cedi" },
    { currency_code: "EGP", currency_name: "Egyptian Pound" },
    { currency_code: "MAD", currency_name: "Moroccan Dirham" },
    { currency_code: "INR", currency_name: "Indian Rupee" },
    { currency_code: "CNY", currency_name: "Chinese Yuan" },
    { currency_code: "SGD", currency_name: "Singapore Dollar" },
    { currency_code: "HKD", currency_name: "Hong Kong Dollar" },
    { currency_code: "MYR", currency_name: "Malaysian Ringgit" },
    { currency_code: "THB", currency_name: "Thai Baht" },
    { currency_code: "IDR", currency_name: "Indonesian Rupiah" },
    { currency_code: "PHP", currency_name: "Philippine Peso" },
    { currency_code: "VND", currency_name: "Vietnamese Dong" },
    { currency_code: "KRW", currency_name: "South Korean Won" },
    { currency_code: "TWD", currency_name: "Taiwan Dollar" },
    { currency_code: "BRL", currency_name: "Brazilian Real" },
    { currency_code: "ARS", currency_name: "Argentine Peso" },
    { currency_code: "CLP", currency_name: "Chilean Peso" },
    { currency_code: "COP", currency_name: "Colombian Peso" },
    { currency_code: "PEN", currency_name: "Peruvian Sol" },
    { currency_code: "MXN", currency_name: "Mexican Peso" },
    { currency_code: "RUB", currency_name: "Russian Ruble" },
    { currency_code: "UAH", currency_name: "Ukrainian Hryvnia" },
    { currency_code: "ILS", currency_name: "Israeli Shekel" },
    { currency_code: "AED", currency_name: "UAE Dirham" },
    { currency_code: "SAR", currency_name: "Saudi Riyal" },
    { currency_code: "QAR", currency_name: "Qatari Riyal" },
    { currency_code: "KWD", currency_name: "Kuwaiti Dinar" },
    { currency_code: "BHD", currency_name: "Bahraini Dinar" },
    { currency_code: "OMR", currency_name: "Omani Rial" },
    { currency_code: "JOD", currency_name: "Jordanian Dinar" }
  ];

  // Skip API entirely - use only fallback currencies
  console.log('� Using fallback currencies only, skipping API calls');

  // Initialize with example currencies immediately
  useEffect(() => {
    // Set example currencies immediately - skip API entirely
    console.log('🚀 Setting example currencies (skipping API):', exampleCurrencies.length);
    setCurrencyData(exampleCurrencies);
    setLoading(false); // Ensure loading is false
  }, []); // No API fetch dependency

  // Debug: Log currency data changes
  useEffect(() => {
    console.log('📊 Currency data updated:', currencyData.length, currencyData);
  }, [currencyData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency.currency_code);
    setShowDropdown(false);
    
    // Store selected currency in localStorage
    localStorage.setItem("selectedPayeeCurrency", JSON.stringify(currency));
    
    // Navigate to new payee page with currency as URL parameter and state
    navigate(`/new-payee?currency=${currency.currency_code}`, { 
      state: { 
        selectedCurrency: currency,
        fromCurrencySelection: true
      } 
    });
  };

  const getDisplayCurrencies = () => {
    console.log('🔍 getDisplayCurrencies called:', {
      showAllCurrencies,
      currencyDataLength: currencyData.length,
      popularCurrencies,
      currencyData: currencyData.slice(0, 5) // Show first 5 for debugging
    });
    
    if (showAllCurrencies) {
      return currencyData;
    }
    // Show popular currencies that exist in the data
    const filtered = currencyData.filter(currency => 
      popularCurrencies.includes(currency.currency_code)
    );
    
    console.log('🎯 Filtered currencies:', filtered);
    return filtered;
  };

  return (
    <div className="flex flex-col bg-white h-[600px]">
      {/* Header */}
      <div className="flex items-center pt-6 pb-2 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <img alt="backArrow" src={backArrow} />
        </button>
        <div className="flex-grow">
          <h5 className="text-center font-medium text-[18px] mb-0 text-[#222] tracking-wide">
            Choose currency for payee
          </h5>
        </div>
        <span className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start px-6 mt-12">
        {/* Dropdown Menu Label */}
        <div className="text-center mb-8">
          <p className="text-[16px] font-medium text-[#666] mb-6">
            Drop menu
          </p>

          {/* Dropdown Button */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full max-w-[80%] mx-auto flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[8px] px-4 py-3 text-[16px] font-medium text-[#222] hover:border-[#999] transition-colors focus:outline-none focus:border-[#999]"
            >
              <span>{selectedCurrency || "Select Currency"}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown List */}
            {showDropdown && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-[80%] mt-2 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-50">
                {loading ? (
                  <div className="p-4 text-center text-[#666]">
                    Loading...
                  </div>
                ) : (
                  <div className="max-h-[200px] overflow-y-auto">
                    {console.log('🎬 Rendering dropdown, display currencies:', getDisplayCurrencies().length)}
                    {getDisplayCurrencies().length > 0 ? (
                      getDisplayCurrencies().map((currency, index) => (
                        <button
                          key={index}
                          onClick={() => handleCurrencySelect(currency)}
                          className="w-full text-left px-4 py-3 text-[16px] font-medium text-[#222] hover:bg-[#F9FAFB] transition-colors border-b border-[#F0F0F0] last:border-b-0 focus:outline-none focus:bg-[#F9FAFB]"
                        >
                          {currency.currency_code}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-[#666]">
                        <div>No currencies available</div>
                        <div className="text-xs mt-1">Debug: {currencyData.length} total, {getDisplayCurrencies().length} filtered</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Show All Currencies Link */}
        <div className="text-center">
          <button
            onClick={() => {
              setShowAllCurrencies(!showAllCurrencies);
              setShowDropdown(false);
            }}
            className="text-[14px] text-[#666] underline hover:text-[#222] transition-colors focus:outline-none"
          >
            {showAllCurrencies ? "Show popular currencies" : "(Show all available currencies)"}
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-6"></div>
    </div>
  );
};

export default PayeeCountry;
