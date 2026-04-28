import type {
  Profile,
  Education,
  Certification,
  Experience,
  Project,
  AboutContent,
} from '@/types';

export const profile: Profile = {
  name: { ko: '오리', en: 'Ori' },
  tagline: {
    ko: '백엔드 개발자 & 팀 리드 · AI 응용에 진심인 4학년',
    en: 'Backend Developer & Team Lead · Senior at Ewha CE',
  },
  email: 'seayun9845@gmail.com',
  phone: '+82 10-0000-0000',
  github: 'https://github.com/orixxxx',
  profileImage: '',
};

export const aboutContent: AboutContent = {
  paragraphs: {
    ko: [
      '안녕하세요, 오리입니다. 이화여자대학교 컴퓨터공학과 4학년에 재학 중이며 2027년 2월 졸업을 앞두고 있습니다.',
      '백엔드 개발과 AI 응용 영역에 관심이 많고, 멀티 AI 오케스트레이션과 신뢰성 있는 서비스 설계를 좋아합니다. 팀 코드만두에서 팀장으로서 기획부터 배포까지 책임지는 경험을 쌓았습니다.',
      '코드를 잘 쓰는 것만큼 동료가 이해할 수 있는 코드를 쓰는 것을 중요하게 생각합니다. 작은 디테일이 사용자 경험을 만든다고 믿어요.',
    ],
    en: [
      "Hi, I'm Ori — a senior in Computer Engineering at Ewha Womans University, graduating February 2027.",
      'I focus on backend engineering with a strong interest in AI applications. I enjoy designing reliable systems that orchestrate multiple AI services. As team lead at Code Mandu, I have led projects end-to-end, from planning to deployment.',
      'I care as much about readable code as I do about working code. Small details shape the experience.',
    ],
  },
};

export const educations: Education[] = [
  {
    school: { ko: '이화여자대학교', en: 'Ewha Womans University' },
    major: { ko: '컴퓨터공학과', en: 'Computer Engineering' },
    status: 'enrolled',
    startDate: '2021-03',
    endDate: '2027-02',
    gpa: { value: '3.8', max: '4.5', hidden: false },
  },
];

export const certifications: Certification[] = [
  {
    name: { ko: 'SQL 개발자 (SQLD)', en: 'SQL Developer (SQLD)' },
    issuer: { ko: '한국데이터산업진흥원', en: 'Korea Data Agency' },
    date: '2026-03',
    type: 'certification',
  },
  {
    name: { ko: 'IELTS', en: 'IELTS' },
    issuer: { ko: '영국문화원', en: 'British Council' },
    date: '2026-04',
    type: 'language',
    score: 'Overall 6.5',
  },
];

export const experiences: Experience[] = [
  {
    id: 'code-mandu',
    organization: { ko: '코드만두', en: 'Code Mandu' },
    role: { ko: '팀장 / 백엔드', en: 'Team Lead / Backend' },
    startDate: '2024-09',
    endDate: '2026-04',
    description: {
      ko: 'AI 기반 콘서트 티켓북 Re:cord를 기획·개발. 백엔드 아키텍처 설계와 멀티 AI 오케스트레이션을 담당했습니다.',
      en: 'Built Re:cord, an AI-powered concert ticket book. Owned backend architecture and multi-AI orchestration.',
    },
  },
  {
    id: 'plug-9',
    organization: { ko: 'UNPLUGGED Hongdae', en: 'UNPLUGGED Hongdae' },
    role: { ko: '문화기획 / 개발', en: 'Culture Planning / Development' },
    startDate: '2024-03',
    endDate: '2024-08',
    description: {
      ko: 'PLUG 9th — 홍대 공연장 투어 맵 프로젝트. 인터랙티브 지도 기획과 프론트엔드 구현.',
      en: 'PLUG 9th — Concert Venue Tour Map. Planned the interactive map and built the frontend.',
    },
  },
];

