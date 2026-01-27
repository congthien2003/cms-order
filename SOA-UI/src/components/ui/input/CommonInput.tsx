/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { Typography } from '../typography';
import { Input } from '../input';

type InputProps = {
  value?: string;
  control?: any;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  pattern?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function RenderInput({
  label,
  placeholder,
  className,
  type = 'text',
  disabled = false,
  min,
  max,
  maxLength,
  pattern,
  onChange,
}: InputProps) {
  return (
    <>
      <Typography variant="body-m-medium">{label}</Typography>
      <Input
        disabled={disabled}
        type={type}
        className={className}
        placeholder={placeholder}
        min={min}
        max={max}
        maxLength={maxLength}
        pattern={pattern}
        onChange={onChange}
      />
    </>
  );
}

function CommonInput({
  control,
  name,
  label,
  placeholder,
  className,
  type = 'text',
  disabled = false,
  required = false,
  min,
  max,
  maxLength,
  pattern,
}: InputProps) {
  if (control && name) {
    return (
      <>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  type={type}
                  className={className}
                  placeholder={placeholder}
                  min={min}
                  max={max}
                  maxLength={maxLength}
                  pattern={pattern}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return (
    <RenderInput
      label={label}
      type={type}
      className={className}
      placeholder={placeholder}
    />
  );
}

export default CommonInput;
