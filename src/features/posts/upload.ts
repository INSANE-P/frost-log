import { createClient } from "@/lib/supabase/client";
import { requestImageSize } from "./imageSizeController";

const BUCKET = "post-images";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB(원본 상한)
const MAX_WIDTH = 1600; // 업로드 최대 너비(자동·상한)

/**
 * 이미지를 지정 너비(maxWidth)로 줄여 재인코딩한다. 원본이 더 작으면 그대로 둔다.
 * gif(애니메이션)·svg(벡터)는 캔버스로 처리하면 망가지니 원본을 유지. 문제 시 원본 폴백.
 */
async function resizeToWidth(file: File, maxWidth: number): Promise<Blob> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    if (bitmap.width <= maxWidth) {
      bitmap.close();
      return file;
    }
    const scale = maxWidth / bitmap.width;
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
 * 올리기 전 크기 선택 모달로 너비를 정해 그 크기로 줄인다(ADR-0019). 취소하면 업로드 안 함.
 * gif·svg는 크기 조절 없이 원본 그대로. Crepe onUpload로 연결.
 */
export async function uploadPostImage(file: File): Promise<string> {
  // 비이미지·초대용량은 애초에 막는다(깨진 그림·용량 낭비 방지)
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 올릴 수 있어요");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("이미지는 10MB까지 올릴 수 있어요");
  }

  const resizable = file.type !== "image/gif" && file.type !== "image/svg+xml";
  let blob: Blob = file;
  if (resizable) {
    const choice = await requestImageSize(file);
    // 취소: throw하면 Milkdown이 "업로드 중" placeholder를 못 치워 stuck됨.
    // 대신 빈 src를 돌려줘 빈 이미지 블록만 남기고(지우면 됨) 업로드는 하지 않는다.
    if (choice === "cancel") return "";
    const targetWidth = choice === "auto" ? MAX_WIDTH : choice;
    blob = await resizeToWidth(file, targetWidth);
  }

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
