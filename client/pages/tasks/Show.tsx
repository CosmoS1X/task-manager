import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTaskByIdQuery } from '@/api/tasksApi';
import Title from '@/components/Title';
import Spinner from '@/components/Spinner';
import TaskCard from '@/components/TaskCard';
import Endpoints from '@/endpoints';
import { formatDate, buildFullName } from '@/helpers';
import type { User, Status, Label } from '@/types';
import { useTaskActions } from '@/hooks';

export default function ShowTaskPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: task, isLoading, isError } = useGetTaskByIdQuery(Number(id));
  const { handleDelete } = useTaskActions();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !task) {
    navigate(Endpoints.NotFound, { replace: true });
    return null;
  }

  return (
    <>
      <Title text={task.name} />
      <TaskCard>
        <TaskCard.Description description={task.description ?? ''} />
        <TaskCard.Metadata>
          <TaskCard.Badges
            status={(task.status as Status).name}
            labels={(task.labels as Label[]).map((label) => label.name)}
          />
          <TaskCard.Info
            name={t('tableCols.creator')}
            value={buildFullName(task.creator as User)}
          />
          <TaskCard.Info
            name={t('tableCols.executor')}
            value={buildFullName(task.executor as User)}
          />
          <TaskCard.Info
            name={t('tableCols.createdAt')}
            value={formatDate(task.createdAt)}
          />
          <TaskCard.Actions
            taskId={task.id}
            onDelete={handleDelete}
          />
        </TaskCard.Metadata>
      </TaskCard>
    </>
  );
}
