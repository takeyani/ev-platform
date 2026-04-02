"use client";

import { useRef, useEffect, useState } from "react";

type CrossSectionType = "3kw" | "6kw_nitto" | "6kw_kawamura" | "rapid_qb";

const SECTIONS: Record<CrossSectionType, { title: string; layers: { label: string; height: number; color: string; pattern?: string }[]; totalDepth: number; chargerHeight: number; chargerWidth: number }> = {
  "3kw": {
    title: "3kWコンセント 基礎断面図",
    totalDepth: 400,
    chargerHeight: 120,
    chargerWidth: 60,
    layers: [
      { label: "GL（地表面）", height: 0, color: "#8B7355" },
      { label: "砕石 t=100", height: 100, color: "#A0A0A0", pattern: "dots" },
      { label: "コンクリート t=150", height: 150, color: "#C0C0C0" },
      { label: "根入れ t=150", height: 150, color: "#8B7355", pattern: "hatch" },
    ],
  },
  "6kw_nitto": {
    title: "6kW普通充電器（日東工業）基礎断面図",
    totalDepth: 500,
    chargerHeight: 160,
    chargerWidth: 80,
    layers: [
      { label: "GL（地表面）", height: 0, color: "#8B7355" },
      { label: "砕石 t=100", height: 100, color: "#A0A0A0", pattern: "dots" },
      { label: "コンクリート t=200", height: 200, color: "#C0C0C0" },
      { label: "根入れ t=200", height: 200, color: "#8B7355", pattern: "hatch" },
    ],
  },
  "6kw_kawamura": {
    title: "6kW普通充電器（河村電器）基礎断面図",
    totalDepth: 500,
    chargerHeight: 150,
    chargerWidth: 75,
    layers: [
      { label: "GL（地表面）", height: 0, color: "#8B7355" },
      { label: "砕石 t=100", height: 100, color: "#A0A0A0", pattern: "dots" },
      { label: "コンクリート t=200", height: 200, color: "#C0C0C0" },
      { label: "根入れ t=200", height: 200, color: "#8B7355", pattern: "hatch" },
    ],
  },
  rapid_qb: {
    title: "急速充電器 QB基礎断面図",
    totalDepth: 700,
    chargerHeight: 200,
    chargerWidth: 120,
    layers: [
      { label: "GL（地表面）", height: 0, color: "#8B7355" },
      { label: "砕石 t=150", height: 150, color: "#A0A0A0", pattern: "dots" },
      { label: "鉄筋コンクリート t=300", height: 300, color: "#B0B0B0" },
      { label: "根入れ t=250", height: 250, color: "#8B7355", pattern: "hatch" },
    ],
  },
};

export default function CrossSectionViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sectionType, setSectionType] = useState<CrossSectionType>("6kw_nitto");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const section = SECTIONS[sectionType];
    const W = canvas.width;
    const H = canvas.height;
    const scale = 0.4;
    const baseY = 200;
    const centerX = W / 2;

    ctx.clearRect(0, 0, W, H);

    // Title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(section.title, centerX, 30);

    // Ground line
    ctx.strokeStyle = "#8B7355";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, baseY);
    ctx.lineTo(W - 50, baseY);
    ctx.stroke();

    // GL label
    ctx.fillStyle = "#8B7355";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("GL ±0", W - 45, baseY + 4);

    // Foundation layers
    let currentY = baseY;
    const foundationWidth = section.chargerWidth * scale * 3;

    section.layers.forEach((layer) => {
      if (layer.height === 0) return;
      const layerH = layer.height * scale;

      ctx.fillStyle = layer.color;
      ctx.fillRect(centerX - foundationWidth / 2, currentY, foundationWidth, layerH);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - foundationWidth / 2, currentY, foundationWidth, layerH);

      // Pattern
      if (layer.pattern === "dots") {
        ctx.fillStyle = "#888";
        for (let dx = 5; dx < foundationWidth; dx += 10) {
          for (let dy = 5; dy < layerH; dy += 10) {
            ctx.beginPath();
            ctx.arc(centerX - foundationWidth / 2 + dx, currentY + dy, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (layer.pattern === "hatch") {
        ctx.strokeStyle = "#9B8765";
        ctx.lineWidth = 0.5;
        for (let d = -foundationWidth; d < foundationWidth + layerH; d += 8) {
          ctx.beginPath();
          ctx.moveTo(centerX - foundationWidth / 2 + d, currentY);
          ctx.lineTo(centerX - foundationWidth / 2 + d - layerH, currentY + layerH);
          ctx.stroke();
        }
      }

      // Dimension
      ctx.fillStyle = "#333";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(layer.label, centerX + foundationWidth / 2 + 10, currentY + layerH / 2 + 4);

      // Dimension line
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 0.5;
      const dimX = centerX - foundationWidth / 2 - 25;
      ctx.beginPath();
      ctx.moveTo(dimX, currentY);
      ctx.lineTo(dimX, currentY + layerH);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dimX - 3, currentY); ctx.lineTo(dimX + 3, currentY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dimX - 3, currentY + layerH); ctx.lineTo(dimX + 3, currentY + layerH); ctx.stroke();
      ctx.fillStyle = "#666";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${layer.height}mm`, dimX - 5, currentY + layerH / 2 + 3);

      currentY += layerH;
    });

    // Charger body (above ground)
    const chargerW = section.chargerWidth * scale;
    const chargerH = section.chargerHeight * scale;
    ctx.fillStyle = "#059669";
    ctx.fillRect(centerX - chargerW / 2, baseY - chargerH, chargerW, chargerH);
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - chargerW / 2, baseY - chargerH, chargerW, chargerH);

    // Charger label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("充電器", centerX, baseY - chargerH / 2 + 4);

    // Conduit
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, baseY);
    ctx.lineTo(centerX, currentY - 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "9px sans-serif";
    ctx.fillText("配管", centerX + 15, (baseY + currentY) / 2);

  }, [sectionType]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(Object.keys(SECTIONS) as CrossSectionType[]).map((key) => (
          <button
            key={key}
            onClick={() => setSectionType(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sectionType === key
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {SECTIONS[key].title.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <canvas ref={canvasRef} width={700} height={500} className="w-full" />
      </div>
    </div>
  );
}
