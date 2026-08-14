import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResourceFormPage() {
  const { projectSlug } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Resource name is required.");
      return;
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    navigate(`/project/${projectSlug}/resources/${slug}`);
  };

  return (
    <AppLayout>
      <main className="h-[calc(100vh-6rem)] overflow-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/project/${projectSlug}`}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Project
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Resource</h1>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Create a new resource for your mock API.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>

              <CardDescription>
                Give your resource a name. The URL slug will be generated automatically.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>

                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    placeholder="Products"
                    autoComplete="off"
                  />

                  <p className="text-xs text-muted-foreground">
                    Examples: Products, Customers, Orders, Drivers.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild>
                    <Link to={`/project/${projectSlug}`}>Cancel</Link>
                  </Button>

                  <Button type="submit">Create Resource</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
