import { cn } from "@/lib/utils";
import { applyBlockStyles, BlockStyles } from "@/lib/block-styles";

interface SectionContainerProps {
  blockStyles?: BlockStyles | null;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SectionContainer({
  blockStyles,
  children,
  className,
  style,
}: SectionContainerProps) {
  const customStyles = applyBlockStyles(blockStyles);
  const combinedStyle = { ...customStyles, ...style };

  return (
    <div
      className={cn("relative section-theme-bg", className)}
      style={combinedStyle}
    >
      <div className="container relative">
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
