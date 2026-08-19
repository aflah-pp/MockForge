import { useMemo, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import ApiLogo from "../../../assets/Api.png";
import { SearchForm } from "@/features/docs/components/search-form";
import { navigation } from "@/features/docs/data/v1.0.0";

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredNavigation = useMemo(() => {
    if (!normalizedSearch) {
      return navigation;
    }

    return navigation
      .map((section) => {
        const sectionMatches = section.title.toLowerCase().includes(normalizedSearch);

        const filteredItems = sectionMatches
          ? section.items
          : section.items.filter((item) => item.title.toLowerCase().includes(normalizedSearch));

        return {
          ...section,
          items: filteredItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [normalizedSearch]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img src={ApiLogo} alt="Mokvio" className="size-6 object-contain" />
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight">Mokvio</span>
            <span className="truncate text-xs text-muted-foreground">Documentation</span>
          </div>
        </div>

        <div className="px-2 pt-1">
          <SearchForm value={search} onChange={setSearch} />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {filteredNavigation.map((section) => (
          <Collapsible key={section.title} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                render={<CollapsibleTrigger />}
              >
                {section.title}

                <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.url;

                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton isActive={isActive} render={<Link to={item.url} />}>
                            {item.title}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        {normalizedSearch && filteredNavigation.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No documentation found.
          </div>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
