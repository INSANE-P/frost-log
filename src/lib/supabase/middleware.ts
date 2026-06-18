import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * 매 요청마다 Supabase 세션을 갱신한다 (만료된 토큰 리프레시).
 * src/middleware.ts 에서 호출된다. 보호 경로 가드는 (admin)/layout.tsx 에서 별도 처리.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  // 환경변수가 아직 없으면(.env.local 미설정) 세션 갱신을 건너뛴다 — 블로그는 정상 렌더된다.
  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser()를 호출해야 세션이 갱신된다.
  await supabase.auth.getUser();

  return response;
}
