"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { useToast } from "@/lib/toast";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") ?? "patient";
  const { push } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      push({
        kind: "success",
        title: "Account created",
        message: `Welcome aboard, ${name.split(" ")[0]}!`,
      });
      if (role === "patient") {
        router.push(`/onboarding/setup?name=${encodeURIComponent(name)}`);
      } else if (role === "doctor") {
        router.push("/doctor/onboarding");
      } else if (role === "caregiver") {
        router.push(`/onboarding/caregiver-setup?name=${encodeURIComponent(name)}`);
      } else {
        router.push("/dashboard");
      }
    }, 700);
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Create your account" subtitle={`Signing up as ${role}`} />
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 pb-6 pt-3">
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Jordan Lee"
          error={errors.name}
        />
        <Field
          label="Email address"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          error={errors.email}
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Minimum 6 characters"
          type="password"
          error={errors.password}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[16px] font-semibold text-white shadow-floating active:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
        <p className="mt-4 text-center text-[12px] leading-5 text-gray-helper">
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none placeholder:text-gray-helper focus:border-primary ${
          error ? "border-danger" : "border-gray-medium"
        }`}
      />
      {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
    </div>
  );
}
