"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  useButtonTheme,
  type ButtonIconValue,
  type ButtonIconPosition,
} from "@/components/ui/button-theme-context";
import { ButtonDefaultIcon } from "@/components/ui/button-icon";

import { buttonVariants, type ButtonVariantProp, type ButtonSizeProp } from "./button-variants";

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

export { Button };
