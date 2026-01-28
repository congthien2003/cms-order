import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  ButtonSizesClass,
  ButtonVariantClass,
  type ButtonSizes,
  type ButtonVariants,
} from './buttonVariant';

export type ButtonProps = {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  className?: string;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  title?: string;
  tabIndex?: number;
  asChild?: boolean;
};
function Button({
  className,
  variant = 'default',
  size = 'default',
  type,
  label,
  title,
  tabIndex,
  asChild,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type || 'button'}
      data-slot="button"
      title={title}
      tabIndex={tabIndex}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        ButtonSizesClass[size],
        ButtonVariantClass[variant],
        className
      )}
      {...props}
    >
      {props.children}
      {label && <span className="font-medium text-sm">{label}</span>}
    </button>
  );
}

export default Button;
