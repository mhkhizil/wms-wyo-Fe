import { item, itemList, NewItemData } from "@/pages/dto/itemDto";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
//tanstack query for getting all items
const token = getCookie("token");
export const useGetAllItems = () => {
  return useQuery<itemList, Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(
        `https://api-wai.yethiha.com/items?limit=10&page=1`,
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
    },
    onError: () => {
      alert("error");
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
      alert("Item updated successfully");
    },
    onError: () => {
      alert("Failed to update item");
    },
  });
};
