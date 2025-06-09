import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateTaskMutation } from '@/api/tasksApi';
import Title from '@/components/Title';
import Card from '@/components/Card';
import TaskForm from '@/components/TaskForm';
import type { TaskFormValues } from '@/components/TaskForm';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export default function NewTaskPage() {
  const { t } = useTranslation();
  const [createTask] = useCreateTaskMutation();
  const navigate = useNavigate();

  const handleFormSubmit = async (data: TaskFormValues) => {
    const preparedData = TaskForm.prepareDataForSubmit(data);

    try {
      await createTask(preparedData).unwrap();
      showSuccess(t('flash.tasks.create.success'));
      navigate(Endpoints.Tasks);
    } catch {
      showError(t('flash.tasks.create.error'));
    }
  };

  return (
    <>
      <Title text={t('titles.createTask')} />
      <Card>
        <TaskForm onSubmit={handleFormSubmit} />
      </Card>
    </>
  );
}
