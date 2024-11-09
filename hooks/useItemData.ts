import { item, itemList, NewItemData } from "@/pages/dto/itemDto";
import { apiRequest } from "@/pages/util/reqHelper";

import { useMutation, useQuery } from "@tanstack/react-query";
import { error } from "console";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
//tanstack query for getting all items
const token = getCookie("token");
export const useGetAllItems = (page: number, limit: number) => {
  return useQuery<itemList, Error>({
    queryKey: ["items", page, limit],
    queryFn: () => apiRequest(`/items?limit=${limit}&page=${page}`),

    staleTime: 60000 * 1, // Keep data fresh for 5 minutes
    // refetchInterval:1000
    retry: 4, // Retry failed requests up to 2 times
  });
};
//tanstack query for get individual item
export const useGetItem = (itemId?: string | string[]) => {
  return useQuery<item, Error>({
    queryKey: ["item", itemId],
    queryFn: () => apiRequest(`/items/${itemId}`),
    staleTime: 60000,
    retry: 4,
    enabled: !!itemId, // Only run this query if itemId is not null
  });
};
//tanstack query for delteing
export const useDeleteItem = (queryClient: any) => {
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/items/${id}`, { method: "DELETE" }, false),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "active",
      });
      toast.success("Item deleted!", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
  });
};
export const useCreateItem = (queryClient: any) => {
  return useMutation({
    mutationFn: (newItemData: NewItemData) =>
      apiRequest(
        `/items`,
        { method: "POST", body: JSON.stringify(newItemData) },
        false
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "active",
      });
      toast.success("Item created!", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
  });
};
export const useUpdateItem = (queryClient: any) => {
  return useMutation({
    mutationFn: ({
      itemId,
      updatedItemData,
    }: {
      itemId: string;
      updatedItemData: NewItemData;
    }) =>
      apiRequest(
        `/items/${itemId}`,
        { method: "PUT", body: JSON.stringify(updatedItemData) },
        false
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "active",
      });
      toast.success("Item updated!", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#141414",
          color: "white",
          padding: "12px",
        },
      });
    },
  });
};
