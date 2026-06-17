import Link from "next/link";
import { Mail } from "lucide-react";
import { FlameLogo } from "@/components/brand/FlameLogo";
import { GithubIcon } from "@/components/ui/GithubIcon";

const SOCIAL: { label: string; href: string; Icon: React.ComponentType<{ className?: string }> }[] =
  [
    { label: "GitHub", href: "https://github.com/INSANE-P", Icon: GithubIcon },
    { label: "메일", href: "mailto:chanbin0626@gmail.com", Icon: Mail },
  ];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-12">
        {/* 둘러보기는 sticky 헤더가 대신하므로, 푸터는 브랜드(좌) + 소셜(우)만 */}
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[280px]">
            <Link href="/" className="flex items-center gap-2">
              <FlameLogo size={24} animated={false} name="footer" className="-translate-y-[2px]" />
              <span className="font-title text-base font-bold text-foreground">설화</span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              눈과 불 사이, 한 줄씩 쌓아가요.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex size-9 items-center justify-center rounded-full border border-hairline text-muted transition hover:border-accent hover:text-accent"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6 text-xs text-muted">© 설화 · 박찬빈</div>
      </div>
    </footer>
  );
}
