import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const KEY = "il_scroll_positions";

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writePosition(path: string, y: number) {
  const positions = readPositions();
  positions[path] = y;
  sessionStorage.setItem(KEY, JSON.stringify(positions));
}

export default function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const saved = readPositions()[pathname] ?? 0;
    requestAnimationFrame(() => window.scrollTo(0, saved));

    return () => {
      writePosition(pathname, window.scrollY);
    };
  }, [pathname]);

  return null;
}
