# 1단계 시작 프롬프트

맥북에서 Claude Code 또는 Cursor에 그대로 붙여넣어 사용하세요.

---

## 사전 준비
1. 빈 폴더에 `SPEC.md`, `CLAUDE.md`, `.cursorrules` 세 파일을 먼저 둡니다.
2. 그 폴더에서 Claude Code 실행 (`claude` 명령) 또는 Cursor로 폴더 열기.
3. 아래 프롬프트 사용.

---

## Claude Code에 던질 프롬프트

```
프로젝트 루트에 SPEC.md, CLAUDE.md, .cursorrules가 있어. 먼저 이 세 파일을 모두 읽고 시작해.

지금 1단계 작업을 시작할 거야. SPEC.md의 "1단계 상세 작업 지시" 섹션을 정확히 따라서:

1. Next.js 14 프로젝트를 ovo-portfolio 폴더로 초기화 (App Router, TS, Tailwind, src dir)
2. 의존성 설치 (next-intl, next-themes, lucide-react, clsx, tailwind-merge)
3. SPEC.md에 정의된 폴더 구조 생성
4. 디자인 토큰을 globals.css에 CSS variables로 정의 (라이트/다크 양쪽)
5. tailwind.config.ts에 다크모드 class 모드, 컨테이너 1100px, 폰트 패밀리, semantic 컬러 매핑
6. 폰트 셋업 (Pretendard, Inter, Geist Mono)
7. next-intl 셋업 (ko/en, [locale] 라우팅, middleware)
8. 더미 데이터 작성 (src/data/dummy.ts) — SPEC.md 1-6에 적힌 오리 실제 정보 사용
9. 시드 스킬 (src/data/skills-seed.ts) — SPEC.md "기본 시드 스킬" 사용
10. 타입 정의 (src/types/index.ts) — CLAUDE.md "데이터 구조 가이드" 그대로
11. UI primitives (Button, Chip, Card)
12. 다크모드 토글, 한영 토글
13. Hero 섹션 먼저 완성 (디자인 검증)
14. 그 다음 About → Education → Skills → Certifications → Experience → Projects(카드만, 모달 X) → Footer

작업하면서:
- 1단계 스코프를 절대 벗어나지 마. 모달/DB/인증/마크다운 렌더링/이미지 업로드/드래그앤드롭/필터 전부 다음 단계야.
- 더미 데이터는 한영 둘 다 채워둘 것.
- 모바일 (375px), 태블릿 (768px), 데스크탑 (1280px) 반응형 동작 확인.
- 다 끝나면 SPEC.md "1-10 검수 체크리스트" 모두 통과시키고 npm run dev로 검증.

각 큰 단계가 끝날 때마다 무엇을 했는지 짧게 요약해줘.
```

---

## 중간 점검 시 추가 프롬프트 예시

**Hero만 먼저 디자인 검증하고 싶을 때:**
```
일단 1번~13번까지만 끝내고 멈춰. Hero 섹션 결과만 보고 디자인 톤 확인할게.
```

**스타일 미세 조정:**
```
Hero의 프로필 사진 크기를 키워보고, 이름과 한 줄 소개의 간격을 좀 더 좁혀줘. SPEC.md 디자인 토큰 안에서만.
```

**한영 토글 검증:**
```
지금 messages/ko.json과 en.json을 보여줘. 그리고 /ko, /en 양쪽에서 누락된 텍스트 없는지 확인해줘.
```

---

## Cursor에서 빠른 인라인 편집 예시

특정 컴포넌트 파일을 열고 Cmd+K:
```
이 컴포넌트의 hover transition을 SPEC.md 모션 가이드에 맞게 더 미세하게 다듬어줘. duration 200ms 이내.
```

```
이 섹션의 모바일 (375px) 레이아웃이 깨져. SPEC.md 스페이싱 토큰 사용해서 고쳐줘.
```

---

## 자주 쓸 명령

```bash
# 개발 서버
npm run dev

# 타입 체크
npx tsc --noEmit

# 린트
npm run lint

# 빌드 (배포 전 검증)
npm run build
```
