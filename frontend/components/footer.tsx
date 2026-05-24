import Logo from "@/components/logo";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import SocialLinks from "@/components/header/social-links";
import { fetchSanitySettings, fetchSanityNavigation, fetchSeoSettings } from "@/sanity/lib/fetch";
import { NAVIGATION_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "@/sanity.types";

type SanityLink = NonNullable<NAVIGATION_QUERY_RESULT[0]["links"]>[number];
type NavChild = {
  _key?: string;
  group?: string | null;
  icon?: string | null;
  title?: string | null;
  href?: string | null;
  target?: boolean | null;
};
type NavLinkWithChildren = SanityLink & {
  icon?: string | null;
  navLocation?: "primary" | "utility" | null;
  showInFooter?: boolean | null;
  children?: NavChild[] | null;
};
type SettingsWithSocial = SETTINGS_QUERY_RESULT & {
  socialLinks?: Array<{
    _key?: string;
    platform?: string | null;
    url?: string | null;
    target?: boolean | null;
  }> | null;
};

function groupChildren(children: NavChild[]) {
  const grouped = new Map<string, NavChild[]>();
  for (const child of children) {
    const key = child.group?.trim() || "";
    const current = grouped.get(key) || [];
    current.push(child);
    grouped.set(key, current);
  }
  return Array.from(grouped.entries());
}

export default async function Footer() {
  const settings = await fetchSanitySettings();
  const seoSettings = await fetchSeoSettings();
  const companyInfo = (seoSettings as any)?.companyInfo;
  const settingsWithSocial = settings as SettingsWithSocial;
  const navigation = await fetchSanityNavigation();
  const navItems = (navigation[0]?.links || [])
    .filter((item) => item?.title)
    .map((item) => item as NavLinkWithChildren)
    .filter((item) => item.showInFooter !== false);
  const footerPrimaryLinks = navItems.filter((item) => item.navLocation !== "utility");
  const footerUtilityLinks = navItems.filter((item) => item.navLocation === "utility");
  const footerColumns = navItems.filter(
    (item) =>
      (item.children?.filter((child) => child?.title && child?.href).length || 0) >
      0,
  );

  return (
    <footer className="section-divider mt-10">
      <div className="container py-12 xl:py-14">
        <div className="flex flex-col gap-10 xl:gap-14">
          <div className="flex flex-col items-start lg:items-center lg:text-center">
            <Link href="/" className="inline-block" aria-label="Home page">
              <Logo settings={settings} />
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/65">
              Solusi website, software, dan layanan IT dengan implementasi yang
              rapi, cepat, serta mudah di-scale untuk kebutuhan bisnis Anda.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-start gap-x-4 gap-y-2.5 lg:justify-center">
              {footerPrimaryLinks.map((navItem: SanityLink) => (
                <Link
                  key={navItem._key}
                  href={navItem.href || "#"}
                  target={navItem.target ? "_blank" : undefined}
                  rel={navItem.target ? "noopener noreferrer" : undefined}
                  className="text-xs text-foreground/72 transition-colors hover:text-foreground"
                >
                  {navItem.title}
                </Link>
              ))}
            </div>
            {!!footerUtilityLinks.length && (
              <div className="mt-3 flex flex-wrap items-center justify-start gap-x-4 gap-y-2.5 lg:justify-center">
                {footerUtilityLinks.map((navItem: SanityLink) => (
                  <Link
                    key={navItem._key}
                    href={navItem.href || "#"}
                    target={navItem.target ? "_blank" : undefined}
                    rel={navItem.target ? "noopener noreferrer" : undefined}
                    className="text-xs text-foreground/62 transition-colors hover:text-foreground"
                  >
                    {navItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!!footerColumns.length && (
            <div className="border-t border-border/60 pt-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-10 lg:gap-y-8">
              {footerColumns.map((item) => {
                const children =
                  item.children?.filter((child) => child?.title && child?.href) || [];
                const groupedChildren = groupChildren(children);

                return (
                  <div key={item._key} className="lg:min-w-[120px]">
                    <Link
                      href={item.href || "#"}
                      target={item.target ? "_blank" : undefined}
                      rel={item.target ? "noopener noreferrer" : undefined}
                      className="text-sm font-semibold tracking-tight text-foreground"
                    >
                      {item.title}
                    </Link>

                    <div className="mt-3 space-y-3">
                      {groupedChildren.map(([groupName, links]) => (
                        <div key={groupName || "default"}>
                          {groupName && (
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/45">
                              {groupName}
                            </p>
                          )}
                          <ul className="space-y-1.5">
                            {links.map((child) => (
                              <li key={child._key || child.href || child.title}>
                                <Link
                                  href={child.href || "#"}
                                  target={child.target ? "_blank" : undefined}
                                  rel={child.target ? "noopener noreferrer" : undefined}
                                  className="text-sm text-foreground/68 transition-colors hover:text-foreground"
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </div>

        {!!settingsWithSocial?.socialLinks?.length && (
          <div className="section-divider mt-10 flex items-center justify-between gap-4 pt-7">
            <p className="text-xs uppercase tracking-[0.13em] text-foreground/55">
              Ikuti Update Kami
            </p>
            <SocialLinks
              links={settingsWithSocial.socialLinks}
              iconOnly
              size="sm"
              className="justify-end"
            />
          </div>
        )}

        {/* Structured Address */}
        <div className="section-divider mt-10 pt-7">
          <div className="grid gap-6 md:grid-cols-2">
            {companyInfo?.addressSidoarjo && (
              <address className="not-italic">
                <p className="mb-2 text-sm font-semibold text-foreground">Kantor Utama</p>
                <p className="text-sm text-foreground/70">{companyInfo.addressSidoarjo}</p>
              </address>
            )}
            {companyInfo?.addressSurabaya && (
              <address className="not-italic">
                <p className="mb-2 text-sm font-semibold text-foreground">Kantor Cabang</p>
                <p className="text-sm text-foreground/70">
                  {companyInfo.addressSurabaya}
                  {companyInfo.phone && (
                    <>
                      <br />
                      <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                        {companyInfo.phone}
                      </a>
                    </>
                  )}
                </p>
              </address>
            )}
          </div>
        </div>

        <div className="section-divider mt-7 flex flex-row gap-6 pt-6 text-xs lg:mt-8">
          <div className="flex items-center gap-2 text-foreground/60">
            <span>&copy; {new Date().getFullYear()}</span>
            {settings?.copyright && (
              <span className="[&>p]:!m-0">
                <PortableTextRenderer value={settings.copyright} />
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
