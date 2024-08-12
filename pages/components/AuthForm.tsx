import React from "react";
import { AuthFormProps } from "../dto/authDto";
import Link from "next/link";

const AuthForm: React.FC<AuthFormProps> = ({
  registerData,
 loginData,
  handleSubmit,
  error,
  handleInputChange,
  validationError,
  title,
  switchPageSentence,
  linkText,
  linkPath,
  confirmPassword

}) => {
  console.log(registerData);
  console.log(confirmPassword);
  
  
  return (
    <>
      <div className="shadow-xl shadow-white px-8 pb-8 pt-12 border-2 border-white rounded-3xl space-y-12">
        <h1 className="font-semibold text-2xl text-bold text-center">{title}</h1>
        <form onSubmit={handleSubmit} className="space-y-12 w-full sm:w-[400px]">
        {registerData && (
              <div className="grid w-full items-center gap-1.5">
              <input
                className=" px-2 w-full rounded-xl placeholder-c-white block bg-transparent border focus:outline-none py-3"
                required
                placeholder="Name"
                id="name"
                type="text"
                name="name"
                value={registerData?.name}
                onChange={ handleInputChange}
              />
                  {validationError?.name && (
              <span className="text-red-500 text-sm">{validationError.name}</span>
            )}
            </div>
          )}
          <div className="grid w-full items-center gap-1.5">
            
            <input
              className=" px-2 w-full rounded-xl placeholder-c-white block bg-transparent border focus:outline-none py-3"
              required
              placeholder="Email"
              id="email"
              type="email"
              value={loginData?loginData.email:registerData?.email}
              name="email"
              onChange={ handleInputChange}
            />
                {validationError?.email && (
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
              value={loginData?loginData.password:registerData?.password}
              onChange={ handleInputChange}
            />
                {validationError?.password && (
            <span className="text-red-500 text-sm">{validationError.password}</span>
          )}
          </div>
          {registerData && (
              <div className="grid w-full items-center gap-1.5">
              <input
                className=" px-2 w-full rounded-xl placeholder-c-white block bg-transparent border focus:outline-none py-3"
                required
                placeholder="Confirm Password"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={ handleInputChange}
              />
                  {validationError?.confirmPassword && (
              <span className="text-red-500 text-sm">{validationError.confirmPassword}</span>
            )}
            </div>
          )}
       
          <div className="w-full">
            <button className="w-full bg-white text-black  rounded-2xl py-3">
              {title}
            </button>
          </div>
        </form>
        <p className="text-center">
        {switchPageSentence}
          <Link className="text-indigo-500 hover:underline" href={linkPath}>
       {linkText}
          </Link>
        </p>
      </div>
    </>
  );
};

export default AuthForm;
