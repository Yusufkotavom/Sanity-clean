"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
