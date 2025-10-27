import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap, useMapEvents, Marker, Popup, LayersControl, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapDrawer.css";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";

// Fix para ícones do Leaflet - usar caminhos absolutos do CDN
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface Coordinate {
  lat: number;
  lng: number;
}

interface MapDrawerProps {
  onPolygonCreated: (coordinates: Coordinate[][]) => void;
  onPolygonsImported?: (polygons: Coordinate[][]) => void;
  externalPolygons?: Coordinate[][];
  initialCenter?: [number, number];
  initialZoom?: number;
  centerTo?: { lat: number; lng: number } | null;
  showSearchBar?: boolean;
}

const DrawingControls = ({ 
  isDrawing, 
  onStartDrawing, 
  onClearPolygon,
  hasPolygon 
}: { 
  isDrawing: boolean; 
  onStartDrawing: () => void; 
  onClearPolygon: () => void;
  hasPolygon: boolean;
}) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="sm"
        onClick={onStartDrawing}
        disabled={isDrawing}
        className={`bg-primary hover:bg-primary/90 shadow-lg ${isDrawing ? 'opacity-50' : ''}`}
      >
        <Pencil className="h-4 w-4 mr-2" />
        {isDrawing ? "Desenhando..." : "Desenhar Polígono"}
      </Button>
      {hasPolygon && (
        <Button
          size="sm"
          variant="destructive"
          onClick={onClearPolygon}
          className="shadow-lg"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      )}
    </div>
  );
};

const PolygonDrawer = ({ 
  onPolygonComplete, 
  isDrawing, 
  setIsDrawing 
}: { 
  onPolygonComplete: (coords: Coordinate[]) => void;
  isDrawing: boolean;
  setIsDrawing: (val: boolean) => void;
}) => {
  const [currentPoints, setCurrentPoints] = useState<Coordinate[]>([]);
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!isDrawing) return;
      
      const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
      setCurrentPoints([...currentPoints, newPoint]);
    },
  });

  useEffect(() => {
    if (!isDrawing) {
      setCurrentPoints([]);
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentPoints.length >= 3) {
        e.preventDefault();
        e.stopPropagation();
        onPolygonComplete(currentPoints);
        setCurrentPoints([]);
        setIsDrawing(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPoints([]);
        setIsDrawing(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [currentPoints, isDrawing, onPolygonComplete, setIsDrawing]);

  // Renderizar marcadores para cada ponto clicado
  return (
    <>
      {/* Marcadores para cada ponto */}
      {currentPoints.map((point, idx) => (
        <CircleMarker
          key={idx}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-xs">
              <p className="font-semibold">Ponto {idx + 1}</p>
              <p className="text-muted-foreground">
                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Polígono temporário (aparece quando há 2+ pontos) */}
      {currentPoints.length >= 2 && (
        <Polygon
          positions={currentPoints.map(p => [p.lat, p.lng])}
          pathOptions={{ 
            color: '#3b82f6', 
            fillColor: '#60a5fa',
            fillOpacity: 0.3,
            dashArray: '5, 5',
            weight: 2
          }}
        />
      )}
    </>
  );
};

// Componente para centralizar mapa quando centerTo mudar
const MapCenterController = ({ centerTo }: { centerTo?: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (centerTo) {
      map.setView([centerTo.lat, centerTo.lng], 15, {
        animate: true,
        duration: 1,
      });
    }
  }, [centerTo, map]);

  return null;
};

// Componente para ajustar zoom aos polígonos importados
const FitBoundsController = ({ polygons }: { polygons: Coordinate[][] }) => {
  const map = useMap();
  const hasAdjustedRef = useRef(false);

  useEffect(() => {
    if (polygons.length > 0 && !hasAdjustedRef.current) {
      const allCoords: [number, number][] = [];
      
      polygons.forEach(polygon => {
        polygon.forEach(coord => {
          allCoords.push([coord.lat, coord.lng]);
        });
      });

      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 1,
        });
        hasAdjustedRef.current = true;
      }
    } else if (polygons.length === 0) {
      // Resetar flag quando polígonos forem limpos
      hasAdjustedRef.current = false;
    }
  }, [polygons, map]);

  return null;
};

const MapDrawer = ({ 
  onPolygonCreated, 
  externalPolygons = [],
  initialCenter = [-15.7801, -47.9292], // Brasília, Brasil
  initialZoom = 12,
  centerTo = null,
  showSearchBar = false
}: MapDrawerProps) => {
  const [polygons, setPolygons] = useState<Coordinate[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; name: string } | null>(null);

  // Atualizar polígonos internos quando externalPolygons mudar
  useEffect(() => {
    if (externalPolygons && externalPolygons.length > 0) {
      setPolygons(externalPolygons);
    }
  }, [externalPolygons]);

  const handlePolygonComplete = (coords: Coordinate[]) => {
    const newPolygons = [...polygons, coords];
    setPolygons(newPolygons);
    onPolygonCreated(newPolygons);
  };

  const handleClearPolygon = () => {
    setPolygons([]);
    onPolygonCreated([]);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
  };

  const clearSearchMarker = () => {
    setSearchMarker(null);
  };

  // Atualizar marcador quando centerTo mudar
  useEffect(() => {
    if (centerTo) {
      setSearchMarker({
        lat: centerTo.lat,
        lng: centerTo.lng,
        name: "Local encontrado",
      });
    }
  }, [centerTo]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border relative z-0">
      {isDrawing && (
        <div className="absolute top-4 right-4 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-semibold">Modo de Desenho Ativo</p>
          <p className="text-xs mt-1">Clique no mapa para adicionar pontos</p>
          <p className="text-xs">Pressione ENTER para finalizar (mín. 3 pontos)</p>
          <p className="text-xs">Pressione ESC para cancelar</p>
        </div>
      )}
      
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Mapa (OpenStreetMap)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satélite (Google)">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Híbrido (Google)">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terreno (OpenTopoMap)">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* Controlador de centralização */}
        <MapCenterController centerTo={centerTo} />
        
        {/* Ajustar zoom aos polígonos importados */}
        <FitBoundsController polygons={polygons} />
        
        {/* Marcador de busca */}
        {searchMarker && (
          <Marker position={[searchMarker.lat, searchMarker.lng]}>
            <Popup className="custom-popup" closeButton={true}>
              <div className="p-2 relative z-[2000]">
                <p className="font-semibold text-sm mb-1">📍 {searchMarker.name}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSearchMarker}
                  className="mt-2 w-full text-xs h-7 relative z-[2001]"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar Marcador
                </Button>
              </div>
            </Popup>
          </Marker>
        )}
        
        {polygons.map((polygon, idx) => (
          <Polygon
            key={idx}
            positions={polygon.map(p => [p.lat, p.lng])}
            pathOptions={{ 
              color: '#16a34a', 
              fillColor: '#22c55e',
              fillOpacity: 0.3,
              weight: 2
            }}
          />
        ))}

        <PolygonDrawer 
          onPolygonComplete={handlePolygonComplete} 
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
        />
        
        <DrawingControls
          isDrawing={isDrawing}
          onStartDrawing={handleStartDrawing}
          onClearPolygon={handleClearPolygon}
          hasPolygon={polygons.length > 0}
        />
      </MapContainer>
    </div>
  );
};

export default MapDrawer;
