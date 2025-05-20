import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginMutation, useLogoutMutation, authUtil } from '@/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, clearUser } from '@/store/authSlice';
import type { Credentials } from '@/types';
import { showSuccess, showError } from '@/utils/flash';

export default () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  const handleLogin = async (credentials: Credentials) => {
    try {
      const response = await login(credentials).unwrap();
      dispatch(setUser(response));
      showSuccess(t('flash.login.success'));
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      dispatch(authUtil.resetApiState());
      showSuccess(t('flash.logout.success'));
      return true;
    } catch (error) {
      showError(t('flash.logout.error'));
      dispatch(clearUser());
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
