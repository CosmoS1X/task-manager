import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  registration: UseFormRegisterReturn;
  placeholder: string;
  defaultValue?: string;
  height?: number;
};

export default function Textarea({ registration, placeholder, defaultValue, height }: Props) {
  return (
    <div className="form-floating mb-3">
      <textarea
        className="form-control"
        id={registration.name}
        name={registration.name}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={registration.ref}
        placeholder={placeholder}
        defaultValue={defaultValue}
        style={{ height: `${height}px` }}
      />
      <label htmlFor={registration.name}>{placeholder}</label>
    </div>
  );
}

Textarea.defaultProps = {
  defaultValue: '',
  height: 100,
};
