import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-none bg-[#282828] text-[#f0f0f0] ring-1 ring-[#383838]",
        className
      )}
    >
      <Sparkles className="size-4" aria-hidden />
    </div>
  );
}
