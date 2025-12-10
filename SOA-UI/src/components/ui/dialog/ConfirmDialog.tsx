import CustomDialog from './CustomDialog';
import { Button } from '../button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
};

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      children={
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={false}>
              {cancelText}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={false}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      }
      isClose={false}
    />
  );
}

export default ConfirmDialog;
