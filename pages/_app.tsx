import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated } from "./util/authRelated";
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];

    // If the route is not in the public routes and the user is not authenticated, redirect to login
    if (!publicRoutes.includes(router.pathname) && !isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);
  return(
 
  <>
<Toaster/>
     <QueryClientProvider client={queryClient}>
    
    <Component {...pageProps} />
    </QueryClientProvider>
  </>
  
  ) 
}
