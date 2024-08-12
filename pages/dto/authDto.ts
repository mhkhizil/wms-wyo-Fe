import { ChangeEvent } from "react";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1,"Email is required").email("Invalid email address"),
  password: z.string().min(1,"Password is required"),
});
export type LoginData =z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type RegisterData = Omit<z.infer<typeof registerSchema>, 'confirmPassword'>;


  export type LoginResponse ={
    token: string;
  }


 export  type AuthFormProps= {
  isPending:boolean,
  registerData?:RegisterData,
    loginData?:LoginData,
    handleSubmit: (e: React.FormEvent) => void,
    handleInputChange: (e:ChangeEvent<HTMLInputElement>) => void,
    error?:Error|null,
    isLoading?:boolean,
    validationError?:{
      email?:string|null,
      password?:string|null,
      name?:string|null,
      confirmPassword?:string|null

    },
    title:string,
    switchPageSentence:string,
    linkText:string,
    linkPath:string,
    confirmPassword?:string
  }
  export type DecodedToken ={
    exp: number; // Expiration time in seconds since the Unix epoch
  }