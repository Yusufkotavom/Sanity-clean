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
    color?: any;
    image?: any;
  };
  typography?: {
    textAlign?: string;
    fontSize?: string;
    fontFamily?: string;
    textColor?: any;
  };
  effects?: {
    shadow?: string;
    opacity?: number;
  };
}

export function applyBlockStyles(styles?: BlockStyles | null): React.CSSProperties {
  if (!styles) return {};

  const getColor = (c: any) => {
    if (!c) return undefined;
    if (typeof c === "string") return c;
    if (typeof c === "object" && c.hex) return c.hex;
    return undefined;
  };

  const cssProps: Record<string, string | number | undefined> = {
    paddingTop: styles.padding?.top,
    paddingBottom: styles.padding?.bottom,
    marginTop: styles.margin?.top,
    backgroundColor: getColor(styles.background?.color) || getColor((styles.background as any)),
    backgroundImage: typeof styles.background?.image === 'string' ? `url(${styles.background.image})` : undefined,
    borderWidth: styles.border?.width,
    borderStyle: styles.border?.style,
    borderColor: getColor(styles.border?.color),
    borderRadius: styles.borderRadius
      ? `${styles.borderRadius.topLeft || '0'} ${styles.borderRadius.topRight || '0'} ${styles.borderRadius.bottomRight || '0'} ${styles.borderRadius.bottomLeft || '0'}`
      : undefined,
    textAlign: styles.typography?.textAlign,
    color: getColor(styles.typography?.textColor),
    fontSize: styles.typography?.fontSize,
    fontFamily: styles.typography?.fontFamily,
    boxShadow: styles.effects?.shadow,
    opacity: styles.effects?.opacity,
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
