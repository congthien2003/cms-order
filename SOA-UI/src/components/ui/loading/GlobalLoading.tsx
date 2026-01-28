interface GlobalLoadingProps {
  isLoading?: boolean;
  message?: string;
}

function GlobalLoading({ isLoading = false, message }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 px-12 py-8">
        <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 h-24 w-24 aspect-square rounded-full">
          <div className="rounded-full h-full w-full bg-white backdrop-blur-md "></div>
        </div>
        <p className="text-xl font-medium text-white">Đang tải...</p>
        {message && (
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default GlobalLoading;
