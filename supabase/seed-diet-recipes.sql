-- Script para popular tabela diet_recipes com receitas da Dieta de 21 Dias
-- Execute este script no Supabase SQL Editor: https://supabase.com/dashboard/project/mpcnsxyqpfaorlxingur/sql/new

-- Limpar receitas existentes (opcional)
-- DELETE FROM diet_recipes WHERE diet_program_id IN (SELECT id FROM diet_programs WHERE target_goal = 'weight_loss');

-- Inserir receitas para o programa de emagrecimento
INSERT INTO diet_recipes (diet_program_id, title, category, ingredients, instructions, macros, is_low_carb, is_weekend_meal) 
SELECT 
  dp.id as diet_program_id,
  v.title,
  v.category,
  v.ingredients::jsonb,
  v.instructions,
  v.macros::jsonb,
  v.is_low_carb,
  v.is_weekend_meal
FROM diet_programs dp
CROSS JOIN (VALUES
  -- Receitas de Desjejum
  ('Omelete com Bacon', 'Desjejum', 
   '["3 ovos inteiros", "2 fatias de bacon", "1 colher de sopa de manteiga", "Sal e pimenta a gosto"]',
   'Bata os ovos em um bowl. Derreta a manteiga na frigideira e adicione o bacon picado. Quando o bacon estiver dourado, adicione os ovos batidos. Cozinhe até firmar.',
   '{"calories": 420, "protein": 28, "carbs": 2, "fat": 35}',
   true, false),

  ('Ovos Mexidos com Azeite', 'Desjejum',
   '["3 ovos inteiros", "2 colheres de sopa de azeite extra virgem", "Sal e orégano", "Opcional: queijo ralado"]',
   'Bata os ovos e tempere. Aqueça o azeite em fogo médio, adicione os ovos e mexa até o ponto desejado. Sirva quente.',
   '{"calories": 380, "protein": 21, "carbs": 1, "fat": 32}',
   true, false),

  ('Pasta de Amendoim com Óleo de Coco', 'Desjejum',
   '["2 colheres de sopa de pasta de amendoim integral", "1 colher de sopa de óleo de coco", "Canela em pó (opcional)"]',
   'Misture a pasta de amendoim com o óleo de coco até ficar homogêneo. Polvilhe canela se desejar. Consume puro ou com aipo.',
   '{"calories": 340, "protein": 10, "carbs": 8, "fat": 30}',
   true, false),

  -- Receitas de Almoço
  ('Frango Grelhado com Brócolis', 'Almoço',
   '["150g de peito de frango", "1 xícara de brócolis", "2 colheres de sopa de azeite", "Alho e limão", "Sal e pimenta"]',
   'Tempere o frango com sal, pimenta e limão. Grelhe até dourar. Refogue o brócolis no azeite com alho. Sirva junto.',
   '{"calories": 380, "protein": 42, "carbs": 8, "fat": 20}',
   true, false),

  ('Carne Moída com Abobrinha', 'Almoço',
   '["150g de carne moída", "1 abobrinha média em cubos", "1 cebola picada", "2 dentes de alho", "Azeite", "Temperos a gosto"]',
   'Refogue a cebola e o alho no azeite. Adicione a carne moída e doure. Acrescente a abobrinha e cozinhe por 10 minutos. Tempere a gosto.',
   '{"calories": 410, "protein": 38, "carbs": 12, "fat": 24}',
   true, false),

  ('Salmão ao Forno com Aspargos', 'Almoço',
   '["150g de salmão", "8 aspargos", "2 colheres de azeite", "Limão", "Sal e ervas finas"]',
   'Tempere o salmão com sal, limão e ervas. Disponha os aspargos ao redor. Regue com azeite. Asse a 180°C por 20 minutos.',
   '{"calories": 420, "protein": 35, "carbs": 5, "fat": 30}',
   true, false),

  ('Peito de Frango ao Óleo de Coco', 'Almoço',
   '["150g de peito de frango", "2 colheres de óleo de coco", "Curry em pó", "Sal e pimenta", "Couve refogada"]',
   'Corte o frango em tiras e tempere com curry, sal e pimenta. Aqueça o óleo de coco e frite o frango até dourar. Sirva com couve refogada.',
   '{"calories": 390, "protein": 40, "carbs": 6, "fat": 22}',
   true, false),

  -- Receitas de Jantar
  ('Omelete de Espinafre e Queijo', 'Jantar',
   '["3 ovos", "1 xícara de espinafre", "50g de queijo muçarela", "Manteiga", "Sal e noz-moscada"]',
   'Refogue o espinafre na manteiga. Bata os ovos, tempere e adicione o espinafre e queijo. Faça a omelete na frigideira.',
   '{"calories": 380, "protein": 28, "carbs": 4, "fat": 28}',
   true, false),

  ('Carne Grelhada com Salada Verde', 'Jantar',
   '["150g de carne bovina", "Alface, rúcula e agrião", "Tomate cereja", "Azeite e vinagre", "Sal e pimenta"]',
   'Grelhe a carne temperada. Monte a salada com as folhas, tomate cereja, tempere com azeite, vinagre, sal e pimenta.',
   '{"calories": 360, "protein": 38, "carbs": 6, "fat": 20}',
   true, false),

  ('Tilápia com Couve-Flor Gratinada', 'Jantar',
   '["150g de tilápia", "1 xícara de couve-flor", "50g de queijo parmesão", "Manteiga", "Sal e pimenta"]',
   'Cozinhe a couve-flor, amasse e misture com manteiga e metade do queijo. Tempere o peixe e grelhe. Monte em refratário, cubra com a couve-flor e o resto do queijo. Gratine por 15 minutos.',
   '{"calories": 390, "protein": 42, "carbs": 8, "fat": 22}',
   true, false),

  -- Receitas de Lanches
  ('Vitamina de Abacate', 'Lanche',
   '["1/2 abacate", "200ml de leite de coco", "Adoçante stevia", "Gelo"]',
   'Bata todos os ingredientes no liquidificador até ficar cremoso. Sirva gelado.',
   '{"calories": 280, "protein": 3, "carbs": 10, "fat": 26}',
   true, false),

  ('Mix de Castanhas', 'Lanche',
   '["30g de castanha do Pará", "20g de amêndoas", "20g de nozes"]',
   'Misture todas as castanhas. Pode torrar levemente no forno para mais sabor.',
   '{"calories": 350, "protein": 12, "carbs": 8, "fat": 32}',
   true, false),

  ('Iogurte Natural com Chia', 'Lanche',
   '["150g de iogurte natural integral", "1 colher de sopa de chia", "Canela em pó"]',
   'Misture o iogurte com a chia e polvilhe canela. Deixe descansar por 10 minutos antes de consumir.',
   '{"calories": 180, "protein": 10, "carbs": 12, "fat": 10}',
   true, false),

  -- Receitas de Fim de Semana (Carb Reload)
  ('Tapioca com Queijo', 'Desjejum',
   '["3 colheres de goma de tapioca", "50g de queijo muçarela", "1 colher de manteiga"]',
   'Aqueça a frigideira, adicione a tapioca até formar uma panqueca. Coloque o queijo no meio, dobre e deixe derreter.',
   '{"calories": 280, "protein": 12, "carbs": 32, "fat": 12}',
   false, true),

  ('Batata Doce Assada', 'Almoço',
   '["1 batata doce média", "Azeite", "Sal e alecrim"]',
   'Corte a batata em rodelas, tempere com azeite, sal e alecrim. Asse a 200°C por 35 minutos.',
   '{"calories": 180, "protein": 2, "carbs": 38, "fat": 4}',
   false, true),

  ('Arroz Integral com Feijão', 'Almoço',
   '["1 xícara de arroz integral cozido", "1/2 xícara de feijão cozido", "Azeite"]',
   'Cozinhe o arroz e o feijão separadamente. Sirva junto com um fio de azeite.',
   '{"calories": 320, "protein": 12, "carbs": 58, "fat": 4}',
   false, true),

  -- Receitas Vegetarianas
  ('Salada Cetogênica Completa', 'Almoço',
   '["Alface, rúcula e espinafre", "1 ovo cozido", "50g de queijo", "Abacate", "Azeite e limão", "Sementes de girassol"]',
   'Monte a salada com as folhas, adicione o ovo picado, queijo em cubos e abacate. Finalize com azeite, limão e sementes.',
   '{"calories": 380, "protein": 18, "carbs": 8, "fat": 32}',
   true, false),

  ('Cogumelos Salteados com Alho', 'Jantar',
   '["200g de cogumelos variados", "4 dentes de alho", "3 colheres de manteiga", "Salsinha", "Sal e pimenta"]',
   'Saltee os cogumelos na manteiga com alho até ficarem macios. Finalize com salsinha picada.',
   '{"calories": 220, "protein": 8, "carbs": 6, "fat": 18}',
   true, false),

  ('Sopa de Legumes Low-Carb', 'Jantar',
   '["Brócolis", "Couve-flor", "Abobrinha", "Cebola", "Alho", "Azeite", "Caldo de legumes"]',
   'Refogue a cebola e alho no azeite. Adicione os legumes picados e o caldo. Cozinhe por 20 minutos. Bata metade no liquidificador e misture de volta.',
   '{"calories": 160, "protein": 6, "carbs": 12, "fat": 10}',
   true, false),

  -- Receitas Anti-Celulite
  ('Chá de Hibisco com Gengibre', 'Lanche',
   '["1 colher de hibisco seco", "1 pedaço de gengibre", "500ml de água", "Limão (opcional)"]',
   'Ferva a água com o gengibre. Desligue o fogo, adicione o hibisco e deixe em infusão por 10 minutos. Coe e sirva.',
   '{"calories": 5, "protein": 0, "carbs": 1, "fat": 0}',
   true, false)
) AS v(title, category, ingredients, instructions, macros, is_low_carb, is_weekend_meal)
WHERE dp.target_goal = 'weight_loss' 
  AND dp.is_active = true
ON CONFLICT DO NOTHING;
