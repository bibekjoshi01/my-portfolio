import type { ProjectEntry } from "./types";

export const projects: ProjectEntry[] = [
  {
    name: "Personal technical blog",
    description:
      "A showcase of backend patterns, AI experimentation notes, and newsletter-ready prose built with Astro, TypeScript, and Tailwind.",
    openSource: true,
    link: "/",
    github: "https://github.com/bibekjoshi01/personal-technical-blog",
    tags: ["Astro", "TypeScript", "Tailwind", "Content"],
    status: "Live",
  },
  {
    name: "AI systems integration lab",
    description:
      "Prototyping Django APIs, vector search RAG, and Celery + Redis automations that bridge internal workflows with LLMs.",
    openSource: false,
    tags: ["Django", "RAG", "Celery", "Backend"],
    status: "Experimenting",
  },
  {
    name: "Backend observability toolkit",
    description:
      "Reusable logging and monitoring helpers for high-throughput services, wired to dashboards that track p95 latency and error budgets.",
    openSource: false,
    link: "https://example.internal/observability",
    tags: ["Observability", "Monitoring", "DevOps"],
    status: "Used internally",
  },
  {
    name: "Player coach CLI templates",
    description:
      "CLI helpers, launch recipes, and reference architectures that keep cross-functional teammates moving faster while maintaining observability.",
    openSource: true,
    github: "https://github.com/bibekjoshi01/player-coach-cli",
    tags: ["CLI", "Automation", "Open Source"],
    status: "Published",
  },
];
