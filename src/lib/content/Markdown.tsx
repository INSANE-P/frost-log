import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * 마크다운 본문 렌더 — GFM(표·체크박스·자동링크) + 코드 하이라이트.
 * react-markdown은 기본적으로 원시 HTML을 렌더하지 않아 XSS에 안전하다.
 * 출력 요소(h2·ul·code·pre 등)는 .prose가 스타일링한다.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
      {children}
    </ReactMarkdown>
  );
}
