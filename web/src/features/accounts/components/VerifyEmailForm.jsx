import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const verifyEmailSchema = z.object({
  code: z.string().trim().min(1, "Verification code is required."),
});

export default function VerifyEmailForm({ email, onSubmit, isSubmitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full border bg-muted">
          <MailCheck className="size-5" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">Verify your email</h2>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Enter the verification code sent to{" "}
          <span className="font-medium text-foreground">{email || "your email address"}</span>.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Verification code</Label>

        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter verification code"
          disabled={isSubmitting}
          {...register("code")}
        />

        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </form>
  );
}
