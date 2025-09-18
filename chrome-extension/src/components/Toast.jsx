// import { Toaster } from "react-hot-toast";
import { Toaster } from 'sonner';
// import { useLanguage } from "../context/LanguageContext";
export const Toast = () => {
//   const { language } = useLanguage();

//   const isRtl = language === "english"; 

  return (
    <>
    {/* <div className="w-[375px] testing relative h-[600px]"> */}
      <Toaster
        position="top-center"
        duration={2000}
        closeButton
        richColors
        theme="light"
        visibleToasts={3}
        offset={16}
        toastOptions={{
          style: {
            fontSize: "13px",
            borderRadius: "8px",
          },
          className: 'toast-height',
        }}
        swipeDirection="right"
      />
    {/* </div> */}
    </>
  );
};
