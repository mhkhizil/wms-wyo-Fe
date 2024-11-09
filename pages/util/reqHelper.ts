import { getCookie } from "cookies-next";

const BASE_URL = "http://localhost:1337";
const token = getCookie("token");

// Helper function for API requests
// Helper function for API requests
export const apiRequest = async (url: string, options: RequestInit = {}, json: boolean = true) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Request failed");
  
  return json ? await response.json() : response;
};