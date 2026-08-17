import { useState } from "react";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Menu,
  Sparkles,
  X,
  Zap,
  Shield,
  Cpu,
  FileCode,
  Pencil,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import ApiLogo from "../assets/Api.png";
import useAuthStore from "@/service/store/authStore";

const upcomingFeatures = [
  {
    id: "01",
    icon: Zap,
    title: "Real-time WebSocket Support",
    description:
      "Mock real-time data streams with WebSocket endpoints. Simulate live updates, chat messages, and streaming data without a backend.",
    status: "PLanned",
    eta: "Q3 2026",
    color: "from-[#F7931A] to-[#FFAA2B]",
  },
  {
    id: "02",
    icon: Shield,
    title: "Authentication & Authorization",
    description:
      "Built-in JWT authentication, role-based access control, and API key management. Secure your mock endpoints with production-grade auth.",
    status: "PLanned",
    eta: "Q4 2026",
    color: "from-[#6366F1] to-[#8B5CF6]",
  },
  {
    id: "03",
    icon: Pencil,
    title: "Full REST Method Support",
    description:
      "Support for PUT, PATCH, DELETE, and custom methods. Build complete CRUD APIs with proper HTTP semantics for realistic frontend testing.",
    status: "In Development",
    eta: "Q4 2026",
    color: "from-[#EC4899] to-[#F43F5E]",
  },
  {
    id: "04",
    icon: FileCode,
    title: "API Templates",
    description:
      "Pre-built mock API templates for common use cases like e‑commerce, blogs, user management, and more. Start mocking in seconds with a single click.",
    status: "Planned",
    eta: "Q1 2027",
    color: "from-[#10B981] to-[#34D399]",
  },
  {
    id: "05",
    icon: List,
    title: "Built-in Pagination",
    description:
      "Automatic pagination for list endpoints with configurable page size, cursor‑based or offset‑based navigation, and metadata in responses.",
    status: "Planned",
    eta: "Q1 2027",
    color: "from-[#F59E0B] to-[#F97316]",
  },
  {
    id: "06",
    icon: Cpu,
    title: "AI-Generated Responses",
    description:
      "Generate realistic mock data using AI. Describe what you need and let the AI create complex, production-like response payloads.",
    status: "Researching",
    eta: "Q4 2027",
    color: "from-[#F472B6] to-[#FB7185]",
  },
];

function Github() {
  return (
    <svg viewBox="0 0 640 640" className="size-4" fill="currentColor">
      <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
    </svg>
  );
}

