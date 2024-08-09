import React, { ChangeEvent, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { getCookie } from 'cookies-next';
import { loginSchema, registerSchema } from '../dto/authDto';

const index = () => {
const [registerData,setRegisterData]=useState({
  email:'',
  name:'',
  password:''
});
const [confirmPassword, setConfirmPassword] = useState(''); 
const [errors, setErrors] = useState<{ email?: string; password?: string ;name?:string;confirmPassword?:string}>({});
const handleInputChange = (
  e: ChangeEvent<HTMLInputElement>,

) => {
  const { name, value } = e.target;
  if (name === 'confirmPassword') {
    setConfirmPassword(value); // Update confirmPassword separately
  } else {
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  }
};
  const { mutate: register, isError, error } = useRegister(); // Destructure the mutate function and states from useLogin
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {email,name,password,}=registerData
       // Zod validation
       const validationResult = registerSchema.safeParse({ email, password,name,confirmPassword });

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string;name?:string ;confirmPassword?:string} = {};
      validationResult.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
     // If validation passes, reset errors and proceed with login
     setErrors({});
    register(
      registerData, // Pass the login data to the mutate function
      {
        onSuccess: () => {
          router.push('/login'); // Redirect to the login on successful login
        },
      }
    );
    setRegisterData({
      email:'',
      name:'',
      password:''
    });
    setConfirmPassword('')
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center " >
     
     <AuthForm confirmPassword={confirmPassword} title='Register' switchPageSentence='Already have an account?' linkText='  Login' linkPath='/login' registerData={registerData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} error ={error} validationError={errors} />
    </div>
  )
}

export default index
