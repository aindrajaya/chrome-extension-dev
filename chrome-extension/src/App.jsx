import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PassCode from "./PassCode";
import Transactions from "./Transactions";
import NewPayee from "./NewPayee";
import EnterAmount from "./EnterAmount";
import ThankYou from "./ThankYou";
import Home from "./pages/customers/Home";
import SignUp from "./pages/customers/SignUp";
import BusinessDetails from "./pages/customers/BusinessDetails";
import VerifyPhoneOtp from "./pages/customers/VerifyPhoneOtp";
import VerifyEmailOtp from "./pages/customers/VerifyEmailOtp";
import Success from "./pages/customers/Success";
import InvoiceSent from "./pages/customers/InvoiceSent";
import NotActivated from "./pages/customers/NotActivated";
import SignIn from "./pages/customers/SignIn";
import ForgetPassword from "./pages/customers/ForgetPassword";
import NewPassword from "./pages/customers/NewPassword";
import ResetMessage from "./pages/customers/ResetMessage";
import { Toast } from "./components/Toast";
import { useEffect, useState } from "react";
import BusinessType from "./pages/customers/BusinessType";
import CompanyNumber from "./pages/customers/CompanyNumber";
import UnEditPayee from "./UnEditPayee";
import FoundingMember from "./pages/customers/onboard/FoundingMember";
import ChoosePlan from "./pages/customers/ChoosePlan";
import AccountantKey from "./pages/customers/onboard/AccountantKey";
import AddBank from "./pages/customers/onboard/AddBank";
import AccountingSoftware from "./pages/customers/onboard/AccountingSoftware";
import AccountantKeyPartner from "./pages/partners/onboard/AccountantKeyPartner";
import UploadLogo from "./pages/partners/onboard/UploadLogo";
import GenerateKey from "./pages/partners/onboard/GenerateKey";
import Profile from "./Profile";
import LinkAccountingSoftware from "./pages/customers/onboard/LinkAccountingSoftware";
import SoftwareSuccess from "./pages/customers/onboard/SoftwareSuccess";
import Clients from "./Clients";
import CountrySelect from "./pages/customers/CountrySelect";
import KYC from "./pages/customers/KYC";
import Currency from "./pages/customers/Currency";
import PayeeCurrency from "./pages/customers/PayeeCurrency";
import PayeeCountry from "./PayeeCountry";
import HomePage from "./pages/customers/HomePage";
import RequestSaved from "./RequestSaved";
import Deposit from "./Deposit";
import RegisterTeam from "./pages/customers/company/RegisterTeam";
import SuccessRegisterTeam from "./pages/customers/company/SuccessRegisterTeam";
import ProfileTransactions from "./ProfileTransactions";
import ProfilePayees from "./ProfilePayees";
import ProfileBank from "./ProfileBank";
// import CompanyInfo from "./CompanyInfo";
import ProfileTeam from "./ProfileTeam";
import ProfileEditPayee from "./ProfileEditPayee";
import ProfileEditTeam from "./ProfileEditTeam";
import ProfileAddTeam from "./ProfileAddTeam";
import ProfileFAQ from "./ProfileFAQ";
import ProfilePrivacyPolicy from "./ProfilePrivacyPolicy";
import ProfileCompanyInfo from "./ProfileCompanyInfo";
import ProfileEditCompany from "./ProfileEditCompany";
import ProfileEditCompanyContact from "./ProfileEditCompanyContact";
import ProfileAddTeamSuccess from "./ProfileAddTeamSuccess";
import VerifyChoose from "./pages/customers/VerifyChoose";
import VerifyAuthenticator from "./pages/customers/VerifyAuthenticator";
import EditAddress from "./pages/customers/EditAddress";

