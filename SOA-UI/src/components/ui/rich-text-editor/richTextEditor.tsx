export type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

// Placeholder Rich Text Editor - requires @tiptap dependencies
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  disabled = false,
  className,
}: RichTextEditorProps) {
  return (
    <div className={className}>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[200px] p-3 border rounded-md resize-y"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Note: Rich text editor requires @tiptap dependencies. Using simple
        textarea as fallback.
      </p>
    </div>
  );
}
