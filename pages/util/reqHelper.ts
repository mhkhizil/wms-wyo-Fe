// api.ts
const BASE_URL = "https://api-wai.yethiha.com";

export const fetchData = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  token?: string,
  errorMsg?:string
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || errorMsg);
  }

  return response.json();
};

// export const showToast = (
//   message: string,
//   type: "success" | "error"
// ): void => {
//   toast[type](message, {
//     duration: 5000,
//     position: "bottom-right",
//     style: {
//       background: "#141414",
//       color: "white",
//       padding: "12px",
//     },
//   });
// };
