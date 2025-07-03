"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook để theo dõi một media query CSS.
 * @param query - Chuỗi media query (ví dụ: '(max-width: 767px)')
 * @returns `true` nếu query khớp, ngược lại là `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Kiểm tra ngay khi component mount để có giá trị ban đầu
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    // Lắng nghe sự thay đổi kích thước cửa sổ
    // Sử dụng addEventListener/removeEventListener thay vì addListener/removeListener đã cũ
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}