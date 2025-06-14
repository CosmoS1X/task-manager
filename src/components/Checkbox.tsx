import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  registration: UseFormRegisterReturn;
};

export default function Checkbox({ registration }: Props) {
  const { t } = useTranslation();

  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id={registration.name}
        name={registration.name}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={registration.ref}
      />
      <label htmlFor={registration.name} className="form-check-label">
        {t(`form.checkboxes.${registration.name}`)}
      </label>
    </div>
  );
}
