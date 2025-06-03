import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateLabelMutation } from '@/api/labelsApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function NewLabelPage() {
  const { t } = useTranslation();
  const [createLabel] = useCreateLabelMutation();

  const handleCreateLabel = async (data: EntityFormData) => {
    await createLabel(data).unwrap();
  };

  return (
    <>
      <Title text={t('titles.createLabel')} />
      <EntityFormContainer
        onSubmitAction={handleCreateLabel}
        successMessage={t('flash.labels.create.success')}
        errorMessage={t('flash.labels.create.error')}
        redirectLink={Endpoints.Labels}
      />
    </>
  );
}
