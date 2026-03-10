export type OtherExperienceEntry = {
  title: string;
  summary: string;
  highlights: string[];
};

export const otherExperience: OtherExperienceEntry[] = [
  {
    title: "Freelance / Contract",
    summary:
      "Delivered production-grade backend APIs and AI-powered workflows (including RAG pipelines) for early-stage startups, owning architecture, deployment, and feature delivery end-to-end.",
    highlights: [
      "Partnered with founders to translate product goals into reliable Django/DRF services and AI toolchains.",
      "Ensured observability, testing, and deployment automation shipped alongside new capabilities.",
      "Mentored cross-functional teams on clean code, documentation, and on-call readiness."
    ],
  },
  {
    title: "Additional Achievements",
    summary:
      "Contributed to open-source efforts, campus platforms, and pursued advanced certifications while sharing knowledge through workshops and mentoring.",
    highlights: [
      "Contributed fixes and documentation to public repos plus college website/IMS enhancements.",
      "Earned Microsoft Career Essentials in Generative AI and experimented with LLMs, GANs, BERT-family models, and YOLO-based computer vision pipelines.",
      "Conducted workshops on software-development fundamentals, tech frameworks, and applied AI with cohorts and peers."
    ],
  },
];
