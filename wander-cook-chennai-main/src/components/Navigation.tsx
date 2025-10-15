import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Camera, 
  BookOpen, 
  MapPin, 
  User, 
  Menu,
  X,
  ChefHat
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/upload", icon: Camera, label: "Upload" },
    { to: "/recipes", icon: BookOpen, label: "Recipes" },
    { to: "/stores", icon: MapPin, label: "Stores" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Recipe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button
                  variant={isActive(to) ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    isActive(to) 
                      ? "hero-gradient text-white shadow-lg" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(to) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-lg",
                      isActive(to) 
                        ? "hero-gradient text-white" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animated background particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </nav>
  );
};

export default Navigation;