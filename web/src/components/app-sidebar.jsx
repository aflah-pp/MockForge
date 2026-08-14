"use client";

import { NavMain } from "@/components/nav-main";
import { NavHelp } from "@/components/nav-helps";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  Settings2Icon,
  LifeBuoyIcon,
  FrameIcon,
  BookMarkedIcon,
  ShieldCheckIcon,
  FileTextIcon,
} from "lucide-react";
import ApiLogo from "../assets/Api.png";

const data = {
  user: {
    name: "aflah",
    email: "admin@mail.com",
    avatar: ApiLogo,
  },
  navMain: [
    {
      title: "Projects",
      url: "/project",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/project/list",
        },
        {
          title: "Create",
          url: "/project/create",
        },
      ],
    },
    {
      title: "Active API Endpoints",
      url: "/api/active",
      icon: <BotIcon />,
    },
    {
      title: "Settings",
      url: "/settings",
      isActive: true,
      icon: <Settings2Icon />,
      items: [
        {
          title: "Edit Account",
          url: "/settings/account",
        },
        {
          title: "Danger",
          url: "/settings/danger",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Privacy Policy",
      url: "/policy",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Terms of Service",
      url: "/terms",
      icon: <FileTextIcon />,
    },
  ],
  help: [
    {
      name: "Documentation V1.0",
      url: "/docs",
      icon: <FrameIcon />,
    },
    {
      name: "Resource Templates",
      url: "/resource/templates",
      icon: <BookMarkedIcon />,
    },
  ],
};
export function AppSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
            <img src={ApiLogo} alt="MockForge" className="size-6 object-contain" />
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold tracking-tight">MockForge</span>
            <span className="truncate text-xs text-muted-foreground">DashBoard V1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavHelp helps={data.help} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
