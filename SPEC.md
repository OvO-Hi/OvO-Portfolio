# OvO Portfolio — 프로젝트 스펙

> 개발자 자소서/포트폴리오 사이트. 한영 토글, 미니멀 디자인, 관리자 페이지에서 모든 콘텐츠 CRUD.

---

## 📌 프로젝트 개요

- **프로젝트명**: `ovo-portfolio`
- **목적**:
  - 한국 기업 자소서 보조 링크용
  - 해외 지원용 영문 포트폴리오 (EPITA Summer School 등)
- **언어**: 한국어 / 영어 토글 (필수)
- **소유자**: 오리 (Ewha Womans University, Computer Engineering, 2027년 2월 졸업 예정)

---

## 🎨 디자인 방향

### 톤 & 무드
- **스타일**: Linear / Vercel 스타일 미니멀
- **컬러**: 모노크롬 베이스 (블랙 / 화이트 / 그레이) + 슬레이트 블루 액센트 1
- **타이포**: Inter (영문) + Pretendard (한글), Geist Mono (코드/숫자)
- **모션**: 미세한 hover transition, 모달 fade + scale, 페이지 전환은 절제

### 컬러 토큰 (다크/라이트 양쪽)

```
/* Light */
--bg: #ffffff
--bg-subtle: #fafafa
--bg-muted: #f5f5f5
--border: #e5e5e5
--border-strong: #d4d4d4
--text: #0a0a0a
--text-muted: #525252
--text-subtle: #a3a3a3
--accent: #4a6fa5         /* slate blue (OvO TAROT와 톤 통일) */
--accent-hover: #3d5d8f
--accent-subtle: #eef2f8

/* Dark */
--bg: #0a0a0a
--bg-subtle: #111111
--bg-muted: #1a1a1a
--border: #262626
--border-strong: #404040
--text: #fafafa
--text-muted: #a3a3a3
--text-subtle: #525252
--accent: #6b8cc4
--accent-hover: #84a0d4
--accent-subtle: #1a2332
```

### 스페이싱 / 레이아웃
- 컨테이너 max-width: `1100px`
- 섹션 간격: `96px` (모바일 `64px`)
- 콘텐츠 패딩: `24px` (모바일 `16px`)
- Border radius: `8px` (카드), `6px` (버튼/태그), `999px` (스킬 칩, 프로필)

### 타이포 위계
- `h1` (페이지 메인): 48px / 700 / -0.02em
- `h2` (섹션): 28px / 600 / -0.01em
- `h3` (서브): 18px / 600
- `body`: 15px / 400 / line-height 1.6
- `caption`: 13px / 400, `text-muted`
- `mono`: Geist Mono (날짜, 숫자, 태그 등)

---

## 🛠 기술 스택

| 영역 | 선택 |
|---|---|
| Framework | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS + CSS variables |
| DB | PostgreSQL (Neon) |
| ORM | Prisma |
| 인증 | NextAuth (이메일 화이트리스트) |
| i18n | next-intl |
| 폰트 | Pretendard (한글), Inter (영문), Geist Mono |
| 마크다운 | react-markdown + remark-gfm + rehype-highlight |
| 이미지 업로드 | Vercel Blob (5단계) |
| 배포 | Vercel |

OvO TAROT와 동일한 스택 — 환경 셋업/배포 지식 재활용.

---

## 📄 사이트 구조 (메인 페이지)

단일 페이지 스크롤 구조. 섹션별로 anchor 링크.

