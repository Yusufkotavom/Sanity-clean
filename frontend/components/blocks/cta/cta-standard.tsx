import Link from "next/link";

import { Button } from "@/components/ui/button";

type CtaStandardButton = {
  readonly text: string;
  readonly url: string;
};

type CtaStandardBlock = {
  readonly _type: string;
  readonly _key: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly button?: CtaStandardButton;
};

type CtaStandardProps = {
  readonly block: CtaStandardBlock;
};

export function CtaStandard({ block }: CtaStandardProps) {
  return (
    <section className="bg-slate-950 px-4 py-16 text-white md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
          {block.title}
        </h2>
        {block.subtitle ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
            {block.subtitle}
          </p>
        ) : null}
        {block.button ? (
          <Button asChild className="mt-8" size="lg">
            <Link href={block.button.url}>{block.button.text}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
