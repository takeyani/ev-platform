-- Supabase Storage バケット作成
-- Supabase SQL Editor で実行してください

-- 図面バケット
INSERT INTO storage.buckets (id, name, public) VALUES ('drawings', 'drawings', true)
ON CONFLICT (id) DO NOTHING;

-- 安全書類バケット
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 写真バケット
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 全バケットのアクセスポリシー（認証なしで読み書き可）
CREATE POLICY "allow_all_drawings" ON storage.objects FOR ALL USING (bucket_id = 'drawings') WITH CHECK (bucket_id = 'drawings');
CREATE POLICY "allow_all_documents" ON storage.objects FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');
CREATE POLICY "allow_all_photos" ON storage.objects FOR ALL USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');
