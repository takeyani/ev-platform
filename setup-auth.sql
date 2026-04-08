-- ユーザープロフィール＋ロール管理テーブル
-- Supabase SQL Editor で実行してください

-- ロール: admin(管理者), terra_case(案件担当), terra_const(施工管理), contractor(協力会社), manufacturer(メーカー)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'contractor',
  company TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'terra_case', 'terra_const', 'contractor', 'manufacturer'))
);

-- RLS有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 管理者は全員閲覧・編集可
CREATE POLICY "admin_all" ON user_profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 自分のプロフィールは閲覧・編集可
CREATE POLICY "own_profile" ON user_profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- テラ社員は全プロフィール閲覧可
CREATE POLICY "terra_read_all" ON user_profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case', 'terra_const'))
  );

-- 新規ユーザー登録時に自動でプロフィール作成するトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, display_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', ''), 'contractor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- projectsテーブルのRLSポリシーを更新
-- 既存ポリシーを削除して新しいものに置換
DROP POLICY IF EXISTS "allow_all" ON projects;

-- 管理者・テラ社員は全案件アクセス
CREATE POLICY "terra_all_projects" ON projects FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case', 'terra_const'))
  );

-- 協力会社は自社担当案件のみ
CREATE POLICY "contractor_own_projects" ON projects FOR SELECT
  USING (
    contractor = (SELECT company FROM user_profiles WHERE id = auth.uid())
  );

-- 協力会社は担当案件のステータス更新・書類提出のみ
CREATE POLICY "contractor_update_projects" ON projects FOR UPDATE
  USING (
    contractor = (SELECT company FROM user_profiles WHERE id = auth.uid())
  );

-- メーカーは自社充電器の案件のみ閲覧
CREATE POLICY "manufacturer_read_projects" ON projects FOR SELECT
  USING (
    charger_manufacturer = (SELECT company FROM user_profiles WHERE id = auth.uid())
  );

-- 注意: 匿名アクセスポリシーは setup-security-fix.sql で削除済み
-- セキュリティ上、未認証アクセスは許可しない
