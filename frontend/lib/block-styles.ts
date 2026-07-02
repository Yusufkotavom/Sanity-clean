export interface BlockStyles {
  padding?: {
    top?: string;
    bottom?: string;
    topMd?: string;
    bottomMd?: string;
    topLg?: string;
    bottomLg?: string;
  };
  margin?: {
    top?: string;
    bottom?: string;
  };
  border?: {
    width?: string;
    style?: string;
    color?: string;
  };
  borderRadius?: {
    topLeft?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
  };
  background?: {
    color?: string;
  };
  typography?: {
    textAlign?: string;
    fontSize?: string;
    textColor?: string;
  };
  effects?: {
    shadow?: string;
    opacity?: number;
  };
}

export function applyBlockStyles(styles?: BlockStyles | null): React.CSSProperties {
  if (!styles) return {};

  const cssProps: Record<string, string | number | undefined> = {
    paddingTop: styles.padding?.top,
    paddingBottom: styles.padding?.bottom,
    marginTop: styles.margin?.top,
    backgroundColor: styles.background?.color,
    borderWidth: styles.border?.width,
    borderStyle: styles.border?.style,
    borderColor: styles.border?.color,
    borderRadius: styles.borderRadius
      ? `${styles.borderRadius.topLeft || '0'} ${styles.borderRadius.topRight || '0'} ${styles.borderRadius.bottomRight || '0'} ${styles.borderRadius.bottomLeft || '0'}`
      : undefined,
    textAlign: styles.typography?.textAlign,
    color: styles.typography?.textColor,
  };

  // Add responsive CSS variables for breakpoints
  // We can prefix these with --bs-
  if (styles.padding?.topMd) cssProps['--bs-pt-md'] = styles.padding.topMd;
  if (styles.padding?.bottomMd) cssProps['--bs-pb-md'] = styles.padding.bottomMd;
  if (styles.padding?.topLg) cssProps['--bs-pt-lg'] = styles.padding.topLg;
  if (styles.padding?.bottomLg) cssProps['--bs-pb-lg'] = styles.padding.bottomLg;

  // Filter out undefined values to keep styles clean
  const cleanStyles: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(cssProps)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanStyles[key] = value;
    }
  }

  return cleanStyles as React.CSSProperties;
}
