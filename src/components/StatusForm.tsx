import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Input from './Input';
import Button from './Button';
import { capitalize } from '@/helpers';
import type { Status } from '@/types';
import Endpoints from '@/endpoints';

const formSchema = (t: TFunction) => {
  const minLength = 1;

  return z.object({
    name: z
      .string()
      .min(minLength, t('form.errors.min', { count: minLength }))
      .transform((value) => capitalize(value.trim())),
  });
};

export type StatusFormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentStatus?: Status;
  onSubmit: SubmitHandler<StatusFormValues>;
  submitError?: string | null;
};

export default function StatusForm({ currentStatus, onSubmit, submitError }: Props) {
  const { t } = useTranslation();
  const [internalSubmitError, setInternalSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(formSchema(t)),
    mode: 'onChange',
    defaultValues: currentStatus,
  });

  const nameValue = watch('name');

  useEffect(() => {
    reset(currentStatus);
  }, [currentStatus, reset]);

  useEffect(() => {
    const error = submitError || internalSubmitError;
    if (error) {
      setError('root', {
        type: 'manual',
        message: error,
      });
    }
  }, [submitError, internalSubmitError, setError]);

  useEffect(() => {
    if (nameValue && nameValue !== currentStatus?.name) {
      clearErrors('root');
      setInternalSubmitError(null);
    }
  }, [nameValue, currentStatus?.name, clearErrors]);

  const handleFormSubmit = async (data: StatusFormValues) => {
    clearErrors('root');

    try {
      await onSubmit(data);
    } catch (error) {
      setInternalSubmitError(error instanceof Error ? error.message : String(error));
    }
  };

  const nameRegistration = register('name', {
    onChange: () => {
      clearErrors('root');
      setInternalSubmitError(null);
    },
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        type="text"
        placeholder={t('form.inputs.name')}
        registration={nameRegistration}
        error={errors.name?.message || errors.root?.message}
        isDirty={dirtyFields.name}
      />
      <Button type="submit" variant="primary" isDisabled={isSubmitting || !isValid}>
        {isSubmitting ? t('buttons.sending') : t('buttons.send')}
      </Button>
      <a href={Endpoints.Statuses} className="btn btn-danger ms-1">{t('buttons.cancel')}</a>
    </form>
  );
}

StatusForm.defaultProps = {
  currentStatus: undefined,
  submitError: null,
};
