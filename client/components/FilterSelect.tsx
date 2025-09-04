import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormRegisterReturn } from 'react-hook-form';
import type { Status, User, Label } from '@/types';

type Props = {
  options: Array<Status | User | Label>;
  registration: UseFormRegisterReturn;
};

export default function FilterSelect({ options, registration }: Props) {
  const { t } = useTranslation();

  const renderOptions = () => options.map((option) => (
    <option key={option.id} value={option.id}>
      {'name' in option ? option.name : `${option.firstName} ${option.lastName}`}
    </option>
  ));

  return (
    <div className="col-12 col-md">
      <div className="input-group mb-3">
        <label htmlFor={registration.name} className="input-group-text">
          {t(`form.selects.${registration.name}`)}
        </label>
        <select
          className="form-select"
          id={registration.name}
          name={registration.name}
          onChange={registration.onChange}
          onBlur={registration.onBlur}
          ref={registration.ref}
        >
          <option value="">{t(`form.selects.defaults.${registration.name}`)}</option>
          {options && renderOptions()}
        </select>
      </div>
    </div>
  );
}
