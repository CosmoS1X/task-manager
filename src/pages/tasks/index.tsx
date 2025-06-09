import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetTasksQuery, useDeleteTaskMutation } from '@/api/tasksApi';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import type { TableColumns } from '@/types';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';
import { isFetchBaseQueryError } from '@/api/helpers';

export default function TasksPage() {
  const { t } = useTranslation();
  const { data: tasks, isLoading, refetch } = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const onEdit = (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(`${Endpoints.Tasks}/${id}/edit`);
  };

  const onDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteTask(id).unwrap();
      showSuccess(t('flash.tasks.delete.success'));
      refetch();
    } catch (error) {
      const isForbidden = isFetchBaseQueryError(error) && error.status === 403;

      if (isForbidden) {
        showError(t('flash.tasks.delete.forbidden'));
      } else {
        showError(t('flash.tasks.delete.error'));
      }
    }
  };

  const cols: TableColumns<'tasks'> = ['id', 'name', 'status', 'creator', 'executor', 'createdAt'];

  return (
    <>
      <Title text={t('titles.tasks')} />
      <a href={Endpoints.NewTask} className="btn btn-primary">{t('buttons.createTask')}</a>
      {tasks && <Table tableName="tasks" cols={cols} rows={tasks} onEdit={onEdit} onDelete={onDelete} />}
    </>
  );
}
