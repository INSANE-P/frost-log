"use client";

import { useState } from "react";

/**
 * 태그 입력 — 입력 후 Enter·쉼표·띄어쓰기로 칩으로 확정, × 로 제거.
 * 기존 태그는 datalist로 자동완성. 폼에는 hidden input(쉼표 결합)으로 전달.
 */
export function TagInput({
  defaultValue = "",
  suggestions = [],
}: {
  defaultValue?: string;
  suggestions?: string[];
}) {
  const [tags, setTags] = useState<string[]>(
    defaultValue
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  );
  const [text, setText] = useState("");

  function add(raw: string) {
    const t = raw.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setText("");
  }
  function remove(t: string) {
    setTags(tags.filter((x) => x !== t));
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(text);
    } else if (e.key === " " && text.trim()) {
      e.preventDefault();
      add(text);
    } else if (e.key === "Backspace" && !text && tags.length) {
      remove(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <input type="hidden" name="tags" value={tags.join(",")} />
      <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 transition focus-within:border-accent">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-title text-[12px]"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              aria-label={`${t} 제거`}
              className="text-accent/70 transition hover:text-accent"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(text)}
          list="tag-suggestions"
          placeholder={tags.length ? "" : "태그 입력 후 Enter"}
          className="min-w-[8ch] flex-1 bg-transparent px-1 py-0.5 text-[15px] text-foreground outline-none"
        />
        <datalist id="tag-suggestions">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
