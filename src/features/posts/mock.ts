import type { Entry } from "./types";

/**
 * 임시 mock 데이터. UI를 먼저 만들어 검증하기 위한 것.
 * Supabase 연결 시 이 파일은 제거되고 queries.ts가 DB를 조회한다.
 */
export const MOCK_ENTRIES: Entry[] = [
  {
    slug: "how-i-built-this",
    type: "post",
    title: "이 블로그는 어떻게 만들었나",
    excerpt: "설화가 사는 이 공간을 Next.js와 Supabase로 짓기까지의 기록.",
    date: "2026-06-10",
    tags: ["Next.js", "회고"],
    featured: true,
    coverImage: "/covers/build.svg",
    body: "<p>처음엔 다른 블로그 플랫폼을 쓸까 했다. 하지만 글 하나 올리는 데 마찰이 크면, 결국 손이 안 가게 된다는 걸 알고 있었다.</p><h2>기록과 이야기, 두 흐름</h2><p>매일 쓰는 <strong>기록</strong>과 가끔 공들이는 <strong>이야기</strong>를 나눴다. 둘이 섞이면 읽는 쪽도 쓰는 쪽도 피곤하니까.</p>",
  },
  {
    slug: "rsc-and-caching",
    type: "post",
    title: "RSC와 캐싱, 한 번에 이해하기",
    excerpt: "서버 컴포넌트가 언제 DB를 때리는지, 방문자 수와 비용이 왜 분리되는지.",
    date: "2026-06-08",
    tags: ["React", "공부"],
    body: '<p>서버 컴포넌트는 기본적으로 캐시된다. 그래서 방문자가 늘어도 매번 DB를 때리지 않는다.</p><img src="/covers/data.svg" alt="RSC 캐싱 흐름" /><p>핵심은 "언제 다시 그리는가"를 우리가 정한다는 점이다.</p>',
  },
  {
    slug: "supabase-cost",
    type: "post",
    title: "Supabase, 돈 얼마나 드나",
    excerpt: "개인 블로그 트래픽에서 무료 한도가 어디까지 버티는지 실제로 계산.",
    date: "2026-06-05",
    tags: ["Supabase"],
    body: "<p>결론부터: 개인 블로그는 사실상 계속 무료다.</p>",
  },
  {
    slug: "2026-06-12",
    type: "journal",
    title: "종일 로고만 그린 날",
    excerpt: "잘 안 풀렸지만, 그래도 한 발 나아갔다.",
    date: "2026-06-12",
    featured: true,
    body: "<p>잘 안 풀렸지만, 그래도 한 발 나아갔다. 내일은 색을 잡아봐야지.</p>",
  },
  {
    slug: "2026-06-11",
    type: "journal",
    title: "오랜만에 일찍 잤다",
    excerpt: "11시에 누웠더니 아침이 개운하다.",
    date: "2026-06-11",
    body: "<p>11시에 누웠더니 아침이 개운하다. 이걸 계속할 수 있을까.</p>",
  },
  {
    slug: "2026-06-10",
    type: "journal",
    title: "커피를 바꿨더니 집중이 잘 된다",
    excerpt: "원두를 산미 있는 걸로. 작업 두 시간이 훅 갔다.",
    date: "2026-06-10",
    body: "<p>원두를 산미 있는 걸로 바꿨다. 작업 두 시간이 훅 갔다.</p>",
  },
];
