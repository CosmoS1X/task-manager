import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import type { Status, User } from '@/types';

type Props = {
  options: Array<Status | User>;
  registration: UseFormRegisterReturn;
  error?: string | null;
};

export default function Select({ options, registration, error }: Props) {
  const { t } = useTranslation();

  const classes = cn('form-control', {
    'is-invalid': !!error,
  });

  return (
    <div className="form-floating mb-3">
      <select
        className={classes}
        id={registration.name}
        name={registration.name}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={registration.ref}
      >
        <option value="">{t(`form.selects.defaults.${registration.name}`)}</option>
        {options && options.map((option) => (
          <option key={option.id} value={option.id}>
            {'name' in option ? option.name : `${option.firstName} ${option.lastName}`}
          </option>
        ))}
      </select>
      <label htmlFor={registration.name}>{t(`form.selects.${registration.name}`)}</label>
      {error && <div className="form-control-feedback invalid-feedback">{error}</div>}
    </div>
  );
}

Select.defaultProps = {
  error: null,
};
