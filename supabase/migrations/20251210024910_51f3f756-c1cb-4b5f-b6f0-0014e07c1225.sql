
-- Remover políticas públicas de visualização
DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Exercise GIFs are publicly viewable" ON storage.objects;

-- Recriar como authenticated (usuários precisam estar logados para ver imagens)
CREATE POLICY "Authenticated users can view avatars" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can view exercise GIFs" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'exercise-gifs');
