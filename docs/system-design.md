# EV充電器施工管理プラットフォーム - システム設計書

## 1. 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フロントエンド | Next.js 16 + React 19 | App Router, Server Components |
| スタイリング | Tailwind CSS 4 | ユーティリティファースト |
| 型システム | TypeScript 6 | 厳密モード |
| 認証 | Supabase Auth | RLS対応 |
| DB | Supabase (PostgreSQL) | Row Level Security |
| ファイルストレージ | Supabase Storage | 図面・写真・PDF |
| 3D描画 | Three.js | 断面図ビューア |
| デプロイ | Vercel | Edge Functions |
| ポート | 3010 | 開発サーバー |

---

## 2. データベース設計

### 2.1 ER図（主要テーブル）

```
organizations (組織)
├── users (ユーザー)
├── contractors (協力会社)
│   └── workers (作業員)
└── projects (案件)
    ├── project_schedules (日程管理)
    ├── project_materials (資材管理)
    │   └── charger_devices (充電器個体管理)
    ├── safety_documents (安全書類)
    ├── drawings (図面)
    ├── construction_logs (工事日報)
    ├── photos (写真)
    ├── completion_reports (完了報告)
    ├── pre_construction_meetings (着工前会議)
    └── invoices (請求)

charger_models (充電器マスタ)
├── manufacturer
├── model_number
├── power_rating
└── specifications

cubicle_models (キュービクルマスタ)
cross_section_templates (断面図テンプレート)
```

### 2.2 主要テーブル定義

#### projects（案件）
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(10) UNIQUE NOT NULL,  -- T05010形式
  nev_id VARCHAR(20),
  subsidy_type VARCHAR(20) NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  prefecture VARCHAR(10),
  application_category VARCHAR(20),
  construction_area VARCHAR(10),
  
  -- 充電器
  charger_category VARCHAR(30),
  charger_manufacturer VARCHAR(30),
  charger_model VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  
  -- 担当者
  sales_department VARCHAR(10),
  case_manager_id UUID REFERENCES users(id),
  seko_manager_id UUID REFERENCES users(id),
  construction_manager_id UUID REFERENCES users(id),
  contractor_id UUID REFERENCES contractors(id),
  
  -- ステータス
  status VARCHAR(20) NOT NULL DEFAULT '交付決定待ち',
  ready_status VARCHAR(10),  -- Ready / Not Ready
  ready_confirm_date DATE,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### project_schedules（日程管理）
```sql
CREATE TABLE project_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  order_date DATE,
  pre_meeting_date DATE,
  pre_meeting_time TIME,
  safety_doc_submit_date DATE,
  
  charger_delivery_request DATE,
  charger_delivery_confirm DATE,
  signboard_delivery_request DATE,
  signboard_delivery_confirm DATE,
  material_confirm_date DATE,
  
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  
  power_reception_date DATE,
  blackout_date DATE,
  blackout_time VARCHAR(20),
  
  site_manager_name VARCHAR(50),
  site_manager_phone VARCHAR(20),
  
  waste_disposal BOOLEAN,
  waste_description TEXT,
  waste_pickup_date DATE,
  waste_pickup_time TIME,
  
  UNIQUE(project_id)
);
```

#### safety_documents（安全書類）
```sql
CREATE TABLE safety_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  contractor_id UUID REFERENCES contractors(id),
  
  document_type VARCHAR(5) NOT NULL,  -- A-1, B-2, C-3 etc.
  fiscal_year INTEGER,
  submit_date DATE,
  status VARCHAR(10) DEFAULT '未提出',  -- 未提出/提出済み/確認済み
  file_path TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### completion_reports（完了報告）
```sql
CREATE TABLE completion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  
  report_date DATE,
  submit_date DATE,
  status VARCHAR(10) DEFAULT '未作成',  -- 未作成/提出済み/差戻/承認済み
  approval_date DATE,
  approved_by UUID REFERENCES users(id),
  
  -- 完成図面
  completion_drawings JSONB,  -- [{type, file_path, created_date}]
  
  -- 変更図面（あれば）
  change_drawings JSONB,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### charger_devices（充電器個体管理）
