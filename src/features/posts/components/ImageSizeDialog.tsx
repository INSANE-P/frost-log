"use client";

import { useEffect, useRef, useState } from "react";
import { registerImageSizePicker, type SizeChoice } from "../imageSizeController";

const COLUMN = 728; // 본문 폭(미리보기·표시 기준)
const MAX = 1600; // 업로드 최대 너비
const MIN = 120;
const PRESETS = [
  { label: "작게", w: 360 },
  { label: "보통", w: 540 },
  { label: "크게", w: COLUMN },
];

/**
 * 업로드 전 이미지 크기 선택 모달(ADR-0019). 파일 크기 = 표시 크기 원리.
 * 기본값은 원본(=현재 동작) — 그냥 올리면 지금과 동일, 줄이고 싶을 때만 조절.
 * PostForm에 상시 마운트하고, onUpload이 requestImageSize로 연다.
 */
export function ImageSizeDialog() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [maxW, setMaxW] = useState(MAX); // 원본 너비(≤MAX)
  const [width, setWidth] = useState(MAX);
  const [aspect, setAspect] = useState(1.5); // 원본 가로/세로 비 — 미리보기 영역 높이 고정용
  const resolveRef = useRef<((c: SizeChoice) => void) | null>(null);
  const urlRef = useRef("");

  useEffect(() => {
    return registerImageSizePicker(
      (file) =>
        new Promise<SizeChoice>((resolve) => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            const nat = Math.min(img.naturalWidth || COLUMN, MAX);
            setMaxW(nat);
            setWidth(nat); // 기본 = 원본
            setAspect((img.naturalWidth || 3) / (img.naturalHeight || 2));
            setPreviewUrl(url);
            urlRef.current = url;
            resolveRef.current = resolve;
            setOpen(true);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve("auto");
          };
          img.src = url;
        }),
    );
  }, []);

  function finish(choice: SizeChoice) {
    resolveRef.current?.(choice);
    resolveRef.current = null;
    setOpen(false);
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = "";
    }
    setPreviewUrl("");
  }

  if (!open) return null;

  const w = Math.min(width, maxW);
  const previewPct = Math.min(100, (w / COLUMN) * 100);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={() => finish("cancel")}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-title text-base font-semibold text-foreground">이미지 크기</h2>
        <p className="mt-1 text-[13px] text-muted">본문에 보일 크기를 정해요. 그냥 올리면 원본 크기.</p>

        {/* 미리보기 — 실제 본문처럼 텍스트 사이에 사진. 텍스트 한 줄 폭(=본문 폭) 대비
           사진이 얼마나 차지하는지 그대로 보인다. 사진 영역 높이는 고정이라 슬라이더에 안 들썩이고, 안 잘린다. */}
        <div className="mt-3">
          <div className="mb-1.5 text-right text-[12px] tabular-nums text-muted">
            본문의 약 {Math.round(previewPct)}% · {w}px
          </div>
          <div className="rounded-xl border border-hairline bg-background px-5 py-4">
            <p className="font-title font-bold leading-tight text-foreground" style={{ fontSize: "1.55rem" }}>
              h1
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/75">본문</p>
            <div
              className="my-3 flex w-full items-center justify-center"
              style={{ aspectRatio: String(Math.min(2.4, Math.max(0.9, aspect))), maxHeight: 220 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="mx-auto block rounded border border-border"
                style={{ width: `${previewPct}%`, height: "auto", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/75">본문</p>
          </div>
        </div>

        {/* 프리셋 */}
        <div className="mt-4 flex gap-2">
          {PRESETS.filter((p) => p.w <= maxW).map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setWidth(p.w)}
              className={`flex-1 rounded-lg border px-3 py-1.5 text-[13px] transition ${
                w === p.w
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setWidth(maxW)}
            className={`flex-1 rounded-lg border px-3 py-1.5 text-[13px] transition ${
              w === maxW
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            원본
          </button>
        </div>

        {/* 슬라이더 */}
        <div className="mt-4 flex items-center gap-3">
          <input
            type="range"
            min={MIN}
            max={maxW}
            value={w}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="flex-1 accent-[var(--accent)]"
          />
          <span className="w-16 text-right font-title text-[13px] tabular-nums text-muted">
            {w}px
          </span>
        </div>

        {/* 액션 */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => finish("cancel")}
            className="rounded-lg border border-border px-4 py-2 text-[14px] text-foreground transition hover:border-accent"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => finish(w)}
            className="rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            이 크기로 올리기
          </button>
        </div>
      </div>
    </div>
  );
}
