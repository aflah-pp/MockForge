import ThemeToggle from "@/components/theme-toggle";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
