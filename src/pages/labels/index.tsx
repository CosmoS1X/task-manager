import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetLabelsQuery, useDeleteLabelMutation } from '@/api/labelsApi';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import type { TableColumns } from '@/types';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints, { buildEditRoute } from '@/endpoints';

export default function LabelsPage() {
  const { t } = useTranslation();
  const { data: labels, isLoading, refetch } = useGetLabelsQuery();
  const [deleteLabel] = useDeleteLabelMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onEdit = (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(buildEditRoute(Endpoints.Labels, id));
  };

  const onDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteLabel(id).unwrap();
      showSuccess(t('flash.labels.delete.success'));
      refetch();
    } catch {
      showError(t('flash.labels.delete.error'));
    }
  };

  const cols: TableColumns<'labels'> = ['id', 'name', 'createdAt'];

  return (
    <>
      <Title text={t('titles.labels')} />
      <a href={Endpoints.NewLabel} className="btn btn-primary">{t('buttons.createLabel')}</a>
      {labels && <Table tableName="labels" cols={cols} rows={labels} onEdit={onEdit} onDelete={onDelete} />}
    </>
  );
}
