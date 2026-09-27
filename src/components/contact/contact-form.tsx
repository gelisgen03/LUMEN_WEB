"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import { contactReasons, type ContactField, type ContactReason } from "@/lib/contact-reasons";

export type ContactFormLabels = {
  reason: string;
  reasons: Record<ContactReason, string>;
  name: string;
  email: string;
  organization: string;
  message: string;
  messageHint: string;
  consent: string;
  submit: string;
  sending: string;
  required: string;
  honeypot: string;
  /** Pre-rendered summary strings, indexed by error count (1..4). */
  errorsSummary: string[];
  errors: Record<ContactField | "rateLimited" | "server", string>;
  success: string;
};

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Accessible contact form: native controls, labels, aria-invalid/aria-describedby,
 * an error summary that takes focus, and a live region for the result.
 * Without JS it still posts to /api/contact, which redirects back with ?etat=…
 */
export function ContactForm({
  locale,
  labels,
  defaultReason = "question",
}: {
  locale: string;
  labels: ContactFormLabels;
  defaultReason?: ContactReason;
}) {
  const [reason, setReason] = useState<ContactReason>(defaultReason);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactField[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Read ?motif= (preselected reason) and ?etat= (result of a no-JS post) after mount,
  // so the form itself stays fully static and server-rendered.
  useEffect(() => {
    setStartedAt(Date.now());
    const params = new URLSearchParams(window.location.search);
    const motif = params.get("motif");
    if (motif && (contactReasons as readonly string[]).includes(motif)) setReason(motif as ContactReason);
    const etat = params.get("etat");
    if (etat === "sent") setStatus("sent");
    else if (etat) setGlobalError(etat === "rateLimited" ? labels.errors.rateLimited : labels.errors.server);
  }, [labels.errors.rateLimited, labels.errors.server]);
  useEffect(() => {
    if (errors.length || globalError) summaryRef.current?.focus();
  }, [errors, globalError]);
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const validate = (fd: FormData): ContactField[] => {
    const out: ContactField[] = [];
    if (String(fd.get("name") ?? "").trim().length < 2) out.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get("email") ?? "").trim())) out.push("email");
    if (String(fd.get("message") ?? "").trim().length < 20) out.push("message");
    if (!fd.get("consent")) out.push("consent");
    return out;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const clientErrors = validate(fd);
    setGlobalError(null);
    setErrors(clientErrors);
    if (clientErrors.length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fd.entries()), consent: fd.get("consent") === "on" }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string; fields?: ContactField[] };
      if (body.ok) {
        setStatus("sent");
        return;
      }
      setStatus("error");
      if (body.error === "validation" && body.fields?.length) setErrors(body.fields);
      else setGlobalError(body.error === "rateLimited" ? labels.errors.rateLimited : labels.errors.server);
    } catch {
      setStatus("error");
      setGlobalError(labels.errors.server);
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex gap-4 rounded-2xl border border-border-strong p-6 focus:outline-none"
      >
        <CheckCircle2 aria-hidden className="mt-0.5 size-6 shrink-0 text-accent-text" />
        <p className="font-medium">{labels.success}</p>
      </div>
    );
  }

  const has = (f: ContactField) => errors.includes(f);
  const describedBy = (f: ContactField, extra?: string) =>
    [has(f) ? `err-${f}` : null, extra].filter(Boolean).join(" ") || undefined;
  const req = <span className="font-normal text-muted"> ({labels.required})</span>;

  return (
    <form action="/api/contact" method="post" noValidate onSubmit={onSubmit} className="space-y-6">
      {(errors.length > 0 || globalError) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border-2 border-[#b91c1c] p-4 dark:border-[#fca5a5] focus:outline-none"
        >
          {globalError ? (
            <p className="font-medium">{globalError}</p>
          ) : (
            <>
              <p className="font-semibold">{labels.errorsSummary[errors.length - 1]}</p>
              <ul className="mt-2 list-disc pl-5">
                {errors.map((f) => (
                  <li key={f}>
                    <a href={`#field-${f}`} className="underline underline-offset-4">
                      {labels.errors[f]}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={startedAt || ""} />
      {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="field-website">{labels.honeypot}</label>
        <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="field-reason" className="mb-2">
          {labels.reason}
        </Label>
        <Select id="field-reason" name="reason" value={reason} onChange={(e) => setReason(e.target.value as ContactReason)}>
          {contactReasons.map((r) => (
            <option key={r} value={r}>
              {labels.reasons[r]}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="field-name" className="mb-2">
            {labels.name}
            {req}
          </Label>
          <Input
            id="field-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={has("name") || undefined}
            aria-describedby={describedBy("name")}
          />
          <FieldError id="err-name">{has("name") && labels.errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="field-email" className="mb-2">
            {labels.email}
            {req}
          </Label>
          <Input
            id="field-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={has("email") || undefined}
            aria-describedby={describedBy("email")}
          />
          <FieldError id="err-email">{has("email") && labels.errors.email}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="field-organization" className="mb-2">
          {labels.organization}
        </Label>
        <Input id="field-organization" name="organization" autoComplete="organization" />
      </div>

      <div>
        <Label htmlFor="field-message" className="mb-1">
          {labels.message}
          {req}
        </Label>
        <p id="hint-message" className="mb-2 text-sm text-muted">
          {labels.messageHint}
        </p>
        <Textarea
          id="field-message"
          name="message"
          required
          minLength={20}
          aria-invalid={has("message") || undefined}
          aria-describedby={describedBy("message", "hint-message")}
        />
        <FieldError id="err-message">{has("message") && labels.errors.message}</FieldError>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="field-consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 accent-[var(--gold)]"
            aria-invalid={has("consent") || undefined}
            aria-describedby={describedBy("consent")}
          />
          <label htmlFor="field-consent" className="text-base">
            {labels.consent}
          </label>
        </div>
        <FieldError id="err-consent">{has("consent") && labels.errors.consent}</FieldError>
      </div>

      <Button type="submit" size="lg" disabled={status === "sending"} className="btn-shine w-full rounded-full sm:w-auto">
        {status === "sending" ? labels.sending : labels.submit}
      </Button>
    </form>
  );
}
