import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const RecipeIngredients = () => {
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipeIngredients() {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipe_ingredients")
        .select("*, recipes(title), ingredients(name)");
      if (error) {
        // Handle error (could use a toast)
        setRecipeIngredients([]);
      } else {
        setRecipeIngredients(data || []);
      }
      setLoading(false);
    }
    fetchRecipeIngredients();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Recipe Ingredients</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {recipeIngredients.map((ri) => (
              <Card key={ri.id}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{ri.recipes?.title || "Unknown Recipe"}</div>
                    <div className="text-muted-foreground">{ri.ingredients?.name || "Unknown Ingredient"}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <span className="badge bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded">
                      {ri.amount} {ri.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeIngredients;
