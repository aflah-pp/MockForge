import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResourceRuntime({ projectSlug, resource }) {
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [recordCount, setRecordCount] = useState("5");

  const runtimeUrl = `${import.meta.env.VITE_API_BASE_URL}${projectSlug}/${resource.slug}/`;
  const multipleRecordsUrl = `${runtimeUrl}?count=${recordCount}`;

  const handleCopy = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);

      setCopiedUrl(type);

      setTimeout(() => {
        setCopiedUrl(null);
      }, 1500);
    } catch {
      setCopiedUrl(null);
    }
  };

  const openApi = () => {
    window.open(runtimeUrl, "_blank", "noopener,noreferrer");
  };

  const openMultipleRecordsApi = () => {
    window.open(multipleRecordsUrl, "_blank", "noopener,noreferrer");
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
          <Button
            variant="outline"
            className="flex-1"
            disabled={!resource.is_published}
            onClick={() => handleCopy(runtimeUrl, "single")}
          >
            {copiedUrl === "single" ? (
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
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Multiple records</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose how many records the API should return.
              </p>
            </div>

            <Badge variant="secondary">count</Badge>
          </div>

          <div className="space-y-3">
            <Select
              value={recordCount}
              disabled={!resource.is_published}
              onValueChange={(value) => {
                setRecordCount(value);
                setCopiedUrl(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select record count" />
              </SelectTrigger>

              <SelectContent>
                {Array.from({ length: 10 }, (_, index) => {
                  const count = index + 1;

                  return (
                    <SelectItem key={count} value={String(count)}>
                      {count} {count === 1 ? "record" : "records"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="rounded-md bg-muted/40 px-3 py-2">
              <p className="break-all font-mono text-xs text-muted-foreground">
                {multipleRecordsUrl}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!resource.is_published}
                onClick={() => handleCopy(multipleRecordsUrl, "multiple")}
              >
                {copiedUrl === "multiple" ? (
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

              <Button
                className="flex-1"
                disabled={!resource.is_published}
                onClick={openMultipleRecordsApi}
              >
                <ExternalLink className="mr-2 size-4" />
                Open API
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
