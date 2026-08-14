import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required.")
    .max(50, "Project name must be 50 characters or less."),
});

export default function ProjectForm({ onSubmit, isSubmitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
    },
  });

  const submitForm = (data) => {
    onSubmit({
      name: data.name.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>

        <Input
          id="name"
          placeholder="E-Commerce API"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />

        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}

        <p className="text-xs text-muted-foreground">Choose a descriptive name for your project.</p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