function App() {
  return (
    <>
      <div className="layout">
        <Router>
        <RouteManager>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country-select" element={<CountrySelect />} />
            <Route path="/business-type" element={<BusinessType />} />
            <Route path="/company-number" element={<CompanyNumber />} />
            <Route path="/edit-address" element={<EditAddress />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/business-details" element={<BusinessDetails />} />
            <Route path="/verify-phone" element={<VerifyPhoneOtp />} />
            <Route path="/verify-choose" element={<VerifyChoose />} />
            <Route path="/verify-authenticator" element={<VerifyAuthenticator />} />
            <Route path="/verify-email" element={<VerifyEmailOtp />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/choose-plan" element={<ChoosePlan />} />
            <Route path="/success" element={<Success />} />
            <Route path="/processing" element={<NotActivated />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/reset-message" element={<ResetMessage />} />
            <Route path="/homepage" element={<HomePage />} />

            <Route path="/pass-code" element={<PassCode />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/payee-curreny" element={<PayeeCurrency />} />
            <Route path="/payee-country" element={<PayeeCountry />} />
            <Route path="/new-payee" element={<NewPayee />} />
            <Route path="/edit-payee" element={<UnEditPayee />} />
            <Route path="/enter-amount" element={<EnterAmount />} />
            <Route path="/payment-sent" element={<RequestSaved />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/thank-you" element={<ThankYou />} />

            <Route path="/customer/register-team" element={<RegisterTeam />} />
            <Route path="/customer/register-team-success" element={<SuccessRegisterTeam />} />
            {/* customer onboard */}
            <Route path="/founding-member" element={<FoundingMember />} />
            <Route path="/accountant-key" element={<AccountantKey />} />
            <Route path="/add-bank" element={<AddBank/>} />
            <Route path="/link-accounting-software" element={<LinkAccountingSoftware/>} />
            <Route path="/accounting-software" element={<AccountingSoftware/>} />
            <Route path="/software-success" element={<SoftwareSuccess/>} />
            {/* partner onboard */}
            <Route path="/accountant-key-partner" element={<AccountantKeyPartner/>} />
            <Route path="/generate-key" element={<GenerateKey/>} />
            <Route path="/upload-logo" element={<UploadLogo/>} />
            {/* profile */}
            <Route path="/profile" element={<Profile/>} />
            <Route path="/clients" element={<Clients/>} />
            <Route path="/profile-transactions" element={<ProfileTransactions/>} />
            <Route path="/profile-payee" element={<ProfilePayees/>} />
            <Route path="/profile-edit-payee" element={<ProfileEditPayee/>} />
            <Route path="/profile-team" element={<ProfileTeam/>} />
            <Route path="/profile-company" element={<ProfileCompanyInfo/>} />
            <Route path="/profile-edit-company" element={<ProfileEditCompany/>} />
            <Route path="/profile-edit-contact-company" element={<ProfileEditCompanyContact/>} />
            <Route path="/profile-edit-team" element={<ProfileEditTeam/>} />
            <Route path="/profile-add-team" element={<ProfileAddTeam/>} />
            <Route path="/profile-faq" element={<ProfileFAQ/>} />
            <Route path="/profile-privacy-policy" element={<ProfilePrivacyPolicy/>} />
            <Route path="/profile-bank" element={<ProfileBank/>} />
            <Route path="/profile-add-team-success" element={<ProfileAddTeamSuccess/>} />
            <Route path="/invoice-sent" element={<InvoiceSent/>} />
          </Routes>
          </RouteManager>
        </Router>
      </div>
      <Toast/>
    </>
  );
}

// Tracks and saves the current route in Chrome storage
// Tracks and saves the current route in localStorage
function RouteManager({ children }) {
  const [isRestored, setIsRestored] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Save the current route (including query params), except for certain pages
  useEffect(() => {
    if (isRestored) {
      const currentPathWithQuery = `${location.pathname}${location.search}`;
      const shouldNotSave = location.pathname.startsWith("/new-password") ||
                           location.pathname.startsWith("/homepage") ||
                           location.pathname.startsWith("/processing");
      
      if (!shouldNotSave) {
        localStorage.setItem("lastVisitedRoute", currentPathWithQuery);
      }
    }
  }, [location, isRestored]);

  // Restore the last visited route (including query params) ONLY if on root path
  useEffect(() => {
    const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
    const isOnRoot = location.pathname === "/";
    const shouldNotRestore = location.pathname.startsWith("/new-password") ||
                             location.pathname.startsWith("/homepage") ||
                             location.pathname.startsWith("/processing");
    
    // Check if user just logged in (has token but is on root)
    const hasActiveSession = localStorage.getItem("token") && localStorage.getItem("user");
    
    if (!shouldNotRestore && isOnRoot && lastVisitedRoute && 
        lastVisitedRoute !== `${location.pathname}${location.search}`) {
      
      // If user has an active session and lastVisitedRoute is sign-in, don't redirect back to sign-in
      if (hasActiveSession && lastVisitedRoute === "/sign-in") {
        console.log("🚫 RouteManager: User has active session, not redirecting to sign-in");
        localStorage.removeItem("lastVisitedRoute"); // Clear to prevent future issues
        return;
      }
      
      navigate(lastVisitedRoute);
    }
    setIsRestored(true); // Ensure restoration is complete
  }, [navigate, location]);

  // Prevent children from rendering until restoration is done
  if (!isRestored) {
    return null;
  }

  return children;
}

export default App;
