import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import Card from '@/components/Card';
import UserForm from '@/components/UserForm';
import { useCreateUserMutation } from '@/api/usersApi';
import type { UserFormValues } from '@/components/UserForm';
import Endpoints from '@/endpoints';
import { useAppDispatch } from '@/store';
import { setUser } from '@/store/authSlice';
import { showError, showSuccess } from '@/utils/flash';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: UserFormValues) => {
    try {
      const newUser = await createUser(data).unwrap();
      dispatch(setUser(newUser));
      showSuccess(t('flash.users.create.success'));
      navigate(Endpoints.Users);
    } catch (error) {
      showError(t('flash.users.create.error'));
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
