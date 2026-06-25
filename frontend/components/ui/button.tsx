import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  useButtonTheme,
  type ButtonIconValue,
  type ButtonIconPosition,
} from "@/components/ui/button-theme-context";
import { ButtonDefaultIcon } from "@/components/ui/button-icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--btn-radius,0.5rem)] border border-[length:var(--btn-border-width,1px)] border-[color:var(--btn-border-color,var(--input))] text-sm font-medium shadow-[var(--btn-shadow,none)] transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 [--btn-border-width:0]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 [--btn-border-width:0]",
        outline:
          "bg-background/90 hover:bg-accent hover:text-accent-foreground [--btn-border-color:var(--input)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 [--btn-border-color:var(--border)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground [--btn-border-width:0]",
        link:
          "text-primary underline-offset-4 hover:underline rounded-none [--btn-border-width:0] [--btn-shadow:none]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 has-[>svg]:px-2.5",
        lg: "h-11 px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariantProp = VariantProps<typeof buttonVariants>["variant"];
type ButtonSizeProp = VariantProps<typeof buttonVariants>["size"];

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const theme = useButtonTheme();

  const resolvedVariant = (variant ?? theme.variant) as
    | NonNullable<ButtonVariantProp>
    | undefined;
  const resolvedSize = (size ?? theme.size) as
    | NonNullable<ButtonSizeProp>
    | undefined;

  const showDefaultIcon =
    resolvedSize !== "icon" &&
    theme.icon &&
    theme.icon !== "none" &&
    isPlainContent(children);

  const iconPosition: ButtonIconPosition =
    theme.iconPosition ?? "right";
  const iconName: ButtonIconValue = theme.icon;

  const iconNode = showDefaultIcon ? (
    <ButtonDefaultIcon name={iconName} className="size-4 shrink-0" />
  ) : null;

  const content = iconNode ? (
    iconPosition === "left" ? (
      <>
        {iconNode}
        {children}
      </>
    ) : (
      <>
        {children}
        {iconNode}
      </>
    )
  ) : (
    children
  );

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant: resolvedVariant, size: resolvedSize, className })
      )}
      {...props}
    >
      {content}
    </Comp>
  );
}

function isPlainContent(children: React.ReactNode): boolean {
  if (typeof children === "string") return true;
  if (typeof children === "number") return true;
  if (Array.isArray(children)) {
    return children.every(
      (child) =>
        typeof child === "string" ||
        typeof child === "number" ||
        (React.isValidElement(child) && child.type === "span")
    );
  }
  if (React.isValidElement(children) && children.type === "span") return true;
  return false;
}

export { Button, buttonVariants };
