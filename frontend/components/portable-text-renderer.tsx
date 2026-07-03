import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

import { componentMap } from "@/components/blocks";

type MarkdownTableRowValue = {
  _key?: string;
  isHeader?: boolean;
  cells?: string[];
};

const CodeBlock = dynamic(() => import("@/components/ui/code-block"), { ssr: true });
import Markdown from "react-markdown";

function sectionBlockTypes(pageTitle?: string | null) {
  return Object.fromEntries(
    Object.entries(componentMap)
      .filter(([type]) => type !== "legacy-rich-content" && type !== "block-preset-ref")
      .map(([type, Component]) => [
        type,
        ({ value }: { value: any }) => (
          <Component {...value} key={value._key} pageTitle={pageTitle} />
        ),
      ]),
  );
}

const createPortableTextComponents = (
  headingIdMap?: Record<string, string>,
  pageTitle?: string | null,
): PortableTextProps["components"] => ({
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const { url, metadata } = value.asset;
      const { lqip, dimensions } = metadata || {};
      return (
        <Image
          src={url}
          alt={value.alt || "Image"}
          width={dimensions.width}
          height={dimensions.height}
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip || undefined}
          style={{
            borderRadius: "1rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 720px, 800px"
        />
      );
    },
    undefined: ({ value }) => {
      const text = typeof value === 'string' ? value : value?.text;
      if (!text) return null;
      return <p style={{ marginBottom: '1rem' }}>{text}</p>;
    },
    youtube: ({ value }) => {
      const { videoId } = value;
      return (
        <div className="aspect-video max-w-[45rem] rounded-xl overflow-hidden mb-4">
          <YouTubeEmbed videoid={videoId} params="rel=0" />
        </div>
      );
    },
    code: ({ value }) => {
      return (
        <CodeBlock
          code={value.code || ""}
          language={value.language || "typescript"}
          filename={value.filename}
        />
      );
    },
    markdownTable: ({ value }) => {
      const rows: MarkdownTableRowValue[] = Array.isArray(value?.rows) ? value.rows : [];
      if (rows.length === 0) return null;

      const headerRow = rows.find((row) => row?.isHeader) || rows[0];
      const bodyRows = rows.filter((row, index) => row !== headerRow || index !== 0 || !row?.isHeader);

      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-border/70">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr>
                {(headerRow?.cells || []).map((cell: string, index: number) => (
                  <th key={`${index}-${cell}`} className="border-b border-border px-4 py-3 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={row._key || rowIndex} className="odd:bg-background even:bg-muted/20">
                  {(row?.cells || []).map((cell: string, cellIndex: number) => (
                    <td key={`${row._key || rowIndex}-${cellIndex}`} className="border-t border-border/70 px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    "legacy-rich-content": ({ value }) => {
      return (
        <section className="my-6 rounded-xl border border-border/70 p-5">
          {value?.title ? (
            <h2 className="mb-2 text-2xl font-semibold">{value.title}</h2>
          ) : null}
          {value?.excerpt ? (
            <p className="mb-4 text-sm text-muted-foreground">{value.excerpt}</p>
          ) : null}
          <div className="legacy-prose">
            <Markdown>{value?.contentRaw || ""}</Markdown>
          </div>
        </section>
      );
    },
    "inline-button": ({ value }) => {
      const linkTarget = value?.link?.isExternal ? "_blank" : undefined;
      const href = value?.link?.isExternal 
        ? value?.link?.href 
        : value?.link?.internalLink?.route 
          ? `/${value.link.internalLink.route.replace(/^\/+/, '')}`
          : "#";
      
      return (
        <div className="my-6">
          <Button asChild size="lg" className="rounded-full px-6 transition-all duration-200 active:scale-[0.98]">
            <Link href={href || "#"} target={linkTarget}>
              {value?.text || "Button"}
            </Link>
          </Button>
        </div>
      );
    },
    ...sectionBlockTypes(pageTitle),
  },
  block: {
    normal: ({ children }) => (
      <p style={{ marginBottom: "1rem" }}>{children}</p>
    ),
    h1: ({ children, value }) => (
      <h1
        id={value?._key ? headingIdMap?.[value._key] : undefined}
        className="scroll-mt-24"
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        {children}
      </h1>
    ),
    h2: ({ children, value }) => (
      <h2
        id={value?._key ? headingIdMap?.[value._key] : undefined}
        className="scroll-mt-24"
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={value?._key ? headingIdMap?.[value._key] : undefined}
        className="scroll-mt-24"
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4
        id={value?._key ? headingIdMap?.[value._key] : undefined}
        className="scroll-mt-24"
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        {children}
      </h4>
    ),
    h5: ({ children, value }) => (
      <h5
        id={value?._key ? headingIdMap?.[value._key] : undefined}
        className="scroll-mt-24"
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        {children}
      </h5>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const isExternal =
        (value?.href || "").startsWith("http") ||
        (value?.href || "").startsWith("https") ||
        (value?.href || "").startsWith("mailto");
      const target = isExternal ? "_blank" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={target ? "noopener" : undefined}
          style={{ textDecoration: "underline" }}
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1rem",
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          paddingLeft: "1.5rem",
          marginBottom: "1rem",
          listStyleType: "decimal",
          listStylePosition: "inside",
        }}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: "0.5rem" }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: "0.5rem" }}>{children}</li>
    ),
  },
});

const PortableTextRenderer = ({
  value,
  headingIdMap,
  pageTitle,
}: {
  value: PortableTextProps["value"];
  headingIdMap?: Record<string, string>;
  pageTitle?: string | null;
}) => {
  return (
    <PortableText
      value={value}
      components={createPortableTextComponents(headingIdMap, pageTitle)}
    />
  );
};

export default PortableTextRenderer;
