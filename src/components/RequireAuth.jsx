import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('isAdmin');

    if (token && isAdmin === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuth;
