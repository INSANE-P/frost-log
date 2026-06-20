import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/**
 * 마크다운 본문 렌더 — GFM(표·체크박스·자동링크) + 코드 하이라이트 + 수식(KaTeX).
 * react-markdown은 기본적으로 원시 HTML을 렌더하지 않아 XSS에 안전하다(rehype-raw 미사용).
 * 에디터(Crepe)가 내는 줄바꿈·수식을 그대로 받기 위한 호환 처리(ADR-0018).
 * 출력 요소(h2·ul·code·pre 등)는 .prose가 스타일링한다.
 */
export function Markdown({ children }: { children: string }) {
  // Crepe는 하드 줄바꿈을 <br />(HTML)로 저장한다. 원시 HTML은 렌더하지 않으므로(XSS 안전),
  // <br>만 마크다운 하드 브레이크(공백 2 + 줄바꿈)로 바꿔 줄바꿈만 안전하게 살린다.
  const normalized = children.replace(/<br\s*\/?>\n?/gi, "  \n");
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {normalized}
    </ReactMarkdown>
  );
}
