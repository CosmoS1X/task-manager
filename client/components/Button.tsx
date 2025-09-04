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
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export default function Button({
  type,
  variant,
  size,
  isDisabled,
  children,
  onClick,
  className,
}: Props) {
  const classes = cn('btn', {
    [`btn-${variant}`]: !!variant,
    [`btn-${size}`]: !!size,
  }, className);

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={classes} disabled={isDisabled} onClick={onClick}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  isDisabled: false,
  variant: '',
  size: '',
  onClick: () => {},
  className: '',
};
