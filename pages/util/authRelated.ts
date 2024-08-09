import { getCookie } from 'cookies-next';

export const isAuthenticated = (): boolean => {
  const token = getCookie('token');
  return !!token; // Return true if the token exists
};
