import { AlertTriangle, ArrowLeft, Code2, FileCheck2, ShieldAlert, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    icon: UserCheck,
    title: "Using MockForge",
    content: [
      "You may use MockForge to create and manage mock APIs, projects, resources, fields, and related configurations for legitimate development and testing purposes.",
      "You are responsible for the information and configurations you create through your account.",
      "You must provide accurate account information and keep your authentication credentials secure.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Prohibited use",
    content: [
      "You may not use MockForge to facilitate unlawful activity, abuse, fraud, unauthorized access, attacks against systems, or other activity that violates applicable law.",
      "You may not intentionally interfere with the availability, security, or normal operation of the hosted MockForge service.",
      "You may not attempt to bypass authentication, rate limits, access controls, or other security mechanisms.",
      "You may not use the service to distribute malicious code or intentionally harmful content.",
    ],
  },
  {
    icon: Code2,
    title: "Open-source software",
    content: [
      "MockForge is developed as open-source software. The source code is made available under the license included with the project.",
      "The open-source license governs your rights to use, modify, and distribute the software itself.",
      "The hosted MockForge service may have additional operational rules that apply specifically to use of the hosted platform.",
    ],
  },
  {
    icon: FileCheck2,
    title: "Your content",
    content: [
      "You retain responsibility for the projects, configurations, and other content you create using MockForge.",
      "You must have the necessary rights to any content or data you submit to the service.",
      "You should not store passwords, private keys, production secrets, API credentials, or other sensitive credentials inside mock configurations unless the feature is explicitly designed for secure secret storage.",
    ],
  },
];

export default function TermsPage() {
  return (
    <AppLayout>
      <main className="h-[calc(100vh-5rem)] overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="shrink-0">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link to="/" aria-label="Back to home">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Legal
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Terms of Service
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  The rules for using the hosted MockForge service.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-8">
            <div className="space-y-5">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm leading-6 text-muted-foreground">
                    <strong className="text-foreground">Last updated: August 12, 2026.</strong> By
                    creating an account or using the hosted MockForge service, you agree to these
                    Terms of Service. If you do not agree with these terms, do not use the hosted
                    service.
                  </p>
                </CardContent>
              </Card>

              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <Card key={section.title}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </div>

                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {section.content.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="border-destructive/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <AlertTriangle className="size-4" />
                    </div>

                    <CardTitle className="text-base">Availability and liability</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    MockForge is provided on an as-available basis. We do not guarantee that the
                    hosted service will always be available, uninterrupted, secure, or error-free.
                  </p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    You should maintain appropriate backups of important configurations and
                    development data. MockForge should not be treated as a replacement for
                    production infrastructure, backup systems, or secure secret management.
                  </p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    To the extent permitted by applicable law, MockForge and its contributors are
                    not responsible for losses resulting from your use of the service or misuse of
                    the software.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Changes to these terms</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    These terms may be updated as MockForge evolves. Continued use of the hosted
                    service after an updated version becomes effective constitutes acceptance of the
                    updated terms, subject to applicable law.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Open-source project</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    These terms apply to the hosted MockForge service. They do not replace or modify
                    the open-source license governing the MockForge source code.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
