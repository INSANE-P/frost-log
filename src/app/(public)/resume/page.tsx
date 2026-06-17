import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DinoMascot } from "@/components/brand/DinoMascot";

export const metadata: Metadata = { title: "이력서" };

/** 이력서 준비중 — 설화를 안은 공룡이 톡 튀어나와 알린다. */
export default function ResumePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <DinoMascot size={220} className="dino-pop" />
      <h1 className="mt-7 text-[32px] font-bold tracking-tight text-foreground">
        이력서는 <span className="text-accent">준비중</span>이에요
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">조금만 기다려 주세요!</p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-1.5 font-title text-sm font-medium text-accent transition hover:opacity-80"
      >
        <ArrowLeft className="size-4" aria-hidden />
        홈으로
      </Link>
    </section>
  );
}
