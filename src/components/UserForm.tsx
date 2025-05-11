import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useEmailCheck } from '@/hooks';
import type { User } from '@/types';

const formSchema = (t: TFunction, isEditing: boolean) => {
  const firstNameLength = 2;
  const lastNameLength = 2;
  const passwordLength = 5;

  const baseSchema = z.object({
    firstName: z.string().min(firstNameLength, t('form.errors.min', { count: firstNameLength })),
    lastName: z.string().min(lastNameLength, t('form.errors.min', { count: lastNameLength })),
    email: z.string().email(t('form.errors.email.invalid')),
  });

  const passwordSchema = isEditing
    ? z.object({
      password: z.string().min(passwordLength, t('form.errors.min', { count: passwordLength })).optional(),
    })
    : z.object({
      password: z.string().min(passwordLength, t('form.errors.min', { count: passwordLength })),
    });

  return baseSchema.merge(passwordSchema);
};

export type FormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentUser?: User;
  onSubmit: SubmitHandler<FormValues>;
  isEditing?: boolean;
};

export default function UserForm({ currentUser, onSubmit, isEditing = false }: Props) {
  const { t } = useTranslation();
  const { checkEmailExists } = useEmailCheck(currentUser?.id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema(t, isEditing)),
    mode: 'onChange',
    defaultValues: currentUser,
  });

  useEffect(() => {
    if (currentUser) {
      reset(currentUser);
    }
  }, [currentUser, reset]);

  const emailValue = watch('email');
  const isEmailExists = checkEmailExists(emailValue);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder={t('form.inputs.firstName')}
        registration={register('firstName')}
        error={errors.firstName?.message}
      />
      <Input
        type="text"
        placeholder={t('form.inputs.lastName')}
        registration={register('lastName')}
        error={errors.lastName?.message}
      />
      <Input
        type="text"
        placeholder={t('form.inputs.email')}
        registration={register('email')}
        error={
          errors.email?.message || (isEmailExists ? t('form.errors.email.exists') : null)
        }
      />
      <Input
        type="password"
        placeholder={t('form.inputs.password')}
        registration={register('password')}
        error={errors.password?.message}
      />
      <Button
        type="submit"
        variant="primary"
        isDisabled={isSubmitting || isEmailExists || !isValid}
      >
        {isSubmitting ? t('buttons.sending') : t('buttons.send')}
      </Button>
    </form>
  );
}

UserForm.defaultProps = {
  currentUser: undefined,
  isEditing: false,
};
