import React from "react";
import Logo from "../../assets/logo-senda.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-5 relative w-[375px] h-[600px] top-[-20px] left-[-20px]">
      <div className="flex flex-col h-full bg-black text-white px-[60px] py-[14px] shadow">
        <div className="flex flex-col  h-full">
          <div className="flex flex-col h-full">
            <img
              alt="Logo"
              src={Logo}
              title="logo"
              loading="eager"
              className="mx-auto mt-[100px]"
            />
            <div className="flex justify-between items-center mt-[70px] gap-16 flex-grow">
              <Link to="/company-number?type=business&country=GB" className="cursor-pointer">
                <p className="font-medium">REGISTER</p>
              </Link>
              <Link to="/sign-in" className="cursor-pointer">
                <p className="font-medium">LOGIN</p>
              </Link>
            </div>
            <div className="grow items-end flex justify-center">
              <Link to="/forget-password" className="cursor-pointer">
                <p className="font-medium text-[14px] mb-[40px]">
                  Forget Password
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
