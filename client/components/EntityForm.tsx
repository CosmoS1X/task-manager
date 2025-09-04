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
import type { Status, Label } from '@/types';
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

export type EntityFormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentEntity?: Status | Label;
  onSubmit: SubmitHandler<EntityFormValues>;
  submitError?: string | null;
  redirectLink: Endpoints;
};

export default function EntityForm({ currentEntity, onSubmit, submitError, redirectLink }: Props) {
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
  } = useForm<EntityFormValues>({
    resolver: zodResolver(formSchema(t)),
    mode: 'onChange',
    defaultValues: currentEntity,
  });

  const nameValue = watch('name');

  useEffect(() => {
    reset(currentEntity);
  }, [currentEntity, reset]);

  useEffect(() => {
    const error = submitError || internalSubmitError;
    if (error) {
      setError('root', { message: error });
    }
  }, [submitError, internalSubmitError, setError]);

  useEffect(() => {
    if (nameValue && nameValue !== currentEntity?.name) {
      clearErrors('root');
      setInternalSubmitError(null);
    }
  }, [nameValue, currentEntity?.name, clearErrors]);

  const handleInputChange = () => {
    clearErrors('root');
    setInternalSubmitError(null);
  };

  const handleFormSubmit = async (data: EntityFormValues) => {
    handleInputChange();

    try {
      await onSubmit(data);
    } catch (error) {
      setInternalSubmitError(error instanceof Error ? error.message : String(error));
    }
  };

  const nameRegistration = register('name', {
    onChange: handleInputChange,
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
      <a href={redirectLink} className="btn btn-danger ms-1">{t('buttons.cancel')}</a>
    </form>
  );
}

EntityForm.defaultProps = {
  currentEntity: undefined,
  submitError: null,
};
