import Image from "next/image";
import { cn } from "@/lib/utils";
import mark from "../../../public/brand/lumen-mark.png";

/**
 * Official LUMEN mark (from the logo file) + wordmark.
 * The mark is navy-heavy, so it sits on a white tile in dark mode / on dark backgrounds.
 */
export function Logo({ className, onDark = false, subtitle }: { className?: string; onDark?: boolean; subtitle?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-[10px] transition-transform duration-500 group-hover:rotate-[-8deg]",
          onDark ? "bg-white" : "dark:bg-white",
        )}
      >
        <Image src={mark} alt="" width={36} height={36} priority className="size-9" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.4rem] font-extrabold tracking-[0.06em]">LUMEN</span>
        {subtitle && <span className="mt-1 hidden text-[0.68rem] font-medium tracking-wide opacity-75 sm:block">{subtitle}</span>}
      </span>
    </span>
  );
}