```sql
CREATE TABLE charger_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  
  device_number INTEGER,  -- 設置No (1, 2, 3...)
  serial_number VARCHAR(30),  -- 本体ドア裏側番号 (TCJAA003094)
  device_id VARCHAR(30),  -- デバイスIDシリアル
  seal_number VARCHAR(30),  -- シール番号 (TCC-MJ72E-55HSQ8)
  my_charger_code VARCHAR(20),  -- マイ充電器コード (MYC-LBPC30)
  qr_send_date DATE,
  
  model VARCHAR(50),
  installation_pattern VARCHAR(20),  -- アンカー/基礎/壁面
  
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. アプリケーション構成

### 3.1 ページ構成（実装済み 13ページ）

```
/ (ダッシュボード)         ← 自動集計・アラート・Ready/資材判定
├── /flow (業務フロー)     ← 11ステップ詳細・期限ルール・チェックリスト
├── /projects (案件管理)
│   ├── /projects/new (新規登録) ← マスタ連携フォーム
│   └── /projects/[id] (案件詳細) ← フロー進捗・日程・資材・安全書類
├── /site-surveys (現場調査)     ← Toyokumo連携・撮影ポイント・案件別状況
├── /drawings (図面管理)         ← 4種図面 + 3コンポーネント(Canvas描画)
├── /construction (施工管理)     ← 施工中/Ready/準備中 + Ready自動判定
├── /equipment (充電器管理)      ← 7メーカー・マスタ集計・キュービクル
├── /documents (書類管理)        ← 14種安全書類 + 図面種別 + 仕様書
├── /schedule (スケジュール)     ← ガントチャート + 日程詳細
├── /safety (安全管理)           ← 14種書類 + 案件別提出状況
└── /reports (完了報告)          ← 月次検収自動集計 + 報告フロー
```

### 3.2 コンポーネント構成（実装済み 3コンポーネント）

```
src/components/
├── AutoDrawingGenerator.tsx   # Canvas自動図面生成（4充電器種・3レイアウト）
├── CrossSectionViewer.tsx     # Canvas断面図ビューア（3kW/6kW/急速 4種）
└── DrawingEditor.tsx          # Canvasドラッグ＆ドロップ図面エディタ（11要素）
```

### 3.3 自動化ロジック（実装済み `src/lib/automation.ts`）

```
src/lib/
├── constants.ts    # マスタデータ（ステータス14種・安全書類14種・充電器7メーカー20+モデル・Project型60+フィールド）
└── automation.ts   # 自動化ロジック
    ├── checkReadyStatus()             # 着工Ready自動判定（9〜12条件）
    ├── getDeadlineAlerts()            # 期限アラート自動生成
    ├── getMaterialStatus()            # 資材確認状況チェック
    ├── suggestNextStatus()            # ステータス自動遷移候補
    ├── getMonthlyInspectionSummary()  # 月次検収自動集計
    ├── getSafetyDocStatus()           # 安全書類提出状況
    ├── getDashboardSummary()          # ダッシュボード全指標集計
    └── addBusinessDays()              # 営業日計算
```

---

## 4. 着工Ready自動判定ロジック（実装済み: `src/lib/automation.ts`）

進捗シートの仕様に基づく自動判定。Projectの全フィールドを直接チェック:

```typescript
// 基本9条件（全案件共通）
const items = [
  { label: "着工予定日",       ok: !!p.startDate },
  { label: "完工予定日",       ok: !!p.endDate },
  { label: "現場担当者氏名",    ok: !!p.siteManagerName },
  { label: "現場担当者電話番号", ok: !!p.siteManagerPhone },
  { label: "産廃回収有無",      ok: p.wasteDisposal === "有" || p.wasteDisposal === "無" },
  { label: "安全書類提出",      ok: !!p.safetyDocSubmitDate },
  { label: "充電器納品確認",    ok: !!p.chargerDeliveryConfirmDate },
  { label: "電材確保確認",      ok: !!p.materialConfirmDate },
  { label: "着工前会議完了",    ok: !!p.preConstructionMeetingDate },
];

// 産廃「有」の場合は追加3条件
if (p.wasteDisposal === "有") {
  items.push(
    { label: "産廃荷姿",       ok: !!p.wasteDescription },
    { label: "産廃回収希望日",  ok: !!p.wastePickupDate },
    { label: "産廃回収希望時間", ok: !!p.wastePickupTime },
  );
}

