"use client";
import Link from "next/link";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function SiteSurveysPage() {
  const { projects: allProjects, loading } = useProjects();
  const projects = allProjects.filter((p) => p.status !== "キャンセル" && p.status !== "延期");
  const surveyed = projects.filter((p) => p.preConstructionMeetingDate);
  const pending = projects.filter((p) => !p.preConstructionMeetingDate && p.status !== "請求済み" && p.status !== "検収完了");
  if (loading) return <div style={pageTitle}>🔍 現場調査<br/><span style={{ fontSize: 11, color: "#9ca3af" }}>読み込み中...</span></div>;
  return (
    <div>
      <div style={pageTitle}>🔍 現場調査</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><table style={table}><thead><tr><th style={hcellG}>調査待ち</th><th style={hcellG}>調査済み</th><th style={hcellG}>全案件</th></tr></thead><tbody><tr>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#d97706" }}>{pending.length}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#16a34a" }}>{surveyed.length}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{projects.length}</td>
        </tr></tbody></table></div>
        <div style={section}><div style={shead}>R8現調フロー（Toyokumo連携）</div><table style={table}><thead><tr>{["1.kViewer","2.日時入力","3.現地調査","4.写真撮影","5.報告書"].map((s)=><th key={s} style={{...hcell,textAlign:"center",fontSize:10}}>{s}</th>)}</tr></thead><tbody><tr>{["案件選択","FormBridge","配管・電源確認","電源盤・ルート","Kizuku承認"].map((s)=><td key={s} style={{...cell,textAlign:"center",fontSize:9,color:"#6b7280"}}>{s}</td>)}</tr></tbody></table></div>
      </div>
      <div style={section}><div style={shead}>案件別 現調状況</div><table style={table}><thead><tr><th style={hcell}>案件</th><th style={hcell}>都道府県</th><th style={hcell}>充電器</th><th style={hcell}>ステータス</th><th style={hcell}>着工前会議日</th><th style={hcell}>施工会社</th></tr></thead><tbody>{projects.map((p)=><tr key={p.id}>
        <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{fontSize:9,color:"#9ca3af"}}>{p.caseId}</div></td>
        <td style={cell}>{p.prefecture}</td><td style={cell}>{p.chargerCategory}</td>
        <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
        <td style={cell}>{p.preConstructionMeetingDate?<span style={{color:"#16a34a"}}>{p.preConstructionMeetingDate}</span>:<span style={{color:"#d1d5db"}}>未実施</span>}</td>
        <td style={cell}>{p.contractor}</td>
      </tr>)}</tbody></table></div>
      <div style={section}><div style={shead}>撮影ポイント</div><table style={table}><tbody>{["電源盤全体写真・盤名","スマートメーター接写","主幹ブレーカ容量・RT相電流値","分岐ブレーカ用途の名称・仕様","配線ルート","コア抜き箇所","架空距離","埋設配管","看板（商業施設のみ）","駐車場写真（個別+全体）","ポール式の場合、基礎設置床面"].map((item)=><tr key={item}><td style={cell}>☐ {item}</td></tr>)}</tbody></table></div>
    </div>
  );
}
