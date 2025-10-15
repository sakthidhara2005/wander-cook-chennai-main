import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Stores from "./pages/Stores";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Ingredients from "./pages/Ingredients";
import Favorites from "./pages/Favorites";
import RecipeIngredients from "./pages/RecipeIngredients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe-ingredients" element={<RecipeIngredients />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
