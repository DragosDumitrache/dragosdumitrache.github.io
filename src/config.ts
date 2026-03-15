// Dotfiles Theme Config

export const siteConfig = {
  title: "Dragos Dumitrache",
  description: "Staff Software Engineer & Engineering Manager. Building systems and the teams behind them.",
  author: "Dragos Dumitrache",
  siteUrl: "https://dragos.dumitrache.dev",

  header: {
    coreNav: [
      { text: "Blog", href: "/blog" },
      { text: "CV", href: "/cv" },
    ],
    showThemeSwitcher: true,
  },

  hero: {
    title: "Dragos Dumitrache",
    typewriterLines: [
      "Staff Engineer & Engineering Manager",
      "Building systems and the teams behind them",
    ],
    description: "Happy to chat about **open-source** projects or **consult** on backend, infrastructure, and developer experience. **Reach out!**",
    terminalTitle: "~",
    ctaButtons: [
      { text: "[blog]", href: "/blog", primary: true },
      { text: "[cv]", href: "/cv", primary: false },
    ],
  },

  theme: {
    defaultTheme: "catppuccin-mocha",
  },

  social: {
    github: "https://github.com/DragosDumitrache",
    twitter: "",
    linkedin: "https://linkedin.com/in/DragosDumitrache",
    bluesky: "",
    mastodon: "",
    email: "dragosd2000@gmail.com",
    rss: "/rss.xml",
  },

  blog: {
    postsOnHomepage: 5,
    postsPerPage: 10,
    showReadingTime: true,
    showTableOfContents: true,
    showPostNavigation: true,
    showTags: true,
    showFeaturedPost: true,
    dateFormat: "MMMM d, yyyy",
  },

  projects: {
    gridColumns: 3,
    showStatus: true,
    items: [],
  },

  footer: {
    statusMessage: "All systems operational",
    copyright: "© %YEAR% Dragos Dumitrache",
    showSocialLinks: true,
  },

  seo: {
    ogImage: "/og-image.png",
    twitterCard: "summary_large_image",
    twitterHandle: "",
    googleSiteVerification: "",
  },

  pages: {
    blog: true,
    projects: false,
    search: true,
    archives: true,
    rss: true,
  },

  advanced: {
    commandPalette: true,
    showCopyCode: true,
    showLineNumbers: false,
    showBreadcrumbs: true,
    pageTransitions: true,
  },

  demo: {
    enabled: import.meta.env.PUBLIC_ENABLE_DEMO === 'true' || false,
  },
};

export type SiteConfig = typeof siteConfig;
