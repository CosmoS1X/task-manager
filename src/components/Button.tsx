import React from 'react';
import cn from 'classnames';

type Props = {
  type?: 'submit' | 'reset' | 'button';
  isDisabled?: boolean;
  children: string;
  variant?:
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark';
  size?: 'sm' | 'lg';
};

export default function Button({ type, variant, size, isDisabled, children }: Props) {
  const classes = cn('btn', {
    [`btn-${variant}`]: !!variant,
    [`btn-${size}`]: !!size,
  });

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={classes} disabled={isDisabled}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  isDisabled: false,
  variant: '',
  size: '',
};
