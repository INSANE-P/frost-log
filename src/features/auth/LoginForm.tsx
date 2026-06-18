"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="이메일"
        className="rounded-lg border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground outline-none transition focus:border-accent"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="비밀번호"
        className="rounded-lg border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground outline-none transition focus:border-accent"
      />
      {state.error && <p className="text-[13px] text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-accent px-4 py-2.5 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
