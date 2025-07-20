export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
}

export interface Skill {
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Cloud'
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface OpenSourceContribution {
  id: string
  title: string
  description: string
  repository: string
  url: string
  type: 'Contribution' | 'Project' | 'Initiative'
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}