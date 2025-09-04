import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import FilterSelect from './FilterSelect';
import Checkbox from './Checkbox';
import Button from './Button';
import type { Status, User, Label } from '@/types';
import { useGetStatusesQuery } from '@/api/statusesApi';
import { useGetUsersQuery } from '@/api/usersApi';
import { useGetLabelsQuery } from '@/api/labelsApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setTaskFilters, resetTaskFilters } from '@/store/taskFiltersSlice';
import { TaskFilterParams } from '@/types';

export default function TaskFilter() {
  const { t } = useTranslation();
  const { data: statuses } = useGetStatusesQuery();
  const { data: users } = useGetUsersQuery();
  const { data: labels } = useGetLabelsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilters = useAppSelector((state) => state.taskFilters);
  const dispatch = useAppDispatch();
  const initialValues = useMemo(() => TaskFilter.getFilterParams(searchParams), [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TaskFilterParams>({ defaultValues: initialValues });

  useEffect(() => {
    reset(initialValues);
    dispatch(setTaskFilters(initialValues));
  }, [initialValues, dispatch, reset]);

  const onSubmit = async (data: TaskFilterParams) => {
    const { status, executor, label, isCreator } = data;
    const params = new URLSearchParams();

    if (status) params.set('status', status);
    if (executor) params.set('executor', executor);
    if (label) params.set('label', label);
    if (isCreator) params.set('isCreator', 'true');

    setSearchParams(params);
    dispatch(setTaskFilters(data));
  };

  const onReset = () => {
    setSearchParams();
    dispatch(resetTaskFilters());
    reset({
      status: '',
      executor: '',
      label: '',
      isCreator: false,
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <FilterSelect options={statuses as Status[]} registration={register('status')} />
            <FilterSelect options={users as User[]} registration={register('executor')} />
            <FilterSelect options={labels as Label[]} registration={register('label')} />
          </div>
          <Checkbox registration={register('isCreator')} />
          <Button type="submit" variant="primary">{t('buttons.show')}</Button>
          <Button
            type="button"
            variant="secondary"
            className="ms-1"
            onClick={onReset}
            isDisabled={!Object.values(currentFilters).some(Boolean) && !isDirty}
          >
            {t('buttons.reset')}
          </Button>
        </form>
      </div>
    </div>
  );
}

type SearchParams = {
  get(name: string): string | null;
};

TaskFilter.getFilterParams = (searchParams: SearchParams): TaskFilterParams => ({
  status: searchParams.get('status') || '',
  executor: searchParams.get('executor') || '',
  label: searchParams.get('label') || '',
  isCreator: searchParams.get('isCreator') === 'true',
});
