import { ArrowUpRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountCard({ user }) {
  const account = user ?? {
    username: "aflah",
    email: "aflah@example.com",
    first_name: "Muhammed",
    last_name: "Aflah",
    avatar: null,
    is_verified: false,
  };

  const fullName =
    [account.first_name, account.last_name].filter(Boolean).join(" ") || account.username;

  const initials =
    [account.first_name?.[0], account.last_name?.[0]].filter(Boolean).join("").toUpperCase() ||
    account.username?.[0]?.toUpperCase() ||
    "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={account.avatar || undefined} alt={fullName} />
            <AvatarFallback>{initials || <UserRound className="size-5" />}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <CardTitle>Account</CardTitle>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              Manage your account information.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Username</p>

            <p className="mt-1 font-medium">@{account.username}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>

            <p className="mt-1 truncate font-medium">{account.email}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">First Name</p>

            <p className="mt-1 font-medium">{account.first_name || "—"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Last Name</p>

            <p className="mt-1 font-medium">{account.last_name || "—"}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Email Status</p>

            <p className="mt-1 font-medium">{account.is_verified ? "Verified" : "Not verified"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button asChild>
            <Link to="/settings/account">
              Edit Account
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
