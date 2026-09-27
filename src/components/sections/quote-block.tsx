import { cn } from "@/lib/utils";

export function QuoteBlock({ quote, author, className }: { quote: string; author: string; className?: string }) {
  return (
    <figure className={cn("border-l-[3px] border-accent pl-6 md:pl-8", className)}>
      <blockquote className="font-display text-step-2 font-medium leading-snug">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-4 text-base text-muted">{author}</figcaption>
    </figure>
  );
}
