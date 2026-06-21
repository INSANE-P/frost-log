/**
 * 에디터의 onUpload(명령형 함수)과 React 크기 선택 모달을 잇는 작은 브리지.
 * 모달(ImageSizeDialog)이 opener를 등록하고, 업로드 시 requestImageSize로 연다.
 * 반환: 선택한 너비(px) | "auto"(모달 없음/디코드 실패 → 기본 동작) | "cancel"(취소).
 */
export type SizeChoice = number | "auto" | "cancel";

type Opener = (file: File) => Promise<SizeChoice>;

let opener: Opener | null = null;

export function registerImageSizePicker(fn: Opener): () => void {
  opener = fn;
  return () => {
    if (opener === fn) opener = null;
  };
}

export function requestImageSize(file: File): Promise<SizeChoice> {
  return opener ? opener(file) : Promise.resolve("auto");
}
