import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2c3e50]">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2c3e50]">
            Clúster Logística
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de Flotas</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
