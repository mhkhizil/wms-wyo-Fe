import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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
//type of data fetching from endpoint
export type ItemData = {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  remark: string;
};
const index = () => {
  //item data state
  const [itemData, setItemData] = useState<ItemData[]>([]);
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

    //tanstack query for delete
  const { mutate, error } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`https://api-wai.yethiha.com/items/${id}`, {
        method: "DELETE",
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
    },
    onError: () => {
      alert("error");
    },
  });
  //delete handler
  const handleDelete = (id: string) => {
    alert("Do you want to delete it ?");
    mutate(id);
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
          <button className=" p-3 hover:text-amber-400">
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
  return (
    <div className=" m-10">
      <Layout>
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
            <button className=" border border-slate-400 hover:bg-slate-400  rounded-2xl  px-6 py-2">
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
              </table>
            </div>
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
          </div>
        )}
      </Layout>
    </div>
  );
};

export default index;
