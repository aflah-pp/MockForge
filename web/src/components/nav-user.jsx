import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { ChevronsUpDownIcon, BadgeCheckIcon, LogOutIcon, Code2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavUser({ user, onLogout, onLogoutAll }) {
  const { isMobile } = useSidebar();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
    } finally {
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOut(true);
      await onLogoutAll();
    } finally {
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
            >
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />

                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name || "User"}</span>

                <span className="truncate text-xs">{user?.email || ""}</span>
              </div>

              <ChevronsUpDownIcon className="ml-auto size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name || "User"} />

                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name || "User"}</span>

                      <span className="truncate text-xs">{user?.email || ""}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <Link to="/account">
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Mokvio
              </div>

              <DropdownMenuGroup>
                <Link to="/about">
                  <DropdownMenuItem>
                    <Code2 />
                    About Mokvio
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Mokvio?</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to end your session. Logging out of all devices will invalidate
              your active sessions everywhere.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0">
            <AlertDialogAction
              disabled={isLoggingOut}
              onClick={handleLogout}
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Log out current session
            </AlertDialogAction>

            <AlertDialogAction
              disabled={isLoggingOut}
              onClick={handleLogoutAll}
              className={cn(buttonVariants({ variant: "destructive" }), "w-full")}
            >
              Log out all devices
            </AlertDialogAction>

            <AlertDialogCancel disabled={isLoggingOut} className="w-full sm:mt-0">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
