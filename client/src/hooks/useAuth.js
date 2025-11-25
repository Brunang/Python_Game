import { useState, useEffect } from 'react';
import userService from '../services/userService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const register = async (username, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.register(username, email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;
