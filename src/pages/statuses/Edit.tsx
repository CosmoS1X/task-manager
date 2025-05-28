import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStatusByIdQuery, useUpdateStatusMutation } from '@/api/statusesApi';
import Title from '@/components/Title';
import Card from '@/components/Card';
import StatusForm from '@/components/StatusForm';
import type { StatusFormValues } from '@/components/StatusForm';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export default function EditStatus() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: status } = useGetStatusByIdQuery(Number(id));
  const [updateStatus] = useUpdateStatusMutation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: StatusFormValues) => {
    try {
      await updateStatus({ ...data, id: Number(id) }).unwrap();
      showSuccess(t('flash.statuses.edit.success'));
      navigate(Endpoints.Statuses);
    } catch (error) {
      showError(t('flash.statuses.edit.error'));
      setSubmitError(t('form.errors.name.exists'));
      throw error;
    }
  };

  return (
    <>
      <Title text={t('titles.editStatus')} />
      <Card>
        <StatusForm currentStatus={status} onSubmit={onSubmit} submitError={submitError} />
      </Card>
    </>
  );
}
