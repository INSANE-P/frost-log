import { DinoMascot } from "./DinoMascot";
import { DinoSpeech } from "./DinoSpeech";

/** 히어로 장면 — 공룡이 설화를 안고, 머리 위 말풍선으로 인사한다. z: 글로우 < 공룡 < 말풍선. */
export function DinoScene({ size = 200, className }: { size?: number; className?: string }) {
  const glow = Math.round(size * 1.3);
  return (
    <div className={`relative ${className ?? ""}`} style={{ width: size }}>
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: glow,
          height: glow,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 62%)",
        }}
      />
      {/* 코믹 말풍선 — 공룡 머리 위 가운데, 꼬리가 머리를 향함 */}
      <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
        <div className="comic-bubble whitespace-nowrap px-4 py-2.5 text-[15px] font-bold">
          <DinoSpeech />
        </div>
      </div>
      <DinoMascot size={size} className="dino-grounded relative z-10 mx-auto" />
    </div>
  );
}
