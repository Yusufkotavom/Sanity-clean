import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonIconValue } from "@/components/ui/button-theme-context";

const ICON_MAP: Partial<Record<ButtonIconValue, LucideIcon>> = {
  "arrow-right": ArrowRight,
  "chevron-right": ChevronRight,
  "external-link": ExternalLink,
  phone: Phone,
  mail: Mail,
};

export function ButtonDefaultIcon({
  name,
  className,
}: {
  name: ButtonIconValue;
  className?: string;
}) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={cn(className)} aria-hidden="true" />;
}

export default ButtonDefaultIcon;
