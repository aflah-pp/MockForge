import { ArrowUpRight, Code2, Coffee, Globe, Star } from "lucide-react";
import AppLayout from "@/components/layout/app-layout";

function GithubIcon() {
  return (
    <svg viewBox="0 0 640 640" className="size-4" fill="currentColor">
      <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 640 640" className="size-4" fill="currentColor">
      <path d="M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z" />
    </svg>
  );
}

export default function CreatorPage() {
  return (
    <AppLayout>
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="size-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  About the creator
                </p>

                <h1 className="text-2xl font-bold tracking-tight">Muhammed Aflah</h1>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                I'm a Full Stack Developer who enjoys building practical web applications with
                React, Django, and PostgreSQL.
              </p>

              <p>
                MockForge started as a simple idea to make frontend development easier by providing
                configurable mock APIs without having to build temporary backend services.
              </p>
            </div>

            <div className="mt-7 border-t pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Find me online
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/aflah-pp"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <GithubIcon />
                  <span className="ml-2">GitHub</span>
                  <ArrowUpRight className="ml-2 size-3.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/muhammed-aflahpp/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <LinkedinIcon />
                  <span className="ml-2">LinkedIn</span>
                  <ArrowUpRight className="ml-2 size-3.5" />
                </a>

                <a
                  href="https://aflah-pp.github.io"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Globe className="size-4" />
                  <span className="ml-2">Portfolio</span>
                  <ArrowUpRight className="ml-2 size-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-7 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Star className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Like MockForge?</p>

                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    If you find MockForge useful, consider starring the project on GitHub. It helps
                    the project get discovered and motivates continued development.
                  </p>
                </div>

                <a
                  href="https://github.com/aflah-pp/MockForge"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex shrink-0 items-center rounded-lg border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Star className="mr-1.5 size-3.5" />
                  Star Project
                  <ArrowUpRight className="ml-1.5 size-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-4 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Coffee className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Support MockForge</p>

                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    If MockForge is useful to you, you’ll be able to support its development with a
                    coffee.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="shrink-0 cursor-not-allowed rounded-lg border bg-background px-3 py-2 text-xs font-medium text-muted-foreground opacity-60"
                >
                  <span className="mr-1">☕</span>
                  Buy Me a Coffee
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}
