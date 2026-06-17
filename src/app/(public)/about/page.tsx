import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { DinoMascot } from "@/components/brand/DinoMascot";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "소개" };

// 옅은 틴트 + accent 톤 — 목록의 태그 배지와 같은 언어(일관성)
const chipStyle = {
  background: "color-mix(in srgb, var(--accent) 8%, var(--surface))",
  borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
  color: "color-mix(in srgb, var(--accent) 52%, var(--foreground))",
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-md border px-2 py-0.5 font-title text-[11px] font-medium"
      style={chipStyle}
    >
      {children}
    </span>
  );
}

/** 외부 링크 칩 — 라벨 + 살짝 떠오르는 화살표. 모두 새 탭. */
function LinkChip({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-0.5 font-title text-[13px] font-medium text-muted transition hover:text-accent"
    >
      {label}
      <ArrowUpRight
        className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}

const STACK: { label: string; items: string[] }[] = [
  { label: "언어", items: ["TypeScript", "JavaScript", "Dart"] },
  { label: "프레임워크", items: ["React", "Next.js", "Flutter"] },
  { label: "상태·데이터", items: ["Zustand", "TanStack Query", "Riverpod", "MSW"] },
  { label: "테스트", items: ["Vitest", "Cypress"] },
  { label: "인프라·배포", items: ["GitHub Actions", "AWS", "Vercel", "GitHub Pages"] },
];

type Project = {
  name: string;
  tagline: string;
  status?: string;
  period: string;
  role: string;
  tech: string[];
  points: string[];
  links: { label: string; href: string }[];
};

const PROJECTS: Project[] = [
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

const AWARDS = [
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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-4 pt-16">
      {/* 인트로 — 이름 + 한 문단 + 마스코트(사진 대신) */}
      <section className="flex flex-col-reverse items-start gap-7 sm:flex-row sm:items-center sm:gap-9">
        <div className="min-w-0 flex-1">
          <h1 className="text-[30px] font-bold tracking-tight text-foreground">
            안녕하세요, <span className="text-accent">박찬빈</span>이에요
          </h1>
          <p className="mt-2 font-title text-sm text-muted">
            프론트엔드 개발자 · 세종대학교 컴퓨터공학과
          </p>
          <p className="mt-5 break-keep text-[15px] leading-relaxed text-foreground/90">
            팀에서 <span className="font-semibold text-accent">같이 만들어가는 과정</span>을 좋아하는
            프론트엔드 개발자예요. 더 나은 방법이 보이면 먼저 제안하고, 필요하면 새로운 것도 마다하지
            않고 시도해요. 재밌어 보이는 걸 만들고, 생각이 향하는 대로 움직여요.
          </p>
        </div>

        {/* 설화를 안은 공룡 — 다른 화면과 같은 캐릭터로 톤을 맞춘다 */}
        <DinoMascot size={188} className="shrink-0 self-center" />
      </section>

      {/* 기술 */}
      <section className="mt-16 border-t border-border pt-10">
        <SectionLabel>기술</SectionLabel>
        <dl className="mt-6 flex flex-col gap-4">
          {STACK.map(({ label, items }) => (
            <div key={label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
              <dt className="w-24 shrink-0 font-title text-[13px] font-medium text-muted">
                {label}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <Tag key={it}>{it}</Tag>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 프로젝트 */}
      <section className="mt-16 border-t border-border pt-10">
        <SectionLabel>프로젝트</SectionLabel>
        <div className="mt-7 flex flex-col gap-10">
          {PROJECTS.map((p) => (
            <article key={p.name}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <h3 className="text-[20px] font-bold tracking-tight text-foreground">{p.name}</h3>
                {p.status && (
                  <span className="inline-flex items-center gap-1.5 font-title text-[12px] text-muted">
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                    {p.status}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[14px] text-muted">{p.tagline}</p>
              <p className="mt-1 font-title text-[12px] text-muted">
                {p.period} · {p.role}
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/90"
                  >
                    <span
                      className="mt-2 size-1 shrink-0 rounded-full"
                      style={{ background: "color-mix(in srgb, var(--accent) 55%, transparent)" }}
                      aria-hidden
                    />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {p.links.map((l) => (
                  <LinkChip key={l.label} label={l.label} href={l.href} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 활동 */}
      <section className="mt-16 border-t border-border pt-10">
        <SectionLabel>활동</SectionLabel>
        <article className="mt-7">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="text-[20px] font-bold tracking-tight text-foreground">그리디 (Greedy)</h3>
            <span className="font-title text-[12px] text-muted">2025.03 ~ 현재</span>
          </div>
          <p className="mt-1.5 text-[14px] text-muted">
            세종대학교 SW 학술 동아리 · 2기 멘티 → 3기 스터디 리드 → 4기 메인테이너
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              "스터디 리드로 상태관리 미션을 Zustand·TanStack Query 기반으로 재설계 (3기)",
              "메인테이너로 새 미션 설계 및 학습 자료 제작 (4기)",
            ].map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/90">
                <span
                  className="mt-2 size-1 shrink-0 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--accent) 55%, transparent)" }}
                  aria-hidden
                />
                {pt}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <LinkChip
              label="스터디 소개 발표 자료"
              href="https://insane-p.github.io/greedy-frontend-study/"
            />
          </div>
        </article>
      </section>

      {/* 수상 */}
      <section className="mt-16 border-t border-border pt-10">
        <SectionLabel>수상</SectionLabel>
        <ul className="mt-6 flex flex-col gap-5">
          {AWARDS.map((a) => (
            <li key={a.title}>
              <div className="text-[15px] font-semibold text-foreground">{a.title}</div>
              <div className="mt-1 font-title text-[12px] text-muted">{a.by}</div>
              <div className="mt-0.5 text-[13px] text-muted">{a.note}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* 연락처 */}
      <section className="mt-16 border-t border-border pt-10">
        <SectionLabel>연락처</SectionLabel>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/INSANE-P"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-title text-[13px] font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            <GithubIcon className="size-[17px]" />
            GitHub
          </a>
          <a
            href="mailto:chanbin0626@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-title text-[13px] font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            <Mail className="size-[17px]" />
            메일
          </a>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-title text-[13px] font-medium text-muted transition hover:border-accent hover:text-accent"
          >
            이력서
            <span className="font-title text-[11px] text-accent">준비중</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
