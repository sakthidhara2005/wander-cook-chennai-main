import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Heart, 
  ChefHat, 
  Award,
  Settings,
  Bell,
  Globe,
  Utensils,
  Clock,
  Star,
  Camera,
  Edit
} from "lucide-react";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const { toast } = useToast();

  const userStats = {
    recipesCooked: 24,
    favoriteRecipes: 8,
    totalCookingTime: "18 hours",
    averageRating: 4.6,
    recipesShared: 3,
    ingredientsUploaded: 45
  };

  const favoriteRecipes = [
    { id: 1, name: "Butter Chicken", difficulty: "Medium", cookingTime: "45 min", rating: 4.8 },
    { id: 2, name: "Masala Dosa", difficulty: "Hard", cookingTime: "30 min", rating: 4.9 },
    { id: 3, name: "Chicken Biryani", difficulty: "Hard", cookingTime: "90 min", rating: 4.7 },
    { id: 4, name: "Filter Coffee", difficulty: "Easy", cookingTime: "10 min", rating: 4.5 }
  ];

  const recentActivity = [
    { action: "Cooked Butter Chicken", date: "2 days ago", icon: ChefHat },
    { action: "Liked Masala Dosa recipe", date: "3 days ago", icon: Heart },
    { action: "Uploaded ingredient photo", date: "5 days ago", icon: Camera },
    { action: "Shared Tandoori Chicken recipe", date: "1 week ago", icon: Star }
  ];

  const achievements = [
    { title: "First Recipe", description: "Cooked your first recipe", earned: true },
    { title: "Recipe Explorer", description: "Tried 10 different recipes", earned: true },
    { title: "Ingredient Master", description: "Uploaded 50 ingredient photos", earned: false },
    { title: "Social Cook", description: "Shared 5 recipes", earned: false }
  ];

  const dietaryPreferences = [
    { name: "Vegetarian", enabled: false },
    { name: "Vegan", enabled: false },
    { name: "Gluten-Free", enabled: true },
    { name: "Low-Carb", enabled: false },
    { name: "Dairy-Free", enabled: false },
    { name: "Nut-Free", enabled: true }
  ];

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved!",
      description: "Your dietary preferences have been updated successfully.",
      duration: 3000,
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
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <Card className="card-gradient border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="text-2xl hero-gradient text-white">TC</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">Travel Chef</h1>
                <p className="text-muted-foreground mb-4">
                  Passionate home cook exploring Indian cuisine while traveling
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  <Badge variant="secondary">🍛 Indian Cuisine</Badge>
                  <Badge variant="secondary">✈️ Travel Enthusiast</Badge>
                  <Badge variant="secondary">📱 Tech Savvy</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{userStats.recipesCooked}</div>
                    <div className="text-sm text-muted-foreground">Recipes Cooked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{userStats.favoriteRecipes}</div>
                    <div className="text-sm text-muted-foreground">Favorites</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-2xl font-bold text-accent">{userStats.averageRating}</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-gradient border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-gradient border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-accent" />
                    <span>Cooking Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <ChefHat className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{userStats.totalCookingTime}</div>
                      <div className="text-xs text-muted-foreground">Total Time</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <Camera className="h-6 w-6 mx-auto mb-2 text-secondary" />
                      <div className="font-semibold">{userStats.ingredientsUploaded}</div>
                      <div className="text-xs text-muted-foreground">Photos Uploaded</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <Star className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <div className="font-semibold">{userStats.recipesShared}</div>
                      <div className="text-xs text-muted-foreground">Recipes Shared</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">Chennai</div>
                      <div className="text-xs text-muted-foreground">Current City</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="card-gradient border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Favorite Recipes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {favoriteRecipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{recipe.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge className={getDifficultyColor(recipe.difficulty)} variant="outline">
                            {recipe.difficulty}
                          </Badge>
                          <span>•</span>
                          <span>{recipe.cookingTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{recipe.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="card-gradient border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${
                      achievement.earned 
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                        : 'bg-muted/20 border-muted text-muted-foreground'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-gradient border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <span>Dietary Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dietaryPreferences.map((pref, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium">{pref.name}</span>
                      <Switch checked={pref.enabled} />
                    </div>
                  ))}
                  <Button onClick={handleSavePreferences} className="w-full hero-gradient text-white hover:opacity-90">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-gradient border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-accent" />
                    <span>Privacy & Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-muted-foreground">Get notified about new recipes</div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">Public Profile</div>
                      <div className="text-sm text-muted-foreground">Make your profile visible to others</div>
                    </div>
                    <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                  </div>

                  <Button variant="outline" className="w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;