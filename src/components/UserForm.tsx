import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Input from '@/components/Input';
import Button from '@/components/Button';
import type { User } from '@/types';
import { capitalize } from '@/helpers';
import Endpoints from '@/endpoints';

const formSchema = (t: TFunction, isEditing: boolean) => {
  const firstNameLength = 2;
  const lastNameLength = 2;
  const passwordLength = 5;

  const baseSchema = z.object({
    firstName: z
      .string()
      .min(firstNameLength, t('form.errors.min', { count: firstNameLength }))
      .transform((value) => capitalize(value.trim())),
    lastName: z
      .string()
      .min(lastNameLength, t('form.errors.min', { count: lastNameLength }))
      .transform((value) => capitalize(value.trim())),
    email: z
      .string()
      .email(t('form.errors.email.invalid'))
      .transform((value) => value.trim().toLowerCase()),
  });

  const passwordBaseSchema = z
    .string()
    .min(passwordLength, t('form.errors.min', { count: passwordLength }))
    .transform((value) => value.trim());

  const passwordSchema = isEditing
    ? z.object({ password: passwordBaseSchema.optional() })
    : z.object({ password: passwordBaseSchema });

  return baseSchema.merge(passwordSchema);
};

export type UserFormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentUser?: User;
  onSubmit: SubmitHandler<UserFormValues>;
  isEditing?: boolean;
};

const checkEmailAvailability = async (email: string) => {
  try {
    const { data } = await axios.get(`/api/check-email?email=${email}`);
    return data.isAvailable;
  } catch {
    return false;
  }
};

export default function UserForm({ currentUser, onSubmit, isEditing = false }: Props) {
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<UserFormValues>({
    resolver: zodResolver(formSchema(t, isEditing)),
    mode: 'onChange',
    defaultValues: currentUser,
  });

  useEffect(() => {
    if (currentUser) {
      reset(currentUser);
    }
  }, [currentUser, reset]);

  const [debouncedEmail] = useDebounce(watch('email'), 500);

  useEffect(() => {
    const checkEmail = async () => {
      if (debouncedEmail && z.string().email().safeParse(debouncedEmail).success) {
        setIsCheckingEmail(true);

        if (currentUser?.email === debouncedEmail) {
          setIsEmailAvailable(true);
          setIsCheckingEmail(false);
          return;
        }

        try {
          const isAvailable = await checkEmailAvailability(debouncedEmail);
          setIsEmailAvailable(isAvailable);
        } catch (error) {
          setIsEmailAvailable(false);
          throw error;
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setIsEmailAvailable(null);
      }
    };

    checkEmail();
  }, [debouncedEmail, currentUser?.email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder={t('form.inputs.firstName')}
        registration={register('firstName')}
        error={errors.firstName?.message}
        isDirty={dirtyFields.firstName}
      />
      <Input
        type="text"
        placeholder={t('form.inputs.lastName')}
        registration={register('lastName')}
        error={errors.lastName?.message}
        isDirty={dirtyFields.lastName}
      />
      <Input
        type="text"
        placeholder={t('form.inputs.email')}
        registration={register('email')}
        error={errors.email?.message || (isEmailAvailable === false ? t('form.errors.email.exists') : null)}
        isDirty={dirtyFields.email}
      />
      <Input
        type="password"
        placeholder={t('form.inputs.password')}
        registration={register('password')}
        error={errors.password?.message}
        isDirty={dirtyFields.password}
      />
      <Button
        type="submit"
        variant="primary"
        isDisabled={isSubmitting || isCheckingEmail || !isValid || !isEmailAvailable}
      >
        {isSubmitting ? t('buttons.sending') : t('buttons.send')}
      </Button>
      {currentUser && <a href={Endpoints.Users} className="btn btn-danger ms-1">{t('buttons.cancel')}</a>}
    </form>
  );
}

UserForm.defaultProps = {
  currentUser: undefined,
  isEditing: false,
};