```
1. Hero
   - 원형 프로필 사진 (정통 자소서 느낌, 200px)
   - 이름 (한/영)
   - 짧은 한 줄 소개 (예: "Backend Developer & Team Lead")
   - 연락처 아이콘 줄: 전화, 이메일, GitHub, (LinkedIn/Velog 옵션)

2. About (자기소개)
   - 2~3문단의 자기소개 / 개발 철학
   - 마크다운 지원

3. Education (학력)
   - 학교, 학과, 학년/상태 (재학/졸업/졸업유예/휴학/추가학기)
   - 입학~졸업(예정) 기간
   - 성적 (GPA) — 토글로 숨김/공개 가능
   - 여러 개 가능 (편입/대학원 대비)

4. Skills (기술 스택)
   - 카테고리별 (Languages / Frontend / Backend / Mobile / Database / AI/GenAI / Tools)
   - 각 카테고리 안에 칩 형태로 노출
   - 노션 옵션 블록처럼: 검색하면 즉시 자동완성/필터, 클릭으로 토글
   - 아이콘 (devicon 또는 simple-icons)

5. Certifications & Awards (자격증·어학·수상)
   - 자격증: 이름, 발급기관, 취득일
   - 어학: 시험명, 점수, 응시일
   - 수상: 대회명, 상격, 수여기관, 일자

6. Experience (경력/대외활동)  ← ✨ 추가 권장
   - 회사/동아리/크루명, 직책, 기간, 한 줄 설명

7. Projects (프로젝트)
   - 카드 그리드 (썸네일 + 제목 + 한줄 설명 + 사용 스킬 칩 일부)
   - 카드 클릭 → 모달 (페이지 이동 X, 뒤로가기로 닫힘)
   - 필터: 스킬, 연도, 역할 (드롭다운/태그)
   - 정렬: 최신순 / Pin된 항목 우선
   - "Pin" 표시된 항목은 상단에 우선 노출

8. Footer
   - 깃허브, 이메일, "© 2026 오리" 같은 미니멀 표기
   - 관리자 진입점 숨김 (예: "© 2026 오리" 텍스트 더블클릭 또는 "ㆍ" 점 클릭)
```

---

## 🪟 프로젝트 모달 (상세)

```
[모달 헤더]
- 프로젝트명 + 기간 (YYYY.MM ~ YYYY.MM 또는 특정 날짜)
- Pin 아이콘 (관리자만 보임)
- 닫기 버튼 (Esc, 외부 클릭, X 모두 동작)

[메타 정보 영역]
- 한 줄 설명
- 역할 (선택, 비워두기 가능)
- 팀 규모 / 내 기여도 % (선택)
- 사용 스킬 칩들

[메인 콘텐츠]
- 프로젝트 상세 설명 (마크다운, 코드블록 하이라이트)
- 데모 영상 / 사이트 임베드 (iframe, YouTube/Vimeo, 자체 사이트)
- 깃허브 링크 (있으면)

[이슈 & 해결]
- 카드/아코디언 형태로 여러 개
- 각각 STAR 구조 권장 (Situation / Task / Action / Result)
  - 또는 더 단순하게: 문제 / 원인 / 해결 / 배운 점
- 작성자가 자유롭게 마크다운으로 쓸 수 있게
```

### 모달 동작
- 열릴 때: scale 0.98 → 1, opacity 0 → 1, duration 200ms
- 배경 dim: rgba(0,0,0,0.5), backdrop-blur-sm
- 모바일: full-screen sheet (하단에서 슬라이드 업)
- 데스크탑: 중앙 정렬, max-width 720px
- URL에 쿼리 파라미터 (`?project=slug`) 추가 → 새로고침/공유 가능

---

## 🔐 관리자 페이지

### 진입
- 푸터의 특정 영역 더블클릭 → 로그인 모달
- 또는 직접 `/admin` 진입
- NextAuth로 이메일 화이트리스트 (오리 본인 이메일만)

### 기능
- 모든 섹션 CRUD: About / Education / Skills / Certifications / Experience / Projects
- 프로젝트:
  - 드래그 앤 드롭 정렬
  - Pin 토글 (대표작 표시)
  - 공개/비공개 토글
  - 마크다운 에디터 (live preview)
  - 이미지 업로드 (5단계)
- 스킬:
  - 검색 + 즉시 자동완성
  - 카테고리 지정해서 새 스킬 추가
  - 아이콘 매핑 (없으면 첫 글자로 fallback)
- 한/영 콘텐츠 분리 입력 (탭으로 전환)

---

## 🧩 기본 시드 스킬 (관리자 추가 전 기본값)

이 목록은 첨부 이력서 + 일반적인 개발자 스킬 합친 것. 관리자가 수정/추가/삭제 가능.

### Languages
Java, Python, JavaScript, TypeScript, C, C++, Go, Rust, Kotlin, Swift, Ruby, PHP

### Frontend
React, Next.js (App Router), Vue, Svelte, HTML, CSS, Tailwind CSS, Sass, styled-components, Redux, Zustand, TanStack Query

### Backend
Spring Boot, Flask, FastAPI, Express, NestJS, Django, RESTful API, GraphQL, JWT, OAuth

### Mobile
React Native, Flutter, Swift (iOS), Kotlin (Android)

### Database
PostgreSQL, MySQL, MongoDB, Redis, SQLite, Prisma, TypeORM

