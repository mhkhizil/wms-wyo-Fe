import React, { ChangeEvent, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router';
import { useLogin } from '@/hooks/useAuth';
import { getCookie } from 'cookies-next';
import { loginSchema } from '../dto/authDto';

const index = () => {
const [loginData,setLoginData]=useState({
  email:'',
  password:''
});
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
const handleInputChange = (
  e: ChangeEvent<HTMLInputElement>,

) => {
  const { name, value } = e.target;
  setLoginData({
    ...loginData,
    [name]: value,
  });
};
  const { mutate: login, isError, error } = useLogin(); // Destructure the mutate function and states from useLogin
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {email,password}=loginData
       // Zod validation
       const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
     // If validation passes, reset errors and proceed with login
     setErrors({});
    login(
      loginData, // Pass the login data to the mutate function
      {
        onSuccess: () => {
          router.push('/'); // Redirect to the dashboard on successful login
        },
      }
    );
    setLoginData({
      email:'',
      password:''
    })
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center " >
      <AuthForm loginData={loginData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} error ={error} validationError={errors} />
    </div>
  )
}

export default index
