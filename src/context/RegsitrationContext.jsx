import React, { createContext, useContext, useState } from "react";

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [registration, setRegistration] = useState({
    country: "",
    businessType: "",
    companyNumber: "",
    companyName: "",
    address: "",
    email: "",
    adminName: "",
    adminPhone: "",
    directors: [], // Array of directors from Companies House
    incorporationDate: "", // From Companies House
    userId: "", // Add userId for verification flow
    companyId: "", // Add companyId from registration
    userType: "" // Add userType
    // ...add more as needed
  });

  return (
    <RegistrationContext.Provider value={{ registration, setRegistration }}>
      {children}
    </RegistrationContext.Provider>
  );
};