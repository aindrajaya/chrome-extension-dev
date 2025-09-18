// Authentication service aligned with OpenAPI specification
import axiosInstance from "./axiosConfig";
import toast from "react-hot-toast";

class AuthService {

  // Utility method to validate and format phone numbers
  validatePhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, assume it's a UK number and add +44
    if (!cleanPhone.startsWith('+')) {
      // Remove leading 0 if present and add +44
      const withoutLeadingZero = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
      return `+44${withoutLeadingZero}`;
    }
    
    return cleanPhone;
  }

  // Utility method to validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Utility method to validate and format website URLs
  validateWebsiteUrl(website) {
    if (!website || website.trim() === '') {
      // Return a default placeholder URL if no website provided
      return 'https://www.example.com';
    }
    
    // Clean the URL
    const cleanUrl = website.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      return `https://${cleanUrl}`;
    }
    
    return cleanUrl;
  }

  // Utility method to validate and map numberOfPayments values
  validateNumberOfPayments(numberOfPayments) {
    if (!numberOfPayments) return "Fewer than 5 payments";
    
    // Map common variations to valid API values
    const paymentMappings = {
      "Less than 5 payments": "Fewer than 5 payments",
      "Less than 10 payments": "5 - 10 payments",
      "10-20 payments": "10 - 20 payments",
      "More than 20": "More than 20 payments",
      // Valid values that don't need mapping
      "Fewer than 5 payments": "Fewer than 5 payments",
      "5 - 10 payments": "5 - 10 payments",
      "10 - 20 payments": "10 - 20 payments",
      "More than 20 payments": "More than 20 payments",
      "250_500k": "250_500k"
    };
    
    return paymentMappings[numberOfPayments] || "Fewer than 5 payments";
  }

  // Utility method to validate and map annual volume values  
  validateAnnualVolume(annualVolume) {
    if (!annualVolume) return "Less than £10,000";
    
    // Map common variations to consistent format
    const volumeMappings = {
      "Less than £10,000": "Less than £10,000",
      "£10,000 - £50,000": "£10,000 - £50,000", 
      "£50,000 - £100,000": "£50,000 - £100,000",
      "More than £100,000": "More than £100,000",
      // Handle variations without £ symbol
      "Less than 10,000": "Less than £10,000",
      "10,000 - 50,000": "£10,000 - £50,000",
      "50,000 - 100,000": "£50,000 - £100,000", 
      "More than 100,000": "More than £100,000"
    };
    
    return volumeMappings[annualVolume] || "Less than £10,000";
  }

  // Utility method to split and validate admin names
  validateAdminNames(userData) {
    let firstName = '';
    let lastName = '';
    
    // Prioritize separate first/last names if provided
    if (userData.f_name && userData.l_name) {
      firstName = userData.f_name.trim();
      lastName = userData.l_name.trim();
    } else if (userData.name) {
      // Fallback to splitting full name
      const nameParts = userData.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Validation
    if (!firstName || firstName.length === 0) {
      throw new Error("Admin first name is required and cannot be empty");
    }
    if (!lastName || lastName.length === 0) {
      throw new Error("Admin last name is required and cannot be empty");
    }
    
    return {
      adminFirstName: firstName,
      adminLastName: lastName
    };
  }
  
  // Get company data from Companies House API (maps to /company/data)
  async getCompanyData(businessId) {
    try {
      const response = await axiosInstance.get("/company/data", {
        params: {
          business_id: businessId
        }
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        director: response.data.director || [] // Keep it as 'director' to match backend response
      };
    } catch (error) {
      console.error("Company data retrieval error:", error);
      
      // Handle specific error cases from OpenAPI spec
      if (error.response?.status === 404) {
        return {
          success: true,
          message: "Unable to retrieve information. Please try again after 30 minutes",
          data: null,
          director: []
        };
      } else if (error.response?.status === 408) {
        return {
          success: false,
          message: "Request timed out. Please try again later.",
          data: null,
          director: []
        };
      } else if (error.response?.status === 422) {
        throw new Error("Business ID is required and must be a string");
      }
      
      throw error;
    }
  }

  async sendEmailOtpBeforeRegistration(email) {
    try {
      // Validate required fields
      if (!email || !this.validateEmail(email)) {
        throw new Error("Valid email address is required");
      }

      console.log("Send email OTP request:", {
        endpoint: "/auth/send-email-otp",
        email
      });

      console.log("Sending email OTP data:", email);
      
      const response = await axiosInstance.post("/auth/send-email-otp", { email });
      
      console.log("Email OTP response:", response.data);

      return response.data;
    } catch (error) {
      
      console.error("Send email OTP error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error("OTP already sent. Please wait a few minutes then check your email inbox or try sending again.");
      }
      
      throw error;
    }
  }

  // Verify email with OTP (maps to /auth/verify-email-otp)
  // Note: This function is used before company registration
  async verifyEmailBeforeRegistration(otpCode, email) {
    try {
      const response = await axiosInstance.post(`/auth/verify-email-otp`, {
        code: otpCode,
        type: "email_verification",
        email: email
      });

      console.log("Email verification response:", response);
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("❌ Email verification error:", error);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Bad request. Please check your OTP details.";
 
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  }
  
  // Register company with admin user (maps to /auth/register/company)
  // Note: This endpoint requires separate adminFirstName and adminLastName fields
  // and does NOT accept adminName, businessType, or country fields
  async registerCompany(companyData) {
    try {
      // Validate required fields
      if (!companyData.email || !this.validateEmail(companyData.email)) {
        throw new Error("Valid email address is required");
      }
      
      if (!companyData.phoneNo) {
        throw new Error("Phone number is required");
      }

      const validatedPhone = this.validatePhoneNumber(companyData.phoneNo);
      if (!validatedPhone) {
        throw new Error("Valid phone number is required");
      }

      console.log("🏢 Company registration request:", {
        endpoint: "/auth/register/company",
        data: companyData,
        validatedPhone
      });

      // Validate and split admin names using the utility method
      const { adminFirstName, adminLastName } = this.validateAdminNames(companyData);

      const requestData = {
        companyNumber: companyData.company_number,
        companyName: companyData.company_name,
        address: companyData.address,
        directors: companyData.directors || [], // Should be passed from company lookup
        adminFirstName: adminFirstName,
        adminLastName: adminLastName,
        adminEmail: companyData.email,
        adminPhone: validatedPhone, // Use validated phone number
        adminPassword: companyData.password
        // Note: adminName, businessType, country are not accepted by the updated API
      };

      console.log("📤 Sending registration data:", requestData);

      const response = await axiosInstance.post("/auth/register/company", requestData);

      console.log("📥 Registration response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          userId: response.data.userId,
          companyId: response.data.companyId,
          message: response.data.message
        };
      }
      return response.data;
    } catch (error) {
      console.error("❌ Company registration error:", error);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error("Company already registered. Please use a different company or try logging in.");
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || "Invalid registration data provided.";
        throw new Error(errorMessage);
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Bad request. Please check your registration details.";
        
        // Check for specific validation errors related to name fields
        if (errorMessage.includes('adminFirstName')) {
          throw new Error("Admin first name is required and must be a valid string");
        } else if (errorMessage.includes('adminLastName')) {
          throw new Error("Admin last name is required and must be a valid string");
        } else if (errorMessage.includes('adminName')) {
          throw new Error("Please provide separate first name and last name instead of full name");
        } else if (errorMessage.includes('businessType') || errorMessage.includes('country')) {
          throw new Error("Invalid field provided. Please ensure you're using the latest registration format");
        }
        
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  }

  // Register team member via invitation (maps to /auth/register/team-member)
  // Note: This endpoint still uses a single 'name' field (unlike company registration)
  async registerTeamMember(teamMemberData) {
    try {
      console.log("👥 Team member registration request:", {
        endpoint: "/auth/register/team-member",
        data: teamMemberData
      });

      const requestData = {
        name: teamMemberData.name || `${teamMemberData.f_name || ''} ${teamMemberData.l_name || ''}`.trim(),
        email: teamMemberData.email,
        phone: teamMemberData.phoneNo,
        password: teamMemberData.password,
        invitationToken: teamMemberData.invitationToken
      };

      console.log("📤 Sending team member data:", requestData);

      const response = await axiosInstance.post("/auth/register/team-member", requestData);

      console.log("📥 Team member registration response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          userId: response.data.userId,
          companyId: response.data.companyId,
          message: response.data.message
        };
      }
      return response.data;
    } catch (error) {
      console.error("❌ Team member registration error:", error);
      console.error("❌ Error response data:", error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error("Invalid invitation token or invitation expired.");
      } else if (error.response?.status === 409) {
        throw new Error("Email already registered. Please use a different email or try logging in.");
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || "Invalid registration data provided.";
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  }

  // Register EqualsMoney account (DEPRECATED - use onboardEqualsMoneyAccount instead)
  async registerEqualsMoneyAccount(accountData) {
    try {
      console.warn("Using deprecated /auth/register/account endpoint. Consider using onboardEqualsMoneyAccount() instead.");
      const response = await axiosInstance.post("/auth/register/account", accountData);
      console.log("Data Error: ", response.data)
      return response.data;
    } catch (error) {
      console.error("EqualsMoney account registration error:", error);
      throw error;
    }
  }

  // Onboard EqualsMoney account (NEW - maps to /api/eqm/onboard-account)
  async onboardEqualsMoneyAccount(accountData) {
    try {
      // Validate and fix website URL if present
      if (accountData.account && accountData.account.website !== undefined) {
        accountData.account.website = this.validateWebsiteUrl(accountData.account.website);
      }

      // Validate and fix accountType (must be lowercase)
      if (accountData.accountType) {
        accountData.accountType = accountData.accountType.toLowerCase();
      }

      // Validate contact fields
      if (accountData.contact) {
        // Handle both name formats - prefer firstName/lastName if provided
        if (accountData.contact.firstName && accountData.contact.lastName) {
          // Validate firstName and lastName
          if (!accountData.contact.firstName.trim() || !accountData.contact.lastName.trim()) {
            throw new Error("Contact first name and last name are required and cannot be empty");
          }
          console.log("✅ Using firstName and lastName fields for API");
          // Remove other name fields if they exist
          if (accountData.contact.name) {
            delete accountData.contact.name;
          }
          if (accountData.contact.first_name) {
            delete accountData.contact.first_name;
          }
          if (accountData.contact.last_name) {
            delete accountData.contact.last_name;
          }
        } else if (accountData.contact.first_name && accountData.contact.last_name) {
          // Convert snake_case to camelCase
          accountData.contact.firstName = accountData.contact.first_name;
          accountData.contact.lastName = accountData.contact.last_name;
          delete accountData.contact.first_name;
          delete accountData.contact.last_name;
          if (accountData.contact.name) {
            delete accountData.contact.name;
          }
          console.log("✅ Converted first_name/last_name to firstName/lastName for API");
        } else if (accountData.contact.name) {
          // Split full name into firstName and lastName
          const nameParts = accountData.contact.name.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          if (!firstName || !lastName) {
            throw new Error("Contact name must include both first and last name");
          }
          
          accountData.contact.firstName = firstName;
          accountData.contact.lastName = lastName;
          delete accountData.contact.name;
          console.log("✅ Split name into firstName and lastName fields");
        } else {
          throw new Error("Contact firstName and lastName or full name is required");
        }
        
        // Validate email format
        if (!accountData.contact.email || typeof accountData.contact.email !== 'string') {
          throw new Error("Contact email is required and must be a valid string");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(accountData.contact.email)) {
          throw new Error("Contact email must be in valid format (e.g., user@example.com)");
        }
        
        // Validate phone if present
        if (accountData.contact.phone) {
          accountData.contact.phone = this.validatePhoneNumber(accountData.contact.phone);
        }
      }

      // Validate and fix KYC data if present
      if (accountData.kyc) {
        if (accountData.kyc.numberOfPayments) {
          accountData.kyc.numberOfPayments = this.validateNumberOfPayments(accountData.kyc.numberOfPayments);
        }
        if (accountData.kyc.annualVolume) {
          accountData.kyc.annualVolume = this.validateAnnualVolume(accountData.kyc.annualVolume);
        }
      }

      console.log("💰 EqualsMoney onboarding request:", {
        endpoint: "/api/eqm/onboard-account",
        data: accountData,
        validatedFields: {
          accountType: accountData.accountType,
          contactFirstName: accountData.contact?.firstName,
          contactLastName: accountData.contact?.lastName,
          contactEmail: accountData.contact?.email,
          contactPhone: accountData.contact?.phone,
          website: accountData.account?.website,
          numberOfPayments: accountData.kyc?.numberOfPayments,
          annualVolume: accountData.kyc?.annualVolume
        }
      });

      // Use the correct endpoint as per OpenAPI specification
    //   const response = await axiosInstance.post("/api/eqm/onboard-account", accountData);
      const response = await axiosInstance.post("/auth/register/account", accountData);
      
      console.log("📥 EqualsMoney onboarding response:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("❌ EqualsMoney account onboarding error:", error);
      console.error("❌ Error response data:", error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Invalid account data provided.";
        const errorDetails = error.response?.data?.details || error.response?.data || {};
        
        console.error("❌ Detailed validation error:", {
          status: error.response?.status,
          message: errorMessage,
          details: errorDetails,
          data: error.response?.data
        });
        
        // Check for specific validation errors
        if (errorMessage.includes('accountType')) {
          throw new Error("accountType must be 'Business' or 'Personal' (capitalized)");
        } else if (errorMessage.includes('firstName') || errorMessage.includes('lastName')) {
          throw new Error("Contact should use single 'name' field, not firstName/lastName");
        } else if (errorMessage.includes('contact.name')) {
          throw new Error("Contact name is required and must be a non-empty string");
        } else if (errorMessage.includes('website')) {
          throw new Error("Website must be a valid URL (e.g., https://www.example.com)");
        } else if (errorMessage.includes('numberOfPayments')) {
          throw new Error("Invalid numberOfPayments value. Must be one of: 'Fewer than 5 payments', '5 - 10 payments', '10 - 20 payments', 'More than 20 payments', '250_500k'");
        } else if (errorMessage.includes('annualVolume')) {
          throw new Error("Invalid annualVolume value. Please provide a valid volume range.");
        } else if (errorMessage.includes('email')) {
          throw new Error("Please provide a valid email address");
        } else if (errorMessage.includes('phone')) {
          throw new Error("Please provide a valid phone number");
        } else if (errorMessage.includes('incorporationDate')) {
          throw new Error("incorporationDate must be in YYYY-MM-DD format (e.g., 2020-01-01)");
        } else if (errorMessage.includes('required') || errorMessage.includes('validation')) {
          // For generic validation errors, include the full error details
          throw new Error(`Validation Error: ${errorMessage}. Please check all required fields are provided in correct format.`);
        }
        
        throw new Error(errorMessage);
      } else if (error.response?.status === 409) {
        throw new Error("Account already exists with EqualsMoney.");
      } else if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || "Validation failed.";
        throw new Error(`Validation Error: ${errorMessage}`);
      }
      
      throw error;
    }
  }

  // Get EqualsMoney accounts (NEW - maps to /api/eqm/accounts)
  async getEqualsMoneyAccounts() {
    try {
      const response = await axiosInstance.get("/api/eqm/accounts");
      return {
        success: response.data.success,
        message: response.data.message,
        accounts: response.data.accounts || []
      };
    } catch (error) {
      console.error("Get EqualsMoney accounts error:", error);
      throw error;
    }
  }

  // User login (maps to /auth/login)
  async login(email, password, userType = "user") {
    try {
      console.log("🔐 AuthService: Attempting login to:", `/auth/login`);
      console.log("📤 Request payload:", { email, userType, password: "***" });
      
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        userType
      });

      console.log("📥 AuthService: Login response status:", response.status);
      console.log("📥 AuthService: Login response data:", response.data);

      if (response.data.access_token) {
        // Store authentication data
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        console.log("✅ AuthService: Token stored successfully");
        
        return {
          success: true,
          token: response.data.access_token,
          user: response.data.user,
          isActive: true // If we get here, the account is active
        };
      }
      
      console.log("⚠️ AuthService: No access_token in response, returning raw data");
      return response.data;
    } catch (error) {
      console.error("❌ AuthService: Login error:", error);
      console.error("❌ AuthService: Error response:", error.response?.data);
      console.error("❌ AuthService: Error status:", error.response?.status);
      
      // Handle specific error cases for inactive accounts
      if (error.response?.status === 401) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || "";
        const errorDetails = errorData?.details || "";
        
        // Check if the error is due to inactive account
        if (errorMessage.toLowerCase().includes("account not active") || 
            errorMessage.toLowerCase().includes("inactive") ||
            errorDetails.toLowerCase().includes("account not active")) {
          return {
            success: false,
            isActive: false,
            message: "Account is not active yet. Please wait for account activation.",
            statusCode: 401,
            error: "Unauthorized"
          };
        }
        
        // Check if error is due to EqualsMoneyAccount validation (per OpenAPI spec)
        if (errorDetails.toLowerCase().includes("equalsmoney") || 
            errorDetails === "Account requires verified EqualsMoneyAccount for login") {
          return {
            success: false,
            isActive: true, // Account might be active but missing EqualsMoneyAccount
            requiresEqualsMoneySetup: true,
            message: "Account setup incomplete. Please complete EqualsMoneyAccount setup.",
            statusCode: 401,
            error: "Unauthorized",
            details: errorDetails
          };
        }
        
        // Generic unauthorized error (invalid credentials)
        return {
          success: false,
          message: "Invalid credentials. Please check your email and password.",
          statusCode: 401,
          error: "Unauthorized"
        };
      }
      
      throw error;
    }
  }

  // Admin login (maps to /auth/admin/login)
  async adminLogin(email, password) {
    try {
      const response = await axiosInstance.post("/auth/admin/login", {
        email,
        password,
        userType: "admin"
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        return {
          success: true,
          token: response.data.access_token,
          user: response.data.user
        };
      }
      return response.data;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  }

  // Verify email with OTP (maps to /auth/verify/email/{userId})
  async verifyEmail(userId, otpCode, email) {
    try {
      const response = await axiosInstance.post(`/auth/verify/email/${userId}`, {
        code: otpCode,
        type: "email_verification",
        email: email
      });

      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  // Verify phone with OTP (maps to /auth/verify/phone/{userId})
  async verifyPhone(userId, otpCode, phone) {
    try {
      console.log("🔍 Phone verification request:", {
        userId,
        otpCode,
        phone,
        endpoint: `/auth/verify/phone/${userId}`
      });

      const requestBody = {
        code: otpCode,
        type: "phone_verification",
        phone: phone
      };

      console.log("📤 Request body:", requestBody);

      const response = await axiosInstance.post(`/auth/verify/phone/${userId}`, requestBody);

      console.log("📥 Phone verification response:", response.data);

      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("❌ Phone verification error:", error);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error;
    }
  }

  // Resend OTP (maps to /auth/resend-otp/{userId}/{type})
  async resendOtp(userId, type) {
    try {
      console.log("🔄 Resending OTP:", {
        userId,
        type,
        endpoint: `/auth/resend-otp/${userId}/${type}`
      });

      const response = await axiosInstance.post(`/auth/resend-otp/${userId}/${type}`);
      
      console.log("📥 Resend OTP response:", response.data);

      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("❌ Resend OTP error:", error);
      console.error("❌ Resend OTP error response:", error.response?.data);
      throw error;
    }
  }

  // Get user profile (maps to /auth/profile)
  // NOTE: This endpoint is not defined in the current OpenAPI spec v2.0.0
  // It should be added to the spec or verification status should be included in login response
  async getUserProfile() {
    try {
      console.log("🔍 AuthService: Getting user profile from /auth/profile");
      const response = await axiosInstance.get("/auth/profile");
      console.log("📥 AuthService: Profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ AuthService: Get user profile error:", error);
      console.error("❌ AuthService: Profile error response:", error.response?.data);
      
      // If profile endpoint is not available, return default verified status
      // This allows the authentication flow to continue
      if (error.response?.status === 404) {
        console.log("⚠️ AuthService: Profile endpoint not found, assuming verified user");
        return {
          emailVerified: true,
          phoneVerified: true,
          message: "Profile endpoint not available - assuming verified status"
        };
      }
      
      throw error;
    }
  }

  // Password reset request (Note: This endpoint is not in the current OpenAPI spec)
  // You may need to add this to your OpenAPI spec or use a different endpoint
  async requestPasswordReset(email) {
    try {
      const response = await axiosInstance.post("/auth/password-reset/request", {
        email: email
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("Password reset request error:", error);
      throw error;
    }
  }

  // Reset password with token (Note: This endpoint is not in the current OpenAPI spec)  
  // You may need to add this to your OpenAPI spec or use a different endpoint
  async resetPassword(token, newPassword) {
    try {
      const response = await axiosInstance.post("/auth/password-reset/confirm", {
        token: token,
        password: newPassword
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("accountantUser");
      
      toast.success("Logged out successfully");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Helper method to get stored user data
  getStoredUser() {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get supported currencies from EqualsMoney (Development Mode - No Auth Required)
  async getSupportedCurrencies(accountId = null) {
    try {
      console.log('🌐 Making request to /api/eqm/currencies', accountId ? `with accountId: ${accountId}` : '');
      
      const params = accountId ? { accountId } : {};
      const response = await axiosInstance.get("/api/eqm/currencies", { params });
      
      console.log('📡 Raw API response:', response.data);
      
      return {
        success: response.data.success,
        message: response.data.message || "Static supported currencies retrieved (Development Mode - No Auth Required)",
        currencies: response.data.currencies || []
      };
    } catch (error) {
      console.error("❌ Get supported currencies error:", error);
      console.error("📍 Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      
      // Enhanced fallback for development mode
      if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
        console.warn("🔄 API unavailable, using enhanced fallback currency data for development");
        
        const fallbackCurrencies = accountId ? [
          { code: "GBP", name: "British Pound Sterling", enabled: true, balances: { available: 1250.75, pending: 50.25 } },
          { code: "USD", name: "US Dollar", enabled: true, balances: { available: 1500.50, pending: 100.00 } },
          { code: "EUR", name: "Euro", enabled: true, balances: { available: 980.30, pending: 25.70 } },
          { code: "CAD", name: "Canadian Dollar", enabled: true },
          { code: "AUD", name: "Australian Dollar", enabled: true }
        ] : [
          { code: "GBP", name: "British Pound Sterling", enabled: true },
          { code: "USD", name: "US Dollar", enabled: true },
          { code: "EUR", name: "Euro", enabled: true },
          { code: "CAD", name: "Canadian Dollar", enabled: true },
          { code: "AUD", name: "Australian Dollar", enabled: true },
          { code: "CHF", name: "Swiss Franc", enabled: true },
          { code: "JPY", name: "Japanese Yen", enabled: true }
        ];
        
        return {
          success: true,
          message: `Fallback currencies loaded (Development Mode)${accountId ? ' with mock balances' : ''}`,
          currencies: fallbackCurrencies
        };
      }
      
      throw error;
    }
  }

  // Helper method to get stored token
  getToken() {
    return localStorage.getItem("token");
  }
}

export default new AuthService();
