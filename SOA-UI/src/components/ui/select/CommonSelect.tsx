/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type SelectOption = {
  value: string;
  label: string | React.ReactNode;
  disabled?: boolean;
};

type SelectGroupOption = {
  label?: string | React.ReactNode;
  options: SelectOption[];
};

type CommonSelectProps = {
  control?: any;
  name?: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  required?: boolean;
  groups?: SelectGroupOption[] | null;
  triggerClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
};

export function CommonSelect(props: CommonSelectProps) {
  const {
    control,
    name,
    label,
    placeholder,
    required,
    groups,
    triggerClassName,
    value,
    onValueChange,
    error,
  } = props;

  const renderSelect = (
    selectValue?: string,
    handleChange?: (value: string) => void
  ) => (
    <Select value={selectValue} onValueChange={handleChange}>
      <SelectTrigger className={cn('w-full', triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {groups?.map((group, gIndex) => (
          <SelectGroup key={gIndex}>
            {group.label && <SelectLabel>{group.label}</SelectLabel>}

            {group.options?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );

  /* ================= FORM MODE ================= */
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
            )}

            <FormControl>
              {renderSelect(field.value, field.onChange)}
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

      {renderSelect(value, onValueChange)}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