### AI / GenAI
Claude (Anthropic), GPT-4 (OpenAI), Whisper, DALL-E 3, Google Vision OCR, LangChain, Prompt Engineering, Multi-AI orchestration, Reliability handling

### DevOps / Cloud
AWS (EC2, S3, RDS), Vercel, Docker, GitHub Actions, Nginx, Linux

### Tools
Git, GitHub, Figma, Notion, Slack, Postman, VS Code, Cursor, Claude Code

---

## 🚦 단계별 로드맵

### ✅ 1단계 — 프로젝트 셋업 + 디자인 시스템 + 메인 페이지 정적 버전 ← **현재**
- Next.js 14 App Router, TypeScript, Tailwind 셋업
- 디자인 토큰 (CSS variables, dark mode)
- 폰트 셋업 (Pretendard, Inter, Geist Mono)
- next-intl 한영 토글
- 더미 데이터로 메인 페이지 모든 섹션 레이아웃
- 다크모드 토글 (next-themes)
- **결과물**: 보기 좋은 정적 사이트, 한영 전환, 다크모드 작동

### 2단계 — 프로젝트 모달 + 상세 화면
- 프로젝트 카드 → 모달 (페이지 이동 X)
- URL 쿼리 동기화
- 마크다운 렌더링
- 이슈/해결 아코디언

### 3단계 — DB 스키마 + Prisma + API
- Neon 연결, Prisma 셋업
- 스키마 마이그레이션
- API 라우트 (CRUD)
- 더미 → 실제 데이터

### 4단계 — 관리자 페이지
- NextAuth 이메일 화이트리스트
- 숨겨진 진입점
- 섹션별 CRUD UI
- 마크다운 에디터
- 스킬 검색/추가

### 5단계 — 마무리
- Vercel Blob 이미지 업로드
- 드래그 앤 드롭 정렬, Pin, 공개/비공개
- PDF 이력서 다운로드
- SEO 메타태그
- 반응형 점검
- Vercel 배포

---

## 📋 1단계 상세 작업 지시

### 1-1. 프로젝트 초기화
```bash
npx create-next-app@latest ovo-portfolio --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
cd ovo-portfolio
```

`--no-turbopack` 옵션은 안정성을 위해 끄지 않음 (Next 14 기본).

### 1-2. 의존성 설치
```bash
npm install next-intl next-themes lucide-react clsx tailwind-merge
npm install -D @types/node
```

### 1-3. 폴더 구조
```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx           # 메인 페이지
      globals.css
    api/                 # 3단계에서 추가
  components/
    sections/
      hero.tsx
      about.tsx
      education.tsx
      skills.tsx
      certifications.tsx
      experience.tsx
      projects.tsx
      footer.tsx
    ui/
      button.tsx
      chip.tsx
      card.tsx
      theme-toggle.tsx
      locale-toggle.tsx
    project-card.tsx
  lib/
    utils.ts             # cn() helper 등
    fonts.ts
  data/
    dummy.ts             # 1단계용 더미 데이터 (3단계에서 DB로 교체)
    skills-seed.ts       # 기본 시드 스킬
  i18n/
    request.ts
    routing.ts
  messages/
    ko.json
    en.json
  types/
    index.ts
middleware.ts
tailwind.config.ts
next.config.mjs
```

### 1-4. 디자인 토큰 (`globals.css`)
- 위 컬러 토큰을 `:root` / `.dark`에 정의
- Tailwind에서 `bg-background`, `text-foreground` 등으로 사용 가능하게 설정

### 1-5. Tailwind 설정
- `darkMode: 'class'`
- 컨테이너 max-width 1100px
- 폰트 패밀리: `font-sans` (Pretendard + Inter 합본), `font-mono` (Geist Mono)
- 컬러: CSS variables 기반

### 1-6. 더미 데이터 (`src/data/dummy.ts`)
- 1단계에서 사용할 모든 섹션 더미 데이터
- 첨부 이력서 기반으로 오리 실제 데이터 채워둘 것:
  - 이름: 오리 (Ori)
  - 학교: Ewha Womans University, Computer Engineering, 2027년 2월 졸업 예정
  - 자격증: SQL Developer (SQLD) — Korea Data Agency, MAR 2026 / IELTS Overall 6.5 — British Council, APR 2026
  - 스킬: Java, Python, JavaScript, TypeScript / React, Next.js / Spring Boot, Flask, JWT / React Native / PostgreSQL, MySQL / Claude, GPT-4, Whisper, DALL-E 3, Google Vision OCR
  - 프로젝트:
    - **Re:cord** — AI-powered concert ticket book (팀 코드만두, 백엔드/팀장)
    - **OvO TAROT** — 개인화 타로 리딩 웹앱
    - **PLUG 9th — Concert Venue Tour Map** — UNPLUGGED Hongdae 문화기획
    - (모달용 더미 이슈/해결도 1~2개씩)