export const projects: Project[] = [
  {
    id: 'record',
    slug: 'record',
    title: { ko: 'Re:cord', en: 'Re:cord' },
    oneLiner: {
      ko: 'AI가 정리해주는 나만의 콘서트 티켓북',
      en: 'An AI-powered concert ticket book that remembers every show for you',
    },
    startDate: '2024-09',
    endDate: '2026-04',
    dateGranularity: 'month',
    role: { ko: '팀장 · 백엔드', en: 'Team Lead · Backend' },
    teamSize: 5,
    contribution: 40,
    skillIds: ['java', 'spring-boot', 'postgresql', 'jwt', 'aws', 'claude', 'whisper', 'google-vision-ocr'],
    description: {
      ko: '콘서트 티켓·셋리스트·후기를 OCR과 음성 인식으로 자동 정리해주는 모바일 웹앱. 멀티 AI 오케스트레이션으로 신뢰성을 확보했다.',
      en: 'A mobile web app that auto-organizes concert tickets, setlists, and reviews using OCR and speech recognition, with multi-AI orchestration for reliability.',
    },
    demoUrl: 'https://record.example.com',
    githubUrl: 'https://github.com/code-mandu/record',
    thumbnailUrl: '',
    pinned: true,
    visible: true,
    order: 1,
    issues: [
      {
        id: 'ocr-fallback',
        title: {
          ko: 'OCR 실패 시 사용자 경험 보존',
          en: 'Preserving UX when OCR fails',
        },
        problem: {
          ko: '구겨진 티켓 사진은 Google Vision OCR 정확도가 50% 이하로 떨어졌다.',
          en: 'Wrinkled ticket photos dropped Google Vision OCR accuracy below 50%.',
        },
        solution: {
          ko: 'OCR → Claude 비전 → GPT-4 비전 순으로 폴백하는 멀티 AI 파이프라인을 만들었다. 실패 시에도 사용자가 한 필드만 수정하도록 신뢰도 점수를 함께 노출했다.',
          en: 'Built a fallback pipeline OCR → Claude Vision → GPT-4 Vision, exposing confidence scores so users only correct the uncertain field.',
        },
        outcome: {
          ko: '실측 정확도 88%로 상승, 평균 입력 시간 70% 단축.',
          en: 'Accuracy reached 88% in production; average input time dropped 70%.',
        },
      },
    ],
  },
  {
    id: 'ovo-tarot',
    slug: 'ovo-tarot',
    title: { ko: 'OvO TAROT', en: 'OvO TAROT' },
    oneLiner: {
      ko: '대화형 LLM이 풀어주는 개인화 타로 리딩',
      en: 'Personalized tarot readings driven by a conversational LLM',
    },
    startDate: '2025-06',
    endDate: '2025-12',
    dateGranularity: 'month',
    role: { ko: '풀스택 · 1인 개발', en: 'Full-stack · Solo' },
    teamSize: 1,
    contribution: 100,
    skillIds: ['typescript', 'nextjs', 'tailwind', 'postgresql', 'prisma', 'claude', 'vercel'],
    description: {
      ko: '카드 78장의 컨텍스트를 정교하게 관리한 개인화 타로 웹앱. Claude로 일관성 있는 리딩 흐름을 설계했다.',
      en: 'A personalized tarot web app with carefully managed 78-card context, using Claude to design consistent reading flows.',
    },
    demoUrl: 'https://ovo-tarot.example.com',
    githubUrl: 'https://github.com/orixxxx/ovo-tarot',
    thumbnailUrl: '',
    pinned: true,
    visible: true,
    order: 2,
    issues: [
      {
        id: 'persona-drift',
        title: {
          ko: '리딩 페르소나 일관성 유지',
          en: 'Keeping the reading persona consistent',
        },
        problem: {
          ko: '대화가 길어질수록 톤이 흔들리고, 같은 카드도 매번 다르게 해석되는 문제.',
          en: 'Tone drifted as conversations grew, and identical cards were interpreted differently each session.',
        },
        solution: {
          ko: '카드별 의미를 시스템 프롬프트로 분리하고, 사용자 컨텍스트는 짧게 요약해 주입했다. 캐시 활용으로 비용도 60% 절감.',
          en: 'Split card meanings into the system prompt, injected only summarized user context, and cached static parts — cutting cost 60%.',
        },
      },
    ],
  },
  {
    id: 'plug-9th',
    slug: 'plug-9th',
    title: {
      ko: 'PLUG 9th · 홍대 공연장 투어 맵',
      en: 'PLUG 9th · Concert Venue Tour Map',
    },
    oneLiner: {
      ko: '홍대 라이브 클럽들을 스토리텔링으로 잇는 인터랙티브 지도',
      en: 'An interactive storytelling map across Hongdae live music clubs',
    },
    startDate: '2024-03',
    endDate: '2024-08',
    dateGranularity: 'month',
    role: { ko: '문화기획 · 프론트엔드', en: 'Planning · Frontend' },
    teamSize: 8,
    contribution: 25,
    skillIds: ['javascript', 'react', 'css', 'figma'],
    description: {
      ko: 'UNPLUGGED Hongdae 9기에서 진행한 문화기획 프로젝트. Mapbox 기반 지도 위에 공연장 큐레이션과 셋리스트를 배치했다.',
      en: 'A culture planning project at UNPLUGGED Hongdae 9th, layering venue curation and setlists on top of a Mapbox-based map.',
    },
    githubUrl: 'https://github.com/orixxxx/plug-9th',
    thumbnailUrl: '',
    pinned: false,
    visible: true,
    order: 3,
    issues: [],
  },
];
