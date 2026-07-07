# AGENTS.md — OvO Portfolio

이 파일은 Codex가 이 프로젝트에서 작업할 때 참조하는 컨텍스트입니다.
**모든 작업 전 반드시 `SPEC.md`를 같이 읽어주세요.** 디자인 방향, 컬러 토큰, 단계별 스코프가 거기 있습니다.

---

## 프로젝트 한 줄 요약

오리(Ewha CE 4학년)의 개발자 자소서·포트폴리오 사이트.
한영 토글, 미니멀 + 슬레이트 블루 액센트, 관리자 페이지에서 모든 콘텐츠 CRUD.

## 현재 단계

**1단계 — 정적 버전 (디자인 시스템 + 메인 페이지)**

DB, 인증, 모달, 이미지 업로드는 다음 단계입니다.
1단계에서는 **더미 데이터로 보기 좋은 정적 사이트**를 만드는 것이 전부입니다.

## 절대 원칙

1. **스코프 컨트롤**: SPEC.md의 "1단계에서 하지 말 것" 목록을 엄격히 따른다.
   초과 작업 금지. 사용자가 먼저 다음 단계로 넘어가자고 할 때까지 기다린다.

2. **디자인 토큰 준수**: 컬러 / 폰트 / 스페이싱은 SPEC.md의 토큰만 사용.
   Tailwind 임의 색상(`bg-blue-500` 등) 사용 금지. CSS variables 기반으로.

3. **i18n 필수**: 사용자에게 보이는 모든 텍스트는 `messages/{ko,en}.json`에.
   하드코딩된 한국어/영어 문자열 금지.

4. **타입 안정성**: `any` 사용 금지. 데이터 구조는 `src/types/index.ts`에 정의.

5. **접근성**: 모든 인터랙티브 요소에 적절한 aria 속성, focus 스타일.

## 코딩 컨벤션

- 함수형 컴포넌트, named export
- 파일명: kebab-case
- 컴포넌트명: PascalCase
- 클래스 결합은 `cn()` helper
- 클라이언트 컴포넌트는 최소화 ("use client"는 정말 필요할 때만)
- 폼/상호작용은 React Server Components와 Client 분리 신경쓸 것

## 데이터 구조 가이드 (1단계용 더미 → 3단계 DB 스키마 미리보기)

콘텐츠는 한영 분리 가능한 구조로:
```ts
type Localized<T> = { ko: T; en: T };

interface Profile {
  name: Localized<string>;
  tagline: Localized<string>;
  email: string;
  phone: string;
  github: string;
  profileImage: string;
}

interface Education {
  school: Localized<string>;
  major: Localized<string>;
  status: 'enrolled' | 'graduated' | 'leave' | 'extra-semester' | 'graduation-deferred';
  startDate: string;  // YYYY-MM
  endDate: string;    // YYYY-MM
  gpa?: { value: string; max: string; hidden: boolean };
}

interface Skill {
  id: string;
  name: string;
  category: 'language' | 'frontend' | 'backend' | 'mobile' | 'database' | 'ai' | 'devops' | 'tool';
  iconKey?: string;
}

interface Project {
  id: string;
  slug: string;
  title: Localized<string>;
  oneLiner: Localized<string>;
  startDate: string;
  endDate: string;
  dateGranularity: 'day' | 'month';
  role?: Localized<string>;
  teamSize?: number;
  contribution?: number;  // %
  skillIds: string[];
  description: Localized<string>;  // markdown
  demoUrl?: string;
  githubUrl?: string;
  thumbnailUrl?: string;
  pinned: boolean;
  visible: boolean;
  order: number;
  issues: ProjectIssue[];
}

interface ProjectIssue {
  id: string;
  title: Localized<string>;
  problem: Localized<string>;     // markdown
  solution: Localized<string>;    // markdown
  outcome?: Localized<string>;
}

interface Certification {
  name: Localized<string>;
  issuer: Localized<string>;
  date: string;
  type: 'certification' | 'language' | 'award';
  score?: string;
}
```

## 작업 시작 전 체크

- [ ] SPEC.md 읽었는가
- [ ] 현재 단계가 1단계인가
- [ ] 작업 내용이 1단계 스코프 안에 있는가
- [ ] 새 색상/폰트/외부 라이브러리 추가 시 SPEC.md 토큰과 충돌 없는가

## 막혔을 때

작은 결정은 알아서, 큰 결정은 사용자에게 확인.
- 작은 결정 예: 컴포넌트 prop 이름, 내부 상태 처리 방식
- 확인 필요 예: 새 라이브러리 추가, 디자인 토큰 변경, 단계 스코프 초과

## 주요 참고 사이트
- linear.app (타이포/여백)
- vercel.com (다크모드 깊이)
- rauno.me (디테일)
- brittanychiang.com (자소서 포트폴리오 구조)
