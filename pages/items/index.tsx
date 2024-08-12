//To modiy =>
// 1.zod error ko alert bar nk pya yan ,
// 2.suceess mssage twy ll tt tt yat yat pya yan,
//3.table ko khwel
//4.modal ko modify lk design kor component pr kwhel
//5.logo htl 
//6.side bar 
//7 loader
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { CiEdit } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import Loader from "../components/Loader";
import InputModel from "../components/InputModel";
import { item, itemList, NewItemData, newItemSchema } from "../dto/itemDto";
import { useCreateItem, useDeleteItem, useGetAllItems, useGetItem, useUpdateItem } from "@/hooks/useItemData";
import toast from "react-hot-toast";
//type of data fetching from endpoint
// export const newItemSchema = z.object({
//   name: z.string().trim().min(1, "Name is required"),
//   manufacturer: z.string().trim().min(1, "Manufacturer is required"),
//   category: z.string().trim().min(1, "Category is required"),
//   price: z.number().positive("Price must be positive"),
//   remark: z.string().trim().min(1, "Remark is required"),
// });
// export type NewItemData = z.infer<typeof newItemSchema>;
const index = () => {
  //state for handling input modal
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  //state for getting itemID for single item fetch
  const [itemId, setItemId] = useState<string | null>(null);
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
  //item data state for fetching single item
  const [singleItem, SetSingleItem] = useState<NewItemData>({
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
    setIsShow(false);
  };
  //modal Open function
  const openCreateItemModal = () => {
    setIsCreateItemModalOpen(true);
  };
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0); // Assuming 0-based index
  const [pageSize, setPageSize] = useState<number>(10);
  //tanstack query for data fetching
  const { data, isLoading, isError } = useGetAllItems(page+1 , pageSize);

  //updating fetched data into state
  useEffect(() => {
    if (data) {
      setItemData(data?.items);
    }
  }, [data]);

  //tanstack query for get individual item
  const {
    data: singleItemData,
    isLoading: isSingleItemLoading,
    isError: isSingleItemError,
  } = useGetItem(itemId);

  //state updator function that will update the itemId state so that useQuery will run for individual item
  const getItem = (id: string) => {
    setItemId(id);
  };
  //showing item handler
  const handleShowItem = (id: string) => {
    getItem(id);
    setIsShow(true);
    handleModel();
  };
  //useEffect for insertng data into state
  useEffect(() => {
    if (singleItemData) {
      SetSingleItem(singleItemData);
    }
  }, [singleItemData]);
  //tanstack query for delete
  const deleteMutation =useDeleteItem(queryClient);
  //delete handler
  const handleDelete = (id: string) => {
    toast((t) => (
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
    ), {
      duration: Infinity,
      style: {
        background: "#141414",
        color: "white",
        padding: "12px",
      }
    });
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
      setIsShow(false);
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
  const columns: ColumnDef<item>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        const name = info.getValue<string>();
        return name.length > 10 ? `${name.slice(0, 10)}...` : name;
      },
    },
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
      cell: (info) => {
        const manufacturer = info.getValue<string>();
        return manufacturer.length > 10
          ? `${manufacturer.slice(0, 10)}...`
          : manufacturer;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => {
        const category = info.getValue<string>();
        return category.length > 10 ? `${category.slice(0, 10)}...` : category;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => {
        const price = info.getValue<number>();
        return price.toLocaleString("en-US") + " Ks";
      },
    },
    {
      accessorKey: "remark",
      header: "Remark",
      cell: (info) => {
        const remark = info.getValue<string>();
        return remark.length > 10 ? `${remark.slice(0, 10)}...` : remark;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row) => (
        <div className=" flex items-center justify-around">
          <button
            onClick={() => openEditItem(row.row.original.id)}
            className=" p-3 hover:text-cyan-500"
          >
            <CiEdit />
          </button>
          <button
            onClick={() => handleShowItem(row.row.original.id)}
            className=" p-3 hover:text-amber-400"
          >
            <IoInformationCircleOutline />
          </button>
          <button className=" p-3 hover:text-red-600">
            <MdDelete onClick={() => handleDelete(row.row.original.id)} />
          </button>
        </div>
      ),
    },
  ];
  //table instance creation
  const table = useReactTable({
    columns,
    data: itemData,
    pageCount: data?Math.ceil(data.count / pageSize):0,
    state: {
      pagination: { pageIndex: page, pageSize },
    },
    manualPagination: true, // Important to manually handle pagination //,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (  ) => setPage(table.getState().pagination.pageIndex),
  });
  //function to get zod error msg for specific field
  const getErrorMessage = (field: string) => {
    const error = zodErrors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  }; //zod error ko alert box nk pya yan
  console.log(page);
    
  
  return (
    <div className=" m-10">
      <Layout>
        <InputModel
          title={isCreate ? "Create Item" : isShow ? "Item" : ""}
          isOpen={isCreateItemModalOpen}
          onClose={closeCreateItemModal}
        >
          {isCreate && (
            <form action="" onSubmit={(e) => handleCreate(newItemData, e)}>
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
                <div className="text-red-600 text-center">
                  {getErrorMessage("manufacturer")}
                </div>
              )}
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
                <div className="text-red-600 text-center">
                  {getErrorMessage("category")}
                </div>
              )}
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
                <div className="text-red-600 text-center">
                  {getErrorMessage("price")}
                </div>
              )}

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
          {isShow && (
            <div>
              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40">
                  Item Name:
                </label>
                <p className=" w-40  ">{singleItem?.name}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Manufacturer:
                </label>
                <p className=" w-40  ">{singleItem?.manufacturer}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Category:
                </label>
                <p className=" w-40  ">{singleItem?.category}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Price:
                </label>
                <p className=" w-40  ">
                  {singleItem?.price.toLocaleString("en-US")} Ks
                </p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Remark:
                </label>
                <p className=" w-40  ">{singleItem?.remark}</p>
              </div>
              <div className=" w-[100%]">
                <button
                  onClick={closeCreateItemModal}
                  className=" border border-slate-400 hover:bg-slate-400  rounded-2xl   w-full py-4 my-3"
                >
                  Done
                </button>
              </div>
            </div>
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

        <div>
          <div className=" flex item-center justify-center ">
            <table className=" border border-slate-400  table-fixed w-[75%]">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup?.id}>
                    {headerGroup?.headers?.map((header) => (
                      <th
                        onClick={header.column.getToggleSortingHandler()}
                        key={header?.id}
                        className=" border border-slate-400 p-6"
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header?.column?.columnDef?.header,
                              header.getContext()
                            )}
                            {
                              // { asc: ` asc`, desc: ` desc` }[
                              //   header.column.getIsSorted() ?? null
                              // ]
                            }
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {itemData.length > 0 ? (
                <tbody>
                  {table?.getRowModel()?.rows?.map((row) => {
                    return (
                      <tr key={row?.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell?.id}
                              className=" border border-slate-400 p-4"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="border-none py-10">
                      <div className=" w-[100%] flex items-center justify-center">
                        <p className="text-white text-center">
                          There is currently no item! Please create items
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          {itemData.length > 0 ? (
            <div className=" flex items-center justify-center">
              <div className=" w-[75%] my-2 flex  items-center justify-center">
                <button
                  onClick={() => {table.setPageIndex(0);
                    setPage(0);
                  }}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardDoubleArrowLeft />
                </button>
                <button
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => {
                    table.previousPage();
                    setPage(table.getState().pagination.pageIndex - 1);
                }}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardArrowLeft />
                </button>
                <button
                  disabled={!table.getCanNextPage()}
                  onClick={() => {
                    table.nextPage();
                    setPage(table.getState().pagination.pageIndex + 1);
                }}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardArrowRight />
                </button>

                <button
                  onClick={() => {
                            table.setPageIndex(table.getPageCount() - 1);
                            setPage(table.getPageCount() - 1);
                        }}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Layout>
    </div>
  );
};
export default index;
