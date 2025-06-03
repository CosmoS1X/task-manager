import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function NewStatusPage() {
  const { t } = useTranslation();
  const [createStatus] = useCreateStatusMutation();

  const handleCreateStatus = async (data: EntityFormData) => {
    await createStatus(data).unwrap();
  };

  return (
    <>
      <Title text={t('titles.createStatus')} />
      <EntityFormContainer
        onSubmitAction={handleCreateStatus}
        successMessage={t('flash.statuses.create.success')}
        errorMessage={t('flash.statuses.create.error')}
        redirectLink={Endpoints.Statuses}
      />
    </>
  );
}
