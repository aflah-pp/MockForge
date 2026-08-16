import { ArrowRight, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-background" />
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-[#F7931A]/10 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 -z-10 h-100 w-100 rounded-full bg-[#FFD600]/5 blur-[140px]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-25 bg-[linear-gradient(hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_75%)]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-36 md:pb-32 md:pt-40 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#F7931A] shadow-[0_0_25px_-12px_rgba(247,147,26,0.8)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F7931A] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#F7931A]" />
            </span>
            Error 404
          </div>

          <div className="relative">
            <div className="absolute -inset-20 rounded-full bg-[#F7931A]/5 blur-[120px]" />

            <h1 className="font-heading text-[8rem] font-black leading-none tracking-[-0.06em] sm:text-[10rem] md:text-[12rem]">
              <span className="bg-linear-to-r from-[#F7931A] via-[#FFAA2B] to-[#FFD600] bg-clip-text text-transparent">
                4
              </span>
              <span className="text-foreground/10">0</span>
              <span className="bg-linear-to-r from-[#FFD600] via-[#FFAA2B] to-[#F7931A] bg-clip-text text-transparent">
                4
              </span>
            </h1>
          </div>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Page not found
          </h2>

          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            The endpoint you're looking for doesn't exist or has been moved. Let's get you back on
            track.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group h-11 rounded-lg bg-[#F7931A] px-5 font-medium text-black shadow-[0_8px_30px_-10px_rgba(247,147,26,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff9f1f] hover:shadow-[0_12px_35px_-10px_rgba(247,147,26,0.85)] focus-visible:ring-2 focus-visible:ring-[#F7931A]/50"
            >
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="size-4" />
                Go home
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
                <Search className="size-4" />
                Browse docs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
