import { ChangeEvent } from "react";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
export type LoginData =z.infer<typeof loginSchema>;
  
  export type LoginResponse ={
    token: string;
  }
 export  type AuthFormProps= {
    loginData:LoginData,
    handleSubmit: (e: React.FormEvent) => void,
    handleInputChange: (e:ChangeEvent<HTMLInputElement>) => void,
    error?:Error|null,
    isLoading?:boolean,
    validationError:{
      email:string,
      password:string

    }
  }
  