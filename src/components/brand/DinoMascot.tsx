import type { CSSProperties } from "react";

/** 설화(불꽃)를 안고 앉은 공룡 마스코트. 손으로 그린 원본 이미지를 그대로 띄운다. */
export function DinoMascot({
  size = 256,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={{ width: size, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dino-hug.png"
        alt="설화를 안고 있는 공룡 캐릭터"
        className="block w-full"
        style={{ height: "auto" }}
      />
    </div>
  );
}
