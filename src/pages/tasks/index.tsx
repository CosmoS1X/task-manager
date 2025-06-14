import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGetTasksQuery } from '@/api/tasksApi';
import Title from '@/components/Title';
import Table from '@/components/Table';
import Spinner from '@/components/Spinner';
import TaskFilter from '@/components/TaskFilter';
import type { TableColumns } from '@/types';
import Endpoints from '@/endpoints';
import useTaskActions from '@/hooks/useTaskActions';

export default function TasksPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const filterParams = TaskFilter.getFilterParams(searchParams);
  const { data: tasks, isLoading, refetch } = useGetTasksQuery(filterParams);
  const { handleEdit, handleDelete } = useTaskActions();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  const cols: TableColumns<'tasks'> = ['id', 'name', 'status', 'creator', 'executor', 'createdAt'];

  return (
    <>
      <Title text={t('titles.tasks')} />
      <a href={Endpoints.NewTask} className="btn btn-primary mb-5">{t('buttons.createTask')}</a>
      <TaskFilter />
      {tasks && <Table tableName="tasks" cols={cols} rows={tasks} onEdit={handleEdit} onDelete={handleDelete} />}
    </>
  );
}
