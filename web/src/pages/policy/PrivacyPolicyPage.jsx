import { ArrowLeft, Database, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    icon: UserRound,
    title: "Information we collect",
    content: [
      "When you create a MockForge account, we may collect your username, email address, first name, last name, password credentials, and optional profile information such as an avatar.",
      "When you use MockForge, we may store the projects, resources, fields, configurations, and other content you intentionally create within the service.",
      "When you submit feedback, we associate the submission with your authenticated account so that we can understand who reported an issue or suggestion and follow up when necessary.",
    ],
  },
  {
    icon: Database,
    title: "How we use your information",
    content: [
      "We use account information to provide authentication, account management, and core MockForge functionality.",
      "Your project and configuration data is used to provide the mock API generation features you request.",
      "Feedback is used to identify bugs, improve usability, prioritize features, and improve the overall MockForge project.",
      "We may use limited technical information to maintain reliability, security, and performance.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "Passwords and security",
    content: [
      "Passwords are stored using Django's password hashing mechanisms and are not stored as plain text.",
      "Authentication tokens are used to maintain authenticated sessions.",
      "You are responsible for keeping your account credentials and API keys secure.",
      "Do not submit passwords, authentication tokens, API keys, private credentials, or other secrets through feedback forms or other areas of MockForge that are not specifically designed to store them.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Data deletion",
    content: [
      "You may deactivate your account from your account settings.",
      "Account deletion and associated data handling are performed according to the functionality provided by the deployed MockForge service.",
      "Because MockForge is open source, self-hosted installations may have different data retention and deletion behavior depending on how the operator configures the deployment.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                  Privacy Policy
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  How MockForge handles information when you use the hosted service.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-8">
            <div className="space-y-5">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm leading-6 text-muted-foreground">
                    <strong className="text-foreground">Last updated: August 12, 2026.</strong> This
                    Privacy Policy describes the information collected and used by the hosted
                    MockForge service. MockForge is also available as open-source software, and
                    self-hosted installations may have their own privacy practices.
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Open-source installations</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm leading-6 text-muted-foreground">
                    The MockForge source code may be used and deployed independently according to
                    its applicable open-source license. If you operate your own MockForge instance,
                    you are responsible for determining what information your deployment collects
                    and for providing any notices required for your users.
                  </p>

                  <p className="text-sm leading-6 text-muted-foreground">
                    This policy applies to the hosted MockForge service and does not automatically
                    apply to independent third-party deployments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Changes to this policy</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    We may update this Privacy Policy as MockForge evolves. Material changes should
                    be reflected by updating the effective date and, where appropriate, providing
                    additional notice through the service.
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
