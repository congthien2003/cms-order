/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type RadioOption = {
  value: string;
  label?: string | React.ReactNode;
  disabled?: boolean;
};

type CommonRadioGroupProps = {
  /* ---------- form ---------- */
  control?: any;
  name?: string;

  /* ---------- base ---------- */
  label?: string | React.ReactNode;
  required?: boolean;
  options?: RadioOption[] | null;
  direction?: 'vertical' | 'horizontal';
  itemClassName?: string;

  /* ---------- non-form ---------- */
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
};

export function CommonRadioGroup(props: CommonRadioGroupProps) {
  const {
    control,
    name,
    label,
    required,
    options,
    direction = 'vertical',
    itemClassName,
    value,
    onValueChange,
    error,
  } = props;

  const renderOptions = (
    selectedValue?: string,
    handleChange?: (value: string) => void
  ) => (
    <RadioGroup
      value={selectedValue}
      onValueChange={handleChange}
      className={cn(
        direction === 'horizontal' ? 'flex gap-6' : 'flex flex-col gap-3'
      )}
    >
      {options?.map((opt, index) => {
        const id = `${name ?? 'radio'}-${index}`;

        return (
          <div
            key={opt.value}
            className={cn('flex items-center gap-3', itemClassName)}
          >
            <RadioGroupItem id={id} value={opt.value} disabled={opt.disabled} />
            {opt.label && <Label htmlFor={id}>{opt.label}</Label>}
          </div>
        );
      })}
    </RadioGroup>
  );

  /* ================= FORM MODE ================= */
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }: any) => (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
            )}

            <FormControl>
              {renderOptions(field.value, field.onChange)}
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  /* ================= NORMAL MODE ================= */
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {renderOptions(value, onValueChange)}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
