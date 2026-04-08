-- Supabase Storage バケット作成（セキュア版）
-- Supabase SQL Editor で実行してください

-- 図面バケット（非公開）
INSERT INTO storage.buckets (id, name, public) VALUES ('drawings', 'drawings', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 安全書類バケット（非公開）
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 写真バケット（非公開）
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 注意: アクセスポリシーは setup-security-fix.sql で定義
-- 認証ユーザーのみ読み書き可、削除は admin/terra_case のみ
