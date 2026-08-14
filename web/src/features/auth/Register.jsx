import { SignupForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/features/auth/layout/authLayout";

export default function Register() {
  return (
    <AuthLayout>
      <div className="flex min-h-vh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </AuthLayout>
  );
}
