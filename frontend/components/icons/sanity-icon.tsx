import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ICON_MAP } from "@/components/icons/navigation-icons";

type LegacyIconName = keyof typeof NAVIGATION_ICON_MAP;
type IconProps = { className?: string };

export type SanityIconValue =
  | LegacyIconName
  | {
      provider?: string | null;
      name?: string | null;
      svg?: string | null;
    }
  | null
  | undefined;

const FALLBACK_ICONS = ["◆", "●", "■", "▲", "★", "◎", "⬡", "⬢"] as const;

function FallbackIcon({ className, seed }: { className?: string; seed?: string }) {
  const index = seed ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % FALLBACK_ICONS.length : 0;
  return (
    <span aria-hidden="true" className={cn("inline-flex items-center justify-center", className)}>
      {FALLBACK_ICONS[index]}
    </span>
  );
}

export default function SanityIcon({
  icon,
  className,
  fallbackSeed,
}: {
  icon: SanityIconValue;
  className?: string;
  fallbackSeed?: string;
}) {
  if (!icon) {
    return fallbackSeed ? <FallbackIcon className={className} seed={fallbackSeed} /> : null;
  }

  if (typeof icon === "string") {
    const LegacyIcon = NAVIGATION_ICON_MAP[icon];
    return LegacyIcon ? <LegacyIcon className={className} /> : <FallbackIcon className={className} seed={icon} />;
  }

  if (icon.svg) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 [&_svg]:size-full [&_svg]:fill-current [&_svg]:stroke-current",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
    );
  }

  if ((icon.provider === "lu" || icon.provider === "si") && icon.name) {
    const LegacyIcon = NAVIGATION_ICON_MAP[icon.name] || NAVIGATION_ICON_MAP[icon.name.toLowerCase()];
    if (LegacyIcon) return <LegacyIcon className={className} />;
    return fallbackSeed ? <FallbackIcon className={className} seed={fallbackSeed} /> : null;
  }

  return fallbackSeed ? <FallbackIcon className={className} seed={fallbackSeed} /> : null;
}
