import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const accountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .max(30, "Username must be 30 characters or less."),

  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),

  first_name: z.string().trim().max(150, "First name is too long."),

  last_name: z.string().trim().max(150, "Last name is too long."),
});

export default function AccountForm({ initialData, onSubmit, isSubmitting = false }) {
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || "");

  const [avatarFile, setAvatarFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      username: initialData.username ?? "",
      email: initialData.email ?? "",
      first_name: initialData.first_name ?? "",
      last_name: initialData.last_name ?? "",
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvatarPreview(initialData.avatar || "");
    setAvatarFile(null);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    objectUrlRef.current = previewUrl;

    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const submitForm = (data) => {
    const formData = new FormData();

    formData.append("username", data.username.trim());
    formData.append("email", data.email.trim());
    formData.append("first_name", data.first_name.trim());
    formData.append("last_name", data.last_name.trim());

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    onSubmit(formData);
  };

  const firstName = initialData?.first_name || "";
  const lastName = initialData?.last_name || "";
  const username = initialData?.username || "User";

  const initials =
    [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() ||
    username.slice(0, 2).toUpperCase() ||
    "U";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative">
          <Avatar className="size-24">
            <AvatarImage src={avatarPreview || undefined} alt={username} />

            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            aria-label="Change profile picture"
          >
            <Camera className="size-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <p className="font-medium">Profile picture</p>

          <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or WebP. Maximum 5 MB.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <Input
            id="username"
            autoComplete="username"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />

          {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />

          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>

          <Input
            id="first_name"
            autoComplete="given-name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.first_name)}
            {...register("first_name")}
          />

          {errors.first_name && (
            <p className="text-sm text-destructive">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>

          <Input
            id="last_name"
            autoComplete="family-name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.last_name)}
            {...register("last_name")}
          />

          {errors.last_name && (
            <p className="text-sm text-destructive">{errors.last_name.message}</p>
          )}
        </div>
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

        <Button type="submit" disabled={isSubmitting || (!isDirty && !avatarFile)}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
