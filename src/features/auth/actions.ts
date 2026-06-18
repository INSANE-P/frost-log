"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const LoginInput = z.object({
  email: z.string().email("이메일 형식이 아니에요"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

export type LoginState = { error: string | null };

/** 로그인 — Server Action. 실패는 메시지로 돌려주고, 성공하면 /admin으로 보낸다. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않아요" };
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
