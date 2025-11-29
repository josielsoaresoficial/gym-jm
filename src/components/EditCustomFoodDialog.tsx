import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CustomFood } from "@/hooks/useCustomFoods";

interface EditCustomFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: CustomFood | null;
  onUpdate: (id: string, updates: Partial<CustomFood>) => Promise<boolean>;
}

const CATEGORIES = [
  { value: "proteinas", label: "Proteínas" },
  { value: "carboidratos", label: "Carboidratos" },
  { value: "gorduras", label: "Gorduras" },
  { value: "frutas", label: "Frutas" },
  { value: "vegetais", label: "Vegetais" },
  { value: "lacteos", label: "Laticínios" },
  { value: "lanches", label: "Lanches" },
  { value: "bebidas", label: "Bebidas" },
  { value: "sobremesas", label: "Sobremesas" },
  { value: "outros", label: "Outros" },
];

export function EditCustomFoodDialog({ open, onOpenChange, food, onUpdate }: EditCustomFoodDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    portion: "100g",
    category: "outros",
    notes: "",
  });

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        calories: food.calories.toString(),
        protein: food.protein.toString(),
        carbs: food.carbs.toString(),
        fat: food.fat.toString(),
        portion: food.portion,
        category: food.category || "outros",
        notes: food.notes || "",
      });
    }
  }, [food]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food) return;

    const calories = parseInt(formData.calories);
    const protein = parseFloat(formData.protein);
    const carbs = parseFloat(formData.carbs);
    const fat = parseFloat(formData.fat);

    if (isNaN(calories) || calories < 0 || isNaN(protein) || protein < 0 || 
        isNaN(carbs) || carbs < 0 || isNaN(fat) || fat < 0) {
      return;
    }

    setLoading(true);

    const success = await onUpdate(food.id, {
      name: formData.name.trim(),
      calories,
      protein,
      carbs,
      fat,
      portion: formData.portion.trim() || "100g",
      category: formData.category,
      notes: formData.notes.trim() || null,
    });

    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Alimento</DialogTitle>
          <DialogDescription>
            Modifique as informações do alimento personalizado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Alimento *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Bolo de chocolate caseiro"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="edit-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-calories">Calorias (kcal) *</Label>
              <Input
                id="edit-calories"
                type="number"
                min="0"
                step="1"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-portion">Porção *</Label>
              <Input
                id="edit-portion"
                value={formData.portion}
                onChange={(e) => setFormData({ ...formData, portion: e.target.value })}
                placeholder="100g"
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Macronutrientes (g) *</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-protein" className="text-xs text-muted-foreground">
                  Proteínas
                </Label>
                <Input
                  id="edit-protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-carbs" className="text-xs text-muted-foreground">
                  Carboidratos
                </Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-fat" className="text-xs text-muted-foreground">
                  Gorduras
                </Label>
                <Input
                  id="edit-fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notas (opcional)</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ex: Receita da vovó, versão sem lactose..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
