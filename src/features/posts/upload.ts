import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB(원본 상한)
const MAX_EDGE = 1600; // 긴 변 최대 px — 본문폭(~728)의 레티나 2배+여유. 더 커도 화면에선 차이 없음

/**
 * 너무 큰 이미지는 긴 변 기준 MAX_EDGE로 줄여 재인코딩한다(용량·로딩 최적화).
 * gif(애니메이션)·svg(벡터)는 캔버스로 처리하면 망가지니 원본을 그대로 쓴다.
 * 디코드 실패 등 어떤 문제든 원본으로 폴백한다.
 */
async function downscale(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const longer = Math.max(bitmap.width, bitmap.height);
    if (longer <= MAX_EDGE) {
      bitmap.close();
      return file;
    }
    const scale = MAX_EDGE / longer;
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    // png는 무손실 유지(투명 보존), 그 외는 jpeg로 압축
    const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, outType, 0.82));
    return blob ?? file;
  } catch {
    return file;
  }
}

const extFor = (type: string) =>
  type === "image/png"
    ? "png"
    : type === "image/webp"
      ? "webp"
      : type === "image/gif"
        ? "gif"
        : type === "image/svg+xml"
          ? "svg"
          : "jpg";

/**
 * 에디터에서 떨군/붙여넣은 이미지를 Storage(post-images)에 올리고 공개 URL을 돌려준다.
 * 업로드는 어드민(인증 세션)만 — Storage 정책으로 막혀 있다(0005_storage.sql). 읽기는 공개.
 * 큰 이미지는 올리기 전에 자동으로 줄인다(downscale). Crepe onUpload로 연결.
 */
export async function uploadPostImage(file: File): Promise<string> {
  // 비이미지·초대용량은 애초에 막는다(깨진 그림·용량 낭비 방지)
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 올릴 수 있어요");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("이미지는 10MB까지 올릴 수 있어요");
  }

  const blob = await downscale(file);
  const supabase = createClient();
  const outType = blob.type || file.type;
  const path = `${crypto.randomUUID()}.${extFor(outType)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    upsert: false,
    contentType: outType,
  });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
