import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    title: "Tech Lead",
    company: "Tabflux.com",
    duration: "Nov 2025 — Present",
    summary:
      "Leading backend and AI development while coordinating a cross-functional engineering team to deliver scalable production systems.",
    highlights: [
      "Leading a cross-functional team of 6 engineers across frontend, backend, AI, and QA teams, coordinating development and delivery.",
      "Providing technical leadership through code reviews, architectural guidance, and engineering best practices.",
      "Working hands-on on backend systems and AI modules, contributing directly to core product development.",
      "Collaborating closely with stakeholders and tech teams to deliver end-to-end product features.",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Meraki Techs",
    duration: "Nov 2023 — Jul 2025",
    summary:
      "Led backend architecture, AI workflows, and production systems for Meraki Techs while syncing closely with frontend and reliability partners.",
    highlights: [
      "Led backend architecture for production systems using Django and integrated AI workflows (RAG pipelines, LLM-based summarization) in internal systems.",
      "Designed and implemented scalable REST APIs with DRF, cutting p95 latency by 30% and supporting 100k+ monthly requests.",
      "Integrated backend services with React/Next.js frontends to deliver end-to-end product experiences.",
      "Implemented Celery/Redis background jobs that improved overall system reliability.",
      "Mentored junior developers and shepherded code reviews to raise maintainability standards.",
    ],
  },
  {
    title: "Junior Backend Developer",
    company: "Meraki Techs",
    duration: "Aug 2022 — Nov 2023",
    summary:
      "Owned Django/Django REST Framework workstreams, PostgreSQL schema design, and integrations that kept cross-functional partners moving quickly.",
    highlights: [
      "Developed and optimized RESTful APIs for core product features using Django and DRF.",
      "Designed PostgreSQL schemas and performance-tuned queries to meet growing traffic.",
      "Integrated third-party services and ensured smooth handoffs between frontend and backend teams.",
    ],
  },
  {
    title: "Web Developer Intern",
    company: "Sofsee Tech",
    duration: "Oct 2021 — Apr 2022",
    summary:
      "Delivered responsive marketing sites and client microsites using WordPress, collaborating closely with design and account leads.",
    highlights: [
      "Built responsive websites with WordPress, HTML, CSS, and JavaScript.",
      "Customized themes and layouts to suit client briefs and brand requirements.",
      "Ensured pages remained cohesive across devices and browsers.",
    ],
  },
  {
    title: "Computer Instructor",
    company: "IT Zone Computer Education",
    duration: "2021",
    summary:
      "Taught foundational computer skills to students and beginners as part of a practical computer literacy program.",
    highlights: [],
  },
];
