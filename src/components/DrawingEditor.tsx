"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type DrawingElement = {
  id: string;
  type: "charger" | "cubicle" | "signboard" | "cable" | "parking" | "barrier" | "label";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
  color: string;
};

const ELEMENT_TEMPLATES: Record<string, Omit<DrawingElement, "id" | "x" | "y">> = {
  "3kw_outlet": { type: "charger", width: 30, height: 30, rotation: 0, label: "3kWコンセント", color: "#10b981" },
  "6kw_charger": { type: "charger", width: 40, height: 40, rotation: 0, label: "6kW普通充電器", color: "#3b82f6" },
  "rapid_50kw": { type: "charger", width: 60, height: 50, rotation: 0, label: "50kW急速", color: "#ef4444" },
  "rapid_90kw": { type: "charger", width: 70, height: 55, rotation: 0, label: "90kW急速", color: "#dc2626" },
  "rapid_150kw": { type: "charger", width: 80, height: 60, rotation: 0, label: "150kW急速", color: "#991b1b" },
  cubicle: { type: "cubicle", width: 80, height: 60, rotation: 0, label: "キュービクル", color: "#6366f1" },
  signboard: { type: "signboard", width: 50, height: 20, rotation: 0, label: "案内板", color: "#f59e0b" },
  cable: { type: "cable", width: 100, height: 6, rotation: 0, label: "配線", color: "#64748b" },
  parking: { type: "parking", width: 80, height: 160, rotation: 0, label: "駐車区画", color: "#e2e8f0" },
  barrier: { type: "barrier", width: 40, height: 10, rotation: 0, label: "車止め", color: "#94a3b8" },
  label: { type: "label", width: 80, height: 24, rotation: 0, label: "テキスト", color: "transparent" },
};

export default function DrawingEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [gridSize] = useState(20);
  const [scale, setScale] = useState(1);

  const snapToGrid = (v: number) => Math.round(v / gridSize) * gridSize;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);

    // Grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width / scale; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height / scale); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height / scale; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width / scale, y); ctx.stroke();
    }

    // Elements
    elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x + el.width / 2, el.y + el.height / 2);
      ctx.rotate((el.rotation * Math.PI) / 180);

      if (el.type === "parking") {
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-el.width / 2, -el.height / 2, el.width, el.height);
        ctx.setLineDash([]);
      } else if (el.type === "cable") {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.height;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(-el.width / 2, 0);
        ctx.lineTo(el.width / 2, 0);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (el.type === "label") {
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.label, 0, 0);
      } else {
        ctx.fillStyle = el.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-el.width / 2, -el.height / 2, el.width, el.height);
        ctx.globalAlpha = 1;

        // Border
        if (selectedId === el.id) {
          ctx.strokeStyle = "#0ea5e9";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 2]);
          ctx.strokeRect(-el.width / 2 - 2, -el.height / 2 - 2, el.width + 4, el.height + 4);
          ctx.setLineDash([]);
        }

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.label, 0, 0);
      }

      ctx.restore();
    });

    // Scale indicator
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.fillText(`Scale: ${(scale * 100).toFixed(0)}% | Grid: ${gridSize}px`, 10, (canvas.height / scale) - 10);

    ctx.restore();
  }, [elements, selectedId, gridSize, scale]);

  useEffect(() => { draw(); }, [draw]);

  const addElement = (templateKey: string) => {
    const tpl = ELEMENT_TEMPLATES[templateKey];
    if (!tpl) return;
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setElements((prev) => [...prev, { ...tpl, id, x: snapToGrid(200 + Math.random() * 200), y: snapToGrid(100 + Math.random() * 200) }]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top) / scale;

    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (mx >= el.x && mx <= el.x + el.width && my >= el.y && my <= el.y + el.height) {
        setSelectedId(el.id);
        setDragging({ id: el.id, offsetX: mx - el.x, offsetY: my - el.y });
        return;
      }
    }
    setSelectedId(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top) / scale;

    setElements((prev) =>
      prev.map((el) =>
        el.id === dragging.id
          ? { ...el, x: snapToGrid(mx - dragging.offsetX), y: snapToGrid(my - dragging.offsetY) }
          : el
      )
    );
  };

  const handleMouseUp = () => setDragging(null);

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, rotation: (el.rotation + 90) % 360 } : el))
    );
  };

  const selectedEl = elements.find((el) => el.id === selectedId);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border p-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-500 mr-2">充電器:</span>
        {[
          { key: "3kw_outlet", label: "3kW" },
          { key: "6kw_charger", label: "6kW" },
          { key: "rapid_50kw", label: "50kW" },
          { key: "rapid_90kw", label: "90kW" },
          { key: "rapid_150kw", label: "150kW" },
        ].map((b) => (
          <button key={b.key} onClick={() => addElement(b.key)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition">{b.label}</button>
        ))}
        <span className="border-l h-6 mx-1" />
        <span className="text-xs font-bold text-gray-500 mr-2">設備:</span>
        {[
          { key: "cubicle", label: "キュービクル" },
          { key: "signboard", label: "案内板" },
          { key: "cable", label: "配線" },
        ].map((b) => (
          <button key={b.key} onClick={() => addElement(b.key)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition">{b.label}</button>
        ))}
        <span className="border-l h-6 mx-1" />
        <span className="text-xs font-bold text-gray-500 mr-2">区画:</span>
        {[
          { key: "parking", label: "駐車区画" },
          { key: "barrier", label: "車止め" },
          { key: "label", label: "テキスト" },
        ].map((b) => (
          <button key={b.key} onClick={() => addElement(b.key)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition">{b.label}</button>
        ))}
        <span className="border-l h-6 mx-1" />
        <button onClick={() => setScale((s) => Math.min(s + 0.1, 2))} className="px-2 py-1.5 bg-gray-100 rounded text-xs">+</button>
        <button onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))} className="px-2 py-1.5 bg-gray-100 rounded text-xs">-</button>
        {selectedId && (
          <>
            <span className="border-l h-6 mx-1" />
            <button onClick={rotateSelected} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">回転</button>
            <button onClick={deleteSelected} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100">削除</button>
          </>
        )}
      </div>

      <div className="flex gap-4">
        {/* Canvas */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            width={900}
            height={600}
            className="cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Properties */}
        <div className="w-56 bg-white rounded-xl border shadow-sm p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">プロパティ</h3>
          {selectedEl ? (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">ラベル</label>
                <input
                  type="text"
                  value={selectedEl.label}
                  onChange={(e) =>
                    setElements((prev) =>
                      prev.map((el) => (el.id === selectedId ? { ...el, label: e.target.value } : el))
                    )
                  }
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X</label>
                  <input type="number" value={selectedEl.x} readOnly className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y</label>
                  <input type="number" value={selectedEl.y} readOnly className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">幅</label>
                  <input
                    type="number"
                    value={selectedEl.width}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) => (el.id === selectedId ? { ...el, width: Number(e.target.value) } : el))
                      )
                    }
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">高さ</label>
                  <input
                    type="number"
                    value={selectedEl.height}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) => (el.id === selectedId ? { ...el, height: Number(e.target.value) } : el))
                      )
                    }
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">回転</label>
                <input type="text" value={`${selectedEl.rotation}°`} readOnly className="w-full px-2 py-1.5 border rounded text-xs bg-gray-50" />
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400">要素を選択してください</p>
          )}
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500">配置済み: {elements.length}個</p>
          </div>
        </div>
      </div>
    </div>
  );
}
