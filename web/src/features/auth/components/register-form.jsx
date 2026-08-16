import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { registerUser } from "@/service/endpoints/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(150, "First name is too long."),

    last_name: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(150, "Last name is too long."),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(150, "Username is too long."),

    email: z.string().trim().email("Enter a valid email address."),

    password: z.string().min(8, "Password must be at least 8 characters."),

    password_confirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match.",
    path: ["password_confirm"],
  });

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          username: values.username,
        },
      });
    } catch (error) {
      const responseData = error?.response?.data;

      if (!responseData) {
        form.setError("root", {
          type: "server",
          message: "Unable to create your account. Please try again.",
        });

        return;
      }

      Object.entries(responseData).forEach(([field, value]) => {
        if (field === "detail") {
          form.setError("root", {
            type: "server",
            message: Array.isArray(value) ? value.join(" ") : String(value),
          });

          return;
        }

        if (field in form.getValues()) {
          form.setError(field, {
            type: "server",
            message: Array.isArray(value) ? value.join(" ") : String(value),
          });
        }
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>

        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>

                <Input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  disabled={isSubmitting}
                  {...form.register("first_name")}
                />

                {form.formState.errors.first_name && (
                  <FieldError>{form.formState.errors.first_name.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>

                <Input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  disabled={isSubmitting}
                  {...form.register("last_name")}
                />

                {form.formState.errors.last_name && (
                  <FieldError>{form.formState.errors.last_name.message}</FieldError>
                )}
              </Field>
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>

              <Input
                id="username"
                type="text"
                placeholder="john09"
                autoComplete="username"
                disabled={isSubmitting}
                {...form.register("username")}
              />

              {form.formState.errors.username && (
                <FieldError>{form.formState.errors.username.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...form.register("password")}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}

                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>

              {form.formState.errors.password && (
                <FieldError>{form.formState.errors.password.message}</FieldError>
              )}

              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password_confirm">Confirm Password</FieldLabel>

              <Input
                id="password_confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...form.register("password_confirm")}
              />

              {form.formState.errors.password_confirm && (
                <FieldError>{form.formState.errors.password_confirm.message}</FieldError>
              )}
            </Field>

            {form.formState.errors.root && (
              <FieldError>{form.formState.errors.root.message}</FieldError>
            )}

            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

              <FieldDescription className="px-6 text-center">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </FieldDescription>

              <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