// 全条件充足 → "Ready" / 不足あり → "Not Ready" + 不足項目リスト
```

---

## 5. 外部連携設計

### 5.1 Kizuku連携
```
本プラットフォーム ←→ Kizuku
- 案件作成時 → Kizukuにトークルーム自動作成
- 安全書類提出 → Kizuku図書アップロード
- 工事写真 → Kizukuトーク経由で取得
- 完了報告書 → Kizuku報告書機能で作成→承認
```

### 5.2 Toyokumo連携
```
本プラットフォーム ←→ Toyokumo
- 現地調査 → FormBridgeフォーム入力
- 進捗KPI → kViewerで表示
- 図面提出 → FormBridgeで提出管理
```

### 5.3 進捗シート段階的移行
```
Phase 1: 本プラットフォームで案件登録・閲覧
Phase 2: 日程管理・着工Ready判定を移行
Phase 3: 完了報告・請求管理を移行
Phase 4: Google Sheets は読み取り専用のバックアップに
```

---

## 6. セキュリティ設計

### 6.1 RLS（Row Level Security）ポリシー
```sql
-- テラ社員は全案件アクセス可
CREATE POLICY "terra_staff_all" ON projects
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'org_role' = 'terra_staff');

-- 協力会社は自社担当案件のみ
CREATE POLICY "contractor_own" ON projects
  FOR SELECT TO authenticated
  USING (contractor_id = (
    SELECT contractor_id FROM users WHERE id = auth.uid()
  ));
```

---

## 7. 実装フェーズ

### Phase 1: 基盤構築 ✅ 完了
- [x] プロジェクト構造（Next.js 16 + TypeScript + インラインstyle）
- [x] マスタデータ定義（constants.ts: 14ステータス・14安全書類・7メーカー・60+フィールド）
- [x] 共通スタイル（styles.ts: cell/hcell/section/statusBadge等）
- [x] 自動化ロジック（automation.ts: Ready判定・アラート・検収集計・ステータス遷移提案）
- [x] 全13ページ実装・インラインstyle・テーブル表示統一

### Phase 2: DB連携 ✅ 完了
- [x] Supabase DB接続（supabase.ts + db.ts）
- [x] projectsテーブル作成（48フィールド、camelCase↔snake_case自動変換）
- [x] 案件CRUD（fetch/create/update/delete + エラーメッセージ日本語化）
- [x] useProjects()フック（キャッシュ + invalidateProjectsCache()でグローバル無効化）
- [x] 全ページDB連動（useProjects()経由、mutation後自動リフレッシュ）
- [x] 案件詳細: ステータス変更・日程インライン編集・実着工/完工日編集
- [x] 業務フロー: DB案件数リアルタイム連動
- [x] Vercel環境変数設定・本番デプロイ

### Phase 2.5: ファイル・認証・権限 ✅ 完了
- [x] Supabase Storage（drawings/documents/photos 3バケット）
- [x] FileUploaderコンポーネント（アップロード・一覧・ダウンロード・削除 + エラーハンドリング）
- [x] 認証（Supabase Auth: signIn/signUp/signOut）
- [x] ロール権限5種（admin/terra_case/terra_const/contractor/manufacturer）
- [x] user_profilesテーブル + 自動トリガー
- [x] ロール別UI制御（削除ボタンはadminのみ等）
- [x] 案件詳細に図面・書類・写真アップロード統合
- [x] 案件削除（確認ダイアログ付き）
- [x] 案件新規作成フォームに型番・Seko担当フィールド追加
- [x] 案件詳細に配送依頼日（充電器・看板）・看板納品確認日の編集UI追加
- [x] useProjectsエラーログ出力追加
- [x] 案件詳細に全日付・時刻フィールドの編集UI追加（停電日時・会議時間・産廃回収・完了報告・承認日等）
- [x] RBAC適用（canEdit/canUploadFiles/canViewAllProjects — 編集・アップロード・ステータス変更を権限制御）
- [x] 案件一覧にテキスト検索（案件名・ID・施工会社・都道府県・メーカー）
- [x] モバイルレスポンシブ対応（ハンバーガーメニュー・サイドバースライド・メディアクエリ）
- [x] アクセシビリティ改善（aria-current, aria-label, role="navigation"）
- [x] 現場調査ページの撮影ポイントをPHOTO_CHECK_ITEMSからimport（ハードコード解消）
- [x] 型安全性向上（as any → Project["status"]）

### Phase 3: 次期対応
- [ ] Kizuku API連携（トーク・報告書・写真）
- [ ] Toyokumo連携（現調フォーム・図面提出）
- [ ] 検索・ページネーション

### Phase 4: 高度機能
- [ ] モバイル最適化（レスポンシブ強化）
- [ ] 通知機能（期限アラートのプッシュ通知）
- [ ] PDF生成（発注書・議事録・報告書）
- [ ] 進捗シート段階的移行
