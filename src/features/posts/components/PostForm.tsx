"use client";

import { useActionState, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { savePost, type SaveState } from "../actions";
import type { EditData } from "../admin";
import { TagInput } from "./TagInput";
import { DatePicker } from "./DatePicker";

// 무거운 에디터는 클라이언트에서만 — SSR 비활성 동적 로드(ADR-0015)
const MarkdownEditor = dynamic(() => import("./MarkdownEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[60vh] p-6 text-sm text-muted">에디터 불러오는 중…</div>,
});

const initial: SaveState = { error: null };
const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-[15px] text-foreground outline-none transition focus:border-accent";
const labelCls = "block text-[13px] font-medium text-foreground";
const TYPES = [
  { value: "post", label: "이야기" },
  { value: "journal", label: "기록" },
] as const;

export function PostForm({
  data,
  today,
  tagSuggestions = [],
}: {
  data?: EditData;
  today: string;
  tagSuggestions?: string[];
}) {
  const [state, action, pending] = useActionState(savePost, initial);
  const [content, setContent] = useState(data?.content ?? "");
  const [type, setType] = useState<"post" | "journal">(data?.type ?? "post");
  // status는 버튼 submitter에 의존하면 Enter 제출 등에서 누락될 수 있어, 항상 있는 hidden으로 둔다.
  const statusRef = useRef<HTMLInputElement>(null);
  const setStatus = (s: "draft" | "published") => {
    if (statusRef.current) statusRef.current.value = s;
  };

  return (
    <form action={action}>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <input type="hidden" name="content" value={content} />
      {/* 기본값 = 현재 글 상태(없으면 draft). 버튼 클릭이 이 값을 바꾼다. */}
      <input type="hidden" name="status" ref={statusRef} defaultValue={data?.status ?? "draft"} />

      {/* 상단 바 — 어디서든 저장/발행 */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-2 border-b border-hairline bg-background/85 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
        <span className="mr-auto font-title text-sm font-semibold text-foreground">
          {data ? "글 수정" : "새 글 쓰기"}
        </span>
        {state.error && <span className="text-[13px] text-red-500">{state.error}</span>}
        <button
          type="submit"
          onClick={() => setStatus("draft")}
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-[14px] font-medium text-foreground transition hover:border-accent disabled:opacity-60"
        >
          임시저장
        </button>
        <button
          type="submit"
          onClick={() => setStatus("published")}
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "저장 중…" : "발행하기"}
        </button>
      </div>

      {/* 제목 */}
      <input
        name="title"
        defaultValue={data?.title ?? ""}
        required
        placeholder="제목"
        className="mt-7 w-full border-b border-hairline bg-transparent pb-2.5 font-title text-[28px] font-bold tracking-tight text-foreground outline-none transition placeholder:text-muted/40 focus:border-accent"
      />

      {/* 글 정보 */}
      <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <div>
          <span className={labelCls}>종류</span>
          <input type="hidden" name="type" value={type} />
          <div className="mt-1 flex rounded-lg border border-border bg-surface p-0.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                aria-pressed={type === t.value}
                className={`flex-1 rounded-md px-3 py-1.5 text-[14px] transition ${
                  type === t.value
                    ? "bg-accent font-medium text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className={labelCls}>날짜</span>
          <DatePicker name="entryDate" defaultValue={data?.entryDate ?? ""} today={today} />
        </div>
        <div>
          <label className={labelCls} htmlFor="slug">
            주소 (URL)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={data?.slug ?? ""}
            required
            placeholder="how-i-built-this"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>태그</label>
          <TagInput defaultValue={data?.tags ?? ""} suggestions={tagSuggestions} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="coverImage">
            대표 이미지 <span className="font-normal text-muted">(선택)</span>
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={data?.coverImage ?? ""}
            placeholder="/covers/build.svg"
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="excerpt">
            요약 <span className="font-normal text-muted">(선택)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={data?.excerpt ?? ""}
            rows={3}
            placeholder="목록·미리보기에 보여요"
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </div>
        <label className="flex items-center justify-between gap-3 sm:col-span-2">
          <span className="text-[14px] text-foreground">홈 추천에 띄우기</span>
          <span className="relative inline-block h-6 w-11 shrink-0">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={data?.featured ?? false}
              className="peer sr-only"
            />
            <span className="block h-6 w-11 rounded-full bg-border transition peer-checked:bg-accent" />
            <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition peer-checked:translate-x-5" />
          </span>
        </label>
      </div>

      {/* 본문 — 에디터를 공개 화면처럼. 모바일은 가장자리까지, 데스크탑은 박스 */}
      <div className="mt-7">
        <span className={`${labelCls} mb-2`}>본문</span>
        <div className="-mx-4 overflow-hidden border-y border-border bg-surface sm:mx-0 sm:rounded-xl sm:border">
          <MarkdownEditor defaultValue={data?.content ?? ""} onChange={setContent} />
        </div>
      </div>
    </form>
  );
}
