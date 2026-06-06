export type ActiveNav = "home" | "categories" | "archive" | "about";

type NavItem = {
  id: ActiveNav;
  href: string;
  label: string;
};

export const siteConfig = {
  title: "Yuhang's Web Space",
  description: "Yuhang Wu's personal web space for AI/data projects, notes, thoughts, and fragments of life.",
  assets: {
    favicon: "/assets/favicon.svg",
    portrait: "/assets/yuhang.jpg",
    background: "/assets/site-background.jpg",
  },
  sidebar: {
    kicker: "Personal web space",
    intro: "I build AI/data systems, write about things I am learning, and collect projects, thoughts, and fragments of life here.",
  },
  nav: [
    { id: "home", href: "/", label: "Home" },
    { id: "categories", href: "/categories/", label: "Categories" },
    { id: "archive", href: "/archive/", label: "Archive" },
    { id: "about", href: "/about/", label: "About" },
  ] satisfies NavItem[],
  rightRail: {
    recentLimit: 4,
    filters: [
      { label: "All", value: "all" },
      { label: "Projects", value: "project" },
      { label: "Notes", value: "note" },
      { label: "Life", value: "life" },
      { label: "AI", value: "ai" },
      { label: "Vision", value: "vision" },
      { label: "Robotics", value: "robotics" },
    ],
  },
} as const;
