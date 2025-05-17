import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import { useGetUsersQuery, useDeleteUserMutation } from '@/api/usersApi';
import type { ColNamesUnion } from '@/types';

export default function UsersPage() {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const { t } = useTranslation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await deleteUser(id);
    refetch();
  };

  const cols: ColNamesUnion[] = ['id', 'fullName', 'email', 'createdAt'];

  return (
    <>
      <Title text={t('titles.users')} />
      {users && <Table name="users" cols={cols} rows={users} onDelete={onDelete} />}
    </>
  );
}
