"use client";
import Link from "next/link";
import { checkReadyStatus, getMaterialStatus } from "@/lib/automation";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function SchedulePage() {
  const { projects: allProjects, loading } = useProjects();
  const projects = allProjects.filter((p) => p.status !== "キャンセル" && p.status !== "延期");
  if (loading) return <div style={pageTitle}>📅 スケジュール<br/><span style={{ fontSize: 11, color: "#9ca3af" }}>読み込み中...</span></div>;
  return (
    <div>
      <div style={pageTitle}>📅 スケジュール</div>
      <div style={section}><div style={shead}>R8年度 NeV補助金スケジュール</div><table style={table}><thead><tr>{["4-6月","6-9月","9-10月","10-12月","1-2月"].map((p)=><th key={p} style={{...hcellG,textAlign:"center"}}>{p}</th>)}</tr></thead><tbody><tr>{["交付申請・決定","施工期間(1回目)","実績報告","施工期間(2回目)","実績報告(最終)"].map((p)=><td key={p} style={{...cell,textAlign:"center",fontSize:10}}>{p}</td>)}</tr></tbody></table></div>
      <div style={section}><div style={shead}>日程詳細</div><div style={{ overflowX: "auto" }}><table style={table}><thead><tr>
        <th style={hcell}>案件</th><th style={hcell}>状態</th><th style={hcell}>着工前会議</th><th style={hcell}>安全書類</th><th style={hcell}>着工予定</th><th style={hcell}>完工予定</th><th style={hcell}>停電</th><th style={hcell}>受電</th><th style={{...hcell,textAlign:"center"}}>Ready</th><th style={{...hcell,textAlign:"center"}}>資材</th>
      </tr></thead><tbody>{projects.map((p)=>{const rc=checkReadyStatus(p);const mat=getMaterialStatus(p);return<tr key={p.id}>
        <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{fontSize:9,color:"#9ca3af"}}>{p.caseId} | {p.contractor}</div></td>
        <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
        <td style={cell}>{p.preConstructionMeetingDate||"-"}</td>
        <td style={cell}>{p.safetyDocSubmitDate?<span style={{color:"#16a34a"}}>{p.safetyDocSubmitDate}</span>:<span style={{color:"#f87171"}}>未提出</span>}</td>
        <td style={{...cell,fontWeight:600}}>{p.startDate||"-"}</td><td style={cell}>{p.endDate||"-"}</td>
        <td style={cell}>{p.blackoutDate?`${p.blackoutDate} ${p.blackoutTime}`:"-"}</td>
        <td style={cell}>{p.powerReceptionDate||"-"}</td>
        <td style={{...cell,textAlign:"center",fontWeight:700,color:rc.status==="Ready"?"#16a34a":"#d1d5db"}}>{rc.status==="Ready"?"✓":"-"}</td>
        <td style={{...cell,textAlign:"center",fontWeight:700,color:mat.allConfirmed?"#16a34a":"#f59e0b"}}>{mat.allConfirmed?"✓":"!"}</td>
      </tr>})}</tbody></table></div></div>
    </div>
  );
}
