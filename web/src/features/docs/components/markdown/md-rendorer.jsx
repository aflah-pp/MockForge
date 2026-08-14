import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { codeToHtml } from "shiki";

function CodeBlock({ children, className }) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "text";

  useEffect(() => {
    let cancelled = false;

    async function highlightCode() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language === "text" ? "text" : language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });

        if (!cancelled) {
          setHtml(highlighted);
        }
      } catch {
        if (!cancelled) {
          setHtml("");
        }
      }
    }

    highlightCode();

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{language}</span>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {html ? (
        <div
          className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="m-0 overflow-x-auto p-4 text-sm">
          <code className="font-mono">{code}</code>
        </pre>
      )}
    </div>
  );
}

export default function MarkdownRenderer({ children }) {
  return (
    <article className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} className="scroll-m-20 text-4xl font-bold tracking-tight">
              {children}
            </h1>
          ),

          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight"
            >
              {children}
            </h2>
          ),

          h3: ({ children, id }) => (
            <h3 id={id} className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="leading-7 text-muted-foreground not-first:mt-6">{children}</p>
          ),

          ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,

          ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,

          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),

          thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,

          th: ({ children }) => (
            <th className="border-b px-4 py-3 text-left font-semibold">{children}</th>
          ),

          td: ({ children }) => <td className="border-b px-4 py-3 align-top">{children}</td>,

          a: ({ children, href }) => (
            <a href={href} className="font-medium underline underline-offset-4">
              {children}
            </a>
          ),

          code: ({ children, className }) => {
            const isBlock = Boolean(className?.includes("language-"));

            if (!isBlock) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
              );
            }

            return <CodeBlock className={className}>{children}</CodeBlock>;
          },

          pre: ({ children }) => children,
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}
