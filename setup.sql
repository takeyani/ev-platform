-- EV充電器施工管理 テーブル作成
-- Supabase SQL Editor で実行してください

-- 案件テーブル
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT UNIQUE NOT NULL,
  nev_id TEXT DEFAULT '',
  subsidy_type TEXT NOT NULL DEFAULT 'R8 Nev',
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  prefecture TEXT DEFAULT '',
  application_category TEXT DEFAULT '',
  construction_area TEXT DEFAULT '',

  charger_category TEXT DEFAULT '',
  charger_manufacturer TEXT DEFAULT '',
  charger_model TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,

  sales_department TEXT DEFAULT '',
  case_manager TEXT DEFAULT '',
  seko_manager TEXT DEFAULT '',
  construction_manager TEXT DEFAULT '',
  contractor TEXT DEFAULT '',

  order_date DATE,
  pre_construction_meeting_date DATE,
  pre_construction_meeting_time TEXT DEFAULT '',
  safety_doc_submit_date DATE,
  charger_delivery_request_date DATE,
  signboard_delivery_request_date DATE,
  charger_delivery_confirm_date DATE,
  signboard_delivery_confirm_date DATE,
  material_confirm_date DATE,
  start_date DATE,
  end_date DATE,
  power_reception_date DATE,
  blackout_date DATE,
  blackout_time TEXT DEFAULT '',

  ready_status TEXT DEFAULT '',
  ready_confirm_date DATE,
  site_manager_name TEXT DEFAULT '',
  site_manager_phone TEXT DEFAULT '',

  waste_disposal TEXT DEFAULT '',
  waste_description TEXT DEFAULT '',
  waste_pickup_date DATE,
  waste_pickup_time TEXT DEFAULT '',

  actual_start_date DATE,
  actual_end_date DATE,
  completion_report_date DATE,
  report_status TEXT DEFAULT '',
  report_approval_date DATE,

  status TEXT NOT NULL DEFAULT '交付決定待ち',
  subsidy TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS有効化
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 全員読み書き可（認証なしでも動作するように）
CREATE POLICY "allow_all" ON projects FOR ALL USING (true) WITH CHECK (true);

-- 初期データ投入
INSERT INTO projects (case_id, nev_id, subsidy_type, name, location, prefecture, application_category, construction_area, charger_category, charger_manufacturer, charger_model, quantity, sales_department, case_manager, seko_manager, construction_manager, contractor, order_date, pre_construction_meeting_date, pre_construction_meeting_time, safety_doc_submit_date, charger_delivery_request_date, charger_delivery_confirm_date, material_confirm_date, start_date, end_date, ready_status, ready_confirm_date, site_manager_name, site_manager_phone, waste_disposal, waste_description, waste_pickup_date, waste_pickup_time, actual_start_date, status, subsidy, notes)
VALUES
('T05010', '205697', 'R8 Nev', '○○マンション EV充電器設置', '東京都港区芝浦3-1-1', '東京', '基礎充電', '東日本', '6kW普通充電器', '日東工業', 'EVPT-2G60J-F-L5', 5, 'A', '植崎', '松本', '田中', 'テラEV充電器工事(株)', '2026-03-15', '2026-03-25', '13:00', '2026-03-28', '2026-03-20', '2026-03-22', '2026-03-23', '2026-04-01', '2026-04-05', 'Ready', '2026-03-29', '山田太郎', '090-1234-5678', '有', '土嚢10袋(段ボール,電気線)', '2026-04-05', '11:00', '2026-04-01', '施工中', 'NeV', '管理組合承認済み'),

('E04038', '208123', 'R8 Nev', '△△商業施設 急速充電器設置', '大阪府大阪市北区梅田1-2-3', '大阪', '目的地充電', '西日本', '50kW急速充電器', '新電元工業', 'SDQC2F50XT3200', 2, 'B', '佐藤', '鈴木', '高橋', '(株)関西テック', '2026-03-20', '2026-04-05', '10:00', NULL, '2026-04-01', NULL, NULL, '2026-04-15', '2026-04-25', '', NULL, '', '', '', '', NULL, '', NULL, '日程調整中', 'NeV', 'キュービクル設置あり(150kVA)'),

('T04521', '206789', 'R8 Nev', '□□駐車場 3kWコンセント設置', '名古屋市中区栄4-5-6', '愛知', '目的地充電', '東日本', '3kWコンセント', 'NOEX', 'NXEV-0001 (TC 2024)', 10, 'A', '田中', '松本', '鈴木', '中部電工(株)', '2026-03-10', '2026-04-10', '14:00', NULL, '2026-04-15', NULL, NULL, '2026-05-01', '2026-05-08', '', NULL, '', '', '', '', NULL, '', NULL, '施工発注済み', 'NeV', 'コンセント型10口');
