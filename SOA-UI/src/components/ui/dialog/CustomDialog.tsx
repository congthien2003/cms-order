import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/button/button';

export interface CustomDialogProps {
  /** Trạng thái mở/đóng dialog */
  open: boolean;
  /** Callback khi dialog đóng */
  onOpenChange: (open: boolean) => void;
  /** Tiêu đề dialog */
  title: string;
  /** Mô tả dialog (optional) */
  description?: string;
  /** Nội dung chính của dialog */
  children: React.ReactNode;
  /** Có hiển thị nút Close/Cancel không */
  isClose?: boolean;
  /** Text cho nút Close/Cancel */
  closeText?: string;
  /** Callback khi click nút Close/Cancel */
  onClose?: () => void;
  /** Có hiển thị nút Submit không */
  isSubmit?: boolean;
  /** Text cho nút Submit */
  submitText?: string;
  /** Callback khi click nút Submit */
  onSubmit?: () => void;
  /** Disable nút Submit */
  submitDisabled?: boolean;
  /** Loading state cho nút Submit */
  submitLoading?: boolean;
  /** Variant cho nút Submit */
  submitVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Variant cho nút Close */
  closeVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Kích thước dialog */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Custom className cho dialog content */
  className?: string;
  /** Có hiển thị nút X ở góc phải header không */
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'sm:max-w-[425px]',
  md: 'sm:max-w-[600px]',
  lg: 'sm:max-w-[800px]',
  xl: 'sm:max-w-[1000px]',
  full: 'sm:max-w-[95vw]',
};

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  isClose = true,
  closeText = 'Cancel',
  onClose,
  isSubmit = false,
  submitText = 'Submit',
  onSubmit,
  submitDisabled = false,
  submitLoading = false,
  submitVariant = 'default',
  closeVariant = 'outline',
  size = 'md',
  className = '',
  showCloseButton = true,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} ${className}`}>
        <DialogHeader className="relative">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {showCloseButton && <DialogClose asChild></DialogClose>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {(isClose || isSubmit) && (
          <DialogFooter className="flex justify-end gap-2">
            {isClose && (
              <DialogClose asChild>
                <Button
                  variant={closeVariant}
                  onClick={handleClose}
                  disabled={submitLoading}
                >
                  {closeText}
                </Button>
              </DialogClose>
            )}
            {isSubmit && (
              <Button
                variant={submitVariant}
                onClick={handleSubmit}
                disabled={submitDisabled || submitLoading}
              >
                {submitLoading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  submitText
                )}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