export default function Upcoming() {
  const [menu, setMenu] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const closeMenu = () => setMenu(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-background" />

      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-[#F7931A]/10 blur-[150px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 -z-10 h-100 w-100 rounded-full bg-[#6366F1]/5 blur-[140px]" />

      <div className="pointer-events-none fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/60 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-3 sm:px-4">
            <Link to="/" onClick={closeMenu} className="group flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                <img src={ApiLogo} alt="MockForge" className="size-full object-contain p-1" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-heading text-sm font-bold tracking-tight">MockForge</span>

                <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-muted-foreground">
                  API infrastructure
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/docs"
                className="rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Docs
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Sign in
                  </Link>

                  <Button asChild size="sm" className="ml-2">
                    <Link to="/register">Get started</Link>
                  </Button>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Dashboard
                </Link>
              )}

              <div className="ml-2 border-l border-border pl-2">
                <ThemeToggle />
              </div>
            </nav>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMenu((value) => !value)}
                aria-label="Toggle navigation"
              >
                {menu ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {menu && (
            <div className="border-t border-border/60 px-3 py-3 md:hidden">
              <div className="flex flex-col gap-1">
                <Link
                  to="/docs"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted"
                >
                  Documentation
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted"
                >
                  Sign in
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>

                <Button asChild className="mt-2">
                  <Link to="/register" onClick={closeMenu}>
                    Start building
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 md:pb-24 md:pt-40 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#F7931A] shadow-[0_0_25px_-12px_rgba(247,147,26,0.8)]">
            <Sparkles className="size-3" />
            Roadmap 2026 – 2027
          </div>

          <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl">
            This page is
            <br />
            <span className="bg-linear-to-r from-[#F7931A] via-[#FFAA2B] to-[#FFD600] bg-clip-text text-transparent">
              coming soon.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            We're building the future of API mocking. From real-time WebSockets to AI‑generated
            payloads, here's what's on our roadmap — features that will transform how your frontend
            team builds.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-lg border-border/70 bg-background/60 px-5 font-medium backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7931A]/40 hover:bg-[#F7931A]/5 hover:text-[#F7931A] focus-visible:ring-2 focus-visible:ring-[#F7931A]/30"
            >
              <Link to="/docs" className="flex items-center justify-center gap-2">
                <Code2 className="size-4" />
                View current docs
              </Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-emerald-400" />9 New Features
            </span>

            <span className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-[#F7931A]" />
              Rolling Q3 2026 – Q4 2027
            </span>

            <span className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-[#6366F1]" />
              Community driven
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-2 flex items-center justify-between border-b border-border/40 pb-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Q3 2026
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Q4 2027
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-[#F7931A]/20 bg-[#F7931A]/5 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[#F7931A]/10 blur-[100px]" />

            <div className="relative">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[#F7931A]/30 bg-[#F7931A]/10 text-[#F7931A] shadow-[0_0_30px_-15px_rgba(247,147,26,0.7)]">
                <Sparkles className="size-6" />
              </div>

              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Shape the future of MockForge
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                These features are built for you. Star our repository, join the discussion, and help
                us prioritize what comes next.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="group h-11 rounded-lg bg-[#F7931A] px-5 font-medium text-black shadow-[0_8px_30px_-10px_rgba(247,147,26,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff9f1f] hover:shadow-[0_12px_35px_-10px_rgba(247,147,26,0.85)]"
                >
                  <a
                    href="https://github.com/aflah-pp/MockForge"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Github className="size-4" />
                    Star on GitHub
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-xs text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
            <img src={ApiLogo} alt="" className="size-full object-contain p-1" />
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground">
              MockForge
            </div>

            <div className="mt-1 text-[10px]">Open source API infrastructure.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/docs" className="transition-colors hover:text-foreground">
            Documentation
          </Link>

          <span className="text-border">/</span>

          <a
            href="https://github.com/aflah-pp/MockForge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Github className="size-3.5" />
            GitHub
            <ExternalLink className="size-3" />
          </a>

          <span className="text-border">/</span>

          <span>Built for developers.</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ feature }) {
  const { icon: Icon, title, description, status, eta, color, id } = feature;

  const statusColorMap = {
    Beta: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
    "In Development": "border-[#F7931A]/40 bg-[#F7931A]/10 text-[#F7931A]",
    Planned: "border-[#6366F1]/40 bg-[#6366F1]/10 text-[#6366F1]",
    Researching: "border-slate-500/40 bg-slate-500/10 text-slate-400",
  };

  const statusColor = statusColorMap[status] || statusColorMap.Planned;

  return (
    <div className="group relative rounded-2xl border border-border/60 bg-background/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/30 hover:bg-[#F7931A]/4 hover:shadow-[0_20px_50px_-20px_rgba(247,147,26,0.15)]">
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className={`absolute inset-0 rounded-2xl bg-linear-to-br ${color} opacity-5 blur-xl`}
        />
      </div>

      <div className="relative flex items-start justify-between">
        <div
          className={`flex size-11 items-center justify-center rounded-xl border border-current/20 bg-current/5 text-current shadow-[0_0_25px_-15px_rgba(247,147,26,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_35px_-15px_rgba(247,147,26,0.8)]`}
          style={{ color: "var(--feature-color, #F7931A)" }}
        >
          <Icon className="size-4.5" />
        </div>

        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/30">{id}</span>
      </div>

      <h3 className="mt-5 font-heading text-base font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-border/40">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] ${statusColor}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {status}
        </span>

        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/40">
          ETA <span className="text-muted-foreground/70">{eta}</span>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground/30 transition-colors group-hover:text-[#F7931A]/50">
        <span className="size-1 rounded-full bg-current" />
        Coming soon
      </div>
    </div>
  );
}
