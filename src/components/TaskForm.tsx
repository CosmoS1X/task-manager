import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetStatusesQuery } from '@/api/statusesApi';
import { useGetUsersQuery } from '@/api/usersApi';
import { useGetLabelsQuery } from '@/api/labelsApi';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Multiselect from './Multiselect';
import Button from './Button';
import type { Task } from '@/types';
import Endpoints from '@/endpoints';

const formSchema = (t: TFunction) => {
  const minLength = 1;

  return z.object({
    name: z.string()
      .min(minLength, t('form.errors.min', { count: minLength }))
      .transform((value) => value.trim()),
    description: z.string().optional(),
    status: z.string().min(1, t('form.errors.required')),
    executor: z.string().optional(),
    labels: z.array(z.string()).optional(),
  });
};

export type TaskFormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentTask?: Task;
  onSubmit: SubmitHandler<TaskFormValues>;
};

export default function TaskForm({ currentTask, onSubmit }: Props) {
  const { t } = useTranslation();

  const taskFormValues: TaskFormValues = useMemo(() => ({
    name: currentTask?.name || '',
    description: currentTask?.description || '',
    status: currentTask?.status ? String(currentTask.status.id) : '',
    executor: currentTask?.executor ? String(currentTask.executor.id) : '',
    labels: currentTask?.labels ? currentTask.labels.map((label) => String(label.id)) : [],
  }), [currentTask]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema(t)),
    mode: 'onChange',
    defaultValues: taskFormValues,
  });

  useEffect(() => {
    if (currentTask) {
      reset(taskFormValues);
    }
  }, [currentTask, taskFormValues, reset]);

  const { data: statuses } = useGetStatusesQuery();
  const { data: users } = useGetUsersQuery();
  const { data: labels } = useGetLabelsQuery();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder={t('form.inputs.name')}
        registration={register('name')}
        error={errors.name?.message}
        isDirty={dirtyFields.name}
      />
      <Textarea
        registration={register('description')}
        placeholder={t('form.textarea.description')}
      />
      <Select
        options={statuses}
        registration={register('status')}
        error={errors.status?.message}
      />
      <Select
        options={users}
        registration={register('executor')}
      />
      <Multiselect
        options={labels}
        registration={register('labels')}
      />
      <Button type="submit" variant="primary" isDisabled={isSubmitting || !isValid}>
        {isSubmitting ? t('buttons.sending') : t('buttons.send')}
      </Button>
      <a href={Endpoints.Tasks} className="btn btn-danger ms-1">{t('buttons.cancel')}</a>
    </form>
  );
}

TaskForm.defaultProps = {
  currentTask: undefined,
};

TaskForm.prepareDataForSubmit = (data: TaskFormValues) => ({
  name: data.name,
  description: data.description,
  statusId: Number(data.status),
  executorId: Number(data.executor) || null,
  labelIds: data.labels,
});
