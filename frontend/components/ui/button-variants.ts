import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
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

export type ButtonVariantProp = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSizeProp = VariantProps<typeof buttonVariants>["size"];
