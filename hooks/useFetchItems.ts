import { item, itemList } from "@/pages/dto/itemDto";

import { useQuery } from "@tanstack/react-query";
//tanstack query for getting all items
export const useGetAllItems=()=>{
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcyMjk1NDQ5NSwiZXhwIjoxNzIzMDQwODk1fQ.FE4tdMZIANe3Jt51PCe63h81RK1hb4Ow_1qbvdWfEnY';
   return useQuery<itemList, Error>({
        queryKey: ["items"],
        queryFn: async () => {
          const response = await fetch(`https://api-wai.yethiha.com/items?limit=10&page=1`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
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
}
  //tanstack query for get individual item
  export const useGetItem=(itemId:string|null)=>{
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcyMjk1NDQ5NSwiZXhwIjoxNzIzMDQwODk1fQ.FE4tdMZIANe3Jt51PCe63h81RK1hb4Ow_1qbvdWfEnY';
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
  })};