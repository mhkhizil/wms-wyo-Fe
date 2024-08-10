import { DecodedToken, LoginData, LoginResponse } from "@/pages/dto/authDto";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

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
        // Decode the JWT token
        const decodedToken: DecodedToken = jwtDecode(data.token);
      
        // Calculate the lifespan of the cookie
        const maxAge = decodedToken.exp - Math.floor(Date.now() / 1000);
        console.log(maxAge);
        
      // Store the token in cookies
      setCookie("token", data.token,{ maxAge }); 
      alert("Login successful");
    },

    onError: () => {
      alert("Login failed");
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: async (registerData: LoginData): Promise<LoginResponse> => {
      const response = await fetch(`https://api-wai.yethiha.com/authentication/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    },

    onSuccess: (data) => {
      // Store the token in cookies
      // setCookie("token", data.token, { maxAge: 60 * 60 * 24 }); // Cookie valid for 1 day
      alert("Register successful");
    },

    onError: () => {
      alert("Login failed");
    },
  });
};
