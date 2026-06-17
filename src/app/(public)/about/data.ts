// 소개 페이지 콘텐츠 — 화면(page.tsx)과 분리해 내용만 여기서 고친다.

export const STACK: { label: string; items: string[] }[] = [
  { label: "언어", items: ["TypeScript", "JavaScript", "Dart"] },
  { label: "프레임워크", items: ["React", "Next.js", "Flutter"] },
  { label: "상태·데이터", items: ["Zustand", "TanStack Query", "Riverpod", "MSW"] },
  { label: "테스트", items: ["Vitest", "Cypress"] },
  { label: "인프라·배포", items: ["GitHub Actions", "AWS", "Vercel", "GitHub Pages"] },
];

export type Project = {
  name: string;
  tagline: string;
  status?: string;
  period: string;
  role: string;
  tech: string[];
  points: string[];
  links: { label: string; href: string }[];
};

export const PROJECTS: Project[] = [
  {
    name: "경찰과 도둑 (경도)",
    tagline: "위치 기반 실시간 멀티플레이어 모바일 게임",
    status: "출시·운영 중",
    period: "2025.10 ~",
    role: "프론트엔드 (앱·웹)",
    tech: ["Flutter", "Dart", "STOMP/WebSocket", "Riverpod", "Next.js"],
    points: [
      "STOMP WebSocket으로 로비·게임 실시간 채팅과 게임 시스템 구현",
      "끊긴 연결을 수동 재연결 + FCM 기반 자동 재연결로 복구",
      "앱 소개 웹사이트(Next.js) 구현, 인앱 브라우저 딥링크 문제 해결",
    ],
    links: [
      { label: "소개 사이트", href: "https://copsnro66ers.site/" },
      { label: "App Store", href: "https://apps.apple.com/kr/app/id6756843948" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.elipair.copsandrobbers",
      },
      { label: "GitHub", href: "https://github.com/cops-and-robbers/cops-and-robbers-FE" },
    ],
  },
  {
    name: "올클 (ALLCLL)",
    tagline: "세종대학교 수강신청 도우미",
    status: "운영 중",
    period: "2025.12 ~",
    role: "프론트엔드",
    tech: ["React", "TypeScript", "Zustand", "TanStack Query", "MSW", "Storybook"],
    points: [
      "졸업 요건 검사 기능을 담당해 개발",
      "복잡한 졸업 요건 도메인을 대시보드·검사 플로우로 구현",
    ],
    links: [
      { label: "서비스", href: "https://allcll.kr" },
      { label: "GitHub", href: "https://github.com/allcll/allcll-frontend" },
    ],
  },
  {
    name: "Footure",
    tagline: "축구 선수 이적 퍼포먼스 예측 서비스",
    period: "2026.03 ~",
    role: "프론트엔드 · AI 추론 서버",
    tech: ["React", "TypeScript", "FastAPI", "Docker", "GitHub Actions", "AWS"],
    points: [
      "선수 검색·상세, 시즌 지표 그래프, AI 예측 어드민 페이지 구현",
      "FastAPI 기반 AI 추론 서버 구축, Docker·GitHub Actions로 EC2 자동 배포",
    ],
    links: [
      { label: "서비스", href: "https://footure.site/" },
      { label: "프론트 GitHub", href: "https://github.com/5sondoson/5sondoson-fe" },
      { label: "AI 서버 GitHub", href: "https://github.com/5sondoson/5sondoson-ai" },
    ],
  },
  {
    name: "세종 줍줍 (Zup-Zup)",
    tagline: "세종대학교 지도 기반 분실물 찾기 웹 · 첫 팀 프로젝트",
    period: "2025.07 ~ 2026.04",
    role: "프론트엔드",
    tech: ["React", "TypeScript", "Vite", "Zustand", "TanStack Query", "AWS CloudFront"],
    points: [
      "분실물 찾기·로그인·마이페이지 등 주요 페이지 구현, AWS CloudFront로 첫 배포",
      "MSW로 목 서버를 구축해 백엔드와 병렬 개발",
    ],
    links: [
      { label: "서비스", href: "https://www.sejong-zupzup.kr" },
      { label: "GitHub", href: "https://github.com/greedy-team/zup-zup-fe" },
    ],
  },
];

export const AWARDS = [
  {
    title: "2026 세종 창업 아이디어리그 — 대상",
    by: "세종대학교 SW중심대학사업단",
    note: "실시간 멀티플레이어 게임 '경찰과 도둑'",
  },
  {
    title: "제13회 세종대학교 SW·AI 해커톤 — 장려상",
    by: "세종대학교 SW중심대학사업단",
    note: "GitHub 활동 데이터 기반 팀 결성 플랫폼",
  },
];
