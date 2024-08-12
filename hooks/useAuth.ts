import { DecodedToken, LoginData, LoginResponse } from "@/pages/dto/authDto";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import toast, { ToastBar } from "react-hot-toast";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (loginData: LoginData): Promise<LoginResponse> => {
      const response = await fetch(
        `https://api-wai.yethiha.com/authentication/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        throw new Error("User name or password invalid");
      }

      const data = await response.json();
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
      const response = await fetch(
        `https://api-wai.yethiha.com/authentication/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      if (!response.ok) {
        throw new Error("Register failed");
      }

      const data = await response.json();
      return data;
    },

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
