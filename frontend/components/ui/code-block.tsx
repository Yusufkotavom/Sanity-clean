"use client";

import { Highlight, themes } from "prism-react-renderer";
import { CopyButton } from "@/components/ui/copy-button";

export default function CodeBlock({ code, language, filename }: { code: string; language: string; filename?: string }) {
  return (
    <div className="grid my-4 overflow-x-auto rounded-lg border border-border text-xs lg:text-sm bg-primary/80 dark:bg-muted/80">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-primary/80 dark:bg-muted">
        <div className="text-muted-foreground font-mono">{filename || ""}</div>
        <CopyButton code={code} />
      </div>
      <Highlight theme={themes.vsDark} code={code} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, padding: "1.5rem", margin: 0, overflow: "auto", backgroundColor: "transparent" }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
