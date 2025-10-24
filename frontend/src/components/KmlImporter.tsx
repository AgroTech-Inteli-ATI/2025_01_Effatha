import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as toGeoJSON from "@mapbox/togeojson";

interface Coordinate {
  lat: number;
  lng: number;
}

interface KmlImporterProps {
  onPolygonsImported: (polygons: Coordinate[][]) => void;
}

const KmlImporter = ({ onPolygonsImported }: KmlImporterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar extensão
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.kml') && !fileName.endsWith('.kmz')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo KML ou KMZ.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      const parser = new DOMParser();
      const kml = parser.parseFromString(text, "text/xml");

      // Verificar se há erros no XML
      const parseError = kml.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Erro ao processar o arquivo KML");
      }

      // Converter KML para GeoJSON
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const geoJson = toGeoJSON.kml(kml) as any;

      // Extrair coordenadas dos polígonos
      const polygons: Coordinate[][] = [];

      if (geoJson.features && geoJson.features.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geoJson.features.forEach((feature: any) => {
          const geometry = feature.geometry;

          if (geometry.type === "Polygon") {
            // Polígono simples
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coords = geometry.coordinates[0].map((coord: any) => ({
              lat: coord[1],
              lng: coord[0],
            }));
            polygons.push(coords);
          } else if (geometry.type === "MultiPolygon") {
            // Múltiplos polígonos
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geometry.coordinates.forEach((polygon: any) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const coords = polygon[0].map((coord: any) => ({
                lat: coord[1],
                lng: coord[0],
              }));
              polygons.push(coords);
            });
          } else if (geometry.type === "LineString") {
            // Converter linha em polígono (fechando o caminho)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coords = geometry.coordinates.map((coord: any) => ({
              lat: coord[1],
              lng: coord[0],
            }));
            // Fechar o polígono se necessário
            if (coords.length > 0) {
              const first = coords[0];
              const last = coords[coords.length - 1];
              if (first.lat !== last.lat || first.lng !== last.lng) {
                coords.push({ ...first });
              }
            }
            polygons.push(coords);
          } else if (geometry.type === "Point") {
            // Ignorar pontos individuais
            console.log("Ponto ignorado:", geometry.coordinates);
          }
        });
      }

      if (polygons.length === 0) {
        toast({
          title: "Nenhum polígono encontrado",
          description: "O arquivo KML não contém polígonos válidos.",
          variant: "destructive",
        });
        return;
      }

      // Passar os polígonos para o componente pai
      onPolygonsImported(polygons);

      toast({
        title: "Arquivo importado com sucesso!",
        description: `${polygons.length} polígono(s) carregado(s) do arquivo ${file.name}`,
      });
    } catch (error) {
      console.error("Erro ao processar KML:", error);
      toast({
        title: "Erro ao importar arquivo",
        description: "Não foi possível processar o arquivo KML. Verifique se o formato está correto.",
        variant: "destructive",
      });
    }

    // Limpar o input para permitir reimportar o mesmo arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".kml,.kmz"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={triggerFileInput}
        variant="outline"
        size="sm"
        className="w-full border-primary text-primary hover:bg-primary/10"
      >
        <Upload className="h-4 w-4 mr-2" />
        Importar KML
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        <FileText className="h-3 w-3 inline mr-1" />
        Suporta arquivos .kml e .kmz
      </p>
    </div>
  );
};

export default KmlImporter;
