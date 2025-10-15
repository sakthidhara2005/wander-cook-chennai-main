import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Clock,
  Search,
  Navigation,
  Star,
  Filter
} from "lucide-react";

const Stores = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      setLoadingStores(true);
      const { data, error } = await import("../lib/supabaseClient").then(m => m.supabase.from("stores").select("*"));
      if (error) {
        setStores([]);
      } else {
        setStores(data || []);
      }
      setLoadingStores(false);
    }
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDirections = (store: any) => {
    if (store.lat && store.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-animated pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find <span className="hero-gradient bg-clip-text text-transparent">Stores in Chennai</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover grocery stores and supermarkets near you for fresh ingredients
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="card-gradient border-0 shadow-xl h-[500px]">
              <CardContent className="p-0 h-full">
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
              </CardContent>
            </Card>
          </div>

          {/* Store List */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="card-gradient border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stores */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {loadingStores ? (
                <p>Loading stores...</p>
              ) : (
                filteredStores.map((store) => (
                  <Card key={store.id} className="card-gradient border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{store.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{store.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{store.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{store.hours}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => getDirections(store)}
                          className="flex-1"
                        >
                          <Navigation className="mr-2 h-3 w-3" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-8">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No stores found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;