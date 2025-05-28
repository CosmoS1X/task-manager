import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Title from '@/components/Title';
import Card from '@/components/Card';
import StatusForm from '@/components/StatusForm';
import type { StatusFormValues } from '@/components/StatusForm';
import { useCreateStatusMutation } from '@/api/statusesApi';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export default function NewStatus() {
  const { t } = useTranslation();
  const [createStatus] = useCreateStatusMutation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: StatusFormValues) => {
    try {
      await createStatus(data).unwrap();
      showSuccess(t('flash.statuses.create.success'));
      navigate(Endpoints.Statuses);
    } catch (error) {
      showError(t('flash.statuses.create.error'));
      setSubmitError(t('form.errors.name.exists'));
      throw error;
    }
  };

  return (
    <>
      <Title text={t('titles.createStatus')} />
      <Card>
        <StatusForm onSubmit={onSubmit} submitError={submitError} />
      </Card>
    </>
  );
}
