import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SAMPLE_PROJECTS,
  STATUS_COLORS,
  CONSTRUCTION_FLOW_STEPS,
  SAFETY_DOCUMENTS,
  INSPECTION_REQUIREMENTS,
  type ProjectStatus,
} from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = SAMPLE_PROJECTS.find((p) => p.id === id);
  if (!project) notFound();

  // ステータスに応じたフロー進捗
  const statusToStep: Record<string, number> = {
    "交付決定待ち": 0, "交付決定済み": 1, "施工発注済み": 3,
    "日程調整中": 4, "着工前会議完了": 5, "安全書類提出済み": 6,
    "着工Ready": 8, "施工中": 9, "完了報告待ち": 10,
    "報告書確認中": 10, "検収完了": 11, "請求済み": 11,
  };
  const currentStep = statusToStep[project.status] ?? 0;

  return (
    <div className="space-y-6">
      <Link href="/projects" className="text-sm text-emerald-600 hover:text-emerald-800">&larr; 案件一覧に戻る</Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-400">{project.caseId}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{project.subsidyType}</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">{project.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{project.location}</p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* フロー進捗バー */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">工事フロー進捗</h2>
        <div className="flex items-center gap-0.5">
          {CONSTRUCTION_FLOW_STEPS.map((step) => {
            const done = step.step <= currentStep;
            const active = step.step === currentStep;
            return (
              <div key={step.step} className="flex-1 flex flex-col items-center">
                <div className={`w-full h-2 rounded-full ${done ? "bg-emerald-500" : "bg-gray-200"} ${active ? "ring-2 ring-emerald-300" : ""}`} />
                <p className={`text-[9px] mt-1 text-center leading-tight ${active ? "font-bold text-emerald-700" : done ? "text-emerald-600" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 案件基本情報 */}
        <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">案件情報</h2>
          <div className="space-y-3 text-sm">
            {[
              ["充電器種別", project.chargerCategory],
              ["メーカー/型番", `${project.chargerManufacturer} ${project.chargerModel}`],
              ["設置台数", `${project.quantity}台`],
              ["施工会社", project.contractor],
              ["補助金", `${project.subsidyType}`],
              ["申請区分", project.applicationCategory],
              ["施工エリア", project.constructionArea],
              ["案件担当", project.caseManager],
              ["施工管理", project.constructionManager],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value || "-"}</span>
              </div>
            ))}
            {project.notes && (
              <div className="pt-2 border-t">
                <span className="text-gray-500">備考:</span>
                <span className="ml-2 text-gray-900">{project.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* 日程管理 */}
        <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4">日程管理</h2>
          <div className="space-y-3 text-sm">
            {[
              ["発注日", project.orderDate],
              ["着工前会議", project.preConstructionMeetingDate ? `${project.preConstructionMeetingDate} ${project.preConstructionMeetingTime}` : ""],
              ["安全書類提出", project.safetyDocSubmitDate],
              ["着工予定日", project.startDate],
              ["完工予定日", project.endDate],
              ["電力受電日", project.powerReceptionDate],
              ["停電日", project.blackoutDate ? `${project.blackoutDate} ${project.blackoutTime}` : ""],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-2">
                <span className="text-gray-500">{label}</span>
                <span className={`font-medium ${value ? "text-gray-900" : "text-red-400"}`}>{value || "未定"}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-gray-500">着工Ready</span>
              {project.readyStatus === "Ready" ? (
                <span className="font-medium text-green-600">Ready ({project.readyConfirmDate})</span>
              ) : project.readyStatus === "Not Ready" ? (
                <span className="font-medium text-red-600">Not Ready</span>
              ) : (
                <span className="text-gray-400">未確認</span>
              )}
            </div>
          </div>
        </div>

        {/* 資材・産廃・完了報告 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">資材管理</h2>
            <div className="space-y-3 text-sm">
              {[
                ["充電器納入希望", project.chargerDeliveryRequestDate],
                ["充電器納品確認", project.chargerDeliveryConfirmDate],
                ["看板納品確認", project.signboardDeliveryConfirmDate],
                ["電材確保確認", project.materialConfirmDate],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{label}</span>
                  <span className={value ? "font-medium text-gray-900" : "text-red-400 text-xs"}>{value || "未確認"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">産廃・完了報告</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">産廃回収</span>
                <span className="font-medium text-gray-900">{project.wasteDisposal || "-"}</span>
              </div>
              {project.wasteDescription && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">荷姿</span>
                  <span className="font-medium text-gray-900 text-xs">{project.wasteDescription}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">実着工日</span>
                <span className="font-medium text-gray-900">{project.actualStartDate || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">実完工日</span>
                <span className="font-medium text-gray-900">{project.actualEndDate || "-"}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">報告書</span>
                <span className={`font-medium ${
                  project.reportStatus === "承認済み" ? "text-green-600" :
                  project.reportStatus === "差戻" ? "text-red-600" :
                  project.reportStatus === "提出済み" ? "text-blue-600" : "text-gray-400"
                }`}>{project.reportStatus || "未作成"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 安全書類チェックリスト */}
      <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">安全書類提出状況</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAFETY_DOCUMENTS.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">{doc.id}</span>
                <span className="text-gray-900">{doc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{doc.frequency}</span>
                <span className={`text-xs font-medium ${doc.required === "必須" ? "text-red-500" : "text-gray-400"}`}>
                  {doc.required}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return SAMPLE_PROJECTS.map((p) => ({ id: p.id }));
}
