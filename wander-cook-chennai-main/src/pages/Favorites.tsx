import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("*, recipes(title, image_url)");
      if (error) {
        setFavorites([]);
      } else {
        setFavorites(data || []);
      }
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Favorites</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <Card key={fav.id}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {fav.recipes?.image_url && (
                      <img src={fav.recipes.image_url} alt={fav.recipes.title} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <div className="font-semibold">{fav.recipes?.title || "Unknown Recipe"}</div>
                      <div className="text-muted-foreground">Added: {new Date(fav.created_at).toLocaleDateString()}</div>
                    </div>
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

export default Favorites;
