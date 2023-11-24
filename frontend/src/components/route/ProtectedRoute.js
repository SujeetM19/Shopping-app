import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  return (
    <>
      {!loading && (
        <>
          {isAuthenticated ? (
            <Component /> // Renders child routes when authenticated
          ) : (
            <Navigate to="/login" /> // Redirects to login if not authenticated
          )}
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
