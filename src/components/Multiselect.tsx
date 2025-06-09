import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Label } from '@/types';

type Props = {
  options: Label[] | undefined;
  registration: UseFormRegisterReturn;
};

export default function Multiselect({ options, registration }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <label className="text-secondary small mb-1" htmlFor={registration.name}>{t(`form.selects.${registration.name}`)}</label>
      <select
        className="form-control"
        id={registration.name}
        name={registration.name}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={registration.ref}
        multiple
      >
        {options && options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}
