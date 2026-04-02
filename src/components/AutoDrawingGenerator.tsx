"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type ChargerPlacement = {
  x: number;
  y: number;
  type: string;
  label: string;
  color: string;
  width: number;
  height: number;
};

type AutoConfig = {
  parkingSlots: number;
  slotWidth: number;
  slotDepth: number;
  chargerType: "3kw" | "6kw" | "rapid_50kw" | "rapid_90kw";
  chargerCount: number;
  layout: "single_row" | "double_row" | "L_shape";
  withCubicle: boolean;
  withSignboard: boolean;
  withBarrier: boolean;
};

const CHARGER_SPECS: Record<string, { label: string; color: string; w: number; h: number }> = {
  "3kw": { label: "3kW", color: "#10b981", w: 20, h: 20 },
  "6kw": { label: "6kW", color: "#3b82f6", w: 30, h: 30 },
  rapid_50kw: { label: "50kW", color: "#ef4444", w: 45, h: 35 },
  rapid_90kw: { label: "90kW", color: "#dc2626", w: 55, h: 40 },
};

export default function AutoDrawingGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<AutoConfig>({
    parkingSlots: 6,
    slotWidth: 60,
    slotDepth: 120,
    chargerType: "6kw",
    chargerCount: 3,
    layout: "single_row",
    withCubicle: false,
    withSignboard: true,
    withBarrier: true,
  });
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, W, H);

    const spec = CHARGER_SPECS[config.chargerType];
    const marginX = 40;
    const marginY = 60;
    const slotW = config.slotWidth;
    const slotD = config.slotDepth;

    // Title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EV充電器 配置図（自動生成）", W / 2, 25);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`${config.parkingSlots}台分駐車場 / ${spec.label}充電器 ${config.chargerCount}台`, W / 2, 42);

    // Draw parking slots
    const placements: ChargerPlacement[] = [];
    let chargerIdx = 0;

    if (config.layout === "single_row") {
      for (let i = 0; i < config.parkingSlots; i++) {
        const x = marginX + i * (slotW + 4);
        const y = marginY + 40;

        // Parking slot
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(x, y, slotW, slotD);
        ctx.setLineDash([]);

        // Slot number
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`P${i + 1}`, x + slotW / 2, y + slotD / 2);

        // Charger placement (every N slots)
        const interval = Math.max(1, Math.floor(config.parkingSlots / config.chargerCount));
        if (chargerIdx < config.chargerCount && i % interval === 0) {
          placements.push({
            x: x + slotW / 2 - spec.w / 2,
            y: y - spec.h - 8,
            type: config.chargerType,
            label: `${spec.label} #${chargerIdx + 1}`,
            color: spec.color,
            width: spec.w,
            height: spec.h,
          });
          chargerIdx++;
        }

        // Barrier
        if (config.withBarrier) {
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(x + 5, y + slotD - 8, slotW - 10, 5);
        }
      }
    } else if (config.layout === "double_row") {
      const halfSlots = Math.ceil(config.parkingSlots / 2);
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < halfSlots && (row * halfSlots + i) < config.parkingSlots; i++) {
          const x = marginX + i * (slotW + 4);
          const y = marginY + 40 + row * (slotD + 30);

          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(x, y, slotW, slotD);
          ctx.setLineDash([]);

          ctx.fillStyle = "#94a3b8";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`P${row * halfSlots + i + 1}`, x + slotW / 2, y + slotD / 2);

          if (row === 0 && chargerIdx < config.chargerCount) {
            const interval = Math.max(1, Math.floor(halfSlots / config.chargerCount));
            if (i % interval === 0) {
              placements.push({
                x: x + slotW / 2 - spec.w / 2,
                y: y - spec.h - 8,
                type: config.chargerType,
                label: `${spec.label} #${chargerIdx + 1}`,
                color: spec.color,
                width: spec.w,
                height: spec.h,
              });
              chargerIdx++;
            }
          }
        }
      }
    } else {
      // L-shape
      const mainSlots = Math.ceil(config.parkingSlots * 0.6);
      const sideSlots = config.parkingSlots - mainSlots;

      for (let i = 0; i < mainSlots; i++) {
        const x = marginX + i * (slotW + 4);
        const y = marginY + 40;
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(x, y, slotW, slotD);
        ctx.setLineDash([]);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`P${i + 1}`, x + slotW / 2, y + slotD / 2);

        if (chargerIdx < config.chargerCount && i < config.chargerCount) {
          placements.push({
            x: x + slotW / 2 - spec.w / 2,
            y: y - spec.h - 8,
            type: config.chargerType,
            label: `${spec.label} #${chargerIdx + 1}`,
            color: spec.color,
            width: spec.w,
            height: spec.h,
          });
          chargerIdx++;
        }
      }

      for (let i = 0; i < sideSlots; i++) {
        const x = marginX + mainSlots * (slotW + 4) + 10;
        const y = marginY + 40 + i * (slotW + 4);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(x, y, slotD, slotW);
        ctx.setLineDash([]);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`P${mainSlots + i + 1}`, x + slotD / 2, y + slotW / 2);
      }
    }

    // Draw chargers
    placements.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x, p.y, p.width, p.height);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.label, p.x + p.width / 2, p.y + p.height / 2 + 3);
    });

    // Cable routing
    if (placements.length > 1) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      placements.forEach((p, i) => {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Cubicle
    if (config.withCubicle) {
      const cubX = W - 120;
      const cubY = marginY + 40;
      ctx.fillStyle = "#6366f1";
      ctx.globalAlpha = 0.85;
      ctx.fillRect(cubX, cubY, 70, 50);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2;
      ctx.strokeRect(cubX, cubY, 70, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("キュービクル", cubX + 35, cubY + 28);

      // Cable from cubicle
      if (placements.length > 0) {
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(cubX, cubY + 25);
        ctx.lineTo(placements[0].x + placements[0].width, placements[0].y + placements[0].height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Signboard
    if (config.withSignboard) {
      const sigX = marginX;
      const sigY = H - 50;
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(sigX, sigY, 60, 20);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EV案内板", sigX + 30, sigY + 13);
    }

    // Legend
    const legY = H - 30;
    ctx.fillStyle = "#64748b";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    const legends = [
      { color: spec.color, label: `${spec.label}充電器` },
      { color: "#cbd5e1", label: "駐車区画" },
      { color: "#f59e0b", label: "配線経路" },
    ];
    if (config.withCubicle) legends.push({ color: "#6366f1", label: "キュービクル" });

    legends.forEach((l, i) => {
      const lx = marginX + i * 130;
      ctx.fillStyle = l.color;
      ctx.fillRect(lx, legY, 12, 12);
      ctx.fillStyle = "#64748b";
      ctx.fillText(l.label, lx + 16, legY + 10);
    });

    setGenerated(true);
  }, [config]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "ev_layout.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">自動配置設定</h3>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">駐車台数</label>
            <input type="number" min={2} max={20} value={config.parkingSlots}
              onChange={(e) => setConfig((c) => ({ ...c, parkingSlots: Number(e.target.value) }))}
              className="w-full px-2 py-1.5 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">充電器種別</label>
            <select value={config.chargerType}
              onChange={(e) => setConfig((c) => ({ ...c, chargerType: e.target.value as AutoConfig["chargerType"] }))}
              className="w-full px-2 py-1.5 border rounded text-sm">
              <option value="3kw">3kW</option>
              <option value="6kw">6kW</option>
              <option value="rapid_50kw">50kW急速</option>
              <option value="rapid_90kw">90kW急速</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">充電器台数</label>
            <input type="number" min={1} max={10} value={config.chargerCount}
              onChange={(e) => setConfig((c) => ({ ...c, chargerCount: Number(e.target.value) }))}
              className="w-full px-2 py-1.5 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">レイアウト</label>
            <select value={config.layout}
              onChange={(e) => setConfig((c) => ({ ...c, layout: e.target.value as AutoConfig["layout"] }))}
              className="w-full px-2 py-1.5 border rounded text-sm">
              <option value="single_row">一列配置</option>
              <option value="double_row">二列配置</option>
              <option value="L_shape">L字配置</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.withCubicle}
              onChange={(e) => setConfig((c) => ({ ...c, withCubicle: e.target.checked }))}
              className="rounded border-gray-300 text-emerald-600" />
            キュービクル
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.withSignboard}
              onChange={(e) => setConfig((c) => ({ ...c, withSignboard: e.target.checked }))}
              className="rounded border-gray-300 text-emerald-600" />
            案内板
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={config.withBarrier}
              onChange={(e) => setConfig((c) => ({ ...c, withBarrier: e.target.checked }))}
              className="rounded border-gray-300 text-emerald-600" />
            車止め
          </label>
          <div className="flex-1" />
          <button onClick={generate} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
            図面を自動生成
          </button>
          {generated && (
            <button onClick={downloadPNG} className="px-4 py-2 bg-white border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">
              PNG保存
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <canvas ref={canvasRef} width={900} height={500} className="w-full bg-white" />
      </div>
    </div>
  );
}
