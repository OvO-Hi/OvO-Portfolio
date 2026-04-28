import type { Skill } from '@/types';

export const skillsSeed: Skill[] = [
  // Languages
  { id: 'java', name: 'Java', category: 'language' },
  { id: 'python', name: 'Python', category: 'language' },
  { id: 'javascript', name: 'JavaScript', category: 'language' },
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'c', name: 'C', category: 'language' },
  { id: 'cpp', name: 'C++', category: 'language' },
  { id: 'go', name: 'Go', category: 'language' },
  { id: 'rust', name: 'Rust', category: 'language' },
  { id: 'kotlin', name: 'Kotlin', category: 'language' },
  { id: 'swift', name: 'Swift', category: 'language' },
  { id: 'ruby', name: 'Ruby', category: 'language' },
  { id: 'php', name: 'PHP', category: 'language' },

  // Frontend
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  { id: 'vue', name: 'Vue', category: 'frontend' },
  { id: 'svelte', name: 'Svelte', category: 'frontend' },
  { id: 'html', name: 'HTML', category: 'frontend' },
  { id: 'css', name: 'CSS', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend' },
  { id: 'sass', name: 'Sass', category: 'frontend' },
  { id: 'styled-components', name: 'styled-components', category: 'frontend' },
  { id: 'redux', name: 'Redux', category: 'frontend' },
  { id: 'zustand', name: 'Zustand', category: 'frontend' },
  { id: 'tanstack-query', name: 'TanStack Query', category: 'frontend' },

  // Backend
  { id: 'spring-boot', name: 'Spring Boot', category: 'backend' },
  { id: 'flask', name: 'Flask', category: 'backend' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend' },
  { id: 'express', name: 'Express', category: 'backend' },
  { id: 'nestjs', name: 'NestJS', category: 'backend' },
  { id: 'django', name: 'Django', category: 'backend' },
  { id: 'rest', name: 'RESTful API', category: 'backend' },
  { id: 'graphql', name: 'GraphQL', category: 'backend' },
  { id: 'jwt', name: 'JWT', category: 'backend' },
  { id: 'oauth', name: 'OAuth', category: 'backend' },

  // Mobile
  { id: 'react-native', name: 'React Native', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', category: 'mobile' },
  { id: 'swift-ios', name: 'Swift (iOS)', category: 'mobile' },
  { id: 'kotlin-android', name: 'Kotlin (Android)', category: 'mobile' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database' },
  { id: 'mysql', name: 'MySQL', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'redis', name: 'Redis', category: 'database' },
  { id: 'sqlite', name: 'SQLite', category: 'database' },
  { id: 'prisma', name: 'Prisma', category: 'database' },
  { id: 'typeorm', name: 'TypeORM', category: 'database' },

  // AI / GenAI
  { id: 'claude', name: 'Claude (Anthropic)', category: 'ai' },
  { id: 'gpt-4', name: 'GPT-4 (OpenAI)', category: 'ai' },
  { id: 'whisper', name: 'Whisper', category: 'ai' },
  { id: 'dalle-3', name: 'DALL·E 3', category: 'ai' },
  { id: 'google-vision-ocr', name: 'Google Vision OCR', category: 'ai' },
  { id: 'langchain', name: 'LangChain', category: 'ai' },
  { id: 'prompt-engineering', name: 'Prompt Engineering', category: 'ai' },
  { id: 'multi-ai-orchestration', name: 'Multi-AI Orchestration', category: 'ai' },
  { id: 'reliability-handling', name: 'Reliability Handling', category: 'ai' },

  // DevOps / Cloud
  { id: 'aws', name: 'AWS (EC2, S3, RDS)', category: 'devops' },
  { id: 'vercel', name: 'Vercel', category: 'devops' },
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops' },
  { id: 'nginx', name: 'Nginx', category: 'devops' },
  { id: 'linux', name: 'Linux', category: 'devops' },

  // Tools
  { id: 'git', name: 'Git', category: 'tool' },
  { id: 'github', name: 'GitHub', category: 'tool' },
  { id: 'figma', name: 'Figma', category: 'tool' },
  { id: 'notion', name: 'Notion', category: 'tool' },
  { id: 'slack', name: 'Slack', category: 'tool' },
  { id: 'postman', name: 'Postman', category: 'tool' },
  { id: 'vscode', name: 'VS Code', category: 'tool' },
  { id: 'cursor', name: 'Cursor', category: 'tool' },
  { id: 'claude-code', name: 'Claude Code', category: 'tool' },
];

export const skillById = new Map(skillsSeed.map((s) => [s.id, s]));
