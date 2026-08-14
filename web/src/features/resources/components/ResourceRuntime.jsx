import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourceRuntime({ projectSlug, resource }) {
  const [copied, setCopied] = useState(false);

  const runtimeUrl = `${import.meta.env.VITE_API_BASE_URL}${projectSlug}/${resource.slug}/`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(runtimeUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const openApi = () => {
    window.open(runtimeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Public API</CardTitle>

          <Badge variant="outline">GET</Badge>
        </div>

        <CardDescription>Generated mock API endpoint for this resource.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="break-all font-mono text-xs leading-5 text-muted-foreground">
            {runtimeUrl}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={copyUrl}>
            {copied ? (
              <>
                <Check className="mr-2 size-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 size-4" />
                Copy URL
              </>
            )}
          </Button>

          <Button className="flex-1" disabled={!resource.is_published} onClick={openApi}>
            <ExternalLink className="mr-2 size-4" />
            Open API
          </Button>
        </div>

        {!resource.is_published && (
          <p className="text-xs text-muted-foreground">
            Publish this resource to make the public API available.
          </p>
        )}

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Multiple records</span>

            <Badge variant="secondary">count</Badge>
          </div>

          <p className="break-all font-mono text-xs text-muted-foreground">{runtimeUrl}?count=5</p>
        </div>
      </CardContent>
    </Card>
  );
}
