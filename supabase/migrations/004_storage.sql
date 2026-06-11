-- Create storage bucket for knowledge base documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'knowledge-base',
  'knowledge-base',
  true,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload to knowledge-base"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'knowledge-base' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view knowledge-base files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'knowledge-base' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete knowledge-base files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'knowledge-base' AND auth.uid() IS NOT NULL);
