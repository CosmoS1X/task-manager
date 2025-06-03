import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetStatusByIdQuery, useUpdateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function EditStatusPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: status } = useGetStatusByIdQuery(Number(id));
  const [updateStatus] = useUpdateStatusMutation();

  const handleUpdateStatus = async (data: EntityFormData) => {
    if (!id) return;

    await updateStatus({ ...data, id: Number(id) }).unwrap();
  };

  return (
    <>
      <Title text={t('titles.editStatus')} />
      <EntityFormContainer
        initialEntity={status}
        onSubmitAction={handleUpdateStatus}
        successMessage={t('flash.statuses.edit.success')}
        errorMessage={t('flash.statuses.edit.error')}
        redirectLink={Endpoints.Statuses}
      />
    </>
  );
}
