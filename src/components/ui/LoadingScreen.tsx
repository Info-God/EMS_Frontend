import { Loader2 } from "lucide-react";

const LoadingScreen = ({ title }: { title?: string }) => {
  return (
    <div className="h-full flex items-start justify-center absolute top-0 left-0 w-full bg-gray-200 z-9980">
      <div className="flex flex-col items-center gap-4 mt-80">
        <Loader2 className="w-12 h-12 animate-spin text-(--journal-600)" />
        <p className="text-gray-600 font-semibold text-2xl">Loading {title}...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
