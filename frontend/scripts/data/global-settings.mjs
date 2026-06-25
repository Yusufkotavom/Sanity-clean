export const settingsData = {
  _id: "settings",
  _type: "settings",
  brandName: "DevK Studio",
  copyright: [
    {
      _key: "cp1",
      _type: "block",
      style: "normal",
      children: [
        {
          _key: "cp1-1",
          _type: "span",
          text: "© 2026 DevK Studio. All rights reserved.",
        }
      ]
    }
  ],
  socialLinks: [
    {
      _key: "sl1",
      item: { platform: "instagram", url: "https://instagram.com/devkstudio", target: true }
    },
    {
      _key: "sl2",
      item: { platform: "linkedin", url: "https://linkedin.com/company/devkstudio", target: true }
    },
    {
      _key: "sl3",
      item: { platform: "github", url: "https://github.com/devkstudio", target: true }
    }
  ],
  whatsApp: {
    enabled: true,
    phoneNumber: "6281234567890",
    predefinedText: "Halo Tim DevK Studio, saya ingin berkonsultasi mengenai pembuatan aplikasi/software untuk bisnis saya.",
    ctaText: "Konsultasi Gratis",
    enableAnimation: true
  }
};

export const navigationData = {
  _id: "navigation",
  _type: "navigation",
  links: [
    { _key: "nav1", _type: "link", title: "Layanan", href: "/services", isExternal: false, buttonVariant: "ghost" },
    { _key: "nav2", _type: "link", title: "Software Custom", href: "/software", isExternal: false, buttonVariant: "ghost" },
    { _key: "nav3", _type: "link", title: "Portfolio", href: "/projects", isExternal: false, buttonVariant: "ghost" },
    { _key: "nav4", _type: "link", title: "Tentang", href: "/about", isExternal: false, buttonVariant: "ghost" },
  ],
  headerCta: {
    _type: "link",
    title: "Hubungi Kami",
    href: "/contact",
    isExternal: false,
    target: false,
    buttonVariant: "default"
  }
};

export const siteSettingsData = {
  _id: "siteSettings",
  _type: "siteSettings",
  title: "DevK Studio — Software House & IT Solutions",
  description: "DevK Studio menyediakan layanan pembuatan custom software, sistem POS, instalasi OS, dan perbaikan bug server di Surabaya & Sidoarjo.",
  keywords: ["software house surabaya", "jasa pembuatan web app", "pos system custom", "erp umkm", "jasa instalasi OS", "bug fix server"],
  companyName: "DevK Studio",
  companyTagline: "Your Code, Your System, Running Flawlessly.",
  companyDescription: "Kami adalah tim developer dan IT infrastructure expert yang berfokus pada stabilitas, performa, dan skalabilitas jangka panjang untuk operasional bisnis Anda.",
  foundedYear: 2020,
  projectsCompleted: 120,
  location: "Surabaya",
  coverage: "Seluruh Indonesia (Remote) & On-site Surabaya-Sidoarjo",
  phone: "+6281234567890",
  whatsapp: "6281234567890",
  email: "hello@devk.my.id",
  address: "Surabaya, Jawa Timur"
};

export const seoSettingsData = {
  _id: "seoSettings",
  _type: "seoSettings",
  companyInfo: {
    name: "DevK Studio",
    foundedYear: 2020,
    address: "Surabaya, Jawa Timur",
    phone: "+62 812-3456-7890",
    whatsapp: "+62 812-3456-7890",
    email: "hello@devk.my.id",
    operatingHours: "Senin - Jumat: 09:00 - 17:00 WIB",
    totalClients: 50,
    totalProjects: 120,
    serviceAreas: ["Surabaya", "Sidoarjo", "Remote (Seluruh Indonesia)"],
    certifications: ["Fullstack Javascript", "Cloud AWS Practitioner"],
    awards: ["Best Software Quality 2025"]
  }
};

export const ogSettingsData = {
  _id: "ogSettings",
  _type: "ogSettings",
  brandName: "DevK Studio",
  ctaText: "WA 0812-3456-7890 · dev.kotacom.id",
  showDescription: true,
  showCta: true,
  ogBaseUrl: "https://dev.kotacom.id"
};
