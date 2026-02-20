export type AuthorProfile = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: Array<{ label: string; url: string }>;
  portfolioUrl?: string;
};

const fallbackAuthor: AuthorProfile = {
  name: "Unknown Author",
  role: "Engineer",
  bio: "Engineer writing about practical software delivery.",
  avatar: "/authors/default-author.svg",
  social: [],
  portfolioUrl: undefined,
};

export const authors: Record<string, AuthorProfile> = {
  "Bibek Joshi": {
    name: "Bibek Joshi",
    role: "Backend Engineer | AI Systems Integration | Scalable AI-Powered Applications",
    bio: "I work at the intersection of AI engineering and backend systems, building scalable APIs, reliable architectures, and practical AI integrations that hold up in production. I focus on clean system design, performance-aware development, and engineering workflows that scale with complexity. I actively share what I learn, guide junior developers, and believe strong engineering grows through structured thinking, iteration, and collaborative problem-solving.",
    avatar: "/authors/bibek-joshi.jpeg",
    social: [
      { label: "GitHub", url: "https://github.com/bibekjoshi01" },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/bibek-joshi-69458b231/",
      },
      { label: "YouTube", url: "https://www.youtube.com/@thealienprogrammer" },
      { label: "Email", url: "mailto:bibekjoshi34@gmail.com" },
    ],
  },
};

export function getAuthorProfile(name: string): AuthorProfile {
  return authors[name] ?? { ...fallbackAuthor, name };
}
