import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      setLoading(true);
      const { data, error } = await supabase
        .from("ingredients")
        .select("*");
      if (error) {
        setIngredients([]);
      } else {
        setIngredients(data || []);
      }
      setLoading(false);
    }
    fetchIngredients();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Ingredients</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {ingredients.map((ingredient) => (
              <Card key={ingredient.id}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{ingredient.name}</div>
                    <div className="text-muted-foreground">{ingredient.category}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <span className="badge bg-gray-100 text-gray-800 border border-gray-200 px-2 py-1 rounded">
                      Added: {new Date(ingredient.created_at).toLocaleDateString()}
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

export default Ingredients;
