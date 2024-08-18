//To modiy =>
// 1.zod error ko alert bar nk pya yan ,
//6.side bar
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import InputModel from "../components/InputModel";
import { item, NewItemData, newItemSchema } from "../dto/itemDto";
import {
  useCreateItem,
  useDeleteItem,
  useGetAllItems,
  useUpdateItem,
} from "@/hooks/useItemData";
import toast from "react-hot-toast";
import TableFrame from "../components/TableFrame";
import { itemColumns } from "../components/itemsCompo/ItemColumnDef";
const index = () => {
  //state for handling input modal
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  //item id for edit
  const [editItemId, setEditItemId] = useState<string>("");
  //zod error handling state
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[]>([]);
  //item data state for fetching
  const [itemData, setItemData] = useState<item[]>([]);
  //item data state for creating
  const [newItemData, setNewItemData] = useState<NewItemData>({
    name: "",
    manufacturer: "",
    category: "",
    price: 0,
    remark: "",
  });
  //item data state for updating item
  const [editItemData, setEditItemData] = useState<NewItemData>({
    name: "",
    manufacturer: "",
    category: "",
    price: 0,
    remark: "",
  });
  //input change handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditItemData({
        ...editItemData,
        [name]: name === "price" ? Number(value) : value,
      });
    } else {
      setNewItemData({
        ...newItemData,
        [name]: name === "price" ? Number(value) : value,
      });
    }
  };
  //Modal state
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] =
    useState<boolean>(false);
  //modal close  function
  const closeCreateItemModal = () => {
    setIsCreateItemModalOpen(false);
    setIsCreate(false);
    setIsEdit(false);
  };
  //modal Open function
  const openCreateItemModal = () => {
    setIsCreateItemModalOpen(true);
  };
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0); // Assuming 0-based index
  const [pageSize, setPageSize] = useState<number>(10);
  //tanstack query for data fetching
  const { data, isLoading, isError } = useGetAllItems(page + 1, pageSize);
  //updating fetched data into state
  useEffect(() => {
    if (data) {
      setItemData(data?.items);
    }
  }, [data]);
  //tanstack query for delete
  const deleteMutation = useDeleteItem(queryClient);
  //delete handler
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <span>
          Do you want to delete this item?
          <button
            onClick={() => {
              deleteMutation.mutate(id);
              toast.dismiss(t.id);
            }}
            className="ml-4 text-red-600 hover:underline"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-green-600 hover:underline"
          >
            No
          </button>
        </span>
      ),
      {
        duration: Infinity,
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      }
    );
  };
  //model  handler
  const handleModel = () => {
    openCreateItemModal();
  };

  //tanstack query mutation for create
  const createMutation = useCreateItem(queryClient);
  //create Handler
  const handleCreate = (newItemData: NewItemData, e: FormEvent) => {
    e.preventDefault();
    const result = newItemSchema.safeParse(newItemData);
    if (!result.success) {
      setZodErrors(result.error.issues);
    } else {
      createMutation.mutate(newItemData);
      closeCreateItemModal();
      setIsCreate(false);
      setIsEdit(false);
      setIsShow(false);
      setNewItemData({
        name: "",
        manufacturer: "",
        category: "",
        price: 0,
        remark: "",
      });
    }
  };
  //open edit button
  const openEditItem = (id: string) => {
    const item = itemData.find((item) => item.id === id);
    if (item) {
      setEditItemId(item?.id);
      setEditItemData(item);
      setIsEdit(true);
      handleModel();
    }
  };
  //mutation for edit
  const updateMutation = useUpdateItem(queryClient);
  //handle edit
  const handleEdit = (
    e: FormEvent,
    itemId: string,
    updatedItemData: NewItemData
  ) => {
    e.preventDefault();
    const result = newItemSchema.safeParse(updatedItemData);
    if (!result.success) {
      setZodErrors(result.error.issues);
    } else {
      updateMutation.mutate({ itemId, updatedItemData });
      closeCreateItemModal();
      setIsCreate(false);
      setIsEdit(false);
      setEditItemData({
        name: "",
        manufacturer: "",
        category: "",
        price: 0,
        remark: "",
      });
    }
  };
  //column def using tanstak table
  const columns = itemColumns(handleDelete, openEditItem);
  //function to get zod error msg for specific field
  const getErrorMessage = (field: string) => {
    const error = zodErrors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  }; //zod error ko alert box nk pya yan

  return (
    <div className="">
      <Layout>
        {/* <DetailComponent singleItem={singleItem}/> */}
        <InputModel
          title={isCreate ? "Create Item" : isEdit ? "Edit Item" : ""}
          isOpen={isCreateItemModalOpen}
          onClose={closeCreateItemModal}
        >
          {isCreate && (
            <form action="" onSubmit={(e) => handleCreate(newItemData, e)}>
              <div className=" mb-8">
                <div className=" flex items-center justify-center m-4 ">
                  <label htmlFor="" className=" w-[50%]">
                    Item Name:
                  </label>
                  <input
                    name="name"
                    onChange={handleInputChange}
                    type="text"
                    className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                  />
                </div>
                {getErrorMessage("name") && (
                  <div className="text-red-600 text-center">
                    {getErrorMessage("name")}
                  </div>
                )}
              </div>
              <div className="mb-8">
                <div className=" flex items-center justify-center m-4 ">
                  <label htmlFor="" className=" w-[50%]">
                    Manufacturer:
                  </label>
                  <input
                    name="manufacturer"
                    onChange={handleInputChange}
                    type="text"
                    className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                  />
                </div>
                {getErrorMessage("manufacturer") && (
                  <div className="text-red-600 text-center ms-12">
                    {getErrorMessage("manufacturer")}
                  </div>
                )}
              </div>
              <div  className="mb-8">
                <div className=" flex items-center justify-center m-4 ">
                  <label htmlFor="" className=" w-[50%]">
                    Category:
                  </label>
                  <input
                    name="category"
                    onChange={handleInputChange}
                    type="text"
                    className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                  />
                </div>
                {getErrorMessage("category") && (
                  <div className="text-red-600 text-center ms-3">
                    {getErrorMessage("category")}
                  </div>
                )}
              </div>
              <div  className="mb-8">
                <div className=" flex items-center justify-center m-4 ">
                  <label htmlFor="" className=" w-[50%]">
                    Price:
                  </label>
                  <input
                    name="price"
                    onChange={handleInputChange}
                    type="text"
                    className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                  />
                </div>
                {getErrorMessage("price") && (
                  <div className="text-red-600 text-center ms-6">
                    {getErrorMessage("price")}
                  </div>
                )}
              </div>
              <div  className="mb-8">
                <div className=" flex items-center justify-center m-4 ">
                  <label htmlFor="" className=" w-[50%]">
                    Remark:
                  </label>
                  <input
                    name="remark"
                    onChange={handleInputChange}
                    type="text"
                    className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                  />
                </div>
                {getErrorMessage("remark") && (
                  <div className="text-red-600  flex items-center justify-center">
                    {getErrorMessage("remark")}
                  </div>
                )}
              </div>
              <div className=" w-[100%]">
                <button className=" border border-slate-400 hover:bg-slate-400  rounded-2xl   w-full py-4 my-3">
                  Create
                </button>
              </div>
            </form>
          )}

          {isEdit && (
            <form
              action=""
              onSubmit={(e) => handleEdit(e, editItemId, editItemData)}
            >
              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-[50%]">
                  Item Name:
                </label>
                <input
                  value={editItemData?.name}
                  name="name"
                  onChange={(e) => handleInputChange(e, isEdit)}
                  type="text"
                  className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                />
              </div>
              {getErrorMessage("name") && (
                <div className="text-red-600 text-center">
                  {getErrorMessage("name")}
                </div>
              )}
              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-[50%]">
                  Manufacturer:
                </label>
                <input
                  value={editItemData?.manufacturer}
                  name="manufacturer"
                  onChange={(e) => handleInputChange(e, isEdit)}
                  type="text"
                  className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                />
              </div>
              {getErrorMessage("manufacturer") && (
                <div className="text-red-600 text-center">
                  {getErrorMessage("manufacturer")}
                </div>
              )}
              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-[50%]">
                  Category:
                </label>
                <input
                  value={editItemData?.category}
                  name="category"
                  onChange={(e) => handleInputChange(e, isEdit)}
                  type="text"
                  className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                />
              </div>
              {getErrorMessage("category") && (
                <div className="text-red-600 text-center">
                  {getErrorMessage("category")}
                </div>
              )}
              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-[50%]">
                  Price:
                </label>
                <input
                  value={editItemData?.price}
                  name="price"
                  onChange={(e) => handleInputChange(e, isEdit)}
                  type="text"
                  className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                />
              </div>
              {getErrorMessage("price") && (
                <div className="text-red-600 text-center">
                  {getErrorMessage("price")}
                </div>
              )}

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-[50%]">
                  Remark:
                </label>
                <input
                  value={editItemData?.remark}
                  name="remark"
                  onChange={(e) => handleInputChange(e, isEdit)}
                  type="text"
                  className="   px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                />
              </div>
              {getErrorMessage("remark") && (
                <div className="text-red-600 text-center">
                  {getErrorMessage("remark")}
                </div>
              )}
              <div className=" w-[100%]">
                <button className=" border border-slate-400 hover:bg-slate-400  rounded-2xl   w-full py-4 my-3">
                  Create
                </button>
              </div>
            </form>
          )}
        </InputModel>
        <div className=" my-5">
          <div className=" my-3 flex item-center justify-center ">
            <h1 className=" text-3xl  ">Items</h1>
          </div>
          <div className="  flex items-center justify-center">
            <div className=" w-[75%]">
              <div className="   my-4 flex  items-center justify-between">
                <div className="w-[50%] flex items-center justify-around">
                  <input
                    type="text"
                    placeholder="Search"
                    className=" w-[70%] px-4 py-2 bg-transparent border border-slate-500 rounded-2xl  "
                  />
                  <button
                    onClick={() => {
                      setIsCreate(true);
                      handleModel();
                    }}
                    className=" w-[25%] border border-slate-400 hover:bg-slate-400  rounded-2xl  px-4 py-2"
                  >
                    Create
                  </button>
                </div>
                <div className=" w-[10%] flex items-center justify-around">
                  <p>filter </p>
                  <p>sort </p>
                </div>
                <div className=" w-24"></div>
              </div>
            </div>
          </div>

          <TableFrame
            columns={columns}
            itemData={itemData}
            data={data}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
          />
        </div>
      </Layout>
    </div>
  );
};
export default index;
