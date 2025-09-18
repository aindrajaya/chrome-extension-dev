import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./assets/logo1.png";
import { useForm } from "react-hook-form";

const Home = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  

  const onSubmit = (data) => {
    localStorage.setItem("phone_no", data.phone_no);
    navigate("/pass-code");
    // Your form submission logic here
  };

  return (
    <div className="">
      <div className="max-w-lg mx-auto px-6 py-6 bg-white rounded-lg shadow">
        <img
          alt="Icon"
          src={Icon}
          width={16}
          height={16}
          title="logo"
          loading="eager"
        />
        <div className="my-4">
          <h1 className="text-center font-semibold text-3xl text-black">
            Welcome to
          </h1>
          <h2 className="text-center font-semibold text-3xl mb-3 text-black">
            SENDA
          </h2>
          <p className="text-center mb-1  mx-auto uppercase text-black">
            Senda is a secured
          </p>
          <p className="text-center mb-1  mx-auto uppercase text-black">
            and user-friendly
          </p>
          <p className="text-center mb-1  mx-auto uppercase text-black">
            digital wallet
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="py-4 block text-gray-700 font-medium"
              htmlFor="phone_no"
            >
              Phone No.
            </label>
            <input
              type="text"
              id="phone_no"
              {...register("phone_no", { required: true })}
              className={`w-full bg-transparent border-b focus:outline-none ${
                errors.phone_no ? "border-red-500" : "focus:border-blue-500"
              }`}
              placeholder="Enter your phone no."
            />
            {/* {errors.payeeName && <p className="text-red-500 text-sm mt-1">Payee Name is required</p>} */}
          </div>
          <button
            type="submit"
            className="w-full py-2 my-4 px-4 bg-black text-white font-semibold rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
