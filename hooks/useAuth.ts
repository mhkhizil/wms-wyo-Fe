import { LoginData, LoginResponse } from "@/pages/dto/authDto";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (loginData: LoginData): Promise<LoginResponse> => {
      const response = await fetch(`https://api-wai.yethiha.com/authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    },

    onSuccess: (data) => {
      // Store the token in cookies
      setCookie("token", data.token, { maxAge: 60 * 60 * 24 }); // Cookie valid for 1 day
      alert("Login successful");
    },

    onError: () => {
      alert("Login failed");
    },
  });
};
