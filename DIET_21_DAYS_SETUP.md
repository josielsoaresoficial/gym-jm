# Configuração da Dieta de 21 Dias

## ✅ Arquivos Criados

A funcionalidade da **Dieta de 21 Dias** foi implementada com sucesso! Os seguintes arquivos foram criados:

### Páginas
- `src/pages/Diet21Days.tsx` - Página principal da dieta com progresso e plano diário

### Hooks
- `src/hooks/useDiet21Days.tsx` - Hook para gerenciar inscrição, progresso e navegação

### Componentes
- `src/components/DietProgressHeader.tsx` - Header com barra de progresso
- `src/components/DietMealCard.tsx` - Card individual de refeição
- `src/components/DietDayTips.tsx` - Dicas diárias e informações

### Modificações
- ✅ `src/pages/Nutrition.tsx` - Adicionado botão "Dieta de 21 Dias" (condicional)
- ✅ `src/App.tsx` - Adicionada rota `/diet-21-days`

---

## 🎯 Como Funciona

### Acesso Condicional
O botão **"Dieta de 21 Dias"** aparece APENAS para usuários que selecionaram **"Emagrecer - Perder gordura"** como objetivo no onboarding.

### Localização do Botão
Na página **Nutrição** (`/nutrition`), na seção **"Ações Rápidas"**, entre:
- ✅ Receitas Sugeridas
- **🆕 Dieta de 21 Dias** ← NOVO
- ✅ Ajustar Metas

---

## 📊 Estrutura do Banco de Dados

### Tabelas Existentes (já populadas)
✅ `diet_programs` - Programa "Dieta de 21 Dias" ativo  
✅ `diet_daily_plans` - 21 dias de planos alimentares estruturados  
✅ `user_diet_enrollments` - Inscrições dos usuários na dieta  

### ⚠️ Ação Necessária: Popular Receitas
A tabela `diet_recipes` está vazia e precisa ser populada com as receitas.

---

## 🍽️ Como Popular as Receitas

### Passo 1: Acessar o SQL Editor do Supabase
Acesse: [Supabase SQL Editor](https://supabase.com/dashboard/project/mpcnsxyqpfaorlxingur/sql/new)

### Passo 2: Executar o Script
1. Abra o arquivo: `supabase/seed-diet-recipes.sql`
2. Copie todo o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** para executar

### Passo 3: Verificar
Após executar, você pode verificar com:
```sql
SELECT COUNT(*) FROM diet_recipes;
```
Deve retornar **20 receitas** inseridas.

---

## 📋 Receitas Incluídas

### Desjejum (3)
- Omelete com Bacon
- Ovos Mexidos com Azeite
- Pasta de Amendoim com Óleo de Coco

### Almoço (4)
- Frango Grelhado com Brócolis
- Carne Moída com Abobrinha
- Salmão ao Forno com Aspargos
- Peito de Frango ao Óleo de Coco

### Jantar (3)
- Omelete de Espinafre e Queijo
- Carne Grelhada com Salada Verde
- Tilápia com Couve-Flor Gratinada

### Lanches (4)
- Vitamina de Abacate
- Mix de Castanhas
- Iogurte Natural com Chia
- Chá de Hibisco com Gengibre

### Fim de Semana / Carb Reload (3)
- Tapioca com Queijo
- Batata Doce Assada
- Arroz Integral com Feijão

### Vegetarianas (3)
- Salada Cetogênica Completa
- Cogumelos Salteados com Alho
- Sopa de Legumes Low-Carb

---

## 🚀 Fluxo do Usuário

### 1. Onboarding
Usuário seleciona **"Emagrecer - Perder gordura"** → `fitness_goal: 'weight_loss'`

### 2. Página Nutrição
Botão **"Dieta de 21 Dias"** aparece em Ações Rápidas

### 3. Primeira Visita
Exibe diálogo de boas-vindas explicando o programa

### 4. Iniciar Dieta
Usuário clica em **"Iniciar Dieta Agora"** → Cria inscrição automática

### 5. Página da Dieta
- ✅ Progresso visual (Dia X de 21)
- ✅ Barra de progresso com porcentagem
- ✅ Banner motivacional contextual
- ✅ Plano de refeições do dia com checkboxes
- ✅ Dicas diárias personalizadas
- ✅ Navegação entre dias (anterior/próximo)

---

## 🎨 Funcionalidades Implementadas

### Progresso
- ✅ Dia atual e total (1-21)
- ✅ Semana atual (1-3)
- ✅ Porcentagem de conclusão
- ✅ Dias restantes

### Plano Diário
- ✅ Refeições estruturadas por horário
- ✅ Descrição detalhada de cada refeição
- ✅ Checkboxes para marcar como completo
- ✅ Indicador de dia de treino vs descanso
- ✅ Informação de jejum intermitente

### Dicas
- ✅ Dicas diárias personalizadas
- ✅ Lembretes de hidratação
- ✅ Avisos especiais para dias de treino
- ✅ Informações sobre jejum intermitente

### Navegação
- ✅ Avançar para próximo dia
- ✅ Voltar para dia anterior
- ✅ Navegar para dia específico
- ✅ Bloqueio de acesso para usuários sem objetivo de emagrecimento

---

## 🔒 Segurança

### Verificação de Acesso
A página `/diet-21-days` verifica automaticamente:
1. Se o usuário está autenticado
2. Se o `fitness_goal === 'weight_loss'`
3. Se não, redireciona para `/nutrition`

### Política RLS
As tabelas já possuem Row Level Security configurada:
- ✅ Usuários só veem suas próprias inscrições
- ✅ Planos diários são públicos (read-only)
- ✅ Receitas são públicas (read-only)

---

## 📱 Experiência Mobile

Todos os componentes são responsivos e otimizados para:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

---

## 🎉 Pronto para Usar!

Depois de executar o script SQL para popular as receitas, a funcionalidade estará **100% operacional**.

### Testando
1. Faça login como usuário com objetivo de emagrecimento
2. Vá para `/nutrition`
3. Clique em **"Dieta de 21 Dias"**
4. Inicie a dieta e explore!

---

## 📚 Fonte do Conteúdo

O conteúdo foi adaptado dos PDFs fornecidos:
- Manual da Dieta de 21 Dias
- Livro de Receitas
- Manual de Exercícios Físicos
- Guia Anti-Celulite
- Capítulo Premium

**Nota**: Nomes de autores foram omitidos conforme solicitado.
