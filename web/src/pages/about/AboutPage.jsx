import { ArrowRight, ArrowUpRight, Code2, Database, FileJson, Globe, Server } from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Server,
    label: "Create a Project",
    short: "Start with a project.",
    description: "Create a project to keep your mock API configuration organized in one place.",
  },
  {
    icon: Database,
    label: "Add Resources",
    short: "Define your API resources.",
    description:
      "Create resources such as users, products, posts, or any other data your frontend needs.",
  },
  {
    icon: FileJson,
    label: "Define Fields",
    short: "Describe your data.",
    description:
      "Add fields, choose their data types, and configure how Mokvio should generate their values.",
  },
  {
    icon: Code2,
    label: "Use the API",
    short: "Your endpoint is ready.",
    description:
      "Mokvio interprets your configuration and exposes structured JSON responses through your mock API.",
  },
];

export default function AboutPage() {
  return (
    <AppLayout>
      <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center overflow-hidden py-6 sm:py-8">
        <div className="mx-auto flex w-full max-w-6xl px-4 sm:px-6">
          <div className="relative w-full overflow-hidden rounded-2xl border bg-card/80 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-transparent" />

            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <section className="flex flex-col justify-center border-b p-6 sm:p-8 md:border-b-0 md:border-r lg:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Code2 className="size-5" />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Mokvio</h1>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                      Mock API infrastructure
                    </p>
                  </div>
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                  Build against an API
                  <br />
                  <span className="text-muted-foreground/60">before the backend is ready.</span>
                </h2>

                <div className="mt-5 max-w-xl space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Mokvio is a configuration-driven mock API platform designed to make frontend
                    development and API prototyping faster.
                  </p>

                  <p>
                    Instead of writing temporary backend code, you define your project, resources,
                    and fields. Mokvio turns that configuration into structured mock API
                    responses your frontend can work with immediately.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Open Source", "Developer Tooling", "Mock APIs", "JSON Responses"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <div className="mt-7 border-t pt-5">
                  <Button asChild variant="outline" className="w-fit">
                    <Link to="/about/creator" className="inline-flex items-center gap-2">
                      <Globe className="size-4" />
                      <span>Creator Page</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </section>

              <section className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    The workflow
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">From configuration to API</h3>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Hover over a step to see what happens.
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                      <div key={step.label} className="group relative">
                        <div className="flex cursor-default items-center gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-200 hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{step.label}</p>

                            <p className="truncate text-xs text-muted-foreground">{step.short}</p>
                          </div>

                          {!isLast && (
                            <ArrowRight className="size-4 shrink-0 text-muted-foreground/30 transition-transform group-hover:translate-x-1" />
                          )}
                        </div>

                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-[min(280px,calc(100vw-3rem))] -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                          <div className="rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg">
                            <div className="flex items-start gap-2">
                              <Icon className="mt-0.5 size-4 shrink-0 text-primary" />

                              <div>
                                <p className="text-xs font-semibold">{step.label}</p>

                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-xl border border-dashed bg-muted/20 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    The idea
                  </p>

                  <p className="mt-2 text-sm leading-relaxed">
                    <span className="font-medium">Configure once. Generate instantly.</span> Your
                    frontend gets something real to develop against while the actual backend is
                    still being built.
                  </p>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-between border-t px-6 py-3 text-[10px] text-muted-foreground/60 sm:px-8">
              <span>Mokvio · Developer tooling</span>

              <span className="font-mono tracking-wider">/about</span>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
