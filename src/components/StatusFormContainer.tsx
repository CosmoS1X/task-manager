import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import StatusForm from './StatusForm';
import type { StatusFormValues } from './StatusForm';
import type { Status } from '@/types';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export type StatusFormData = {
  name: string;
  id?: number;
};

type Props = {
  initialStatus?: Status;
  onSubmitAction: (data: StatusFormData) => Promise<void>;
  successMessage: string;
  errorMessage: string;
};

export default function StatusFormContainer({
  initialStatus,
  onSubmitAction,
  successMessage,
  errorMessage,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: StatusFormValues) => {
    try {
      await onSubmitAction(data);
      showSuccess(successMessage);
      navigate(Endpoints.Statuses);
    } catch (error) {
      showError(errorMessage);
      setSubmitError(t('form.errors.name.exists'));
      throw error;
    }
  };

  return (
    <Card>
      <StatusForm currentStatus={initialStatus} onSubmit={onSubmit} submitError={submitError} />
    </Card>
  );
}

StatusFormContainer.defaultProps = {
  initialStatus: undefined,
};
