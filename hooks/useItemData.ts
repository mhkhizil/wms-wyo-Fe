import { item, itemList, NewItemData } from "@/pages/dto/itemDto";

import { useMutation, useQuery } from "@tanstack/react-query";
import { error } from "console";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
//tanstack query for getting all items
const token = getCookie("token");
export const useGetAllItems = (page: number, limit: number) => {
  return useQuery<itemList, Error>({
    queryKey: ["items", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `https://api-wai.yethiha.com/items?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
};
//tanstack query for get individual item
export const useGetItem = (itemId: string | null) => {
  return useQuery<item, Error>({
    queryKey: ["item", itemId],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch(`https://api-wai.yethiha.com/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch item data");
      }
      return await response.json();
    },
    staleTime: 60000,
    retry: 4,
    enabled: !!itemId, // Only run this query if itemId is not null
  });
};
//tanstack query for delteing
export const useDeleteItem = (queryClient: any) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`https://api-wai.yethiha.com/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Add the auth token here
        },
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
    mutationFn: async (newItemData: NewItemData) => {
      const response = await fetch(`https://api-wai.yethiha.com/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add the auth token here
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      return response;
    },

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
    mutationFn: async ({
      itemId,
      updatedItemData,
    }: {
      itemId: string;
      updatedItemData: NewItemData;
    }) => {
      const response = await fetch(
        `https://api-wai.yethiha.com/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItemData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      return response;
    },
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
