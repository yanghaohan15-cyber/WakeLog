import { createContext, useContext, type ReactNode } from "react";
import * as THREE from "three";

const FONT = "'M PLUS Rounded 1c', sans-serif";

function canvasTex(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function center(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
) {
  const r = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function vendFace(title: string, header: string) {
  return canvasTex(512, 896, (ctx, w, h) => {
    ctx.fillStyle = "#121722";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = header;
    ctx.fillRect(0, 0, w, 108);
    center(ctx, title, w / 2, 56, 54, "#fffaf2");
    const colors = [
      "#e23d3d",
      "#f2c14e",
      "#3aa0e8",
      "#7bc96f",
      "#ff8fab",
      "#f7f4ee",
      "#6b4c9a",
      "#f08a3e",
      "#2a9d8f",
      "#e9c46a",
      "#4c6cb3",
      "#f4a261",
      "#84dcc6",
      "#e76f51",
      "#bde0fe",
    ];
    const cols = 3;
    const rows = 5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const bw = (w - 48) / cols;
        const bh = (h - 160) / rows;
        const x = 24 + col * bw;
        const y = 132 + row * bh;
        ctx.fillStyle = colors[(row * cols + col) % colors.length]!;
        roundRect(ctx, x, y, bw - 12, bh - 14, 14);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        roundRect(ctx, x + 10, y + 10, 18, bh - 36, 8);
        ctx.fill();
      }
    }
  });
}

let sidewalk: THREE.CanvasTexture | null = null;

export function sidewalkTexture() {
  if (sidewalk) return sidewalk;
  sidewalk = canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = "#c4bfb4";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const shade = (x + y) % 2 === 0 ? "#cfc9bc" : "#b7b1a6";
        ctx.fillStyle = shade;
        ctx.fillRect(x * 64 + 3, y * 64 + 3, 58, 58);
      }
    }
  });
  sidewalk.wrapS = THREE.RepeatWrapping;
  sidewalk.wrapT = THREE.RepeatWrapping;
  return sidewalk;
}

export type KitTextures = ReturnType<typeof createTextures>;

