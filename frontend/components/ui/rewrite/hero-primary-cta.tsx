"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppHref, normalizeWhatsAppPhone } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type RewriteHeroPrimaryCtaProps = {
  fallbackHref: string;
  fallbackLabel: string;
  phoneNumber?: string;
  predefinedText?: string;
  ctaText?: string;
  sourceUrl?: string;
  canonicalPath: string;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2C6.56 2 2.1 6.46 2.1 11.93c0 1.75.46 3.46 1.33 4.96L2 22l5.27-1.38a9.88 9.88 0 0 0 4.74 1.2h.01c5.47 0 9.93-4.46 9.93-9.93a9.86 9.86 0 0 0-2.9-6.95ZM12.03 20.14h-.01a8.19 8.19 0 0 1-4.17-1.14l-.3-.18-3.13.82.84-3.04-.2-.31a8.2 8.2 0 0 1-1.27-4.36c0-4.52 3.68-8.2 8.22-8.2 2.2 0 4.27.85 5.83 2.41a8.15 8.15 0 0 1 2.4 5.82c0 4.53-3.68 8.2-8.2 8.2Zm4.5-6.14c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.96-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 1.99 0 1.18.86 2.31.98 2.47.12.16 1.68 2.56 4.07 3.59.57.24 1.02.39 1.37.5.58.18 1.1.15 1.51.09.46-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export default function RewriteHeroPrimaryCta({
  fallbackHref,
  fallbackLabel,
  phoneNumber,
  predefinedText,
  ctaText,
  sourceUrl,
  canonicalPath,
}: RewriteHeroPrimaryCtaProps) {
  const pathname = usePathname();
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (!phoneNumber || typeof window === "undefined") {
      setHref(null);
      return;
    }

    const origin = window.location.origin?.replace(/\/+$/, "") || "";
    const currentPage =
      window.location.href || `${origin}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
    const previousPage = document.referrer || "";
    const computed = buildWhatsAppHref({
      phoneNumber,
      predefinedText,
      currentPage,
      fromPage: previousPage,
      sourceUrl,
    });

    setHref(computed);
  }, [
    canonicalPath,
    pathname,
    phoneNumber,
    predefinedText,
    sourceUrl,
  ]);

  const isWhatsApp = Boolean(href && phoneNumber);

  return (
    <Link
      href={href || fallbackHref}
      target={isWhatsApp ? "_blank" : undefined}
      rel={isWhatsApp ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (!isWhatsApp || !phoneNumber) return;
        const normalizedPhone = normalizeWhatsAppPhone(phoneNumber);
        trackWhatsAppClick({
          location: "rewrite_hero_primary_cta",
          label: ctaText?.trim() || "Chat via WhatsApp",
          phoneLast4: normalizedPhone.slice(-4),
          pagePath: typeof window !== "undefined" ? window.location.pathname : "",
        });
      }}
      className={cn(
        buttonVariants({ size: "lg" }),
        "min-w-[13rem] rounded-full px-6 shadow-[0_16px_40px_rgba(17,24,39,0.16)]",
        isWhatsApp &&
          "bg-[#25D366] text-white hover:bg-[#1fbd5c] dark:bg-[#25D366] dark:text-white dark:hover:bg-[#1fbd5c]",
      )}
    >
      {isWhatsApp ? <WhatsAppIcon className="size-4" /> : null}
      {isWhatsApp ? ctaText?.trim() || "Chat via WhatsApp" : fallbackLabel}
      <ArrowRight className="size-4" />
    </Link>
  );
}
