import { Project, Skill, OpenSourceContribution } from '../types'

export const personalInfo = {
  name: 'Bibek Joshi',
  title: 'Software Developer Engineer & Tech Community Mentor',
  tagline: 'Building scalable backend systems and fostering tech communities through mentoring and knowledge sharing.',
  bio: `Experienced Software Developer Engineer with a passion for backend development and system design. 
        Specialized in Python ecosystems including Django and FastAPI, with a strong focus on building scalable, 
        maintainable solutions. Active in tech communities as a mentor, helping developers grow their skills 
        and advance their careers. Passionate about clean code, system architecture, and continuous learning.`,
  email: 'bibek.joshi@example.com',
  linkedin: 'https://linkedin.com/in/bibekjoshi',
  github: 'https://github.com/bibekjoshi',
  location: 'Nepal'
}

export const skills: Skill[] = [
  // Backend
  { name: 'Python', category: 'Backend', proficiency: 'Expert' },
  { name: 'Django', category: 'Backend', proficiency: 'Expert' },
  { name: 'FastAPI', category: 'Backend', proficiency: 'Advanced' },
  { name: 'REST APIs', category: 'Backend', proficiency: 'Expert' },
  { name: 'GraphQL', category: 'Backend', proficiency: 'Intermediate' },
  
  // Databases
  { name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced' },
  { name: 'MySQL', category: 'Database', proficiency: 'Advanced' },
  { name: 'Redis', category: 'Database', proficiency: 'Intermediate' },
  { name: 'MongoDB', category: 'Database', proficiency: 'Intermediate' },
  
  // Frontend
  { name: 'JavaScript', category: 'Frontend', proficiency: 'Advanced' },
  { name: 'React', category: 'Frontend', proficiency: 'Intermediate' },
  { name: 'HTML/CSS', category: 'Frontend', proficiency: 'Advanced' },
  
  // Tools & DevOps
  { name: 'Docker', category: 'Tools', proficiency: 'Advanced' },
  { name: 'Git', category: 'Tools', proficiency: 'Expert' },
  { name: 'Linux', category: 'Tools', proficiency: 'Advanced' },
  { name: 'CI/CD', category: 'Tools', proficiency: 'Intermediate' },
  
  // Cloud
  { name: 'AWS', category: 'Cloud', proficiency: 'Intermediate' },
  { name: 'Google Cloud', category: 'Cloud', proficiency: 'Beginner' },
]

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Backend API',
    description: 'Scalable REST API for e-commerce platform built with Django REST Framework. Features include user authentication, product catalog, order management, and payment integration.',
    techStack: ['Django', 'DRF', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
    githubUrl: 'https://github.com/bibekjoshi/ecommerce-api',
    // liveUrl: 'https://api.example-ecommerce.com'
  },
  {
    id: '2',
    title: 'Real-time Chat Application',
    description: 'High-performance chat application with real-time messaging, file sharing, and user presence indicators. Built with FastAPI and WebSockets.',
    techStack: ['FastAPI', 'WebSockets', 'SQLAlchemy', 'PostgreSQL', 'React'],
    githubUrl: 'https://github.com/bibekjoshi/realtime-chat',
    liveUrl: 'https://chat.example.com'
  },
  {
    id: '3',
    title: 'Microservices Architecture',
    description: 'Distributed system with multiple microservices handling different business domains. Implements service discovery, API gateway, and distributed tracing.',
    techStack: ['Django', 'FastAPI', 'Docker', 'Kubernetes', 'PostgreSQL', 'RabbitMQ'],
    githubUrl: 'https://github.com/bibekjoshi/microservices-demo'
  },
  {
    id: '4',
    title: 'Data Pipeline Automation',
    description: 'Automated data processing pipeline for ETL operations with error handling, monitoring, and scheduling capabilities.',
    techStack: ['Python', 'Apache Airflow', 'Pandas', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/bibekjoshi/data-pipeline'
  }
]

export const openSourceContributions: OpenSourceContribution[] = [
  {
    id: '1',
    title: 'Django REST Framework Enhancement',
    description: 'Contributed performance optimizations and documentation improvements to DRF serializers.',
    repository: 'django-rest-framework/django-rest-framework',
    url: 'https://github.com/encode/django-rest-framework/pull/123',
    type: 'Contribution'
  },
  {
    id: '2',
    title: 'Python Learning Community',
    description: 'Founded and maintain a local Python learning community with 500+ members, organizing workshops and mentoring sessions.',
    repository: 'python-learning-nepal',
    url: 'https://github.com/python-learning-nepal',
    type: 'Initiative'
  },
  {
    id: '3',
    title: 'FastAPI Tutorial Series',
    description: 'Created comprehensive tutorial series for FastAPI beginners with practical examples and best practices.',
    repository: 'fastapi-tutorials',
    url: 'https://github.com/bibekjoshi/fastapi-tutorials',
    type: 'Project'
  }
]