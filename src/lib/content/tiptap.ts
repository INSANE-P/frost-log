// Tiptap 문서 JSON → .prose가 그대로 표시하는 가벼운 HTML.
// 텍스트는 항상 escape하므로 본문 렌더에서 XSS가 생기지 않는다.

type Node = {
  type?: string;
  text?: string;
  content?: Node[];
  marks?: { type: string }[];
  attrs?: Record<string, unknown>;
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(nodes: Node[] = []): string {
  return nodes
    .map((n) => {
      if (n.type !== "text") return "";
      let t = esc(n.text ?? "");
      for (const m of n.marks ?? []) {
        if (m.type === "bold") t = `<strong>${t}</strong>`;
        else if (m.type === "italic") t = `<em>${t}</em>`;
        else if (m.type === "code") t = `<code>${t}</code>`;
      }
      return t;
    })
    .join("");
}

export function renderTiptap(doc: unknown): string {
  const root = doc as Node;
  if (!root?.content) return "";
  return root.content
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${inline(block.content)}</p>`;
        case "heading": {
          const level = Number(block.attrs?.level) || 2;
          return `<h${level}>${inline(block.content)}</h${level}>`;
        }
        case "blockquote":
          return `<blockquote>${(block.content ?? [])
            .map((c) => `<p>${inline(c.content)}</p>`)
            .join("")}</blockquote>`;
        case "image":
          return `<img src="${esc(String(block.attrs?.src ?? ""))}" alt="${esc(
            String(block.attrs?.alt ?? ""),
          )}" />`;
        default:
          return "";
      }
    })
    .join("");
}
