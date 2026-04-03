"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DRAWING_TYPES, DRAWING_PREFIXES } from "@/lib/constants";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

const DrawingEditor = dynamic(() => import("@/components/DrawingEditor"), { ssr: false });
const CrossSectionViewer = dynamic(() => import("@/components/CrossSectionViewer"), { ssr: false });
const AutoDrawingGenerator = dynamic(() => import("@/components/AutoDrawingGenerator"), { ssr: false });

const tabs = [{ id: "manage", label: "📋 管理" }, { id: "auto", label: "🤖 自動生成" }, { id: "editor", label: "📐 エディタ" }, { id: "section", label: "📏 断面図" }] as const;
type TabId = (typeof tabs)[number]["id"];

export default function DrawingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("manage");
  const { projects, loading } = useProjects();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ ...pageTitle, marginBottom: 0 }}>📐 図面管理</div>
        <div style={{ display: "flex", gap: 2 }}>
          {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: "pointer", border: activeTab === tab.id ? "1px solid #059669" : "1px solid #d1d5db", background: activeTab === tab.id ? "#059669" : "white", color: activeTab === tab.id ? "white" : "#4b5563" }}>{tab.label}</button>)}
        </div>
      </div>
      {activeTab === "manage" && !loading && (<div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={section}><div style={shead}>図面種別（4種 × 3段階）</div><table style={table}><thead><tr><th style={hcell}>図面</th>{Object.entries(DRAWING_PREFIXES).map(([k, v]) => <th key={k} style={{ ...hcell, textAlign: "center" }}>{v || "申請"}</th>)}</tr></thead><tbody>{DRAWING_TYPES.map((dt) => <tr key={dt}><td style={cell}>{dt}</td>{Object.entries(DRAWING_PREFIXES).map(([k, v]) => <td key={k} style={{ ...cell, textAlign: "center", color: "#6b7280", fontSize: 10 }}>{v}{dt}</td>)}</tr>)}</tbody></table></div>
          <div style={section}><div style={shead}>断面図テンプレート</div><table style={table}><thead><tr><th style={hcell}>充電器</th><th style={hcell}>設置パターン</th></tr></thead><tbody>{[{t:"3kWコンセント",p:"アンカー, ケミカル, 基礎, 壁面"},{t:"6kW 日東工業",p:"アンカー, AS, ケミカル, 基礎, 壁面"},{t:"6kW 河村電器",p:"AS+アンカー, 基礎, 壁面"},{t:"急速 QB基礎",p:"共通, 150kVA VCTあり/なし"}].map((r)=><tr key={r.t}><td style={{...cell,fontWeight:600}}>{r.t}</td><td style={{...cell,color:"#6b7280",fontSize:10}}>{r.p}</td></tr>)}</tbody></table></div>
        </div>
        <div style={section}><div style={shead}>案件別 図面状況</div><table style={table}><thead><tr><th style={hcell}>案件</th><th style={hcell}>充電器</th><th style={hcell}>状態</th>{DRAWING_TYPES.map((d) => <th key={d} style={{ ...hcell, textAlign: "center", fontSize: 10 }}>{d.slice(0, 3)}</th>)}</tr></thead><tbody>{projects.filter((p)=>!["キャンセル","延期"].includes(p.status)).map((p)=>{const done=p.reportStatus==="承認済み"||p.reportStatus==="提出済み";const wip=["施工中","着工Ready","安全書類提出済み"].includes(p.status);return<tr key={p.id}><td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{fontSize:9,color:"#9ca3af"}}>{p.caseId}</div></td><td style={cell}>{p.chargerCategory}</td><td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>{DRAWING_TYPES.map((dt)=><td key={dt} style={{...cell,textAlign:"center",fontWeight:600,color:done?"#16a34a":wip?"#2563eb":"#d1d5db"}}>{done?"✓":wip?"作成中":"-"}</td>)}</tr>})}</tbody></table></div>
      </div>)}
      {activeTab === "auto" && <div style={{ marginTop: 8 }}><AutoDrawingGenerator /></div>}
      {activeTab === "editor" && <div style={{ marginTop: 8 }}><DrawingEditor /></div>}
      {activeTab === "section" && <div style={{ marginTop: 8 }}><CrossSectionViewer /></div>}
    </div>
  );
}
