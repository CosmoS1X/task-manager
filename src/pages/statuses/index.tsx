import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetStatusesQuery, useDeleteStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import type { TableColumns } from '@/types';
import { showError, showSuccess } from '@/utils/flash';
import Endpoints, { buildEditRoute } from '@/endpoints';

export default function StatusesPage() {
  const { t } = useTranslation();
  const { data: statuses, isLoading, refetch } = useGetStatusesQuery();
  const [deleteStatus] = useDeleteStatusMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onEdit = (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(buildEditRoute(Endpoints.Statuses, id));
  };

  const onDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteStatus(id).unwrap();
      showSuccess(t('flash.statuses.delete.success'));
      refetch();
    } catch {
      showError(t('flash.statuses.delete.error'));
    }
  };

  const cols: TableColumns<'statuses'> = ['id', 'name', 'createdAt'];

  return (
    <>
      <Title text={t('titles.statuses')} />
      <a href={Endpoints.NewStatus} className="btn btn-primary">{t('buttons.createStatus')}</a>
      {statuses && <Table tableName="statuses" cols={cols} rows={statuses} onEdit={onEdit} onDelete={onDelete} />}
    </>
  );
}
