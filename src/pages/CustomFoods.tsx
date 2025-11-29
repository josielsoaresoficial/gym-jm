import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  UtensilsCrossed,
  Flame,
  TrendingUp,
  Package
} from "lucide-react";
import { useState } from "react";
import { useCustomFoods, CustomFood } from "@/hooks/useCustomFoods";
import { AddCustomFoodDialog } from "@/components/AddCustomFoodDialog";
import { EditCustomFoodDialog } from "@/components/EditCustomFoodDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_LABELS: Record<string, string> = {
  proteinas: "Proteínas",
  carboidratos: "Carboidratos",
  gorduras: "Gorduras",
  frutas: "Frutas",
  vegetais: "Vegetais",
  lacteos: "Laticínios",
  lanches: "Lanches",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas",
  outros: "Outros",
};

const CATEGORY_COLORS: Record<string, string> = {
  proteinas: "bg-red-500/10 text-red-700 dark:text-red-400",
  carboidratos: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  gorduras: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  frutas: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  vegetais: "bg-green-500/10 text-green-700 dark:text-green-400",
  lacteos: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  lanches: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  bebidas: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  sobremesas: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  outros: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

export default function CustomFoods() {
  const { foods, isLoading, loadFoods, updateFood, deleteFood } = useCustomFoods();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFood, setEditingFood] = useState<CustomFood | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (food: CustomFood) => {
    setEditingFood(food);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    await deleteFood(id);
  };

  // Filtrar alimentos
  const filteredFoods = foods.filter((food) => {
    // Filtro por categoria
    if (selectedCategory !== "all" && food.category !== selectedCategory) {
      return false;
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return food.name.toLowerCase().includes(query);
    }

    return true;
  });

  // Estatísticas
  const stats = {
    total: foods.length,
    avgCalories: Math.round(foods.reduce((sum, f) => sum + f.calories, 0) / (foods.length || 1)),
    avgProtein: Math.round((foods.reduce((sum, f) => sum + f.protein, 0) / (foods.length || 1)) * 10) / 10,
  };

  // Contar por categoria
  const categoryCounts = foods.reduce((acc, food) => {
    acc[food.category] = (acc[food.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="w-full px-4 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              Alimentos Personalizados
            </h1>
            <p className="text-muted-foreground">
              Gerencie sua base de dados nutricional personalizada
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Alimento
          </Button>
        </div>

        {/* Stats Cards */}
        {!isLoading && foods.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Alimentos</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média de Calorias</p>
                    <p className="text-2xl font-bold">{stats.avgCalories} kcal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média de Proteínas</p>
                    <p className="text-2xl font-bold">{stats.avgProtein}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            <TabsTrigger value="all">Todos ({foods.length})</TabsTrigger>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => {
              const count = categoryCounts[value] || 0;
              if (count === 0) return null;
              return (
                <TabsTrigger key={value} value={value}>
                  {label} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Foods Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <UtensilsCrossed className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">
                  {searchQuery || selectedCategory !== "all"
                    ? "Nenhum alimento encontrado"
                    : "Nenhum alimento cadastrado"}
                </p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "Tente ajustar seus filtros ou busca"
                    : "Comece adicionando seu primeiro alimento personalizado"}
                </p>
                {!searchQuery && selectedCategory === "all" && (
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Alimento
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((food) => (
              <Card key={food.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
                        <Badge className={CATEGORY_COLORS[food.category] || CATEGORY_COLORS.outros}>
                          {CATEGORY_LABELS[food.category] || "Outros"}
                        </Badge>
                      </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Calorias</p>
                        <p className="font-semibold">{food.calories} kcal</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Porção</p>
                        <p className="font-semibold">{food.portion}</p>
                      </div>
                    </div>

                    {/* Macros */}
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">P:</span>
                        <span className="font-semibold ml-1">{food.protein}g</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">C:</span>
                        <span className="font-semibold ml-1">{food.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">G:</span>
                        <span className="font-semibold ml-1">{food.fat}g</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {food.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 italic">
                        {food.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(food)}
                        className="flex-1 gap-2"
                      >
                        <Edit2 className="h-3 w-3" />
                        Editar
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 gap-2"
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir alimento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O alimento "{food.name}" será
                              permanentemente removido.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(food.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Food Dialog */}
        <AddCustomFoodDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={loadFoods}
        />

        {/* Edit Food Dialog */}
        <EditCustomFoodDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          food={editingFood}
          onUpdate={updateFood}
        />
      </div>
    </Layout>
  );
}
