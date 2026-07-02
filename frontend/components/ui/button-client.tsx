"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  useButtonTheme,
  buttonThemeTokenClasses,
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

  let content: React.ReactNode = children;

  if (showDefaultIcon && iconNode) {
    if (asChild && React.isValidElement(children)) {
      // Inject the icon inside the child to maintain a single root for Slot
      const childProps = children.props as any;
      const innerChildren = childProps.children;

      const newInnerContent =
        iconPosition === "left" ? (
          <>
            {iconNode}
            {innerChildren}
          </>
        ) : (
          <>
            {innerChildren}
            {iconNode}
          </>
        );

      content = React.cloneElement(children, {
        ...childProps,
        children: newInnerContent,
      });
    } else {
      content =
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
        );
    }
  }

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonThemeTokenClasses(theme),
        buttonVariants({ variant: resolvedVariant, size: resolvedSize, className })
      )}
      {...props}
    >
      {content}
    </Comp>
  );
}

function isPlainContent(children: React.ReactNode): boolean {
  if (children === null || children === undefined || typeof children === "boolean") return true;
  if (typeof children === "string") return true;
  if (typeof children === "number") return true;

  if (React.isValidElement(children)) {
    // recursively check inside Link or other wrapper components
    if (children.props && (children.props as any).children) {
      return isPlainContent((children.props as any).children);
    }
    return children.type === "span";
  }

  if (Array.isArray(children)) {
    return children.every((child) => isPlainContent(child));
  }
  return false;
}

export { Button };
