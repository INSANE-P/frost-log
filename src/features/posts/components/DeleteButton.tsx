"use client";

import { deletePost } from "../actions";

/** 삭제 — 실수 방지로 확인 후 Server Action 실행 */
export function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!confirm(`'${title}' 글을 삭제할까요?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="shrink-0 font-title text-[12px] text-muted transition hover:text-red-500"
      >
        삭제
      </button>
    </form>
  );
}
