import { ChevronLeft, ChevronRight } from 'lucide-react';
import CustomDialog from '@/components/ui/dialog/CustomDialog';
import Button from '@/components/ui/button/button';

export interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  title?: string;
  hasMultipleImages?: boolean;
  currentIndex?: number;
  totalImages?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Reusable image preview dialog component
 * Supports both single image and multiple images with navigation
 */
export function ImagePreviewDialog({
  open,
  onOpenChange,
  imageUrl,
  title,
  hasMultipleImages = false,
  currentIndex = 0,
  totalImages = 0,
  onNavigate,
  size = 'xl',
}: ImagePreviewDialogProps) {
  if (!imageUrl) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title || 'Hình ảnh'}
      size={size}
      isClose={true}
      isSubmit={false}
      className="max-w-4xl"
    >
      <div className="relative">
        <div className="flex items-center justify-center min-h-[400px] bg-muted rounded-lg">
          <img
            src={imageUrl}
            alt={title || 'preview'}
            className="max-h-[70vh] max-w-full object-contain rounded"
          />
        </div>
        {hasMultipleImages && onNavigate && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={() => onNavigate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => onNavigate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded text-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          </>
        )}
      </div>
    </CustomDialog>
  );
}

