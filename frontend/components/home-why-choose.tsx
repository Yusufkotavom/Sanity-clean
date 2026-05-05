import { Award, HeartHandshake, Shield, TrendingUp, CheckCircle, Star, Zap, Users } from "lucide-react";
import { SectionIntro, SectionPanel, SectionShell } from "@/components/ui/section-shell";
import { fetchWhyChooseReasons } from "@/sanity/lib/content";

const iconMap = {
  "award": Award,
  "heart-handshake": HeartHandshake,
  "shield": Shield,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle,
  "star": Star,
  "zap": Zap,
  "users": Users,
} as const;

export default async function HomeWhyChoose() {
  const reasons = await fetchWhyChooseReasons();

  if (!reasons || reasons.length === 0) {
    return null;
  }

  return (
    <SectionShell>
      <SectionIntro
        eyebrow="Keunggulan Kami"
        title="Mengapa Memilih Kotacom?"
        description="Lebih dari sekadar vendor IT, kami adalah partner yang membantu bisnis Anda tumbuh dengan solusi teknologi yang tepat."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason: any, index: number) => {
          const Icon = iconMap[reason.icon as keyof typeof iconMap] || Award;
          return (
            <SectionPanel
              key={reason._id}
              tone={index % 2 === 0 ? "neutral" : "sky"}
              className="rounded-[1.65rem] p-6"
            >
              <div className="flex flex-col items-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </SectionPanel>
          );
        })}
      </div>
    </SectionShell>
  );
}
