import React from "react";
import { IoMdMenu } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="  flex items-center justify-between">
      <div className=" flex items-center justify-around">
        <div>
          <p className=" text-4xl p-4"><IoMdMenu /></p>
        </div>
        <div>
          <p>Wai Yan oo Logo</p>
        </div>
      </div>
      <div className="  flex items-center justify-center">
          <div className={`w-20 h-20 relative rounded-full  `}>
            <img
              className={`  w-full h-full object-cover rounded-full`}
              width={10}
              height={10}
              src={`https://img.icons8.com/?size=512&id=108652&format=png`}
              alt=""
            />
          </div>
        </div>
    </div>
  );
};

export default Navbar;
