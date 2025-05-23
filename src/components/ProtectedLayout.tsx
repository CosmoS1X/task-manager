import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useCheckAuthQuery } from '@/api/authApi';
import Spinner from './Spinner';
import Endpoints from '@/endpoints';

export default function ProtectedLayout() {
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  const { isLoading, isError } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      setAuthCheckCompleted(true);
    }
  }, [isLoading]);

  if (!authCheckCompleted) {
    return <Spinner />;
  }

  if (isError || !isAuthenticated) {
    return <Navigate to={Endpoints.Login} replace />;
  }

  return <Outlet />;
}
