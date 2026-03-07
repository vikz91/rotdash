export const MOCK_METRICS = {
  totalProjects: 12,
  hotProjects: 3,
  coldProjects: 2,
  glacierProjects: 4,
  totalTasks: 47,
  blockedTasks: 5,
};

export const MOCK_ACTIVITY = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tasks: [3, 5, 2, 7, 4, 6, 3, 8, 5, 4, 6, 2, 5, 3, 4, 2, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0][i],
  };
});

export const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Indie SaaS Launcher",
    tags: ["saas", "side-project"],
    status: "mvp",
    activityStatus: "hot" as const,
    rotScore: 1,
    healthStatus: "+",
  },
  {
    id: "2",
    name: "Discord Bot Rewrite",
    tags: ["bot", "typescript"],
    status: "idea",
    activityStatus: "warm" as const,
    rotScore: 4,
    healthStatus: "+",
  },
  {
    id: "3",
    name: "API Rate Limiter Lib",
    tags: ["library", "go"],
    status: "shipped",
    activityStatus: "stale" as const,
    rotScore: 12,
    healthStatus: "-",
  },
  {
    id: "4",
    name: "Landing Page Generator",
    tags: ["tool", "react"],
    status: "idea",
    activityStatus: "cold" as const,
    rotScore: 35,
    healthStatus: "-",
  },
  {
    id: "5",
    name: "NFT Minting Script",
    tags: ["web3", "ethereum"],
    status: "mvp",
    activityStatus: "glacier" as const,
    rotScore: 89,
    healthStatus: "-",
  },
  {
    id: "6",
    name: "CLI Todo App",
    tags: ["cli", "rust"],
    status: "shipped",
    activityStatus: "hot" as const,
    rotScore: 0,
    healthStatus: "+",
  },
  {
    id: "7",
    name: "Portfolio v3",
    tags: ["website"],
    status: "idea",
    activityStatus: "glacier" as const,
    rotScore: 120,
    healthStatus: "-",
  },
  {
    id: "8",
    name: "React Component Library",
    tags: ["library", "design-system"],
    status: "mvp",
    activityStatus: "warm" as const,
    rotScore: 5,
    healthStatus: "+",
  },
];
