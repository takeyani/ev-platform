-- ============================================================
-- セキュリティ脆弱性修正 - Supabase SQL Editor で実行してください
-- ============================================================
-- このスクリプトは以下を修正します:
-- 1. 匿名アクセスポリシー削除（projectsテーブル）
-- 2. terra_const ロールを読み取り専用化
-- 3. terra_case/admin は引き続き全権限
-- 4. ストレージバケットを非公開化＋認証必須RLS
-- ============================================================

-- ============================================================
-- 1. projectsテーブル: 匿名アクセスを削除
-- ============================================================
DROP POLICY IF EXISTS "anon_read_projects" ON projects;
DROP POLICY IF EXISTS "anon_write_projects" ON projects;

-- ============================================================
-- 2. projectsテーブル: terra_const を読み取り専用に
-- ============================================================
DROP POLICY IF EXISTS "terra_all_projects" ON projects;

-- admin と terra_case は全権限
CREATE POLICY "admin_terra_case_all_projects" ON projects FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case'))
  );

-- terra_const は読み取りのみ
CREATE POLICY "terra_const_read_projects" ON projects FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'terra_const')
  );

-- contractor の閲覧ポリシー: 自社担当案件のみ（匿名フォールバック削除）
DROP POLICY IF EXISTS "contractor_own_projects" ON projects;
CREATE POLICY "contractor_own_projects" ON projects FOR SELECT
  USING (
    contractor = (SELECT company FROM user_profiles WHERE id = auth.uid())
  );

-- ============================================================
-- 3. ストレージバケットを非公開化
-- ============================================================
UPDATE storage.buckets SET public = false WHERE id IN ('drawings', 'documents', 'photos');

-- 既存の全権限ポリシーを削除
DROP POLICY IF EXISTS "allow_all_drawings" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_documents" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_photos" ON storage.objects;

-- 認証ユーザー全員が読み取り可能（contractorは自社案件のみが理想だが、
-- パス命名規則 caseId/filename に依存するため、まずは認証必須化のみ実施）
CREATE POLICY "auth_read_storage" ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('drawings', 'documents', 'photos')
    AND auth.uid() IS NOT NULL
  );

-- 認証ユーザーがアップロード可（admin/terra/contractorのみ、manufacturerは不可）
CREATE POLICY "auth_upload_storage" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('drawings', 'documents', 'photos')
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case', 'terra_const', 'contractor'))
  );

-- 削除は admin と terra_case のみ
CREATE POLICY "admin_delete_storage" ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('drawings', 'documents', 'photos')
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'terra_case'))
  );

-- ============================================================
-- 4. contractor_update_projects に WITH CHECK 追加
-- ============================================================
DROP POLICY IF EXISTS "contractor_update_projects" ON projects;
CREATE POLICY "contractor_update_projects" ON projects FOR UPDATE
  USING (
    contractor = (SELECT company FROM user_profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    contractor = (SELECT company FROM user_profiles WHERE id = auth.uid())
  );

-- ============================================================
-- 確認クエリ
-- ============================================================
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'projects';
-- SELECT id, public FROM storage.buckets;
