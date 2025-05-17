import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import Card from '@/components/Card';
import UserForm from '@/components/UserForm';
import { useCreateUserMutation } from '@/api/usersApi';
import type { FormValues } from '@/components/UserForm';
import Endpoints from '@/endpoints';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    await createUser(data).unwrap();
    navigate(Endpoints.Users);
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
