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

export default function SanityIcon({
  icon,
  className,
}: {
  icon: SanityIconValue;
  className?: string;
}) {
  if (!icon) return null;

  if (typeof icon === "string") {
    const LegacyIcon = NAVIGATION_ICON_MAP[icon];
    return LegacyIcon ? <LegacyIcon className={className} /> : null;
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

  // Fallback for legacy icon-picker payloads that may miss `svg`.
  // We intentionally avoid wildcard icon library imports in the client bundle.
  if ((icon.provider === "lu" || icon.provider === "si") && icon.name) return null;

  return null;
}
