import React from 'react';
import { typographyVariants } from './typographyVariant';

export type TypographyVariant = keyof typeof typographyVariants;

type Props = {
  children: React.ReactNode;
  variant?: TypographyVariant;
  as?: React.ElementType;
  className?: string;
};

const Typography: React.FC<Props> = ({
  children,
  variant = 'default',
  as: Component = 'span',
  className = '',
}) => {
  return (
    <Component className={`${typographyVariants[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export default Typography;
