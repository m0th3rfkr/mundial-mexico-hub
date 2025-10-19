-- WC2025 Storage Buckets

-- Crear buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-assets', 'team-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('player-photos', 'player-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('achievement-icons', 'achievement-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "Public can view team assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-assets');

CREATE POLICY "Authenticated users can upload team assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view player photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'player-photos');

CREATE POLICY "Authenticated users can upload player photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view all avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view achievement icons"
ON storage.objects FOR SELECT
USING (bucket_id = 'achievement-icons');

CREATE POLICY "Authenticated users can upload achievement icons"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'achievement-icons' AND auth.role() = 'authenticated');
