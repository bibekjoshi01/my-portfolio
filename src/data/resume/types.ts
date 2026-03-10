export type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  location?: string;
  summary: string;
  highlights: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  duration: string;
  location?: string;
  highlights?: string[];
};

export type OtherExperienceEntry = {
  title: string;
  summary: string;
  highlights: string[];
};
