import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import backArrow from "../../assets/Vector.png";
import toast from "react-hot-toast";

const EditAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get current address data from URL parameters
  const currentAddress = {
    address_line_1: queryParams.get("address_line_1") || "",
    address_line_2: queryParams.get("address_line_2") || "",
    locality: queryParams.get("locality") || "",
    postal_code: queryParams.get("postal_code") || "",
    country: queryParams.get("country") || "United Kingdom",
  };

  // Get return URL parameters to preserve navigation state
  const returnParams = {
    type: queryParams.get("type"),
    company_number: queryParams.get("company_number"),
    company_name: queryParams.get("company_name"),
    directors: queryParams.get("directors"),
    country: queryParams.get("return_country"),
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: currentAddress
  });

  const [loading, setLoading] = useState(false);

  // Set form values when component mounts
  useEffect(() => {
    Object.keys(currentAddress).forEach(key => {
      setValue(key, currentAddress[key]);
    });
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Create the updated address string
      const updatedAddress = [
        data.address_line_1,
        data.address_line_2,
        data.locality,
        data.country,
        data.postal_code,
      ]
        .filter(Boolean)
        .join(", ");

      // Prepare the return URL with updated address
      const returnUrl = `/company-number?type=${returnParams.type}&country=${returnParams.country}`;
      
      // Store the updated address data in localStorage for the CompanyNumber component to use
      const updatedAddressData = {
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        locality: data.locality,
        postal_code: data.postal_code,
        country: data.country,
        full_address: updatedAddress
      };
      
      localStorage.setItem("editedAddress", JSON.stringify(updatedAddressData));
      
      toast.success("Address updated successfully!");
      
      // Navigate back to company number page
      navigate(returnUrl);
      
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    const returnUrl = `/company-number?type=${returnParams.type}&country=${returnParams.country}`;
    navigate(returnUrl);
  };

  return (
    <div className="h-[600px] flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center pb-2">
          <button onClick={handleGoBack} className="p-2">
            <img alt="backArrow" src={backArrow} />
          </button>
          <div className="flex-grow">
            <h5 className="text-center font-medium text-[16px] mb-2 text-[#212058]">
              Edit Address
            </h5>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white py-[25px] px-[25px] rounded-lg">
            
            {/* Address Line 1 */}
            <div className="mb-5">
              <label
                className="mb-2 text-[12px] font-medium text-[#666F96] block uppercase"
                htmlFor="address_line_1"
              >
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address_line_1"
                {...register("address_line_1", { 
                  required: "Address Line 1 is required",
                  minLength: {
                    value: 2,
                    message: "Address Line 1 must be at least 2 characters"
                  }
                })}
                className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 ${
                  errors.address_line_1 ? "border-red-500" : "focus:border-blue-500"
                }`}
                placeholder="Enter address line 1"
              />
              {errors.address_line_1 && (
                <p className="text-red-500 text-[12px] mt-1">{errors.address_line_1.message}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="mb-5">
              <label
                className="mb-2 text-[12px] font-medium text-[#666F96] block uppercase"
                htmlFor="address_line_2"
              >
                Address Line 2
              </label>
              <input
                type="text"
                id="address_line_2"
                {...register("address_line_2")}
                className="text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 focus:border-blue-500"
                placeholder="Enter address line 2 (optional)"
              />
            </div>

            {/* City/Locality */}
            <div className="mb-5">
              <label
                className="mb-2 text-[12px] font-medium text-[#666F96] block uppercase"
                htmlFor="locality"
              >
                City/Town *
              </label>
              <input
                type="text"
                id="locality"
                {...register("locality", { 
                  required: "City/Town is required",
                  minLength: {
                    value: 2,
                    message: "City/Town must be at least 2 characters"
                  }
                })}
                className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 ${
                  errors.locality ? "border-red-500" : "focus:border-blue-500"
                }`}
                placeholder="Enter city or town"
              />
              {errors.locality && (
                <p className="text-red-500 text-[12px] mt-1">{errors.locality.message}</p>
              )}
            </div>

            {/* Postal Code */}
            <div className="mb-5">
              <label
                className="mb-2 text-[12px] font-medium text-[#666F96] block uppercase"
                htmlFor="postal_code"
              >
                Postal Code *
              </label>
              <input
                type="text"
                id="postal_code"
                {...register("postal_code", { 
                  required: "Postal code is required",
                  pattern: {
                    value: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
                    message: "Please enter a valid UK postal code"
                  }
                })}
                className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 ${
                  errors.postal_code ? "border-red-500" : "focus:border-blue-500"
                }`}
                placeholder="Enter postal code"
              />
              {errors.postal_code && (
                <p className="text-red-500 text-[12px] mt-1">{errors.postal_code.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="mb-5">
              <label
                className="mb-2 text-[12px] font-medium text-[#666F96] block uppercase"
                htmlFor="country"
              >
                Country *
              </label>
              <select
                id="country"
                {...register("country", { required: "Country is required" })}
                className={`text-[14px] font-normal text-[#212058] w-full border-b border-gray-300 focus:outline-none bg-transparent py-2 ${
                  errors.country ? "border-red-500" : "focus:border-blue-500"
                }`}
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="Ireland">Ireland</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Spain">Spain</option>
                <option value="Italy">Italy</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Belgium">Belgium</option>
                <option value="Other">Other</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-[12px] mt-1">{errors.country.message}</p>
              )}
            </div>

          </div>
        </form>
      </div>
      
      {/* Fixed Bottom Buttons */}
      <div className="flex-shrink-0 p-4 space-y-3">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className={`text-[16px] font-medium text-white w-full h-[50px] rounded-[14px] shadow ${
            loading ? "bg-gray-400" : "bg-[#222222]"
          }`}
        >
          {loading ? "Updating..." : "Save Address"}
        </button>
        
        <button
          onClick={handleGoBack}
          type="button"
          className="text-[16px] font-medium text-[#222222] w-full h-[50px] rounded-[14px] border border-[#222222] bg-white shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAddress;
