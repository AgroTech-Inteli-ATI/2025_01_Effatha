import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

interface ExternalMapSearchProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

const ExternalMapSearch = ({ onLocationSelect }: ExternalMapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Função de busca
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
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
        setResults([]);
        setShowResults(false);
      } else {
        setResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce: buscar automaticamente após parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        performSearch(searchQuery);
      } else if (searchQuery.length === 0) {
        setResults([]);
        setShowResults(false);
      }
    }, 500); // Espera 500ms após parar de digitar

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const selectLocation = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    onLocationSelect(lat, lon, result.display_name);
    setShowResults(false);
    setSearchQuery(result.display_name.split(',')[0]); // Preenche com nome curto

    toast({
      title: "Local encontrado!",
      description: result.display_name,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      selectLocation(results[0]); // Seleciona primeiro resultado ao pressionar Enter
    } else if (e.key === "Escape") {
      setShowResults(false);
      setResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      setShowResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Digite para buscar (mín. 3 caracteres)..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="pl-10 pr-10 bg-card border-border"
            disabled={isSearching}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="flex items-center px-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Resultados da busca em tempo real */}
      {showResults && searchQuery.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto z-[1200]">
          {results.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground px-2 py-1 mb-1">
                {results.length} resultado(s) encontrado(s):
              </p>
              <div className="space-y-1">
                {results.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => selectLocation(result)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm flex items-start gap-2"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="line-clamp-2">{result.display_name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : isSearching ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Buscando...
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}

      {/* Dica de uso */}
      {searchQuery.length > 0 && searchQuery.length < 3 && !showResults && (
        <p className="text-xs text-muted-foreground mt-1">
          Digite pelo menos 3 caracteres para buscar
        </p>
      )}
    </div>
  );
};

export default ExternalMapSearch;
