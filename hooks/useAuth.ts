//insert helper function to query data 

import { DecodedToken, LoginData, LoginResponse } from "@/pages/dto/authDto";
import { apiRequest } from "@/pages/util/reqHelper";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import toast, { ToastBar } from "react-hot-toast";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (loginData: LoginData): Promise<LoginResponse> => {
      const data = await apiRequest("/authentication/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      return data;
    },

    onSuccess: (data) => {
      // Decode the JWT token
      const decodedToken: DecodedToken = jwtDecode(data.token);

      // Calculate the lifespan of the cookie
      const maxAge = decodedToken.exp - Math.floor(Date.now() / 1000);

      // Store the token in cookies
      setCookie("token", data.token, { maxAge });
      // showAlert('success', "Success", 'Showing success tailwind alert')
      // toast.success("Login successful");
      toast.success("Login Successfull!", {
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
export const useRegister = () => {
  return useMutation({
    mutationFn: async (registerData: LoginData): Promise<LoginResponse> => {
      const data = await apiRequest("/authentication/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      return data;
    },
    // mutationFn: async (loginData: LoginData) => {
    //   return fetchData<LoginResponse>("/authentication/login", "POST", loginData,undefined,"Register failed");
    // },
    onSuccess: (data) => {
      // Store the token in cookies
      // setCookie("token", data.token, { maxAge: 60 * 60 * 24 }); // Cookie valid for 1 day
      toast.success("Register Successfull!", {
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
