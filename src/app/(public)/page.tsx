import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { DinoMascot } from "@/components/brand/DinoMascot";
import { DinoScene } from "@/components/brand/DinoScene";
import { MorphLink } from "@/components/brand/MorphLink";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostRow } from "@/features/posts/components/PostRow";
import { getFeatured, getRecent } from "@/features/posts/queries";
import { entryHref } from "@/features/posts/types";
import { formatDate } from "@/lib/utils/date";

/** 홈 — 큐레이션(명함 + 골라 둔 이야기 + 최근 기록/이야기). 읽기는 RSC에서 queries를 await. */
export default async function HomePage() {
  const [featured, recentJournal, recentPosts] = await Promise.all([
    getFeatured(),
    getRecent("journal", 3),
    getRecent("post", 3),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5">
      {/* 명함 — 정적 헤드라인(단어 강조) + 유틸 링크, 우측엔 설화를 안은 공룡 마스코트 */}
      <section className="pb-12 pt-20">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {/* 모바일: 헤드라인 위 작은 공룡(우측 큰 공룡은 데스크탑 전용) */}
            <DinoMascot size={72} className="mb-4 sm:hidden" />
            <h1 className="text-[34px] font-bold leading-[1.22] tracking-tight text-foreground">
              <span className="text-accent">겨울</span>을 나는
              <br />
              개발자의 기록
            </h1>
            {/* 소개 버튼 대신 유틸 링크 — 호버하면 글자가 모여 각자에 맞는 로고로 변한다 */}
            <div className="mt-7 flex items-center gap-6 font-title text-base font-medium">
              <MorphLink
                href="https://github.com/INSANE-P"
                label="github"
                external
                icon={<GithubIcon className="size-5" />}
              />
              <MorphLink href="/resume" label="이력서" icon={<FileText className="size-5" />} />
              <MorphLink
                href="mailto:chanbin0626@gmail.com"
                label="메일"
                icon={<Mail className="size-5" />}
              />
            </div>
          </div>
          {/* 우측 — 설화를 안은 공룡 */}
          <DinoScene size={208} className="hidden shrink-0 sm:block" />
        </div>
      </section>

      {/* 골라 둔 이야기 (핀) — 각 섹션이 자기 자리에서 빈 상태를 보여준다 */}
      <section className="border-t border-border pt-10">
        <SectionLabel>골라 둔 이야기</SectionLabel>
        {featured.length > 0 ? (
          <div className="mt-2">
            {featured.map((entry) => (
              <PostRow key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <EmptyState message="아직 골라 둔 이야기가 없어요" />
        )}
      </section>

      {/* 최근 기록 / 최근 이야기 — 컴팩트 목록 */}
      <section className="grid gap-x-10 gap-y-10 pt-14 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <SectionLabel>최근 기록</SectionLabel>
            <Link
              href="/journal"
              className="group inline-flex items-center gap-0.5 font-title text-[12px] text-muted transition hover:text-accent"
            >
              전체 보기
              <ArrowRight
                className="size-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
          {recentJournal.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-5">
              {recentJournal.map((e) => (
                <li key={e.slug}>
                  <Link href={entryHref(e)} className="group block">
                    <div className="text-[15px] font-medium text-foreground transition group-hover:text-accent">
                      {e.title}
                    </div>
                    <div className="mt-1 font-title text-xs text-muted">{formatDate(e.date)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="아직 기록이 없어요" />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <SectionLabel>최근 이야기</SectionLabel>
            <Link
              href="/posts"
              className="group inline-flex items-center gap-0.5 font-title text-[12px] text-muted transition hover:text-accent"
            >
              전체 보기
              <ArrowRight
                className="size-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-5">
              {recentPosts.map((e) => (
                <li key={e.slug}>
                  <Link href={entryHref(e)} className="group block">
                    <div className="text-[15px] font-medium text-foreground transition group-hover:text-accent">
                      {e.title}
                    </div>
                    {e.tags && (
                      <div className="mt-1 font-title text-xs text-muted">{e.tags.join(" · ")}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="아직 이야기가 없어요" />
          )}
        </div>
      </section>
    </div>
  );
}
