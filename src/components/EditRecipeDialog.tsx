import { useState } from 'react';
import { FavoriteRecipe, RecipeCategory } from '@/hooks/useFavoriteRecipes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditRecipeDialogProps {
  recipe: FavoriteRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipeId: string, updates: Partial<FavoriteRecipe>) => Promise<void>;
}

export const EditRecipeDialog = ({ recipe, open, onOpenChange, onSave }: EditRecipeDialogProps) => {
  const [title, setTitle] = useState(recipe.title);
  const [category, setCategory] = useState<RecipeCategory | undefined>(recipe.category || undefined);
  const [prepTime, setPrepTime] = useState(recipe.prep_time || '');
  const [servings, setServings] = useState(recipe.servings?.toString() || '');
  const [ingredients, setIngredients] = useState(recipe.ingredients || [{ item: '', quantity: '' }]);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [macros, setMacros] = useState(recipe.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [tags, setTags] = useState<string[]>(recipe.tags || []);
  const [notes, setNotes] = useState(recipe.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const categoryOptions: { value: RecipeCategory; label: string }[] = [
    { value: 'breakfast', label: 'Café da Manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'post_workout', label: 'Pós-Treino' },
    { value: 'snack', label: 'Lanche' }
  ];

  const availableTags = [
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'high_protein', label: 'High Protein' },
    { value: 'vegetarian', label: 'Vegetariana' },
    { value: 'vegan', label: 'Vegana' },
    { value: 'gluten_free', label: 'Sem Glúten' },
    { value: 'dairy_free', label: 'Sem Lactose' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' }
  ];

  const addIngredient = () => {
    setIngredients([...ingredients, { item: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: 'item' | 'quantity', value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const toggleTag = (tagValue: string) => {
    setTags(prev =>
      prev.includes(tagValue)
        ? prev.filter(t => t !== tagValue)
        : [...prev, tagValue]
    );
  };

  const handleSave = async () => {
    // Validação básica
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, preencha o título da receita",
        variant: "destructive",
      });
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.item.trim() !== '');
    if (validIngredients.length === 0) {
      toast({
        title: "Ingredientes obrigatórios",
        description: "Adicione pelo menos um ingrediente",
        variant: "destructive",
      });
      return;
    }

    if (!instructions.trim()) {
      toast({
        title: "Modo de preparo obrigatório",
        description: "Por favor, preencha o modo de preparo",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(recipe.id, {
        title: title.trim(),
        category,
        prep_time: prepTime || null,
        servings: servings ? parseInt(servings) : null,
        ingredients: validIngredients,
        instructions: instructions.trim(),
        macros: macros.calories || macros.protein || macros.carbs || macros.fat ? macros : null,
        tags: tags.length > 0 ? tags : null,
        notes: notes.trim() || null
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>
            Faça alterações na sua receita favorita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da receita"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as RecipeCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prepTime">Tempo de Preparo</Label>
                <Input
                  id="prepTime"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="Ex: 30 min"
                />
              </div>

              <div>
                <Label htmlFor="servings">Porções</Label>
                <Input
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="Ex: 4"
                />
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredientes *</Label>
              <Button type="button" size="sm" variant="outline" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Quantidade"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Ingrediente"
                    value={ing.item}
                    onChange={(e) => updateIngredient(idx, 'item', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeIngredient(idx)}
                    disabled={ingredients.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Modo de Preparo */}
          <div>
            <Label htmlFor="instructions">Modo de Preparo *</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Descreva o passo a passo..."
              rows={6}
            />
          </div>

          {/* Informações Nutricionais */}
          <div className="space-y-3">
            <Label>Informações Nutricionais (opcional)</Label>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label htmlFor="calories" className="text-xs">Calorias</Label>
                <Input
                  id="calories"
                  type="number"
                  value={macros.calories || ''}
                  onChange={(e) => setMacros({ ...macros, calories: parseFloat(e.target.value) || 0 })}
                  placeholder="kcal"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-xs">Proteína</Label>
                <Input
                  id="protein"
                  type="number"
                  value={macros.protein || ''}
                  onChange={(e) => setMacros({ ...macros, protein: parseFloat(e.target.value) || 0 })}
                  placeholder="g"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-xs">Carboidratos</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={macros.carbs || ''}
                  onChange={(e) => setMacros({ ...macros, carbs: parseFloat(e.target.value) || 0 })}
                  placeholder="g"
                />
              </div>
              <div>
                <Label htmlFor="fat" className="text-xs">Gordura</Label>
                <Input
                  id="fat"
                  type="number"
                  value={macros.fat || ''}
                  onChange={(e) => setMacros({ ...macros, fat: parseFloat(e.target.value) || 0 })}
                  placeholder="g"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags Nutricionais</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableTags.map(tag => (
                <div key={tag.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.value}
                    checked={tags.includes(tag.value)}
                    onCheckedChange={() => toggleTag(tag.value)}
                  />
                  <label
                    htmlFor={tag.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {tag.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dicas, substituições ou observações..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};