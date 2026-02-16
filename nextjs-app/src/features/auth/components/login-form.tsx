"use client";

import { useActionState } from "react";
import { login } from "../actions/auth-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    (_prev: unknown, fd: FormData) => login(fd),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {"_form" in (state?.error ?? {}) && (
        <p className="text-red-600 text-sm text-center">
          {(state?.error as Record<string, string[]>)?._form?.[0]}
        </p>
      )}
      <label className="block">
        <span className="text-sm text-gray-600">Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50]"
          placeholder="admin@cluster.mx"
        />
      </label>
      <label className="block">
        <span className="text-sm text-gray-600">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50]"
          placeholder="••••••••"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 bg-[#2c3e50] text-white rounded-lg text-sm font-medium hover:bg-[#34495e] transition-colors disabled:opacity-50"
      >
        {pending ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
