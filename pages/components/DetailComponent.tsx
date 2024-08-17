"use client";
import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { NewItemData, propNewItemData } from "../dto/itemDto";

const DetailComponent = ({ singleItem, handleButton }: propNewItemData) => {
  // const editImage = document.querySelector(".file");

  return (
    <div className={`w-full h-screen  flex justify-around items-center `}>
      <main className={`flex items-center mt-24`}>
        <section className={`w-full `}>
          <div className={`w-full relative py-4 p-8 bg-[#171717] rounded`}>
            <div
              className={` my-2 w-24 h-24 absolute  top-2 rounded-full border flex justify-center items-center`}
            >
              <img
                className={`w-full h-full object-cover rounded-full`}
                src={""}
                alt=""
              />
              <div
                // onClick={() => editImage.click()}
                className={`flex justify-center cursor-pointer absolute bg-[#f5f5f5] right-3  bottom-1 items-center text-xs gap-1 border-2 rounded-full w-8 h-8 px-1 py-0.5`}
              >
                <MdOutlineEdit className="text-slate-700" />
                <input className="file hidden" type="file" name="" id="" />
              </div>
            </div>
            <div className={`flex items-center justify-between mx-10 ml-52`}>
              <div className={``}>
                <h2>{""}</h2>
                <div className=" my-4 block">
                  <p className="inline">Sale Price:</p>{" "}
                  <span className=" inline">
                    {singleItem.price.toLocaleString("en-US")}
                  </span>{" "}
                  <p className=" inline">mmk</p>
                </div>
                <div className=" my-4 block">
                  <p className="inline">Actual Price:</p>
                  <span className="inline">{""}</span>
                  <p className=" inline">mmk</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex items-center bg-[#161618] gap-10 px-8 border-b py-5`}
            >
              <div className="flex items-center gap-2">
                <BiSolidUser />
                <h4> Information</h4>
              </div>
            </div>
            <div className=" w-full  overflow-y-auto px-10 py-5 flex flex-col gap-5 bg-[#1a1a1a]">
              <div className="flex">
                <p className="w-[30%]">Item name</p>
                <p className="w-[70%]">: {singleItem.name}</p>
              </div>
              <div className="flex">
                <p className="w-[30%]">Manufacturer</p>
                <p className="w-[70%]">: {singleItem.manufacturer}</p>
              </div>
              <div className="flex">
                <p className="w-[30%]">Category</p>
                <p className="w-[70%]">: {singleItem.category}</p>
              </div>

              <div className="flex  overscroll-auto">
                <p className="w-[30%] inline">Remark</p>
                <p className="w-[70%] inline ">: {singleItem.remark} </p>
              </div>
              <div className=" w-full">
                <button onClick={handleButton} className=" w-[100%] py-2 bg-white text-black rounded-2xl">
                  Done
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DetailComponent;
