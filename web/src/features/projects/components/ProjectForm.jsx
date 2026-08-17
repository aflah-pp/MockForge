import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

export default function ProjectForm({
  mode = "create",
  initialValues = {
    name: "",
  },
  onSubmit,
  isSubmitting = false,
}) {
  const navigate = useNavigate();

  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset({
      name: initialValues.name || "",
    });
  }, [initialValues.name, reset]);

  const submitForm = (data) => {
    onSubmit({
      name: data.name.trim(),
    });
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(-1);
      return;
    }

    navigate("/project");
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

        <p className="text-xs text-muted-foreground">
          {isEditMode
            ? "Update the name of your project."
            : "Choose a descriptive name for your project."}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
