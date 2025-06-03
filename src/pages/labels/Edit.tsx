import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetLabelByIdQuery, useUpdateLabelMutation } from '@/api/labelsApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function EditLabelPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: label } = useGetLabelByIdQuery(Number(id));
  const [updateLabel] = useUpdateLabelMutation();

  const handleUpdateLabel = async (data: EntityFormData) => {
    if (!id) return;

    await updateLabel({ ...data, id: Number(id) }).unwrap();
  };

  return (
    <>
      <Title text={t('titles.editLabel')} />
      <EntityFormContainer
        initialEntity={label}
        onSubmitAction={handleUpdateLabel}
        successMessage={t('flash.labels.edit.success')}
        errorMessage={t('flash.labels.edit.error')}
        redirectLink={Endpoints.Labels}
      />
    </>
  );
}
