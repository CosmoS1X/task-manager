import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/Input';
import Button from '@/components/Button';
import type { User } from '@/types';
import { capitalize } from '@/helpers';
import Endpoints from '@/endpoints';
import { isFetchBaseQueryError } from '@/api/helpers';
import { showError } from '@/utils/flash';

const shouldRequireCurrentPassword = (data: { currentPassword?: string, newPassword?: string }) => {
  const isCurrentPasswordProvided = Boolean(data.currentPassword);
  const isNewPasswordProvided = Boolean(data.newPassword);

  if (!isCurrentPasswordProvided && isNewPasswordProvided) return false;

  return true;
};

const shouldConfirmPassword = (data: {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}) => {
  const isPasswordConfirmed = (data.password || data.newPassword) === data.confirmPassword;

  if (isPasswordConfirmed) return true;

  return false;
};

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

  const requiredInputSchema = z.string().min(1, t('form.errors.required'));

  const passwordBaseSchema = z
    .string()
    .min(passwordLength, t('form.errors.min', { count: passwordLength }))
    .transform((value) => value.trim());

  const passwordEditSchema = z.object({
    currentPassword: requiredInputSchema.optional(),
    newPassword: passwordBaseSchema.optional(),
    confirmPassword: requiredInputSchema.optional(),
  })
    .refine(shouldRequireCurrentPassword, {
      message: t('form.errors.required'),
      path: ['currentPassword'],
    })
    .refine(shouldConfirmPassword, {
      message: t('form.errors.password.mismatch'),
      path: ['confirmPassword'],
    });

  const passwordCreateSchema = z.object({
    password: passwordBaseSchema,
    confirmPassword: requiredInputSchema,
  }).refine(shouldConfirmPassword, {
    message: t('form.errors.password.mismatch'),
    path: ['confirmPassword'],
  });

  const passwordSchema = isEditing ? passwordEditSchema : passwordCreateSchema;

  return baseSchema.and(passwordSchema);
};

export type UserFormValues = z.infer<ReturnType<typeof formSchema>>;

type Props = {
  currentUser?: User;
  onSubmit: SubmitHandler<UserFormValues>;
  isEditing?: boolean;
};

const checkEmailAvailability = async (email: string) => {
  try {
    const response = await fetch(`/api/check-email?email=${email}`);
    const data = await response.json();
    return data.isAvailable;
  } catch {
    return false;
  }
};

export default function UserForm({ currentUser, onSubmit, isEditing = false }: Props) {
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
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
  const currentPasswordValue = watch('currentPassword');

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

  const submitHandler: SubmitHandler<UserFormValues> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const isForbidden = isFetchBaseQueryError(error) && error.status === 403;

      if (isForbidden) {
        setError('currentPassword', {
          type: 'manual',
          message: t('form.errors.password.invalid'),
        });

        showError(t('flash.users.edit.error'));
      }
    }
  };

  const renderPasswordFields = () => {
    type Errors = typeof errors;
    type DirtyFields = typeof dirtyFields;

    type CurrentPasswordError = Errors & { currentPassword: FieldError };
    type CurrentPasswordDirtyFields = DirtyFields & { currentPassword: boolean };

    type NewPasswordError = Errors & { newPassword: FieldError };
    type NewPasswordDirtyFields = DirtyFields & { newPassword: boolean };

    type ConfirmPasswordError = Errors & { confirmPassword: FieldError };
    type ConfirmPasswordDirtyFields = DirtyFields & { confirmPassword: boolean };

    type PasswordError = Errors & { password: FieldError };
    type PasswordDirtyFields = DirtyFields & { password: boolean };

    const shouldShowChangePasswordButton = isEditing && !showPasswordFields;

    if (shouldShowChangePasswordButton) {
      return (
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          className="d-block mb-3"
          onClick={() => setShowPasswordFields(true)}
        >
          {t('buttons.changePassword')}
        </Button>
      );
    }

    if (shouldShowPasswordFields) {
      return (
        <>
          <Input
            type="password"
            placeholder={t('form.inputs.currentPassword')}
            registration={register('currentPassword')}
            error={(errors as { currentPassword: { message: string } }).currentPassword?.message}
            isDirty={(dirtyFields as { currentPassword: boolean }).currentPassword}
          />
          <Input
            type="password"
            placeholder={t('form.inputs.newPassword')}
            registration={register('newPassword')}
            error={(errors as { newPassword: { message: string } }).newPassword?.message}
            isDirty={(dirtyFields as { newPassword: boolean }).newPassword}
          />
          <Input
            type="password"
            placeholder={t('form.inputs.confirmPassword')}
            registration={register('confirmPassword')}
            error={(errors as { confirmPassword: { message: string } }).confirmPassword?.message}
            isDirty={(dirtyFields as { confirmPassword: boolean }).confirmPassword}
          />
        </>
      );
    }

    return (
      <>
        <Input
          type="password"
          placeholder={t('form.inputs.password')}
          registration={register('password')}
          error={(errors as { password: { message: string } }).password?.message}
          isDirty={(dirtyFields as { password: boolean }).password}
        />
        <Input
          type="password"
          placeholder={t('form.inputs.confirmPassword')}
          registration={register('confirmPassword')}
          error={(errors as { confirmPassword: { message: string } }).confirmPassword?.message}
          isDirty={(dirtyFields as { confirmPassword: boolean }).confirmPassword}
        />
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
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
        isDisabled={isEditing}
      />

      {renderPasswordFields()}

      <Button
        type="submit"
        variant="primary"
        isDisabled={
          isSubmitting
          || isCheckingEmail
          || !isValid
          || !isEmailAvailable
          || (isEditing && showPasswordFields && !currentPasswordValue)
        }
      >
        {isSubmitting ? t('buttons.sending') : t('buttons.send')}
      </Button>
      {currentUser && (
        <a href={Endpoints.Users} className="btn btn-danger ms-1">
          {t('buttons.cancel')}
        </a>
      )}
    </form>
  );
}

UserForm.defaultProps = {
  currentUser: undefined,
  isEditing: false,
};

UserForm.prepareDataForSubmit = (data: UserFormValues) => {
  const baseData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  };

  if ('password' in data) {
    return {
      ...baseData,
      password: data.password,
    };
  }

  if ('newPassword' in data && data.newPassword) {
    return {
      ...baseData,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
  }

  return baseData;
};