### 1-7. 한영 메시지 파일
- `messages/ko.json`, `messages/en.json` 생성
- 모든 UI 텍스트 (섹션 제목, 버튼 라벨 등)
- 콘텐츠 자체는 데이터 객체에 `{ ko, en }` 구조로 보관

### 1-8. 컴포넌트 작성 우선순위
1. `lib/utils.ts` (cn helper)
2. `lib/fonts.ts` (폰트 로딩)
3. `app/[locale]/layout.tsx` (한영 라우팅, 폰트, 다크모드 provider)
4. UI primitives (button, chip, card)
5. theme-toggle, locale-toggle
6. Hero (가장 먼저 보이는 부분이라 디자인 검증용)
7. 나머지 섹션
8. Footer (관리자 진입점은 4단계에서, 일단 placeholder)

### 1-9. Hero 섹션 상세
```
[좌측 또는 상단]
- 원형 프로필 (200px, ring-2 ring-border)
- 이름 (h1, 48px, 한/영 전환)
- 한 줄 소개 (text-muted, 18px)
- 연락처 줄: 아이콘 + 텍스트 (이메일, GitHub, 전화는 hover 시만 표시 옵션)

[우측 상단]
- 다크모드 토글
- 한영 토글 (KO / EN)
```

### 1-10. 검수 체크리스트 (1단계 완료 기준)
- [ ] `npm run dev`로 에러 없이 실행
- [ ] `/ko` `/en` 둘 다 정상 렌더
- [ ] 다크/라이트 모드 토글 작동, 깜빡임 없음
- [ ] 모든 섹션이 더미 데이터로 렌더링됨
- [ ] 모바일 (375px) / 태블릿 (768px) / 데스크탑 (1280px) 반응형
- [ ] 폰트 깨지지 않음 (한글 Pretendard, 영문 Inter)
- [ ] Lighthouse 접근성 90+ (alt 텍스트, aria 라벨)
- [ ] TypeScript 에러 0
- [ ] ESLint 에러 0

---

## ⚠️ 1단계에서 하지 말 것 (스코프 컨트롤)

- ❌ 프로젝트 모달 (2단계)
- ❌ DB / Prisma / API 라우트 (3단계)
- ❌ 인증 / 관리자 페이지 (4단계)
- ❌ 이미지 업로드 (5단계)
- ❌ 마크다운 렌더링 (2단계, 일단 plain text로)
- ❌ 드래그 앤 드롭, Pin, 필터 (5단계)

1단계는 **"눈으로 보는 정적 버전"** 이 목표.

---

## 🤝 협업 워크플로우 (Claude Code + Cursor)

OvO TAROT와 동일한 방식:
- 큰 단위 작업, 멀티파일 변경: **Claude Code**
- 단일 파일 인라인 편집, 빠른 수정: **Cursor**
- `CLAUDE.md`로 컨텍스트 공유 (이 SPEC.md를 참조하도록)
- `.cursorrules`로 코딩 컨벤션 공유

---

## 📝 작성 규칙

- **컴포넌트**: 함수형, named export, props는 인터페이스로 정의
- **파일명**: kebab-case (`project-card.tsx`)
- **컴포넌트명**: PascalCase (`ProjectCard`)
- **클래스 결합**: `cn()` helper 사용
- **타입**: `any` 금지, 모르겠으면 `unknown`
- **i18n**: 하드코딩된 사용자 노출 텍스트 금지 (모두 messages에서)
- **접근성**: 모든 interactive 요소에 aria-label, focus-visible 스타일

---

## 🎯 최종 목표 비주얼 레퍼런스

- Linear (linear.app) — 타이포 위계, 여백, 절제된 색
- Vercel (vercel.com) — 다크모드 깊이감, 미세한 그라디언트
- Rauno (rauno.me) — 개발자 개인 사이트의 디테일
- Brittany Chiang (brittanychiang.com) — 자소서 보조 포트폴리오 구조

이 4개 톤을 30/30/20/20 정도로 블렌딩.
