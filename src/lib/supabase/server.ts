import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * 서버(RSC, Server Action, Route Handler)에서 쓰는 Supabase 클라이언트.
 * 읽기 쿼리(queries.ts)와 쓰기 액션(actions.ts)이 이걸 통해 DB에 접근한다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // RSC에서 호출되면 set이 막힐 수 있음 — 미들웨어가 세션을 갱신하므로 무시 가능
          }
        },
      },
    },
  );
}
