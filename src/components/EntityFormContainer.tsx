import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import EntityForm from './EntityForm';
import type { EntityFormValues } from './EntityForm';
import type { Status, Label } from '@/types';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints from '@/endpoints';

export type EntityFormData = {
  name: string;
  id?: number;
};

type Props = {
  initialEntity?: Status | Label;
  onSubmitAction: (data: EntityFormData) => Promise<void>;
  successMessage: string;
  errorMessage: string;
  redirectLink: Endpoints;
};

export default function EntityFormContainer({
  initialEntity,
  onSubmitAction,
  successMessage,
  errorMessage,
  redirectLink,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: EntityFormValues) => {
    try {
      await onSubmitAction(data);
      showSuccess(successMessage);
      navigate(redirectLink);
    } catch (error) {
      showError(errorMessage);
      setSubmitError(t('form.errors.name.exists'));
      throw error;
    }
  };

  return (
    <Card>
      <EntityForm
        currentEntity={initialEntity}
        onSubmit={onSubmit}
        submitError={submitError}
        redirectLink={redirectLink}
      />
    </Card>
  );
}

EntityFormContainer.defaultProps = {
  initialEntity: undefined,
};
