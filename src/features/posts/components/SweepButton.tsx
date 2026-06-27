"use client";

import { useState } from "react";
import { sweepUnusedImages } from "../actions";

/**
 * 미사용 이미지 정리 버튼(ADR-0020) — 확인 후 스윕 실행, 결과 표시.
 * 저장 안 한 드래프트 이미지는 고아로 보여 지워질 수 있어, 작성 중이 아닐 때 실행하라고 안내한다.
 */
export function SweepButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    if (busy) return;
    const ok = window.confirm(
      "어느 글에서도 쓰지 않는 이미지를 Storage에서 삭제해요.\n글 작성 중이 아닐 때 실행하세요. 계속할까요?",
    );
    if (!ok) return;
    setBusy(true);
    setMsg(null);
    const r = await sweepUnusedImages();
    setBusy(false);
    setMsg(r.error ? `오류: ${r.error}` : `정리 완료 — 삭제 ${r.deleted} · 유지 ${r.kept}`);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="rounded-lg border border-border px-3 py-1.5 font-title text-[13px] text-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
      >
        {busy ? "정리 중…" : "미사용 이미지 정리"}
      </button>
      {msg && <span className="text-[12px] text-muted">{msg}</span>}
    </div>
  );
}
