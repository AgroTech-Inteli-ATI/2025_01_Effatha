import { useState } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

interface MapSearchProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapSearch = ({ onLocationSelect }: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const map = useMap();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Digite um local",
        description: "Por favor, insira um endereço ou cidade para buscar.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setShowResults(false);

    try {
      // Usar API Nominatim do OpenStreetMap (gratuita)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=br`,
        {
          headers: {
            "Accept-Language": "pt-BR",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar localização");
      }

      const data: SearchResult[] = await response.json();

      if (data.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Não encontramos esse local. Tente ser mais específico.",
          variant: "destructive",
        });
        setResults([]);
      } else {
        setResults(data);
        setShowResults(true);

        // Se houver apenas 1 resultado, centralizar automaticamente
        if (data.length === 1) {
          centerMap(data[0]);
        }
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o local. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao buscar:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const centerMap = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    // Adicionar marcador no local
    setSelectedLocation({
      lat,
      lng: lon,
      name: result.display_name,
    });

    // Centralizar o mapa
    map.setView([lat, lon], 15, {
      animate: true,
      duration: 1,
    });

    // Se houver boundingbox, ajustar para mostrar toda a área
    if (result.boundingbox && result.boundingbox.length === 4) {
      const [south, north, west, east] = result.boundingbox.map(parseFloat);
      map.fitBounds([
        [south, west],
        [north, east],
      ], {
        padding: [50, 50],
        maxZoom: 16,
      });
    }

    setShowResults(false);
    
    // Callback para componente pai
    if (onLocationSelect) {
      onLocationSelect(lat, lon);
    }

    toast({
      title: "Local encontrado!",
      description: result.display_name,
    });
  };

  const clearLocation = () => {
    setSelectedLocation(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Marcador de localização selecionada */}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold text-sm mb-1">Local Encontrado</p>
              <p className="text-xs text-muted-foreground">{selectedLocation.name}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={clearLocation}
                className="mt-2 w-full text-xs h-7"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar Marcador
              </Button>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default MapSearch;
