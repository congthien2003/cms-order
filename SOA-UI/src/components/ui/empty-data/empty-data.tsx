import { CloudAlert } from 'lucide-react';

function EmptyData() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <CloudAlert className="w-10 h-10 text-gray-500" />
      <p className="text-sm text-gray-500">No data found</p>
    </div>
  );
}

export default EmptyData;
