import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '@/api/tasksApi';
import Title from '@/components/Title';
import Card from '@/components/Card';
import TaskForm from '@/components/TaskForm';
import type { TaskFormValues } from '@/components/TaskForm';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export default function NewTaskPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: task, isError } = useGetTaskByIdQuery(Number(id));
  const [updateTask] = useUpdateTaskMutation();
  const navigate = useNavigate();

  if (isError && !task) {
    navigate(Endpoints.NotFound, { replace: true });
    return null;
  }

  const handleFormSubmit = async (data: TaskFormValues) => {
    const preparedData = TaskForm.prepareDataForSubmit(data);

    try {
      await updateTask({ ...preparedData, id: Number(id) }).unwrap();
      showSuccess(t('flash.tasks.edit.success'));
      navigate(Endpoints.Tasks);
    } catch {
      showError(t('flash.tasks.edit.error'));
    }
  };

  return (
    <>
      <Title text={t('titles.editTask')} />
      <Card>
        <TaskForm currentTask={task} onSubmit={handleFormSubmit} />
      </Card>
    </>
  );
}
