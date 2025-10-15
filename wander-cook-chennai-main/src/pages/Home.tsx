import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  BookOpen, 
  MapPin, 
  Clock,
  Utensils,
  Sparkles,
  ArrowRight,
  Globe
} from "lucide-react";
import heroImage from "@/assets/hero-travel-cooking.jpg";

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: "Smart Upload",
      description: "Snap photos of your ingredients and get instant recipe suggestions",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      title: "Recipe Library",
      description: "Discover authentic Indian recipes adapted for travelers",
      color: "text-secondary"
    },
    {
      icon: MapPin,
      title: "Store Locator",
      description: "Find nearby stores in Chennai for fresh ingredients",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Quick Meals",
      description: "15-minute recipes perfect for busy travelers",
      color: "text-primary"
    }
  ];

  const stats = [
    { number: "500+", label: "Recipes", icon: Utensils },
    { number: "50+", label: "Stores", icon: MapPin },
    { number: "10k+", label: "Happy Cooks", icon: Sparkles },
    { number: "15+", label: "Cuisines", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-animated">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="block">Cook Smart,</span>
                  <span className="hero-gradient bg-clip-text text-transparent">
                    Travel Better
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your travel ingredients into delicious meals. Reduce food waste, 
                  discover new flavors, and cook with confidence anywhere in the world.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload">
                  <Button size="lg" className="hero-gradient text-white hover:opacity-90 shadow-xl group">
                    <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Cooking
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/recipes">
                  <Button variant="outline" size="lg" className="border-2 hover:bg-muted/50">
                    Browse Recipes
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map(({ number, label, icon: Icon }) => (
                  <div key={label} className="text-center group">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{number}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Travel cooking adventure" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 hero-gradient opacity-20"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 hero-gradient rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cook Anywhere, <span className="hero-gradient bg-clip-text text-transparent">Anytime</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your intelligent cooking companion for culinary adventures around the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-gradient border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 hero-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Static Map Section - replaces interactive setup UI */}
      <div style={{textAlign:'center', marginTop:'20px'}}>
        <h2>Chennai Map</h2>
        <iframe
          width="100%"
          height="400"
          style={{border:0, borderRadius:'12px'}}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31085.06137955693!2d80.20956629999999!3d13.082680299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265e3d7c92d3f%3A0x2d8a0b62b6e68e15!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1694254122331!5m2!1sen!2sin"
        ></iframe>
      </div>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="hero-gradient text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Start Your Culinary Adventure
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of travelers discovering amazing recipes worldwide
                </p>
                <Link to="/upload">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg group px-8 py-3"
                  >
                    <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Upload Ingredients Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;