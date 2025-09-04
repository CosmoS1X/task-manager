import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { useCheckAuthQuery } from '@/api/authApi';
import { setUser } from '@/store/authSlice';

type Props = {
  children: React.ReactNode;
};

export default function AuthInitializer({ children }: Props) {
  const dispatch = useAppDispatch();
  const { data: user } = useCheckAuthQuery();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return children;
}
