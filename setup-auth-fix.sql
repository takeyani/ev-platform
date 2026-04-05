-- user_profiles RLSポリシー修正（再帰ループ解消）
-- Supabase SQL Editor で実行してください

-- 既存ポリシーを全削除
DROP POLICY IF EXISTS "admin_all" ON user_profiles;
DROP POLICY IF EXISTS "own_profile" ON user_profiles;
DROP POLICY IF EXISTS "terra_read_all" ON user_profiles;

-- 自分のプロフィールは常に読み書き可
CREATE POLICY "own_read" ON user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "own_update" ON user_profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 全ユーザーの一覧は認証済みなら閲覧可（ロール確認不要でシンプルに）
CREATE POLICY "authenticated_read" ON user_profiles FOR SELECT USING (auth.uid() IS NOT NULL);

-- INSERT（トリガー用）
CREATE POLICY "insert_own" ON user_profiles FOR INSERT WITH CHECK (id = auth.uid());

-- サービスロール（トリガー）用
CREATE POLICY "service_insert" ON user_profiles FOR INSERT WITH CHECK (true);

-- 未認証でもエラーにならないように
CREATE POLICY "anon_noop" ON user_profiles FOR SELECT USING (auth.uid() IS NULL AND false);
