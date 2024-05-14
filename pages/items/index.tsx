//To modiy => zod error ko alert bar nk pya yan ,empty state mhr table size pyin yan ,modal opening closing animation htl yan ,suceess mssage twy ll tt tt yat yat pya yan
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
import InputModel from "../components/inputModel";
//type of data fetching from endpoint
export type ItemData = {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  remark: string;
};
export const newItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  manufacturer: z.string().trim().min(1, "Manufacturer is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  remark: z.string().trim().min(1, "Remark is required"),
});
export type NewItemData = z.infer<typeof newItemSchema>;
const index = () => {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string | null>(null);
  //zod error handling state
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[]>([]);
  //item data state for fetching
  const [itemData, setItemData] = useState<ItemData[]>([]);
  //item data state for creating
  const [newItemData, setNewItemData] = useState<NewItemData>({
    name: "",
    manufacturer: "",
    category: "",
    price: 0,
    remark: "",
  });
  //input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItemData({
      ...newItemData,
      [name]: name === "price" ? Number(value) : value,
    });
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
  //tanstack query for data fetching
  const { data, isLoading, isError } = useQuery<ItemData[], Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(`https://api-wai.yethiha.com/items`);
      if (!response.ok) {
        throw new Error("Failed to fetch item data");
      }

      // Update data directly inside queryFn
      return await response.json();
    },

    staleTime: 60000 * 1, // Keep data fresh for 5 minutes
    // refetchInterval:1000
    retry: 4, // Retry failed requests up to 2 times
  });
  //updating fetched data into state
  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);
  //tanstack query for get individual item
  const {
    data: singleItemData,
    isLoading: isSingleItemLoading,
    isError: isSingleItemError,
  } = useQuery<ItemData, Error>({
    queryKey: ["item", itemId],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch(`https://api-wai.yethiha.com/items/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch item data");
      }
      return await response.json();
    },
    staleTime: 60000,
    retry: 4,
    enabled: !!itemId, // Only run this query if itemId is not null
  });
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
  //tanstack query for delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`https://api-wai.yethiha.com/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "active",
      });
    },
    onError: () => {
      alert("error");
    },
  });
  //delete handler
  const handleDelete = (id: string) => {
    if (confirm("Do you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };
  //model  handler
  const handleModel = () => {
    openCreateItemModal();
  };

  //tanstack query mutation for create
  const createMutation = useMutation({
    mutationFn: async (newItemData: NewItemData) => {
      const response = await fetch(`https://api-wai.yethiha.com/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemData),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "active",
      });
      alert("Item created");
    },
    onError: () => {
      alert("error:");
    },
  });

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
  //column def using tanstak table
  const columns: ColumnDef<ItemData>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "manufacturer",
      header: "Manufacturer",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "remark",
      header: "Remark",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row) => (
        <div className=" flex items-center justify-around">
          <button className=" p-3 hover:text-cyan-500">
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
    data: isLoading ? [] : itemData, //,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  console.log(singleItemData);
  //function to get zod error msg for specific field
  const getErrorMessage = (field: string) => {
    const error = zodErrors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  }; //zod error ko alert box nk pya yan
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
                <p className=" w-40  ">{singleItemData?.name}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Manufacturer:
                </label>
                <p className=" w-40  ">{singleItemData?.manufacturer}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Category:
                </label>
                <p className=" w-40  ">{singleItemData?.category}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Price:
                </label>
                <p className=" w-40  ">{singleItemData?.price}</p>
              </div>

              <div className=" flex items-center justify-center m-4 ">
                <label htmlFor="" className=" w-40  ">
                  Remark:
                </label>
                <p className=" w-40  ">{singleItemData?.remark}</p>
              </div>
            </div>
          )}
          {isEdit && (
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
        </InputModel>
        <div className=" flex item-start justify-center ">
          <h1 className=" text-3xl  ">Items</h1>
        </div>
        <div className=" my-4 flex  items-center justify-around">
          <div className=" flex items-center justify-normal">
            <input
              type="text"
              placeholder="Search"
              className="  w-[100%] px-12 py-2 bg-transparent border border-slate-500 rounded-2xl  me-4"
            />
            <button
              onClick={() => {
                setIsCreate(true);
                handleModel();
              }}
              className=" border border-slate-400 hover:bg-slate-400  rounded-2xl  px-6 py-2"
            >
              Create
            </button>
          </div>
          <div className="flex items-center justify-around">
            <p>filter </p>
            <p>sort </p>
          </div>
          <div className=" w-24"></div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div>
            <div className=" flex item-center justify-center ">
              <table className=" border border-slate-400 table-auto">
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
                    {table?.getRowModel()?.rows?.map((row) => (
                      <tr key={row?.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell?.id}
                            className=" border border-slate-400 p-4"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="border-none py-10"
                      >
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
              <div className=" my-2 flex  items-center justify-center">
                <button
                  onClick={() => table.setPageIndex(0)}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardDoubleArrowLeft />
                </button>
                <button
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardArrowLeft />
                </button>
                <button
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardArrowRight />
                </button>

                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  className="mx-1 border border-slate-400 hover:bg-slate-400 px-4 py-2"
                >
                  <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default index;
