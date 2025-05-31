import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import StatusFormContainer from '@/components/StatusFormContainer';
import type { StatusFormData } from '@/components/StatusFormContainer';

export default function NewStatus() {
  const { t } = useTranslation();
  const [createStatus] = useCreateStatusMutation();

  const handleCreateStatus = async (data: StatusFormData) => {
    await createStatus(data).unwrap();
  };

  return (
    <>
      <Title text={t('titles.createStatus')} />
      <StatusFormContainer
        onSubmitAction={handleCreateStatus}
        successMessage={t('flash.statuses.create.success')}
        errorMessage={t('flash.statuses.create.error')}
      />
    </>
  );
}
