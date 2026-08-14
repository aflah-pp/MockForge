import { Label } from "@/components/ui/label";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";

export function SearchForm({ value, onChange, ...props }) {
  return (
    <form {...props} onSubmit={(event) => event.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search the docs
          </Label>

          <SidebarInput
            id="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search the docs..."
            className="pl-8"
          />

          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
