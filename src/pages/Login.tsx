import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/Title';

export default function LoginPage() {
  const { t } = useTranslation();

  return <Title text={t('titles.login')} />;
}
