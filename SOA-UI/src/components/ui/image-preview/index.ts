// Image preview hook placeholder
export interface ImagePreviewOptions {
  src?: string;
  alt?: string;
}

export function useImagePreview(_options?: ImagePreviewOptions) {
  return {
    open: false,
    src: '',
    alt: '',
    openPreview: (_src: string, _alt?: string) => {},
    closePreview: () => {},
  };
}
export { ImagePreviewDialog } from './ImagePreviewDialog';
export type { ImagePreviewDialogProps } from './ImagePreviewDialog';
