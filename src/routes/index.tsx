import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import "@fontsource/m-plus-rounded-1c/700.css";
import { Diorama } from "@/components/diorama/Diorama";

export const Route = createFileRoute("/")({ component: Home });

const GLYPHS =
  "ルナマート24時間営業中新発売おにぎりおでん弁当ドリンクコーヒーようこそ雨横丁月見通り郵便燃えるかんペット一方通行入口ホットお菓子夏祭求人夜市セール駐車雨の街角店温かい飲み物雑誌パンアイス清掃ピアノ教室あできたて期間限定金曜本日";

function Home() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  return (
    <main className="night-stage">
      <span className="glyph-preload">{GLYPHS}</span>
      {on ? <Diorama /> : null}
    </main>
  );
}
