import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStatusByIdQuery, useUpdateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import EntityFormContainer from '@/components/EntityFormContainer';
import type { EntityFormData } from '@/components/EntityFormContainer';
import Endpoints from '@/endpoints';

export default function EditStatusPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: status, isError } = useGetStatusByIdQuery(Number(id));
  const navigate = useNavigate();
  const [updateStatus] = useUpdateStatusMutation();

  if (isError && !status) {
    navigate(Endpoints.NotFound, { replace: true });
    return null;
  }

  const handleUpdateStatus = async (data: EntityFormData) => {
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
