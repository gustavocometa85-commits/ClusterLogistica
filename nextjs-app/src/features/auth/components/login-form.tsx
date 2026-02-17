"use client";

import { useActionState } from "react";
import { login } from "../actions/auth-actions";

const inputClass = "mt-1.5 block w-full rounded-input border border-border px-3 py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-colors";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => login(fd),
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {"_form" in (state?.error ?? {}) && (
        <p className="text-red-600 text-sm text-center">
          {(state?.error as Record<string, string[]>)?._form?.[0]}
        </p>
      )}
      <label className="block">
        <span className="text-sm text-text-secondary font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="admin@cluster.mx"
        />
      </label>
      <label className="block">
        <span className="text-sm text-text-secondary font-medium">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className={inputClass}
          placeholder="••••••••"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {pending ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
