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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">案件管理</h1>
          <p className="text-sm text-gray-500 mt-1">EV充電器設置工事の案件一覧（{filtered.length}件）</p>
        </div>
        <Link href="/projects/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium">新規案件登録</Link>
      </div>

      <div className="flex gap-2">
        {Object.keys(STATUS_GROUPS).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-emerald-600 text-white border-emerald-600"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">案件名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">施工場所</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">充電器</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">台数</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">施工業者</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">工期</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/projects/${p.id}`} className="text-emerald-600 font-medium hover:underline">{p.name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{p.prefecture}</td>
                <td className="px-4 py-3 text-gray-700">{p.chargerCategory}（{p.chargerManufacturer}）</td>
                <td className="px-4 py-3 text-gray-700">{p.quantity}台</td>
                <td className="px-4 py-3 text-gray-700">{p.contractor}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status as ProjectStatus]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {p.startDate && p.endDate ? `${p.startDate} - ${p.endDate.slice(5)}` : "未定"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">該当する案件はありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
