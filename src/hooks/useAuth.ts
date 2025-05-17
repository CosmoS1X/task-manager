import { useEffect, useMemo } from 'react';
import { useCheckAuthQuery, useLoginMutation, useLogoutMutation } from '@/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, clearUser } from '@/store/authSlice';
import type { Credentials } from '@/types';

export default () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { user, isAuthenticated } = useMemo(() => ({
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
  }), [authState.user, authState.isAuthenticated]);

  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const { data, isLoading } = useCheckAuthQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  const handleLogin = async (credentials: Credentials) => {
    try {
      const response = await login(credentials).unwrap();
      dispatch(setUser(response));
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };
};
