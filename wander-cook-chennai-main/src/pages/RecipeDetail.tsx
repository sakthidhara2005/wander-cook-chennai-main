import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  MapPin,
  ChefHat,
  Utensils
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipeErrorMsg, setRecipeErrorMsg] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRecipeDetail() {
      setLoading(true);
      console.log('Fetching recipe with id:', id);
      
      // Fetch recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();
      console.log('Recipe data:', recipeData, 'Error:', recipeError);

      // Fetch ingredients for this recipe
      const { data: recipeIngredientsData, error: recipeIngredientsError } = await supabase
        .from("recipe_ingredients")
        .select("ingredient_id, amount, unit")
        .eq("recipe_id", id);
      console.log('Recipe ingredients:', recipeIngredientsData, 'Error:', recipeIngredientsError);

      let ingredientsList: any[] = [];
      if (recipeIngredientsData && recipeIngredientsData.length > 0) {
        // Fetch ingredient details for each ingredient_id
        const ingredientIds = recipeIngredientsData.map((ri: any) => ri.ingredient_id);
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from("ingredients")
          .select("id, name")
          .in("id", ingredientIds);
        console.log('Ingredients data:', ingredientsData, 'Error:', ingredientsError);
        
        if (ingredientsData) {
          // Merge ingredient details with amounts and units
          ingredientsList = recipeIngredientsData.map((ri: any) => {
            const ingredientDetail = ingredientsData.find((ing: any) => ing.id === ri.ingredient_id);
            return {
              name: ingredientDetail ? ingredientDetail.name : 'Unknown',
              amount: ri.amount,
              unit: ri.unit,
            };
          });
        }
      }
      setIngredients(ingredientsList);

      if (recipeError) {
        toast({ title: "Error fetching recipe", description: recipeError.message });
        setRecipeErrorMsg(recipeError.message);
      } else if (!recipeData) {
        setRecipeErrorMsg("Recipe not found in Supabase.");
      } else {
        setRecipe(recipeData);
      }
      
      setLoading(false);
    }
    
    fetchRecipeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            <p className="text-lg">Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (recipeErrorMsg) {
    return (
      <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-4">{recipeErrorMsg}</p>
            <Link to="/recipes">
              <Button>Back to Recipes</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Recipe not found</p>
            <Link to="/recipes">
              <Button>Back to Recipes</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/recipes">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Recipes
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipe Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card className="card-gradient border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.title}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                      <Badge variant="secondary" className="text-sm">
                        {recipe.cuisine}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{recipe.cook_time_min} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        <span>{ingredients.length} ingredients</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="card-gradient border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span>Cooking Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {recipe.instructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingredients Sidebar */}
          <div className="space-y-6">
            <Card className="card-gradient border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-6 w-6 text-accent" />
                  <span>Ingredients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Ingredients */}
            {ingredients.some(ing => !ing.available) && (
              <Card className="card-gradient border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-600">
                    Missing Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {ingredients
                      .filter(ing => !ing.available)
                      .map((ingredient, index) => (
                        <div key={index} className="text-sm">
                          • {ingredient.name} ({ingredient.amount})
                        </div>
                      ))}
                  </div>
                  <Link to="/stores">
                    <Button className="w-full hero-gradient text-white hover:opacity-90">
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Nearby Stores
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;