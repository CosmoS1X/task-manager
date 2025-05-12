import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';

export default function StatusesPage() {
  const { t } = useTranslation();

  return <Title text={t('titles.statuses')} />;
}
