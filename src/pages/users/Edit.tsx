import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import UserForm from '@/components/UserForm';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/services/usersApi';
import type { FormValues } from '@/components/UserForm';
import Endpoints from '@/endpoints';

export default function EditUserPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: user } = useGetUserByIdQuery(Number(id));
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    await updateUser({ ...data, id: Number(id) }).unwrap();
    navigate(Endpoints.Users);
  };

  return (
    <>
      <Title text={t('titles.editUser')} />
      <UserForm currentUser={user} onSubmit={onSubmit} isEditing />
    </>
  );
}
