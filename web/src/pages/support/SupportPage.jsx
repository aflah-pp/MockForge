import { Bug, FileText, Lightbulb, MessageSquare, Wrench } from "lucide-react";

import AppLayout from "@/components/layout/app-layout";
import FeedbackForm from "@/pages/feedback/FeedBackForm";

const feedbackTypes = [
  {
    value: "BUG",
    label: "Bug Report",
    icon: Bug,
    description: "Something is broken or behaving unexpectedly.",
  },
  {
    value: "FEATURE",
    label: "Feature Request",
    icon: Lightbulb,
    description: "Suggest an improvement or new capability.",
  },
  {
    value: "DOCUMENTATION",
    label: "Documentation",
    icon: FileText,
    description: "Report missing, incorrect, or unclear documentation.",
  },
  {
    value: "UX",
    label: "User Experience",
    icon: Wrench,
    description: "Tell us about confusing or frustrating behavior.",
  },
  {
    value: "GENERAL",
    label: "General Feedback",
    icon: MessageSquare,
    description: "Anything else you would like us to know.",
  },
];

export default function SupportPage() {
  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
          <div className="mb-4 shrink-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Support & Feedback
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">Help make Mokvio better.</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Found a bug, need help, have an idea, or something that could work better? Tell us
              about it.
            </p>
          </div>

          <FeedbackForm feedbackTypes={feedbackTypes} />
        </div>
      </main>
    </AppLayout>
  );
}
