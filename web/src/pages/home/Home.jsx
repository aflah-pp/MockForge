import { useState } from "react";
import { ArrowRight, Code2, Database, ExternalLink, Layers3, Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import ApiLogo from "../../assets/Api.png";

const endpoints = [
  {
    name: "users",
    response: `{
  "id": 42,
  "name": "Alex Chen",
  "email": "alex@demo.dev",
  "role": "developer",
  "active": true
}`,
  },
  {
    name: "products",
    response: `{
  "id": 128,
  "name": "Mechanical Keyboard",
  "price": 149.99,
  "stock": 84
}`,
  },
  {
    name: "projects",
    response: `{
  "id": 7,
  "name": "MockForge",
  "status": "active",
  "members": 12
}`,
  },
];

function Github() {
  return (
    <svg viewBox="0 0 640 640" className="size-4" fill="currentColor">
      <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
    </svg>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [endpoint, setEndpoint] = useState(0);

  const current = endpoints[endpoint];

  const closeMenu = () => setMenu(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-background" />

      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-[#F7931A]/10 blur-[150px]" />

      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-100 w-100 rounded-full bg-[#FFD600]/5 blur-[140px]" />

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

              <Link
                to="/login"
                className="rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Sign in
              </Link>

              <Button asChild size="sm" className="ml-2">
                <Link to="/register">Get started</Link>
              </Button>

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

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-36 md:pb-32 md:pt-40 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#F7931A] shadow-[0_0_25px_-12px_rgba(247,147,26,0.8)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F7931A] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#F7931A]" />
              </span>
              Mock infrastructure online
            </div>

            <h1 className="max-w-4xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl">
              Build the frontend
              <br />
              <span className="bg-linear-to-r from-[#F7931A] via-[#FFAA2B] to-[#FFD600] bg-clip-text text-transparent">
                before the backend.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Design resources, define fields, and instantly get realistic JSON APIs. MockForge
              gives your frontend a production-ready contract before the real backend exists.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="group h-11 rounded-lg bg-[#F7931A] px-5 font-medium text-black shadow-[0_8px_30px_-10px_rgba(247,147,26,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff9f1f] hover:shadow-[0_12px_35px_-10px_rgba(247,147,26,0.85)] focus-visible:ring-2 focus-visible:ring-[#F7931A]/50"
              >
                <Link to="/register" className="flex items-center justify-center gap-2">
                  Start building
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 rounded-lg border-border/70 bg-background/60 px-5 font-medium backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7931A]/40 hover:bg-[#F7931A]/5 hover:text-[#F7931A] focus-visible:ring-2 focus-visible:ring-[#F7931A]/30"
              >
                <Link to="/docs" className="flex items-center justify-center gap-2">
                  <Code2 className="size-4" />
                  Read docs
                </Link>
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-[#F7931A]" />
                01 / Define
              </span>

              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-[#F7931A]" />∞ / Resources
              </span>

              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-[#F7931A]" />
                JSON / Output
              </span>
            </div>

            <div className="mt-9 flex items-center gap-3 border-l-2 border-[#F7931A]/40 pl-4">
              <Code2 className="size-4 shrink-0 text-[#F7931A]" />

              <div className="font-mono text-[10px] leading-5 text-muted-foreground">
                <span className="text-foreground">mockforge</span>
                <span className="mx-1 text-[#F7931A]">$</span>
                create project frontend-api
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#F7931A]/10 blur-[100px]" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1115]/95 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-red-400/70" />
                    <span className="size-2 rounded-full bg-yellow-400/70" />
                    <span className="size-2 rounded-full bg-green-400/70" />
                  </div>

                  <span className="ml-2 font-mono text-[9px] text-white/30">mockforge / api</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  online
                </div>
              </div>

              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                      Live endpoint
                    </div>

                    <div className="mt-2 flex items-center gap-2 font-mono text-sm">
                      <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-400">
                        GET
                      </span>

                      <span className="text-white/80">
                        /api/
                        <span className="text-[#F7931A]">{current.name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                      Status
                    </div>

                    <div className="mt-1 font-mono text-[10px] text-emerald-400">200 OK</div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Response body
                  </span>

                  <span className="font-mono text-[9px] text-white/20">application/json</span>
                </div>

                <pre className="min-h-60 overflow-auto rounded-xl border border-white/5 bg-black/30 p-5 font-mono text-xs leading-6 text-slate-300">
                  <code>{current.response}</code>
                </pre>
              </div>

              <div className="border-t border-white/10">
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Resources
                  </span>

                  <span className="font-mono text-[9px] text-white/20">
                    {endpoints.length} endpoints
                  </span>
                </div>

                <div className="grid grid-cols-3 border-t border-white/10">
                  {endpoints.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setEndpoint(index)}
                      className={`relative py-3 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        index === endpoint
                          ? "bg-[#F7931A]/10 text-[#F7931A]"
                          : "text-slate-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.name}

                      {index === endpoint && (
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#F7931A]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/10">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          <Feature
            icon={Zap}
            number="01"
            title="Instant APIs"
            text="Generate working endpoints without waiting for backend implementation."
          />

          <Feature
            icon={Database}
            number="02"
            title="Schema Driven"
            text="Define resources and fields once. MockForge handles the response structure."
          />

          <Feature
            icon={Layers3}
            number="03"
            title="Frontend First"
            text="Build and test your React application against stable API contracts."
          />
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
            href="https://github.com"
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

function Feature({ icon: Icon, number, title, text }) {
  return (
    <div className="group relative border-b border-border/60 p-7 transition-colors duration-300 hover:bg-[#F7931A]/4 last:border-b-0 md:border-b-0 md:border-r md:p-9 md:last:border-r-0">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg border border-[#F7931A]/20 bg-[#F7931A]/5 text-[#F7931A] transition-all duration-300 group-hover:border-[#F7931A]/40 group-hover:bg-[#F7931A]/10 group-hover:shadow-[0_0_25px_-10px_rgba(247,147,26,0.8)]">
          <Icon className="size-4" />
        </div>

        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
          {number}
        </span>
      </div>

      <h2 className="mt-6 font-heading text-base font-semibold tracking-tight">{title}</h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>

      <div className="mt-6 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground/40 transition-colors group-hover:text-[#F7931A]/70">
        <span className="size-1 rounded-full bg-current" />
        MockForge capability
      </div>
    </div>
  );
}
