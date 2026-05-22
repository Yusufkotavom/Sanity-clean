import Link from "next/link";
import { cn } from "@/lib/utils";

type AffiliateLink = {
  _key?: string;
  platform?: string;
  label?: string;
  url?: string;
};

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const cls = cn("size-5 shrink-0", className);
  switch (platform) {
    case "shopee":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z" />
        </svg>
      );
    case "tokopedia":
      return (
        <svg viewBox="0 0 192 192" fill="currentColor" className={cls}>
          <path fillRule="evenodd" d="M96 28c-9.504 0-17.78 5.307-22.008 13.127C82.736 42.123 88.89 44 96 47.332c7.11-3.332 13.264-5.209 22.008-6.205C113.781 33.31 105.506 28 96 28Zm0-12c-15.973 0-29.568 10.117-34.754 24.28C52.932 40 42.462 40 28.53 40H28a6 6 0 0 0-6 6v124a6 6 0 0 0 6 6h92c27.614 0 50-22.386 50-50V46a6 6 0 0 0-6-6h-.531c-13.931 0-24.401 0-32.715.28C125.566 26.113 111.97 16 96 16ZM34 52.001V164h86c20.987 0 38-17.013 38-38V52.001c-18.502.009-29.622.098-37.872.966-8.692.915-13.999 2.677-21.445 6.4a6 6 0 0 1-5.366 0c-7.446-3.723-12.753-5.485-21.445-6.4-8.25-.868-19.37-.957-37.872-.966ZM50 96c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18-18-8.059-18-18Zm18-30c-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30 1.126 0 2.238-.062 3.332-.183l20.425 20.426a6 6 0 0 0 8.486 0l20.425-20.426c1.094.121 2.206.183 3.332.183 16.569 0 30-13.431 30-30 0-16.569-13.431-30-30-30-12.764 0-23.666 7.971-28 19.207C91.666 73.971 80.764 66 68 66Zm40.082 55.433A30.1 30.1 0 0 1 96 106.793a30.101 30.101 0 0 1-12.082 14.64L96 133.515l12.082-12.082ZM124 78c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18ZM76 96a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm48 8a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" clipRule="evenodd" />
        </svg>
      );
    case "tiktokshop":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "lazada":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.5h-3v-11h3v11zm7 0h-7v-2.5h4.5V7h-4.5V4.5h7v13z" />
        </svg>
      );
    case "bukalapak":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M3.5 5.5l8.5-4 8.5 4v9l-8.5 4-8.5-4v-9zm8.5 11.5l6-2.8V8.8l-6 2.8v5.4zm-7-5.4l6 2.8V8.8l-6-2.8v5.6zM12 3.3L6.5 6 12 8.7 17.5 6 12 3.3z" />
        </svg>
      );
    case "blibli":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14H7V8h3c1.66 0 3 1.34 3 3s-1.34 3-3 3zm6 0h-3V8h3c1.66 0 3 1.34 3 3s-1.34 3-3 3zm-6-2c.55 0 1-.45 1-1s-.45-1-1-1H9v2h1zm6 0c.55 0 1-.45 1-1s-.45-1-1-1h-1v2h1z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
  }
}

const PLATFORM_STYLES: Record<string, string> = {
  shopee: "bg-orange-500/10 text-orange-600 border-orange-500/25 hover:bg-orange-500/20",
  tokopedia: "bg-green-500/10 text-green-700 border-green-500/25 hover:bg-green-500/20",
  tiktokshop: "bg-black/5 text-black border-black/15 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:border-white/20",
  lazada: "bg-blue-600/10 text-blue-700 border-blue-600/25 hover:bg-blue-600/20",
  bukalapak: "bg-rose-500/10 text-rose-700 border-rose-500/25 hover:bg-rose-500/20",
  blibli: "bg-sky-500/10 text-sky-700 border-sky-500/25 hover:bg-sky-500/20",
  other: "bg-muted text-foreground border-border hover:bg-accent",
};

export default function AffiliateLinks({ links }: { links?: AffiliateLink[] | null }) {
  if (!links?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, i) => {
        if (!link.url) return null;
        const style = PLATFORM_STYLES[link.platform || "other"] || PLATFORM_STYLES.other;
        return (
          <Link
            key={link._key || i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              style,
            )}
          >
            <PlatformIcon platform={link.platform || "other"} />
            <span>{link.label || `Beli di ${link.platform}`}</span>
          </Link>
        );
      })}
    </div>
  );
}
