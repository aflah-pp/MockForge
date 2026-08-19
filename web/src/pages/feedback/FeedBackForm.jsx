import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackForm({ feedbackTypes }) {
  const [feedbackType, setFeedbackType] = useState("BUG");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [actualBehavior, setActualBehavior] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedType =
    feedbackTypes.find((item) => item.value === feedbackType) ?? feedbackTypes[0];

  const SelectedIcon = selectedType.icon;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      type: feedbackType,
      title: title.trim(),
      description: description.trim(),
      steps_to_reproduce: stepsToReproduce.trim(),
      expected_behavior: expectedBehavior.trim(),
      actual_behavior: actualBehavior.trim(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    try {
      // eslint-disable-next-line no-console
      console.log(payload);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFeedbackType("BUG");
    setTitle("");
    setDescription("");
    setStepsToReproduce("");
    setExpectedBehavior("");
    setActualBehavior("");
  };

  if (submitted) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border bg-card p-8 shadow-sm">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight">Feedback received.</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Thanks for helping improve Mokvio. Your feedback has been recorded and will be
            reviewed.
          </p>

          <Button type="button" variant="outline" className="mt-6" onClick={resetForm}>
            Submit another
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid h-full lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="hidden border-r bg-muted/10 p-5 lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold">What would you like to report?</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Choose the category that best describes your feedback.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            {feedbackTypes.map((item) => {
              const Icon = item.icon;
              const active = feedbackType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFeedbackType(item.value)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{item.label}</p>

                    <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto rounded-xl border border-dashed bg-background/60 p-4">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Good feedback
            </p>

            <ul className="mt-2 space-y-1.5 text-[11px] leading-4 text-muted-foreground">
              <li>• Explain what happened.</li>
              <li>• Tell us what you expected.</li>
              <li>• Include reproduction steps for bugs.</li>
              <li>• Screenshots are useful when relevant.</li>
            </ul>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div className="lg:hidden">
              <p className="text-xs font-semibold">Feedback type</p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Select what best describes your feedback.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {feedbackTypes.map((item) => {
                  const Icon = item.icon;
                  const active = feedbackType === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFeedbackType(item.value)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                        active ? "border-primary/30 bg-primary/5 text-primary" : "hover:bg-muted/40"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />

                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label htmlFor="title" className="text-xs font-medium">
                Title
              </label>

              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Briefly describe your feedback"
                maxLength={120}
                required
              />

              <p className="text-right text-[10px] text-muted-foreground">{title.length}/120</p>
            </div>

            <div className="mt-4 space-y-2">
              <label htmlFor="description" className="text-xs font-medium">
                Description
              </label>

              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the problem, idea, or feedback in as much detail as necessary."
                className="min-h-28 resize-none"
                maxLength={5000}
                required
              />

              <p className="text-right text-[10px] text-muted-foreground">
                {description.length}/5000
              </p>
            </div>

            {feedbackType === "BUG" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="steps" className="text-xs font-medium">
                    Steps to reproduce
                  </label>

                  <Textarea
                    id="steps"
                    value={stepsToReproduce}
                    onChange={(event) => setStepsToReproduce(event.target.value)}
                    placeholder={"1. Open...\n2. Click...\n3. Observe..."}
                    className="min-h-24 resize-none"
                    maxLength={3000}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="actual" className="text-xs font-medium">
                    Actual behavior
                  </label>

                  <Textarea
                    id="actual"
                    value={actualBehavior}
                    onChange={(event) => setActualBehavior(event.target.value)}
                    placeholder="What actually happened?"
                    className="min-h-24 resize-none"
                    maxLength={3000}
                  />
                </div>
              </div>
            )}

            {feedbackType !== "BUG" && (
              <div className="mt-4 space-y-2">
                <label htmlFor="expected" className="text-xs font-medium">
                  What would you like to see?
                </label>

                <Textarea
                  id="expected"
                  value={expectedBehavior}
                  onChange={(event) => setExpectedBehavior(event.target.value)}
                  placeholder="Describe the outcome or improvement you would like."
                  className="min-h-24 resize-none"
                  maxLength={3000}
                />
              </div>
            )}

            <div className="mt-4 rounded-lg border bg-muted/20 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <SelectedIcon className="size-3.5 text-primary" />

                <span className="text-[11px] font-medium">{selectedType.label}</span>

                <span className="text-[10px] text-muted-foreground">·</span>

                <span className="text-[10px] text-muted-foreground">
                  Page context will be included automatically
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-t bg-background px-5 py-4 sm:px-6">
            <p className="hidden text-[10px] leading-4 text-muted-foreground sm:block">
              Please avoid including passwords, tokens, API keys, or other secrets.
            </p>

            <Button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="ml-auto"
            >
              <Send className="size-4" />

              <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
