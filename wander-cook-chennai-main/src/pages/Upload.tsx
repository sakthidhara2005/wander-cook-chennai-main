import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload as UploadIcon, 
  Camera, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Image as ImageIcon
} from "lucide-react";
import ingredientsImage from "@/assets/ingredients-upload.jpg";
import { genAI } from "../lib/geminiClient";
import { supabase } from "@/lib/supabaseClient";  // ✅ Added import

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ label: string; confidence?: number }>>([]);
  const [recipeText, setRecipeText] = useState<string>("");
  const [manualIngredient, setManualIngredient] = useState<string>("");
  const [manualLoading, setManualLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // ✅ Fixed Manual ingredient search handler
  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualIngredient.trim();
    if (!query) return;

    setManualLoading(true);
    setRecipeText("");

    try {
      // Step 1: Find ingredient IDs that match the search text
      const { data: ingredients, error: ingredientError } = await supabase
        .from("ingredients")
        .select("id, name")
        .ilike("name", `%${query}%`);

      if (ingredientError) throw ingredientError;
      if (!ingredients || ingredients.length === 0) {
        setRecipeText("No matching ingredients found.");
        try {
          // Query Supabase for recipes containing the entered ingredient (at least one match)
          const { data, error } = await supabase
            .from("recipes")
            .select("title, description, recipe_ingredients(ingredient_id, ingredients(name))")
            .contains("recipe_ingredients.ingredients.name", [manualIngredient.trim()]);
          console.log('Supabase recipe response:', data, error);
          if (error) {
            setRecipeText("Could not fetch recipe suggestions.");
          } else if (data && data.length > 0) {
            // Find the first recipe with at least one matching ingredient (case-insensitive)
            const inputIngredient = manualIngredient.trim().toLowerCase();
            const matchingRecipe = data.find(recipe =>
              recipe.recipe_ingredients?.some(ri =>
                ri.ingredients?.name?.toLowerCase() === inputIngredient
              )
            );
            // If no exact match, try partial match
            const fallbackRecipe = !matchingRecipe ? data.find(recipe =>
              recipe.recipe_ingredients?.some(ri =>
                ri.ingredients?.name?.toLowerCase().includes(inputIngredient)
              )
            ) : null;
            const recipeToShow = matchingRecipe || fallbackRecipe || data[0];
            setRecipeText(`Suggested Recipe: ${recipeToShow.title}\n${recipeToShow.description || ""}`);
          } else {
            setRecipeText("No matching recipes found in database.");
          }
        } catch (err) {
          setRecipeText("Error suggesting recipe from database.");
        } finally {
          setManualLoading(false);
        }
        const recipe = recipes[0];
        setRecipeText(`Suggested Recipe: ${recipe.title}\n${recipe.description || ""}`);
      } else {
        setRecipeText("No matching recipes found in database.");
      }
    } catch (err) {
      console.error("Manual ingredient search error:", err);
      setRecipeText("Error suggesting recipe from database.");
    } finally {
      setManualLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        processImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setIsProcessed(false);
    setDetectedObjects([]);
    setRecipeText("");

    try {
      // Use Gemini AI for image ingredient detection
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = (event.target?.result as string).split(",")[1];
          const result = await model.generateContent([
            { inlineData: { mimeType: file.type, data: base64 } },
            "What food items or ingredients are visible in this image? List only what you see, one per line."
          ]);
          const text = result.response.text();
          // Parse ingredient names from Gemini response
          const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          const ingredients = lines.map((line) => ({ label: line }));
          setDetectedObjects(ingredients);
          setIsProcessed(true);
          toast({
            title: "Gemini AI Analysis complete",
            description: `Found ${ingredients.length} items`,
            duration: 3500,
          });

          // Suggest a recipe from Supabase database using detected ingredients
          try {
            const ingredientNames = ingredients.map(i => i.label).filter(Boolean);
            if (ingredientNames.length > 0) {
              const { data, error } = await supabase
                .from("recipes")
                .select("title, description, recipe_ingredients(ingredient_id, ingredients(name))")
                .in("recipe_ingredients.ingredients.name", ingredientNames);
              if (error) {
                setRecipeText("Could not fetch recipe suggestions.");
              } else if (data && data.length > 0) {
                const recipe = data[0];
                setRecipeText(
                  `Suggested Recipe: ${recipe.title}\n${recipe.description || ""}`
                );
              } else {
                setRecipeText("No matching recipes found in database.");
              }
            }
          } catch (err) {
            setRecipeText("Error suggesting recipe from database.");
          }
        } catch (error: any) {
          setDetectedObjects([]); // Clear detected ingredients on error
          setIsProcessed(false);
          toast({
            title: "Gemini AI error",
            description: error?.message ?? "Unable to analyze image. Please check your Gemini API key and model access.",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      setDetectedObjects([]); // Clear detected ingredients on error
      setIsProcessed(false);
      toast({
        title: "Analysis error",
        description: error?.message ?? "Unable to analyze image. Please check your Gemini API key and model access.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        processImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectedIngredients = detectedObjects.length
    ? detectedObjects.map((o) => ({ name: o.label }))
    : [];

  return (
    <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Upload Your <span className="hero-gradient bg-clip-text text-transparent">Ingredients</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Take a photo of your ingredients and let AI find the perfect recipes for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="card-gradient border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-primary" />
                <span>Ingredient Photo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedImage ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your image here</p>
                  <p className="text-muted-foreground mb-4">or click to browse</p>
                  <Button variant="outline" className="group-hover:bg-primary/5">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded ingredients" 
                      className="w-full h-64 object-cover"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Sparkles className="h-8 w-8 mx-auto mb-2 animate-spin" />
                          <p>Analyzing ingredients...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isProcessing && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUploadedImage(null);
                        setIsProcessed(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="w-full"
                    >
                      Upload Different Image
                    </Button>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Manual ingredient entry */}
              <form onSubmit={handleManualSearch} className="mt-6 flex flex-col items-center">
                <label htmlFor="manual-ingredient" className="mb-2 font-medium text-lg text-muted-foreground">Or type your ingredient:</label>
                <input
                  id="manual-ingredient"
                  type="text"
                  value={manualIngredient}
                  onChange={e => {
                    setManualIngredient(e.target.value);
                    console.log('Manual ingredient input:', e.target.value);
                  }}
                  placeholder="e.g. Apple, Tomato, Rice..."
                  className="border rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:ring focus:border-primary"
                  disabled={manualLoading}
                />
                <Button
                  type="submit"
                  className="mt-3 w-full max-w-xs"
                  disabled={!manualIngredient.trim()}
                >
                  {manualLoading ? "Searching..." : "Find Recipe"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="card-gradient border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-accent" />
                <span>AI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div className="text-center py-8">
                  <img 
                    src={ingredientsImage} 
                    alt="Example ingredients" 
                    className="w-full h-48 object-cover rounded-lg mb-4 opacity-50"
                  />
                  <p className="text-muted-foreground">
                    Upload an image to see AI-powered ingredient detection
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                  <p className="text-lg font-medium">Analyzing your ingredients...</p>
                  <p className="text-muted-foreground">This may take a few seconds</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Detected Ingredients:</h3>
                    <div className="space-y-2">
                      {detectedIngredients.map((ingredient) => (
                        <div key={ingredient.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{ingredient.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isProcessed && (
                    <div className="space-y-4">
                      <div className="p-4 hero-gradient rounded-lg text-white text-center">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Analysis Complete!</p>
                        <p className="text-sm opacity-90">Found {detectedIngredients.length} ingredients</p>
                      </div>

                      {recipeText && (
                        <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
                          <h4 className="font-semibold mb-2">Suggested Recipe</h4>
                          <p className="text-sm text-muted-foreground">{recipeText}</p>
                        </div>
                      )}
                      
                      <Link to="/recipes">
                        <Button size="lg" className="w-full hero-gradient text-white hover:opacity-90 group">
                          View All Recipe Suggestions
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
