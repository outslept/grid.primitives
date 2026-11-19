"use client";

import React, { useCallback, useState } from "react";
import type { Breakpoint } from "../grid";
import { BlueprintButton } from "./blueprint";

export function CodeBlock({ code, html, bp }: { code: string; html?: string; bp: Breakpoint }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [code]);

  return (
    <footer className="h-[208px] overflow-hidden border-t border-border bg-surface">
      <div className="flex h-8 items-center justify-between border-b border-border px-4 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-border">/</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">active: {bp}</span>
          <BlueprintButton
            variant="pill"
            active={copied}
            onClick={onCopy}
            className="px-2.5 py-0.5"
          >
            {copied ? "Copied" : "Copy"}
          </BlueprintButton>
        </div>
      </div>
      <div className="flex h-[176px] items-center overflow-x-auto bg-background px-5">
        {html ? (
          <div
            className="w-fit min-w-0 [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:font-mono [&>pre]:text-[12px] [&>pre]:leading-[1.65]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="m-0 w-fit bg-transparent p-0 font-mono text-[12px] leading-[1.65] text-foreground">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </footer>
  );
}
