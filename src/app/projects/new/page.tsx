import Link from "next/link";
import { CHARGER_CATEGORIES, CHARGER_MANUFACTURERS, SUBSIDY_TYPES, APPLICATION_CATEGORIES, CONSTRUCTION_AREAS } from "@/lib/constants";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/projects" className="text-sm text-emerald-600 hover:text-emerald-800 mb-4 inline-block">&larr; 案件一覧に戻る</Link>
      <h1 className="text-2xl font-bold mb-6">新規案件登録</h1>
      <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-4xl">
        <form className="space-y-8">
          {/* 基本情報 */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">基本情報</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案件ID *</label>
                <input name="caseId" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="T05010" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NevID</label>
                <input name="nevId" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="205697" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">補助金区分 *</label>
                <select name="subsidyType" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- 選択 --</option>
                  {SUBSIDY_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">案件名（補助金の名前） *</label>
                <input name="name" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="○○マンション EV充電器設置" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">申請区分</label>
                <select name="applicationCategory" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- 選択 --</option>
                  {APPLICATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">都道府県 *</label>
                <input name="prefecture" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="東京" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">住所 *</label>
                <input name="location" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="東京都港区芝浦3-1-1" />
              </div>
            </div>
          </div>

          {/* 充電器情報 */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">充電器情報</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">充電器種別 *</label>
                <select name="chargerCategory" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- 選択 --</option>
                  {CHARGER_CATEGORIES.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
                <select name="chargerManufacturer" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- 選択 --</option>
                  {CHARGER_MANUFACTURERS.map((m) => <option key={m.value} value={m.label}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">設置台数 *</label>
                <input name="quantity" type="number" min={1} defaultValue={1} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>

          {/* 担当者 */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">担当者・施工会社</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">営業担当部署</label>
                <input name="salesDepartment" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案件担当</label>
                <input name="caseManager" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">施工管理</label>
                <input name="constructionManager" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">施工会社</label>
                <input name="contractor" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">施工エリア</label>
                <select name="constructionArea" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- 選択 --</option>
                  {CONSTRUCTION_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea name="notes" rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>

          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium">
            案件を登録
          </button>
        </form>
      </div>
    </div>
  );
}
