import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900">
      <div className="bg-surface rounded-card shadow-card-hover p-8 sm:p-10 w-full max-w-md mx-4 sm:mx-0">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-800">
            Clúster Logística
          </h1>
          <p className="text-text-muted text-sm mt-1">Gestión de Flotas</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
