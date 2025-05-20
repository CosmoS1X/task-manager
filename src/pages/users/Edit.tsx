import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import UserForm from '@/components/UserForm';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/api/usersApi';
import type { FormValues } from '@/components/UserForm';
import Endpoints from '@/endpoints';
import { showSuccess, showError } from '@/utils/flash';

export default function EditUserPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: user } = useGetUserByIdQuery(Number(id));
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await updateUser({ ...data, id: Number(id) }).unwrap();
      showSuccess(t('flash.users.edit.success'));
      navigate(Endpoints.Users);
    } catch (error) {
      showError(t('flash.users.edit.error'));
      throw error;
    }
  };

  return (
    <>
      <Title text={t('titles.editUser')} />
      <UserForm currentUser={user} onSubmit={onSubmit} isEditing />
    </>
  );
}
