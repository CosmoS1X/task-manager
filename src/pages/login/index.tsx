import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import Title from '@/components/Title';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Endpoints from '@/endpoints';
import { showError } from '@/utils/flash';

const formSchema = (t: TFunction) => z.object({
  email: z.string().email(t('form.errors.email.invalid')).transform((value) => value.toLowerCase()),
  password: z.string().min(1).transform((value) => value.trim()),
});

type FormValues = z.infer<ReturnType<typeof formSchema>>;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema(t)), mode: 'onChange' });

  const onSubmit = async (data: FormValues) => {
    try {
      const isSuccess = await login(data);
      if (isSuccess) navigate(Endpoints.Home);
    } catch (error) {
      showError(t('errors.server'));
      throw error;
    }
  };

  return (
    <>
      <Title text={t('titles.login')} />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder={t('form.inputs.email')}
            registration={register('email')}
            error={errors.email?.message}
            isDirty={dirtyFields.email}
          />
          <Input
            type="password"
            placeholder={t('form.inputs.password')}
            registration={register('password')}
          />
          <Button type="submit" variant="primary" isDisabled={isSubmitting || !isValid}>
            Login
          </Button>
        </form>
      </Card>
    </>
  );
}
