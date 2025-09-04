import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLabelByIdQuery, useUpdateLabelMutation } from '@/api/labelsApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function EditLabelPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: label, isError } = useGetLabelByIdQuery(Number(id));
  const navigate = useNavigate();
  const [updateLabel] = useUpdateLabelMutation();

  if (isError && !label) {
    navigate(Endpoints.NotFound, { replace: true });
    return null;
  }

  const handleUpdateLabel = async (data: EntityFormData) => {
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
