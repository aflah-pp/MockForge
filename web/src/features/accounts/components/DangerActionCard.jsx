import { useState } from "react";
import { AlertTriangle, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DangerActionCard({ onConfirm, isSubmitting = false }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setOpen(false);
  };

  const handleConfirm = async () => {
    await onConfirm?.();

    setOpen(false);
  };

  return (
    <>
      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <UserX className="size-5" />
            </div>

            <div>
              <CardTitle>Deactivate Account</CardTitle>

              <CardDescription className="mt-1">
                Temporarily disable your MockForge account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

              <div>
                <p className="text-sm font-medium text-destructive">
                  Your account will be deactivated.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  You will be signed out and will not be able to use your account while it is
                  inactive. Your account data will remain stored.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="destructive" onClick={() => setOpen(true)} disabled={isSubmitting}>
              <UserX className="mr-2 size-4" />
              Deactivate Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            handleClose();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate your account?</DialogTitle>

            <DialogDescription>
              Your account will be deactivated and you will be signed out. Your projects and other
              account data will not be deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              You can contact the project maintainers if you need help recovering access to your
              account.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button variant="destructive" disabled={isSubmitting} onClick={handleConfirm}>
              {isSubmitting ? "Deactivating..." : "Deactivate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
