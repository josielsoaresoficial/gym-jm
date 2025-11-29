-- Adicionar coluna de categoria aos alimentos personalizados
ALTER TABLE public.custom_foods 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'outros';

-- Criar índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_custom_foods_category ON public.custom_foods(category);

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.custom_foods.category IS 'Categoria do alimento: proteinas, carboidratos, gorduras, frutas, vegetais, lacteos, lanches, bebidas, sobremesas, outros';