import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { CopyButton } from "@/components/ui/copy-button";

const CodeBlock = dynamic(() => import("@/components/ui/code-block"), { ssr: true });
import Markdown from "react-markdown";

const createPortableTextComponents = (
  headingIdMap?: Record<string, string>,
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
}: {
  value: PortableTextProps["value"];
  headingIdMap?: Record<string, string>;
}) => {
  return (
    <PortableText
      value={value}
      components={createPortableTextComponents(headingIdMap)}
    />
  );
};

export default PortableTextRenderer;
