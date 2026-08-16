import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required."),
    new_password: z.string().min(8, "New password must be at least 8 characters."),
    new_password_confirm: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords do not match.",
    path: ["new_password_confirm"],
  });

export default function ChangePasswordForm({ onSubmit, isSubmitting = false }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="old_password">Current password</Label>

        <div className="relative">
          <Input
            id="old_password"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isSubmitting}
            className="pr-10"
            {...register("old_password")}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowCurrentPassword((value) => !value)}
            disabled={isSubmitting}
          >
            {showCurrentPassword ? (
              <EyeOff className="size-4 text-muted-foreground" />
            ) : (
              <Eye className="size-4 text-muted-foreground" />
            )}

            <span className="sr-only">
              {showCurrentPassword ? "Hide current password" : "Show current password"}
            </span>
          </Button>
        </div>

        {errors.old_password && (
          <p className="text-sm text-destructive">{errors.old_password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password">New password</Label>

        <div className="relative">
          <Input
            id="new_password"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            className="pr-10"
            {...register("new_password")}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowNewPassword((value) => !value)}
            disabled={isSubmitting}
          >
            {showNewPassword ? (
              <EyeOff className="size-4 text-muted-foreground" />
            ) : (
              <Eye className="size-4 text-muted-foreground" />
            )}

            <span className="sr-only">
              {showNewPassword ? "Hide new password" : "Show new password"}
            </span>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">Must be at least 8 characters long.</p>

        {errors.new_password && (
          <p className="text-sm text-destructive">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password_confirm">Confirm new password</Label>

        <div className="relative">
          <Input
            id="new_password_confirm"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            className="pr-10"
            {...register("new_password_confirm")}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword((value) => !value)}
            disabled={isSubmitting}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4 text-muted-foreground" />
            ) : (
              <Eye className="size-4 text-muted-foreground" />
            )}

            <span className="sr-only">
              {showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
            </span>
          </Button>
        </div>

        {errors.new_password_confirm && (
          <p className="text-sm text-destructive">{errors.new_password_confirm.message}</p>
        )}
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
          {isSubmitting ? "Changing password..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
