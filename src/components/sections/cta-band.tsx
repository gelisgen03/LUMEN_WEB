import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/** Call to action: navy panel lit from one corner, in both themes. */
export function CtaBand({ title, text, primary, secondary }: Props) {
  return (
    <section className="mt-24">
      <Container>
        <div data-reveal="zoom" className="relative isolate overflow-hidden rounded-[2rem] bg-navy ring-1 ring-white/10 px-6 py-14 text-white md:px-14 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="hero-glow absolute -left-24 -top-24 size-[28rem]" />
            <div className="hero-rays absolute -left-80 -top-80 size-[48rem] opacity-70" />
          </div>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <h2 className="text-step-4 font-bold">{title}</h2>
              <p className="mt-4 max-w-prose text-[#d5dae3]">{text}</p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 md:col-start-9">
              <Link
                href={primary.href}
                className="btn-shine group inline-flex h-14 items-center justify-between gap-2 rounded-full bg-gold px-7 font-semibold text-navy shadow-[0_0_40px_-10px_rgba(244,183,68,0.9)]"
              >
                {primary.label}
                <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="group inline-flex h-14 items-center justify-between gap-2 rounded-full border border-white/30 px-7 font-semibold transition-colors hover:border-gold hover:bg-white/5"
                >
                  {secondary.label}
                  <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
