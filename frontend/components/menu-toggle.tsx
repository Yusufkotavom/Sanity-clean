"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const currentTheme = theme === "light" || theme === "dark" ? theme : "system";
  const nextTheme =
    currentTheme === "light"
      ? "dark"
      : currentTheme === "dark"
      ? "system"
      : "light";

  const Icon = currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : Monitor;

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 rounded-full dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.08]"
      aria-label={`Theme: ${currentTheme}. Switch to ${nextTheme}`}
      title={`Theme: ${currentTheme}. Switch to ${nextTheme}`}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
