import { useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { useClient } from "sanity";
import { useToast } from "@sanity/ui";

const OG_DEFAULTS = {
  eyebrow: "KotaCom",
  defaultBadge: "Blog",
  headerRightText: "",
  footerLeftText: "",
  footerRightText: "",
  gradientFrom: { _type: "color", hex: "#0B1220" },
  gradientTo: { _type: "color", hex: "#1E293B" },
  accentColor: { _type: "color", hex: "#22D3EE" },
  textColor: { _type: "color", hex: "#FFFFFF" },
  fontFamily: "Geist",
  titleMaxLength: 140,
  titleFontSize: 82,
  titleLineHeight: 1.08,
  titleLetterSpacingEm: -0.03,
  titleClampLines: 3,
  canvasPaddingX: 76,
  canvasPaddingY: 68,
  headerDotSize: 10,
  badgeBorderWidth: 1,
  badgeBorderRadius: 999,
  footerBorderColor: { _type: "color", hex: "#FFFFFF" },
  footerBorderOpacity: 0.18,
  overlayEnabled: true,
  overlayOpacity: 0.12,
  showTitleIcon: true,
  randomizeTitleIcon: true,
  titleAlign: "left",
  titleCaseMode: "none",
  cornerCaseMode: "none",
  stylePreset: "morphglass",
  iconSize: 48,
  iconCardSize: 92,
  iconCardRadius: 24,
  iconCardBorderWidth: 1,
  iconCardBgColor: { _type: "color", hex: "#111827" },
  iconCardBorderColor: { _type: "color", hex: "#22D3EE" },
};

export const resetOgSettingsAction: DocumentActionComponent = (props) => {
  const { id, onComplete } = props;
  const client = useClient({ apiVersion: "2026-03-23" });
  const toast = useToast();
  const [running, setRunning] = useState(false);

  return {
    label: "Reset OG Defaults",
    disabled: running,
    onHandle: async () => {
      setRunning(true);
      try {
        const normalizedId = id.replace(/^drafts\./, "");
        const targetId = `drafts.${normalizedId}`;
        await client.patch(targetId).set(OG_DEFAULTS).commit({ autoGenerateArrayKeys: true });
        toast.push({
          status: "success",
          title: "OG settings reset",
          description: "Default morphglass values have been restored in draft.",
        });
      } catch (error) {
        toast.push({
          status: "error",
          title: "Failed to reset OG settings",
          description: error instanceof Error ? error.message : "Unknown error.",
        });
      } finally {
        setRunning(false);
        onComplete();
      }
    },
  };
};
