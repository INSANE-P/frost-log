"use client";

import { useEffect, useState } from "react";

// 타이핑하듯 한 줄씩 건네는 자기소개. 각 줄은 [텍스트, 강조여부] 세그먼트로, 강조는 accent 색.
const LINES: [string, boolean?][][] = [
  [["안녕하세요, "], ["박찬빈", true], ["이에요."]],
  [["재밌어 보이는", true], [" 걸 만들어요."]],
  [["생각이 "], ["향하는 대로", true], [" 움직여요."]],
  [["여행", true], ["하고 "], ["대화", true], ["하는 걸 좋아해요."]],
  [["여기엔 "], ["떠오른 생각", true], ["을 적어요."]],
  [["요즘은 "], ["기획", true], ["에 빠져 있어요."]],
];

export function DinoSpeech() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0); // 현재까지 친 글자 수
  const [deleting, setDeleting] = useState(false);

  const line = LINES[i];
  const fullLen = line.reduce((a, [t]) => a + t.length, 0);

  useEffect(() => {
    let timer: number;
    if (!deleting) {
      if (n < fullLen) timer = window.setTimeout(() => setN(n + 1), 65);
      else timer = window.setTimeout(() => setDeleting(true), 1700);
    } else if (n > 0) {
      timer = window.setTimeout(() => setN(n - 1), 30);
    } else {
      setDeleting(false);
      setI((p) => (p + 1) % LINES.length);
    }
    return () => clearTimeout(timer);
  }, [n, deleting, fullLen, i]);

  const nodes: React.ReactNode[] = [];
  let count = 0;
  for (let k = 0; k < line.length && count < n; k++) {
    const [t, hl] = line[k];
    const vis = t.slice(0, Math.min(t.length, n - count));
    nodes.push(
      hl ? (
        <span key={k} className="font-bold text-accent">
          {vis}
        </span>
      ) : (
        <span key={k}>{vis}</span>
      ),
    );
    count += t.length;
  }

  return (
    <span className="whitespace-nowrap">
      {nodes}
      <span
        aria-hidden
        className="type-caret ml-0.5 inline-block h-[0.95em] w-0.5 translate-y-[2px] bg-accent align-middle"
      />
    </span>
  );
}
