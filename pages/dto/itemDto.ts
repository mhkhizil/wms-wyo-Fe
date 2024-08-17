import { z } from "zod";

export type item={
    id: string,
    name: string,
    manufacturer: string,
    category: string,
    price: number,
    quantity: number,
    alert_on_qty: number,
    remark: string,
    buys:[] 
}
export type itemList={
    count:number ,
    items:item[]
}
export const newItemSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    manufacturer: z.string().trim().min(1, "Manufacturer is required"),
    category: z.string().trim().min(1, "Category is required"),
    price: z.number().positive("Price must be positive"),
    remark: z.string().trim().min(1, "Remark is required"),
  });
  export type NewItemData = z.infer<typeof newItemSchema>;
  export type propNewItemData={
    singleItem:NewItemData,
    handleButton:()=>void
  }