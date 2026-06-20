"use client";

import { useEffect, useRef } from "react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { uploadPostImage } from "../upload";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./editor.css";

/**
 * Milkdown(Crepe) WYSIWYG-마크다운 에디터(ADR-0015). 노션식 작성 + 마크다운 단축키.
 * 어드민 전용 클라이언트. 변경 시 마크다운 문자열을 onChange로 올린다(폼 hidden input에 반영).
 * 무거운 에디터라 PostForm에서 ssr:false 동적 로드한다.
 */
function MarkdownEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (markdown: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const crepe = new Crepe({
      root,
      defaultValue,
      featureConfigs: {
        [CrepeFeature.Placeholder]: { text: "내용을 입력하세요…", mode: "doc" },
        // 슬래시(/) 메뉴 라벨 한글화 — 아이콘은 기본 유지(DeepPartial)
        [CrepeFeature.BlockEdit]: {
          textGroup: {
            label: "기본",
            text: { label: "텍스트" },
            h1: { label: "제목 1" },
            h2: { label: "제목 2" },
            h3: { label: "제목 3" },
            h4: { label: "제목 4" },
            h5: { label: "제목 5" },
            h6: { label: "제목 6" },
            quote: { label: "인용" },
            divider: { label: "구분선" },
          },
          listGroup: {
            label: "목록",
            bulletList: { label: "글머리 목록" },
            orderedList: { label: "번호 목록" },
            taskList: { label: "체크리스트" },
          },
          advancedGroup: {
            label: "고급",
            image: { label: "이미지" },
            codeBlock: { label: "코드 블록" },
            table: { label: "표" },
            math: { label: "수식" },
          },
        },
        // 이미지: 드래그드랍·붙여넣기·/이미지 → Storage 업로드 후 공개 URL(onUpload 하나로 block·inline 모두 커버)
        [CrepeFeature.ImageBlock]: {
          onUpload: uploadPostImage,
          inlineUploadPlaceholderText: "이미지 주소를 붙여넣거나 파일 업로드",
          blockUploadPlaceholderText: "이미지 주소를 붙여넣거나 파일 업로드",
          blockCaptionPlaceholderText: "이미지 설명(선택)",
        },
      },
    });
    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => onChangeRef.current(markdown));
    });
    crepe.create();

    return () => {
      crepe.destroy();
    };
    // 에디터는 한 번만 생성(defaultValue는 초기값). onChange는 ref로 최신 유지.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={rootRef} className="min-h-[55vh]" />;
}

export default MarkdownEditor;
