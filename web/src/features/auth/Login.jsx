import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/features/auth/layout/authLayout";

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex min-h-vh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}
