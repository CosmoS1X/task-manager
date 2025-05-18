import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import Spinner from './Spinner';
import Endpoints from '@/endpoints';

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={Endpoints.Login} replace />;
  }

  return <Outlet />;
}

export default React.memo(ProtectedLayout);
