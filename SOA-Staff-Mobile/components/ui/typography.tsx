import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

type TypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "body"
	| "body-sm"
	| "caption"
	| "label";

type TypographyColor =
	| "default"
	| "muted"
	| "primary"
	| "success"
	| "warning"
	| "error"
	| "white";

interface TypographyProps extends TextProps {
	variant?: TypographyVariant;
	color?: TypographyColor;
	weight?: "normal" | "medium" | "semibold" | "bold";
	align?: "left" | "center" | "right";
	children: React.ReactNode;
}

const getVariantStyles = (variant: TypographyVariant): string => {
	switch (variant) {
		case "h1":
			return "text-3xl font-bold tracking-tight leading-tight";
		case "h2":
			return "text-2xl font-bold tracking-tight leading-tight";
		case "h3":
			return "text-xl font-bold tracking-tight leading-tight";
		case "h4":
			return "text-lg font-bold tracking-tight leading-tight";
		case "body":
			return "text-base leading-normal";
		case "body-sm":
			return "text-sm leading-normal";
		case "caption":
			return "text-xs leading-normal";
		case "label":
			return "text-sm font-medium leading-normal tracking-wide";
		default:
			return "text-base leading-normal";
	}
};

const getColorStyles = (color: TypographyColor): string => {
	switch (color) {
		case "default":
			return "text-slate-900 dark:text-slate-100";
		case "muted":
			return "text-slate-500 dark:text-slate-400";
		case "primary":
			return "text-[#2beead]";
		case "success":
			return "text-green-600 dark:text-green-400";
		case "warning":
			return "text-yellow-600 dark:text-yellow-400";
		case "error":
			return "text-red-500 dark:text-red-400";
		case "white":
			return "text-white";
		default:
			return "text-slate-900 dark:text-slate-100";
	}
};

const getWeightStyles = (weight: TypographyProps["weight"]): string => {
	switch (weight) {
		case "normal":
			return "font-normal";
		case "medium":
			return "font-medium";
		case "semibold":
			return "font-semibold";
		case "bold":
			return "font-bold";
		default:
			return "";
	}
};

const getAlignStyles = (align: TypographyProps["align"]): string => {
	switch (align) {
		case "left":
			return "text-left";
		case "center":
			return "text-center";
		case "right":
			return "text-right";
		default:
			return "";
	}
};

export const Typography: React.FC<TypographyProps> = ({
	variant = "body",
	color = "default",
	weight,
	align,
	children,
	className,
	...props
}) => {
	const variantStyles = getVariantStyles(variant);
	const colorStyles = getColorStyles(color);
	const weightStyles = weight ? getWeightStyles(weight) : "";
	const alignStyles = align ? getAlignStyles(align) : "";

	return (
		<Text
			className={`${variantStyles} ${colorStyles} ${weightStyles} ${alignStyles} ${className || ""}`}
			{...props}>
			{children}
		</Text>
	);
};

// Convenience components
export const Heading1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="caption" color="muted" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, "variant">> = (props) => (
	<Typography variant="label" {...props} />
);

export default Typography;
