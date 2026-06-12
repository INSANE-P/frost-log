import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 홈 디렉터리의 다른 lockfile 때문에 워크스페이스 루트가 잘못 추론되는 것 방지
  outputFileTracingRoot: __dirname,
  images: {
    // Supabase Storage 등 외부 이미지 호스트는 여기에 추가
    remotePatterns: [],
  },
};

export default nextConfig;
