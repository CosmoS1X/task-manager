import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetStatusByIdQuery, useUpdateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import StatusFormContainer from '@/components/StatusFormContainer';
import type { StatusFormData } from '@/components/StatusFormContainer';

export default function EditStatus() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: status } = useGetStatusByIdQuery(Number(id));
  const [updateStatus] = useUpdateStatusMutation();

  const handleUpdateStatus = async (data: StatusFormData) => {
    if (!id) return;

    await updateStatus({ ...data, id: Number(id) }).unwrap();
  };

  return (
    <>
      <Title text={t('titles.editStatus')} />
      <StatusFormContainer
        initialStatus={status}
        onSubmitAction={handleUpdateStatus}
        successMessage={t('flash.statuses.edit.success')}
        errorMessage={t('flash.statuses.edit.error')}
      />
    </>
  );
}
