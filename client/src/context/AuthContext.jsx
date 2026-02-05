import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const loginCall = async (userCredential) => {
    setIsFetching(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', userCredential);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      setError(err);
    }
    setIsFetching(false);
  };

  const registerCall = async (userCredential) => {
    setIsFetching(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', userCredential);
      // Automatically login after register or redirect
      await loginCall({ email: userCredential.email, password: userCredential.password });
    } catch (err) {
      setError(err);
    }
    setIsFetching(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isFetching,
        error,
        loginCall,
        registerCall,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
