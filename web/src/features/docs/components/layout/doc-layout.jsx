import { AppSidebar } from "@/features/docs/components/app-sidebar";
import ThemeToggle from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { navigation } from "@/features/docs/data/v1.0.0";

const docsPages = navigation.flatMap((section) => section.items);

export default function DocLayout({ children }) {
  const location = useLocation();

  const currentPage = docsPages.find((page) => page.url === location.pathname);

  const fallbackTitles = {
    "/docs/introduction": "Introduction",
  };
  const title = currentPage?.title || fallbackTitles[location.pathname] || "Documentation";

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />

          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/docs">Documentation</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
