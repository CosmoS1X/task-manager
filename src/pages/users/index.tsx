import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import { useGetUsersQuery, useDeleteUserMutation } from '@/api/usersApi';
import type { TableColumns } from '@/types';
import { useAuth } from '@/hooks';
import { showError, showSuccess } from '@/utils/flash';
import Endpoints, { buildEditRoute } from '@/endpoints';

export default function UsersPage() {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const { t } = useTranslation();
  const [deleteUser] = useDeleteUserMutation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onEdit = (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (user?.id !== id) {
      showError(t('flash.users.edit.reject'));
      return;
    }

    navigate(buildEditRoute(Endpoints.Users, id));
  };

  const onDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user?.id !== id) {
      showError(t('flash.users.delete.reject'));
      return;
    }

    try {
      await deleteUser(id).unwrap();
      showSuccess(t('flash.users.delete.success'));
      await logout();
    } catch {
      showError(t('flash.users.delete.error'));
    }
  };

  const cols: TableColumns<'users'> = ['id', 'fullName', 'email', 'createdAt'];

  return (
    <>
      <Title text={t('titles.users')} />
      {users && <Table tableName="users" cols={cols} rows={users} onEdit={onEdit} onDelete={onDelete} />}
    </>
  );
}
