/* eslint-disable @typescript-eslint/no-explicit-any */
export function FormError({ state }: { state: any }) {
  const msg = state?.error?._form?.[0];
  if (!msg) return null;
  return <p className="text-red-600 text-sm">{msg}</p>;
}
