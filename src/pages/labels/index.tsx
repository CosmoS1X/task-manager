import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';

export default function LabelsPage() {
  const { t } = useTranslation();

  return <Title text={t('titles.labels')} />;
}
