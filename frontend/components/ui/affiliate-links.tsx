import Link from "next/link";
import { cn } from "@/lib/utils";

type AffiliateLink = {
  _key?: string;
  platform?: string;
  label?: string;
  url?: string;
};

const PLATFORM_ICONS: Record<string, { icon: string; color: string }> = {
  shopee: { icon: "🛒", color: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20" },
  tokopedia: { icon: "🟢", color: "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20" },
  tiktokshop: { icon: "🎵", color: "bg-black/5 text-black border-black/15 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:border-white/20" },
  lazada: { icon: "🔵", color: "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20" },
  bukalapak: { icon: "🟣", color: "bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20" },
  blibli: { icon: "💙", color: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/20" },
  other: { icon: "🔗", color: "bg-muted text-foreground border-border hover:bg-accent" },
};

export default function AffiliateLinks({ links }: { links?: AffiliateLink[] | null }) {
  if (!links?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, i) => {
        if (!link.url) return null;
        const platform = PLATFORM_ICONS[link.platform || "other"] || PLATFORM_ICONS.other;
        return (
          <Link
            key={link._key || i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              platform.color,
            )}
          >
            <span>{platform.icon}</span>
            <span>{link.label || `Beli di ${link.platform}`}</span>
          </Link>
        );
      })}
    </div>
  );
}
