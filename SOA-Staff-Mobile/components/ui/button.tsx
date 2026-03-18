import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  View,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  const baseStyles = {
    container: "",
    text: "",
  };

  if (disabled) {
    return {
      container: "bg-slate-200 dark:bg-slate-800 opacity-70",
      text: "text-slate-400 dark:text-slate-600",
    };
  }

  switch (variant) {
    case "primary":
      return {
        container: "bg-[#2beead] shadow-md shadow-[#2beead]/20 active:opacity-90",
        text: "text-slate-900",
      };
    case "secondary":
      return {
        container: "bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700",
        text: "text-slate-600 dark:text-slate-300",
      };
    case "outline":
      return {
        container:
          "border border-slate-200 dark:border-slate-700 bg-transparent active:bg-slate-50 dark:active:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
      };
    case "ghost":
      return {
        container: "bg-transparent active:bg-slate-100 dark:active:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
      };
    case "destructive":
      return {
        container: "bg-red-500 active:bg-red-600",
        text: "text-white",
      };
    default:
      return baseStyles;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case "sm":
      return {
        container: "px-3 py-2 rounded-lg",
        text: "text-sm",
      };
    case "md":
      return {
        container: "px-4 py-3 rounded-xl",
        text: "text-sm",
      };
    case "lg":
      return {
        container: "px-5 py-4 rounded-xl",
        text: "text-base",
      };
    default:
      return {
        container: "px-4 py-3 rounded-xl",
        text: "text-sm",
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  className,
  ...props
}) => {
  const variantStyles = getVariantStyles(variant, disabled || loading);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      className={`
        flex-row items-center justify-center transition-all
        ${variantStyles.container}
        ${sizeStyles.container}
        ${fullWidth ? "w-full" : ""}
        ${className || ""}
      `}
      style={style}
      activeOpacity={0.8}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ? "#0f172a" : "#3b82f6"
          }
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {leftIcon}
          <Text
            className={`font-bold tracking-wide ${variantStyles.text} ${sizeStyles.text}`}>
            {children}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
