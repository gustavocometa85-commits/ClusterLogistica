"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-semibold text-red-600">Algo salió mal</h2>
      <p className="text-text-secondary">{error.message}</p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-brand-800 text-white rounded-button text-sm font-medium hover:bg-brand-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