export function createTextures() {
  const fascia = canvasTex(1024, 280, (ctx, w, h) => {
    ctx.fillStyle = "#243056";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#7ee0ff";
    ctx.fillRect(0, 0, w, 14);
    ctx.fillStyle = "#ff6b8a";
    ctx.fillRect(0, h - 36, w, 36);
    ctx.fillStyle = "#ffe29a";
    ctx.beginPath();
    ctx.arc(150, 128, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#243056";
    ctx.beginPath();
    ctx.arc(176, 114, 50, 0, Math.PI * 2);
    ctx.fill();
    center(ctx, "ルナマート", 620, 112, 112, "#fff8ea");
    center(ctx, "24時間", 620, 196, 40, "#ffe29a");
  });

  const blade = canvasTex(280, 640, (ctx, w, h) => {
    ctx.fillStyle = "#243056";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ff6b8a";
    ctx.fillRect(0, 0, 18, h);
    ctx.fillStyle = "#ffe29a";
    ctx.beginPath();
    ctx.arc(w / 2 + 8, 92, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#243056";
    ctx.beginPath();
    ctx.arc(w / 2 + 26, 82, 32, 0, Math.PI * 2);
    ctx.fill();
    center(ctx, "ル", w / 2 + 8, 230, 92, "#fff8ea");
    center(ctx, "ナ", w / 2 + 8, 340, 92, "#fff8ea");
    center(ctx, "マート", w / 2 + 8, 500, 48, "#ffe29a");
  });

  const open = canvasTex(420, 180, (ctx, w, h) => {
    ctx.fillStyle = "#143c32";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#b8ffcf";
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    center(ctx, "営業中", w / 2, h / 2, 72, "#d8ffe6");
  });

  const poster = (bg: string, fg: string, a: string, b: string) =>
    canvasTex(420, 560, (ctx, w, h) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(0, 0, w, 16);
      center(ctx, a, w / 2, h * 0.4, 78, fg);
      center(ctx, b, w / 2, h * 0.62, 42, fg);
    });

  const mat = canvasTex(512, 256, (ctx, w, h) => {
    ctx.fillStyle = "#1e3a34";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#c9a36a";
    ctx.fillRect(0, 0, w, 18);
    ctx.fillRect(0, h - 18, w, 18);
    center(ctx, "ようこそ", w / 2, h / 2, 72, "#f6edd8");
  });

  const street = (name: string) =>
    canvasTex(640, 200, (ctx, w, h) => {
      ctx.fillStyle = "#1d4e89";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      center(ctx, name, w / 2, h / 2, 64, "#ffffff");
    });

  const bulletin = canvasTex(640, 800, (ctx, w, h) => {
    ctx.fillStyle = "#6b4a32";
    ctx.fillRect(0, 0, w, h);
    const cells = [
      ["#f2c14e", "#2a241c", "夏祭", "金曜"],
      ["#ff8fab", "#3a2030", "夜市", "雨の日"],
      ["#7ec8e3", "#163040", "ピアノ", "教室"],
      ["#b7e4c7", "#1c3328", "セール", "本日"],
    ] as const;
    cells.forEach((cell, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 28 + col * 300;
      const y = 28 + row * 380;
      ctx.fillStyle = cell[0];
      ctx.fillRect(x, y, 276, 348);
      center(ctx, cell[2], x + 138, y + 140, 64, cell[1]);
      center(ctx, cell[3], x + 138, y + 220, 36, cell[1]);
    });
  });

  const plaque = canvasTex(640, 200, (ctx, w, h) => {
    ctx.fillStyle = "#e6c98a";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#6a5030";
    ctx.fillRect(16, 16, w - 32, h - 32);
    center(ctx, "雨の街角", w / 2, h / 2 - 8, 68, "#f8e7c0");
    center(ctx, "ルナマート", w / 2, h / 2 + 52, 26, "#e6c98a");
  });

  const parking = canvasTex(256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, w, h);
    center(ctx, "駐", w / 2, h / 2, 140, "#f4f7fb");
  });

  const label = (text: string, bg: string, fg: string) =>
    canvasTex(256, 128, (ctx, w, h) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      center(ctx, text, w / 2, h / 2, 54, fg);
    });

  const oneway = canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#1d4e89";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(70, 128);
    ctx.lineTo(150, 78);
    ctx.lineTo(150, 108);
    ctx.lineTo(196, 108);
    ctx.lineTo(196, 148);
    ctx.lineTo(150, 148);
    ctx.lineTo(150, 178);
    ctx.closePath();
    ctx.fill();
  });

  const tactile = canvasTex(256, 128, (ctx, w, h) => {
    ctx.fillStyle = "#e2b423";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#c49212";
    for (let y = 16; y < h; y += 28) {
      for (let x = 16; x < w; x += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  tactile.wrapS = THREE.RepeatWrapping;
  tactile.wrapT = THREE.RepeatWrapping;

  return {
    fascia,
    blade,
    open,
    posterNew: poster("#ff6b8a", "#fff6f8", "新発売", "期間限定"),
    posterRice: poster("#fff3d6", "#5a3b22", "おにぎり", "できたて"),
    posterOden: poster("#f08a3e", "#fff4e8", "おでん", "あつあつ"),
    mat,
    streetA: street("雨横丁"),
    streetB: street("月見通り"),
    bulletin,
    vendDrink: vendFace("ドリンク", "#e23b4a"),
    vendCafe: vendFace("カフェ", "#2458c9"),
    plaque,
    parking,
    burn: label("燃える", "#d7ddd4", "#2c3330"),
    can: label("かん", "#3d7ea6", "#f3fbff"),
    aisleBento: label("弁当", "#e23d3d", "#fff6f2"),
    aisleDrink: label("ドリンク", "#3aa0e8", "#f4fbff"),
    aisleSnack: label("お菓子", "#f2c14e", "#2d2618"),
    oneway,
    tactile,
  };
}

const TexCtx = createContext<KitTextures | null>(null);

export function TexProvider({ value, children }: { value: KitTextures; children: ReactNode }) {
  return <TexCtx.Provider value={value}>{children}</TexCtx.Provider>;
}

export function useTex() {
  const value = useContext(TexCtx);
  if (!value) throw new Error("textures missing");
  return value;
}
