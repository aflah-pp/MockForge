import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "@/features/docs/data/v1.0.0";

const docsPages = navigation.flatMap((section) => section.items);

function DocsPagination() {
  const location = useLocation();

  const currentIndex = docsPages.findIndex((page) => page.url === location.pathname);

  if (currentIndex === -1) {
    return null;
  }

  const previous = docsPages[currentIndex - 1];
  const currentPage = docsPages[currentIndex];
  const next = docsPages[currentIndex + 1];

  const current = currentIndex + 1;
  const total = docsPages.length;

  const buttonClass =
    "flex! flex-row! items-center! justify-center! rounded-lg px-3 cursor:pointer";

  return (
    <TooltipProvider>
      <nav
        aria-label="Documentation Page Navigation"
        className="mt-16 mb-12 border-t border-border pt-6"
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="justify-self-start">
            {previous ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="sm" className={buttonClass}>
                    <Link to={previous.url} aria-label={`Previous: ${previous.title}`}>
                      <ChevronLeft className="size-6 shrink-0" />
                    </Link>
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="top">
                  <p>{previous.title}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className={buttonClass}
                aria-label="No previous page"
              >
                <ChevronLeft className="size-6 shrink-0" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentPage.title}</span>

            <span className="text-border">·</span>

            <span>
              <span className="font-medium text-foreground">{current}</span>

              <span className="mx-1">/</span>

              <span>{total}</span>
            </span>
          </div>

          <div className="justify-self-end">
            {next ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="sm" className={buttonClass}>
                    <Link to={next.url} aria-label={`Next: ${next.title}`}>
                      <ChevronRight className="size-6 shrink-0" />
                    </Link>
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="top">
                  <p>{next.title}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className={buttonClass}
                aria-label="No next page"
              >
                <ChevronRight className="size-6 shrink-0" />
              </Button>
            )}
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}

export default DocsPagination;
