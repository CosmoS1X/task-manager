import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import Card from '@/components/Card';
import UserForm from '@/components/UserForm';
import { useCreateUserMutation } from '@/api/usersApi';
import type { FormValues } from '@/components/UserForm';
import Endpoints from '@/endpoints';
import { useAppDispatch } from '@/store';
import { setUser } from '@/store/authSlice';
import { showError, showSuccess } from '@/utils/flash';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormValues) => {
    try {
      const newUser = await createUser(data).unwrap();
      dispatch(setUser(newUser));
      showSuccess(t('flash.users.create.success'));
      navigate(Endpoints.Users);
    } catch (error) {
      showError(t('error creating user'));
      throw error;
    }
  };

  return (
    <>
      <Title text={t('titles.signUp')} />
      <Card>
        <UserForm onSubmit={onSubmit} />
      </Card>
    </>
  );
}
