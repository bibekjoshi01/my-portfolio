import type { ProjectEntry } from "./types";

export const projects: ProjectEntry[] = [
  {
    name: "Ecommerce Chat Support",
    description:
      "E-commerce support chat system with bot automation, agent escalation, conversation lifecycle management, PostgreSQL persistence, and WebSocket-based real-time communication built using FastAPI and React.Js",
    openSource: true,
    status: "Prototype",
    github: "https://github.com/bibekjoshi01/ecommerce-chat-support",
    tags: ["FastAPI", "ChatBot", "React", "PostgreSQL", "Redis"],
  },
  {
    name: "Udharo",
    description:
      "Udharo is a Nepali-first, offline-first khata app that helps shopkeepers track customers, credits, payments, reminders, and generated PDFs. The app keeps data on-device (SQLite), supports reports, secure lock screens, backups, and bilingual labels (Nepali + English).",
    openSource: false,
    tags: ["React-Native", "Mobile App", "SQLite"],
    status: "Experimenting",
    link: "https://udharo.cloud/",
  },
  {
    name: "What's App Bot",
    description:
      "A WhatsApp auto-reply bot. It supports rule-based intent replies, simple conversation memory, and a plug-in point for AI responses.",
    openSource: true,
    github: "https://github.com/bibekjoshi01/whatsapp-bot",
    tags: ["Node.js", "Bot", "Automation"],
    status: "Experimenting",
  },
  {
    name: "PEARL",
    description:
      "PEARL: A mental health chatbot using free LLMs and Langchain, FASTAPI, Next.js",
    openSource: true,
    github:
      "https://github.com/bibekjoshi01/pearl-ai-powered-mental-health-chatbot",
    tags: ["Node.js", "Bot", "Automation"],
    status: "FuseAI Fellowship Project",
  },
  {
    name: "Sentiment Analyzer",
    description:
      "AI-Powered Sentiment Analyzer API with FastAPI under the Fuse AI Fellowship and Follows the 12-Factor App principles.",
    openSource: true,
    github: "https://github.com/bibekjoshi01/sentiment-analyzer",
    tags: ["AI", "FuseAI Fellowship", "Open Source"],
    status: "12 Factor Discipline",
  },
  {
    name: "Smart Dustbin Engine",
    description:
      "This contains the backend engine for the Smart Dustbin system developed for the NCIT Hackathon. The system uses a YOLO-based computer vision model to automatically detect and classify waste items in real time. When waste is placed in front of the camera, the model analyzes the object and determines whether it is biodegradable or non-biodegradable.",
    openSource: true,
    github: "https://github.com/bibekjoshi01/smart-dustbin-be-engine",
    tags: ["FastAPI", "Hackathon", "YOLO"],
    status: "NCIT Hackathon",
  },
];
