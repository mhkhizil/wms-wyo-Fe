import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react'
import { TableArguments } from '../dto/tableDto';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

const TableFrame = ({columns,itemData,data,page,pageSize,setPage}:TableArguments) => {
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
  return (
    <div className='mt-3'>
    <div className=" flex item-center justify-center ">
      <table className=" border border-slate-400  table-fixed w-[75%]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup?.id}>
              {headerGroup?.headers?.map((header) => (
                <th
                  onClick={header.column.getToggleSortingHandler()}
                  key={header?.id}
                  className=" border border-slate-400 p-3"
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
                        className=" border border-slate-400 p-2"
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
  )
}

export default TableFrame
