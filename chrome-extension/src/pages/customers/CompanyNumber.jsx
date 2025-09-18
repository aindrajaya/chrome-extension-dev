import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import editIcon from "../../assets/edit-icon.png";
import axiosInstance from "../../services/axiosConfig";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import Spineer from "../../components/Spineer";

const CompanyNumber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const country = queryParams.get("country"); // Extract country from URL parameters

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue, // Add setValue to control form inputs
    formState: { errors },
  } = useForm();

  const companyNumber = watch("company_number");
  const postCode = watch("post_code");

  const [companyDetails, setCompanyDetails] = useState({});
  const [directorDetails, setDirectorDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postCodeResults, setPostCodeResults] = useState(null);
  const [editedAddress, setEditedAddress] = useState(null); // Track manually edited address
  const [loadingPostcode, setLoadingPostcode] = useState(false);

  const onSubmit = async (data) => {
    if (companyDetails?.company_number) {
      // Use edited address if available, postcode results, or company details address
      const addressToUse = editedAddress?.full_address || 
        postCodeResults?.full_address ||
        (companyDetails?.registered_office_address
          ? [
              companyDetails?.registered_office_address?.address_line_1 || "",
              companyDetails?.registered_office_address?.address_line_2 || "",
              companyDetails?.registered_office_address?.locality || "",
              companyDetails?.registered_office_address?.country || "",
              companyDetails?.registered_office_address?.postal_code || "",
            ]
              .filter(Boolean)
              .join(", ")
          : "");

      // Extract directors names for OpenAPI payload using the correct field name
      const directorsNames = directorDetails.map(director => director.name).filter(Boolean);
      const directorsParam = encodeURIComponent(JSON.stringify(directorsNames));

      navigate(
        `/sign-up?type=${type}&company_number=${companyDetails?.company_number}&company_name=${companyDetails?.company_name}&address=${addressToUse}&directors=${directorsParam}&country=${country}`
      );
    }
  };

  // Check for edited address data when component loads
  useEffect(() => {
    const storedEditedAddress = localStorage.getItem("editedAddress");
    if (storedEditedAddress) {
      try {
        const parsedAddress = JSON.parse(storedEditedAddress);
        setEditedAddress(parsedAddress);
        setPostCodeResults(parsedAddress);
        // Clear the stored data after using it
        localStorage.removeItem("editedAddress");
      } catch (error) {
        console.error("Error parsing edited address:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (companyNumber?.length === 8) {
      callApi(companyNumber);
    }
  }, [companyNumber]);

  // Validate UK postcode format
  const validatePostcode = (postcode) => {
    if (!postcode) return false;
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  };

  // Call postcode lookup API
  const callPostcodeApi = async (postcode) => {
    if (!validatePostcode(postcode)) {
      setPostCodeResults(null);
      return;
    }

    setLoadingPostcode(true);
    try {
      const response = await fetch(`http://localhost:3001/address/lookup/${encodeURIComponent(postcode)}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.address) {
          // Parse the address lines to extract components
          const lines = data.address.lines || [];
          const addressLine1 = lines[0] || "";
          const locality = lines[1] || "";
          const postcode = data.address.postcode || postcode;
          
          setPostCodeResults({
            address_line_1: addressLine1,
            address_line_2: "", // Not provided in this format
            locality: locality,
            postal_code: postcode,
            country: "United Kingdom",
            full_address: data.address.formatted // Store the formatted address for navigation
          });
          toast.success("Postcode lookup successful");
        } else {
          setPostCodeResults(null);
          toast.error("No address found for this postcode");
        }
      } else {
        setPostCodeResults(null);
        toast.error("Postcode lookup failed");
      }
    } catch (error) {
      console.error("Postcode lookup error:", error);
      setPostCodeResults(null);
      toast.error("Postcode lookup service unavailable");
    } finally {
      setLoadingPostcode(false);
    }
  };

  useEffect(() => {
    if (postCode?.length >= 5 && !editedAddress) {
      // Debounce the API call to avoid too many requests
      const timeoutId = setTimeout(() => {
        if (companyDetails?.registered_office_address) {
          // Check if postcode matches company address first
          const addressData = companyDetails.registered_office_address;
          if (addressData.postal_code === postCode) {
            setPostCodeResults({
              address_line_1: addressData.address_line_1 || "",
              address_line_2: addressData.address_line_2 || "",
              locality: addressData.locality || "",
              postal_code: addressData.postal_code || "",
              country: "United Kingdom"
            });
          } else {
            // Call postcode API for different postcode
            callPostcodeApi(postCode);
          }
        } else {
          // No company data, call postcode API directly
          callPostcodeApi(postCode);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else if (postCode?.length < 5) {
      setPostCodeResults(null);
    }
  }, [postCode, companyDetails, editedAddress]);

  const callApi = async (data) => {
    setLoading(true);
    try {
      // Use the new authService method aligned with OpenAPI spec GET /company/data
      const response = await authService.getCompanyData(data);
      
      if (response?.success === true) {
        if (response.data) {
          toast.success(response.message);
          setCompanyDetails(response.data);
          console.log("Full response:", response); // Debug log
          console.log("Director details:", response.director); // Debug log
          setDirectorDetails(response.director || []); // Updated to use 'director' from response
          
          // Automatically populate postal code if available
          if (response.data.registered_office_address?.postal_code) {
            setValue("post_code", response.data.registered_office_address.postal_code);
            
            // Automatically set the address results
            setPostCodeResults({
              address_line_1: response.data.registered_office_address.address_line_1 || "",
              locality: response.data.registered_office_address.locality || "",
              postal_code: response.data.registered_office_address.postal_code || "",
              country: "United Kingdom"
            });
          }
        } else {
          // Handle case where company data is not found (404 response)
          setMessage(response.message);
          setCompanyDetails({});
          setDirectorDetails([]);
        }
      } else {
        // Handle timeout or other errors
        setMessage(response.message || "Unable to retrieve company information");
        setCompanyDetails({});
        setDirectorDetails([]);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to retrieve information. Please try again after 30 minutes";
      setMessage(errorMessage);
      setCompanyDetails({});
      setDirectorDetails([]);
      console.error("Company lookup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = () => {
    // Get current address data to pass to EditAddress page
    const currentAddressData = editedAddress || (postCodeResults ? {
      address_line_1: postCodeResults.address_line_1 || "",
      address_line_2: postCodeResults.address_line_2 || "",
      locality: postCodeResults.locality || "",
      postal_code: postCodeResults.postal_code || "",
      country: postCodeResults.country || "United Kingdom"
    } : (companyDetails?.registered_office_address ? {
      address_line_1: companyDetails.registered_office_address.address_line_1 || "",
      address_line_2: companyDetails.registered_office_address.address_line_2 || "",
      locality: companyDetails.registered_office_address.locality || "",
      postal_code: companyDetails.registered_office_address.postal_code || "",
      country: "United Kingdom"
    } : {
      address_line_1: "",
      address_line_2: "",
      locality: "",
      postal_code: postCode || "",
      country: "United Kingdom"
    }));

    // Build the navigation URL with current address data and return parameters
    const editAddressUrl = `/edit-address?` +
      `address_line_1=${encodeURIComponent(currentAddressData.address_line_1)}&` +
      `address_line_2=${encodeURIComponent(currentAddressData.address_line_2)}&` +
      `locality=${encodeURIComponent(currentAddressData.locality)}&` +
      `postal_code=${encodeURIComponent(currentAddressData.postal_code)}&` +
      `country=${encodeURIComponent(currentAddressData.country)}&` +
      `type=${type}&` +
      `company_number=${companyDetails?.company_number || ""}&` +
      `company_name=${encodeURIComponent(companyDetails?.company_name || "")}&` +
      `directors=${encodeURIComponent(JSON.stringify(directorDetails.map(d => d.name).filter(Boolean)))}&` +
      `return_country=${country}`;

    navigate(editAddressUrl);
  };

  return (
    <>
      {(loading || loadingPostcode) && <Spineer />}
      <div className="h-[600px] flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center pb-2">
            <Link to="/">
              <div className="">
                <img alt="backArrow" src={backArrow} />
              </div>
            </Link>
            <div className="flex-grow">
              <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058]">
                Enter your company number
              </h5>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col space-y-4 pb-4">
            {/* Company Number Section */}
            <div className="flex flex-col bg-white py-[5px]">
              <div className="mx-[25px]">
                <div className="mb-[20px] text-center">
                  <label
                    className="mb-[10px] text-[14px] text-center font-normal text-[#666F96] block"
                    htmlFor="company_number"
                  >
                    Company number
                  </label>
                  <input
                    type="tel"
                    id="company_number"
                    {...register("company_number", {
                      required: "Company number is required",
                      pattern: {
                        value: /^[0-9]{8}$/, // Validation: Exactly 8 digits
                        message: "Company number must be exactly 8 digits",
                      },
                    })}
                    className={`pb-[10px] mb-0 text-center text-[20px] font-medium text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[20px] ${
                      errors.company_number
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="Enter 8 Digit"
                  />
                </div>
                <div className="ps-[42px] mt-[8px]">
                  <p className="text-[14px] font-normal text-[#666F96] mb-[17px]">
                    Lookup results (Directors: {directorDetails?.length || 0})
                  </p>

                  {companyDetails?.company_number ? (
                    <>
                      <p className="text-[14px] font-medium text-[#212058] w-[140px] mb-[6px]">
                        {companyDetails?.company_number || "\u00A0"}
                      </p>
                      <p className="text-[14px] font-medium text-[#212058] mb-[6px]">
                        {companyDetails?.company_name || "\u00A0"}
                      </p>
                      {console.log("Current directorDetails:", directorDetails)}
                      {directorDetails?.length > 0 ? (
                        directorDetails.slice(0, 2).map((item, index) => (
                          <p
                            key={index}
                            className="text-[14px] font-medium text-[#212058] w-[full] mb-[6px] mt-[6px]"
                          >
                            Director: {item?.name}
                          </p>
                        ))
                      ) : (
                        <p className="text-[14px] font-medium text-[#212058] w-[full] my-3">
                          Director not found (Array length: {directorDetails?.length})
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[14px] font-medium text-[#212058] w-[full] mb-[25px] mt-12">
                      {message || "No data found"}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {companyDetails?.company_number && (
              <div className="text-center mt-[20px] mb-[20px]">
                <button
                  type="button"
                  className="text-[16px] font-medium text-black bg-[#FFD700] px-[30px] py-[10px] rounded-[12px] shadow"
                  onClick={() => {
                    setCompanyDetails({});
                    setDirectorDetails([]);
                    setPostCodeResults(null);
                    setEditedAddress(null); // Clear edited address
                    setMessage("");
                    setLoadingPostcode(false); // Reset postcode loading state
                    // Clear the postal code input as well
                    setValue("post_code", "");
                  }}
                >
                  Try again
                </button>
              </div>
            )}
            
            {/* Post Code Section */}
            <div className="flex flex-col bg-white py-[5px] mt-[20px]">
              <div className="mx-[25px]">
                <div className="mb-[20px] text-center">
                  <label
                    className="mb-[10px] text-[14px] text-center font-normal text-[#666F96] block"
                    htmlFor="post_code"
                  >
                    Enter post code
                  </label>
                  <input
                    type="text"
                    id="post_code"
                    {...register("post_code", {
                      pattern: {
                        value: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
                        message: "Please enter a valid UK postcode (e.g., SW1A 1AA)"
                      }
                    })}
                    className={`pb-[10px] mb-0 text-center text-[20px] font-medium text-[#212058] w-full border-b focus:outline-none bg-transparent placeholder:text-[#9AA0BC] placeholder:text-[20px] ${
                      errors.post_code
                        ? "border-red-500"
                        : "focus:border-blue-500"
                    }`}
                    placeholder="SW1A 1AA"
                    maxLength={8}
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.post_code && (
                    <p className="text-red-500 text-[12px] mt-1 text-center">
                      {errors.post_code.message}
                    </p>
                  )}
                </div>
                <div className="ps-[42px] mt-[12px]">
                  <div className="flex items-center justify-between mb-[17px]">
                    <p className="text-[14px] font-normal text-[#666F96]">
                      Lookup results
                    </p>
                    {loadingPostcode && (
                      <div className="text-[12px] text-blue-600">
                        Looking up postcode...
                      </div>
                    )}
                  </div>
                  
                  {postCodeResults && (
                    <div className="mb-[20px]">
                      <div className="flex justify-between items-center mb-[6px]">
                        <p className="text-[14px] font-medium text-[#212058]">
                          {postCodeResults?.address_line_1}
                        </p>
                        <button 
                          type="button"
                          onClick={handleEditAddress}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Edit address"
                        >
                          <img src={editIcon} alt="edit" className="w-[16px] h-[16px]" />
                        </button>
                      </div>
                      {postCodeResults?.address_line_2 && (
                        <p className="text-[14px] font-medium text-[#212058] mb-[6px]">
                          {postCodeResults?.address_line_2}
                        </p>
                      )}
                      <p className="text-[14px] font-medium text-[#212058] mb-[6px]">
                        {postCodeResults?.locality}
                      </p>
                      <p className="text-[14px] font-medium text-[#212058] mb-[6px]">
                        {postCodeResults?.postal_code}
                      </p>
                      <p className="text-[14px] font-medium text-[#212058] mb-[20px]">
                        {postCodeResults?.country}
                      </p>
                      {editedAddress && (
                        <p className="text-[12px] text-green-600 mb-[10px] italic">
                          ✓ Address has been manually edited
                        </p>
                      )}
                    </div>
                  )}
                  
                  {postCode && validatePostcode(postCode) && !postCodeResults && !loadingPostcode && (
                    <div className="mb-[20px]">
                      <p className="text-[14px] text-gray-500 italic">
                        No address found for this postcode
                      </p>
                    </div>
                  )}
                  
                  {postCode && !validatePostcode(postCode) && postCode.length >= 5 && (
                    <div className="mb-[20px]">
                      <p className="text-[14px] text-red-500 italic">
                        Please enter a valid UK postcode format
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Bottom Button */}
        <div className="flex-shrink-0 p-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="submit"
              className="text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] bg-[#222222] shadow"
              disabled={!companyDetails?.company_number}
            >
              Accept
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanyNumber;
