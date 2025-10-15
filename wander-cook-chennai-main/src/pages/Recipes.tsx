import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Clock, 
  Users, 
  Heart,
  Filter,
  Star,
  ChefHat
} from "lucide-react";

import butterChickenImage from "@/assets/butter-chicken.jpg";
import masalaDosaImage from "@/assets/masala-dosa.jpg";
import chickenBiryaniImage from "@/assets/chicken-biryani.jpg";
import tandooriChickenImage from "@/assets/tandoori-chicken.jpg";
import filterCoffeeImage from "@/assets/filter-coffee.jpg";
import masalaVadaImage from "@/assets/masala-vada.jpg";

import { supabase } from "../lib/supabaseClient";
import { useEffect } from "react";

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  const { toast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from Supabase
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*");
      if (error) {
        toast({ title: "Error fetching recipes", description: error.message });
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || (recipe.difficulty?.toLowerCase() === selectedDifficulty);
    const matchesTime = selectedTime === "all" || 
      (selectedTime === "quick" && recipe.cook_time_min <= 30) ||
      (selectedTime === "medium" && recipe.cook_time_min > 30 && recipe.cook_time_min <= 60) ||
      (selectedTime === "long" && recipe.cook_time_min > 60);
    return matchesSearch && matchesDifficulty && matchesTime;
  });

  const toggleLike = (recipeId: number) => {
    setLikedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
    
    toast({
      title: likedRecipes.includes(recipeId) ? "Removed from favorites" : "Added to favorites",
      description: "Check your profile to see all saved recipes",
      duration: 2000,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover <span className="hero-gradient bg-clip-text text-transparent">Amazing Recipes</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Authentic Indian flavors perfect for travelers and food enthusiasts
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="card-gradient border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Any Time</option>
                    <option value="quick">Under 30 min</option>
                    <option value="medium">30-60 min</option>
                    <option value="long">Over 60 min</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-muted-foreground">Loading recipes...</p>
          ) : (
            <p className="text-muted-foreground">
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>
          )}
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-gradient border-0 overflow-hidden">
              <div className="relative">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                  onClick={() => toggleLike(recipe.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${likedRecipes.includes(recipe.id) ? 'fill-current' : ''}`} 
                  />
                </Button>
                <div className="absolute bottom-3 left-3">
                  <Badge className={getDifficultyColor(recipe.difficulty || "Medium")}> {/* fallback if missing */}
                    {recipe.difficulty || "Medium"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                  {/* You can add rating if you add it to your table */}
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cook_time_min} min</span>
                  </div>
                  {/* Serves info can be added if you add it to your table */}
                </div>
                {/* Tags can be added if you add them to your table */}
                <Link to={`/recipe/${recipe.id}`}>
                  <Button className="w-full hero-gradient text-white hover:opacity-90 group">
                    <ChefHat className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    View Recipe
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;