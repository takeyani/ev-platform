"use client";

import { useState } from "react";
import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS, STATUS_GROUPS, type ProjectStatus } from "@/lib/constants";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("全て");

  const filtered = SAMPLE_PROJECTS.filter((p) => {
    if (filter === "全て") return true;
    const group = STATUS_GROUPS[filter];
    return group?.includes(p.status);
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">案件管理</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{filtered.length}件</p>
        </div>
        <Link href="/projects/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium text-center">新規案件登録</Link>
      </div>

      {/* フィルタ（横スクロール対応） */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.keys(STATUS_GROUPS).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
              filter === f
                ? "bg-emerald-600 text-white border-emerald-600"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* PC: テーブル */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">案件名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">場所</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">充電器</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">台数</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">施工会社</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ステータス</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">工期</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/projects/${p.id}`} className="text-emerald-600 font-medium hover:underline">{p.name}</Link>
                    <div className="text-[10px] text-gray-400">{p.caseId} | {p.subsidyType}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.prefecture}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{p.chargerCategory}<br/><span className="text-gray-400">{p.chargerManufacturer}</span></td>
                  <td className="px-4 py-3 text-gray-700 text-center">{p.quantity}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{p.contractor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status as ProjectStatus]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {p.startDate && p.endDate ? `${p.startDate} ~ ${p.endDate.slice(5)}` : "未定"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">該当する案件はありません</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* モバイル: カード */}
        <div className="md:hidden divide-y">
          {filtered.map((p) => (
            <div key={p.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/projects/${p.id}`} className="text-emerald-600 font-medium text-sm hover:underline block truncate">{p.name}</Link>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.caseId} | {p.subsidyType} | {p.prefecture}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${STATUS_COLORS[p.status as ProjectStatus]}`}>{p.status}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[11px] text-gray-600">
                <span>{p.chargerCategory} x{p.quantity}</span>
                <span>{p.chargerManufacturer}</span>
                <span>{p.contractor}</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                工期: {p.startDate && p.endDate ? `${p.startDate} ~ ${p.endDate}` : "未定"}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">該当する案件はありません</div>
          )}
        </div>
      </div>
    </div>
  );
}
