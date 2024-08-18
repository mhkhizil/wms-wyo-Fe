import React from "react";
import { MdDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaTools } from "react-icons/fa";
import { useRouter } from "next/router";

const Sidebar = ({ isOpen}: { isOpen: boolean}) => {
    const router=useRouter();
  return (
    <div className={`bg-[#0c0b0b] text-white w-64 h-screen shadow-lg shadow-white fixed transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex flex-col items-center justify-center p-4">
    
        <p className="italic font-bold text-3xl text-red-600 mt-2">NZ Auto</p>
      </div>
      <ul className="flex flex-col gap-6 p-4 mt-10">
        <li onClick={()=>router.push("/")} className="flex items-center gap-4 text-lg hover:text-red-600 cursor-pointer">
          <MdDashboard className="w-6 h-6" />
          <span>Dashboard</span>
        </li>
        <li onClick={()=>router.push("/items")} className="flex items-center gap-4 text-lg hover:text-red-600 cursor-pointer">
          <FaTools className="w-6 h-6" />
          <span>Items</span>
        </li>
      
        <li className="flex items-center gap-4 text-lg hover:text-red-600 cursor-pointer mt-auto">
          <FiLogOut className="w-6 h-6" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
