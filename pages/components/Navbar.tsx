import Image from "next/image";
import React from "react";
import { IoMdMenu } from "react-icons/io";
import nzAutoLogo from "@/public/pnglogo-1.png"
import avaterIcon from "@/public/avater-icon.jpg"
import { BiUser, BiUserCircle } from "react-icons/bi";
const Navbar = () => {
  return (
    <div className=" shadow-lg shadow-white  bg-[#0c0b0b] mb-10  flex items-center justify-between">
      <div className=" flex items-center justify-around">
        <div>
          <p className=" text-4xl p-4"><IoMdMenu /></p>
        </div>
        <div className=" flex items-center justify-evenly">
        <Image src={nzAutoLogo} alt="Logo" width={120} height={60}/>
        <p className=" italic font-bold text-3xl text-red-600">NZ Auto </p>
        </div>
      </div>
      <div className="  flex items-center justify-center">
      
          <BiUserCircle className="w-[40px] h-[40px] mx-8"/>
          
        </div>
    </div>
  );
};

export default Navbar;
