import React, { HTMLInputTypeAttribute } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import cn from 'classnames';

type Props = {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string | null;
  defaultValue?: string;
};

export default function Input({ type, placeholder, registration, error, defaultValue }: Props) {
  const inputClasses = cn('form-control', { 'is-invalid': !!error });

  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className={inputClasses}
        id={registration.name}
        placeholder={placeholder}
        name={registration.name}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={registration.ref}
        defaultValue={defaultValue}
      />
      <label htmlFor={registration.name}>{placeholder}</label>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

Input.defaultProps = {
  error: null,
  defaultValue: undefined,
};
