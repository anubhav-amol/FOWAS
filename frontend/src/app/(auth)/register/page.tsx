"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(fullName, email, password);
      router.replace("/dashboard");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create account",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-[var(--radius-xl)] border border-white/8 bg-[#101621] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] md:p-10">
      <div className="mb-8">
        <p className="mono text-[11px] uppercase tracking-widest text-[var(--blue-muted)]">
          Create Account
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Set up your workspace
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
          Register, then continue to the dashboard to create your
          first organisation, workflow, and incident stream.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="fowas-input w-full"
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400">
            Email
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="fowas-input w-full"
            placeholder="operator@fowas.dev"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400">
            Password
          </label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={6}
            className="fowas-input w-full"
            placeholder="At least 6 characters"
            required
          />
        </div>

        {error ? (
          <div className="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <button type="submit" disabled={submitting} className="fowas-button w-full px-5 py-3">
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-[var(--blue-muted)] hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
