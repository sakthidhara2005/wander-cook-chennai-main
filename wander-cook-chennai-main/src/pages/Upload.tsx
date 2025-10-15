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

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ label: string; confidence: number }>>([]);
  const [recipeText, setRecipeText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      const apiUrl = (import.meta as any).env?.VITE_ANALYZE_API_URL as string | undefined;
      const apiKey = (import.meta as any).env?.VITE_ANALYZE_API_KEY as string | undefined;

      if (apiUrl) {
        const formData = new FormData();
        // Common field names
        formData.append("file", file);
        formData.append("image", file);

        const headers: Record<string, string> = {};
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

        const res = await fetch(apiUrl, { method: "POST", headers, body: formData });
        if (!res.ok) throw new Error(`Analyze API failed (${res.status})`);
        const data = await res.json();

        const objects = Array.isArray(data.objects)
          ? data.objects
          : Array.isArray(data.detections)
            ? data.detections
            : [];

        setDetectedObjects(
          objects.map((o: any) => ({
            label: String(o.label ?? o.name ?? "ingredient"),
            confidence: Number(o.confidence ?? o.score ?? 0.9),
          }))
        );

        const recipe =
          data.recipe?.text ??
          data.recipe ??
          data.result ??
          data.choices?.[0]?.message?.content ??
          "";
        if (recipe) setRecipeText(String(recipe));

        setIsProcessed(true);
        toast({
          title: "Analysis complete",
          description: recipe ? "Recipe generated" : `Found ${objects.length} items`,
          duration: 3500,
        });
      } else {
        // Fallback demo if no external API configured
        const mock = [
          { label: "Tomatoes", confidence: 0.95 },
          { label: "Onions", confidence: 0.90 },
          { label: "Garlic", confidence: 0.88 },
        ];
        setDetectedObjects(mock);
        setRecipeText(
          "Simple Tomato Onion Curry:\n1) Saute onions + garlic\n2) Add tomatoes + spices\n3) Simmer and serve."
        );
        setIsProcessed(true);
        toast({ title: "Demo analysis", description: `Found ${mock.length} items`, duration: 3000 });
      }
    } catch (error: any) {
      toast({
        title: "Analysis error",
        description: error?.message ?? "Unable to analyze image",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
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
    ? detectedObjects.map((o) => ({ name: o.label, confidence: Math.round(o.confidence * 100) }))
    : [
        { name: "Tomatoes", confidence: 95 },
        { name: "Onions", confidence: 90 },
        { name: "Ginger", confidence: 85 },
        { name: "Garlic", confidence: 88 },
        { name: "Cilantro", confidence: 82 },
        { name: "Green Chilies", confidence: 79 }
      ];

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
                          <span className="text-sm text-muted-foreground">
                            {ingredient.confidence}%
                          </span>
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