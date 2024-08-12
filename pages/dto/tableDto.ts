import { ColumnDef } from "@tanstack/react-table";
import { item, itemList } from "./itemDto";

export type TableArguments = {
  columns: ColumnDef<item>[];
  itemData: item[];
  data?: itemList;
  page: number;
  pageSize: number;
  setPage: (pageIndex: number) => void;
};
