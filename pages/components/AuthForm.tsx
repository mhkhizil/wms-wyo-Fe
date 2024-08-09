import React from "react";
import { AuthFormProps } from "../dto/authDto";

const AuthForm: React.FC<AuthFormProps> = ({
 loginData,
  handleSubmit,
  error,
  handleInputChange,
  validationError
}) => {
  console.log(loginData);
  
  return (
    <>
      <div className="shadow-xl shadow-white px-8 pb-8 pt-12 border-2 border-white rounded-3xl space-y-12">
        <h1 className="font-semibold text-2xl text-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-12 w-full sm:w-[400px]">
          <div className="grid w-full items-center gap-1.5">
            <input
              className=" px-2 w-full rounded-xl placeholder-c-white block bg-transparent border focus:outline-none py-3"
              required
              placeholder="Email"
              id="email"
              type="email"
              value={loginData.email}
              name="email"
              onChange={ handleInputChange}
            />
                {validationError.email && (
            <span className="text-red-500 text-sm">{validationError.email}</span>
          )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <input
              className=" px-2 w-full rounded-xl placeholder-c-white block bg-transparent border focus:outline-none py-3"
              required
              placeholder="Password"
              id="password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={ handleInputChange}
            />
                {validationError.password && (
            <span className="text-red-500 text-sm">{validationError.password}</span>
          )}
          </div>
          {error instanceof Error ? error.message : ""}
          <div className="w-full">
            <button className="w-full bg-white text-black  rounded-2xl py-3">
              Login
            </button>
          </div>
        </form>
        <p className="text-center">
          Need to create an account?{" "}
          <a className="text-indigo-500 hover:underline" href="/register">
            Create Account
          </a>{" "}
        </p>
      </div>
    </>
  );
};

export default AuthForm;
