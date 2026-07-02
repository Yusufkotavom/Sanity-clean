import Markdown from "react-markdown";
import SectionContainer from "@/components/ui/section-container";

type RichContentProps = {
  title?: string;
  excerpt?: string;
  contentFormat?: "markdown" | "html";
  contentRaw?: string;
  blockStyles?: any;
};

export default function RichContent({ blockStyles, 
      
      
      title,
      excerpt,
      contentFormat,
      contentRaw,
    }: RichContentProps) {
  if (!contentRaw) return null;

  const isHtml = contentFormat === "html";

  return (
    <SectionContainer blockStyles={blockStyles}>
      <article className="mx-auto max-w-4xl">
        {title ? (
          <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        {excerpt ? (
          <p className="mb-6 text-muted-foreground">{excerpt}</p>
        ) : null}

        {isHtml ? (
          <div
            className="legacy-prose"
            dangerouslySetInnerHTML={{ __html: contentRaw }}
          />
        ) : (
          <div className="legacy-prose">
            <Markdown>{contentRaw}</Markdown>
          </div>
        )}
      </article>
    </SectionContainer>
  );
}
