import { ArrowUpRight, KeyRound, MailCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiLogo from "../../../assets/Api.png";

export default function AccountCard({ user }) {
  const account = user || {};
  const username = account.username || "User";
  const email = account.email || "—";
  const firstName = account.first_name || "";
  const lastName = account.last_name || "";
  const avatar = account.avatar || ApiLogo;
  const isVerified = Boolean(account.is_verified);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
    username?.[0]?.toUpperCase() ||
    "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={avatar || undefined} alt={fullName} />

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

              <p className="mt-1 font-medium">@{username}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Email</p>

              <p className="mt-1 truncate font-medium">{email}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">First Name</p>

              <p className="mt-1 font-medium">{firstName || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Last Name</p>

              <p className="mt-1 font-medium">{lastName || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Email Status</p>

              <p
                className={
                  isVerified
                    ? "mt-1 font-medium text-green-600"
                    : "mt-1 font-medium text-muted-foreground"
                }
              >
                {isVerified ? "Verified" : "Not verified"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/settings/account"
              className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <span>Edit Account</span>
              <ArrowUpRight className="size-3.5 shrink-0" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
                <KeyRound className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base">Password</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Link
              to="/settings/account/password"
              className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
            >
              <span>Change Password</span>
              <ArrowUpRight className="size-3.5 shrink-0" />
            </Link>
          </CardContent>
        </Card>

        {!isVerified && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
                  <MailCheck className="size-4" />
                </div>

                <div>
                  <CardTitle className="text-base">Email Verification</CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Verify your email address to secure your account.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Link
                to="/settings/account/verify-email"
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                <span>Verify Email</span>
                <ArrowUpRight className="size-3.5 shrink-0" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
