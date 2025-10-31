import { Loader2 } from "lucide-react";

type SpinnerProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function Spinner({ label, fullScreen }: SpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-10">
      {content}
    </div>
  );
}
