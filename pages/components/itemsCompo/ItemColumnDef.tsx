import { ColumnDef } from "@tanstack/react-table";
import { CiEdit } from "react-icons/ci";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import { useRouter } from "next/router";
import { item } from "@/pages/dto/itemDto";

export const itemColumns = (handleDelete: (id: string) => void, openEditItem: (id: string) => void) : ColumnDef<item>[] => {
  const router = useRouter();
  return  [
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
            // handleShowItem(row.row.original.id)
            onClick={() => router.push(`/items/${row.row.original.id}`)}
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
};
