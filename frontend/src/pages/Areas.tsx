import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, MapPin, Download, Copy, Check, Loader2 } from "lucide-react";
import MapDrawer, { Coordinate } from "@/components/MapDrawer";
import ExternalMapSearch from "@/components/ExternalMapSearch";
import KmlImporter from "@/components/KmlImporter";
import { useToast } from "@/hooks/use-toast";

const areas = [
  { id: 1, name: "Fazenda 1", state: "Minas Gerais", city: "Ouro Preto", crop: "Milho", status: "Ativa" },
  { id: 2, name: "Fazenda 2", state: "Minas Gerais", city: "Ouro Preto", crop: "Soja", status: "Ativa" },
  { id: 3, name: "Fazenda 3", state: "Goiás", city: "Goiânia", crop: "-", status: "Ativa" },
  { id: 4, name: "Fazenda 4", state: "Minas Gerais", city: "Ouro Preto", crop: "Milho", status: "Ativa" },
];

const Areas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[][]>([]);
  const [areaName, setAreaName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [copied, setCopied] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { toast } = useToast();

  // Função para detectar estado e município a partir de coordenadas
  const detectLocationFromCoordinates = async (lat: number, lng: number) => {
    setIsDetectingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`,
        {
          headers: {
            "Accept-Language": "pt-BR",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao detectar localização");
      }

      const data = await response.json();
      
      if (data.address) {
        const state = data.address.state || data.address.region || "";
        const city = data.address.city || 
                     data.address.town || 
                     data.address.village || 
                     data.address.municipality || "";

        if (state) {
          setSelectedState(state);
        }
        
        if (city) {
          setSelectedCity(city);
        }

        if (state && city) {
          toast({
            title: "Localização detectada!",
            description: `${city}, ${state}`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao detectar localização:", error);
      toast({
        title: "Aviso",
        description: "Não foi possível detectar automaticamente a localização. Por favor, selecione manualmente.",
        variant: "default",
      });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handlePolygonCreated = (coordinates: Coordinate[][]) => {
    setPolygonCoordinates(coordinates);
    console.log("Coordenadas do polígono:", coordinates);
    
    // Detectar localização do primeiro ponto do primeiro polígono
    if (coordinates.length > 0 && coordinates[0].length > 0) {
      const firstPoint = coordinates[0][0];
      detectLocationFromCoordinates(firstPoint.lat, firstPoint.lng);
    }
  };

  const handlePolygonsImported = (polygons: Coordinate[][]) => {
    setPolygonCoordinates(polygons);
    console.log("Polígonos importados do KML:", polygons);
    
    // Detectar localização do primeiro ponto do primeiro polígono
    if (polygons.length > 0 && polygons[0].length > 0) {
      const firstPoint = polygons[0][0];
      detectLocationFromCoordinates(firstPoint.lat, firstPoint.lng);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setMapCenter({ lat, lng });
    toast({
      title: "Centralizando mapa",
      description: name,
    });
  };

  const downloadCoordinates = () => {
    if (polygonCoordinates.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum polígono foi desenhado ainda.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      areaName: areaName || "Area sem nome",
      state: selectedState,
      city: selectedCity,
      crop: selectedCrop,
      polygons: polygonCoordinates,
      createdAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `area_${areaName.replace(/\s+/g, "_") || "sem_nome"}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download concluído",
      description: "As coordenadas foram exportadas com sucesso.",
    });
  };

  const copyCoordinates = () => {
    if (polygonCoordinates.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum polígono foi desenhado ainda.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      areaName: areaName || "Area sem nome",
      state: selectedState,
      city: selectedCity,
      crop: selectedCrop,
      polygons: polygonCoordinates,
    };

    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    
    toast({
      title: "Copiado!",
      description: "As coordenadas foram copiadas para a área de transferência.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveArea = () => {
    if (polygonCoordinates.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, desenhe um polígono no mapa antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você pode adicionar a lógica para salvar no backend
    toast({
      title: "Área salva!",
      description: `A área "${areaName}" foi adicionada com sucesso.`,
    });

    // Resetar o formulário
    setIsDialogOpen(false);
    setPolygonCoordinates([]);
    setAreaName("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedCrop("");
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Áreas</h1>

        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Buscar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por áreas"
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar nova área
          </Button>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Projetos disponíveis</h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Nome</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Cultura predominante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.map((area) => (
                  <TableRow key={area.id} className="border-border">
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell className="text-muted-foreground">{area.state}</TableCell>
                    <TableCell className="text-muted-foreground">{area.city}</TableCell>
                    <TableCell className="text-muted-foreground">{area.crop}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                        {area.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          Atualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">100 projetos disponíveis</p>
              <div className="flex gap-1">
                {[1, 2, 3, "...", 9, 10].map((page, idx) => (
                  <Button
                    key={idx}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={page === 1 ? "bg-primary text-primary-foreground" : "border-border"}
                    disabled={page === "..."}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4 border-b border-border">
              <DialogTitle className="text-2xl font-bold">Criar Nova Área</DialogTitle>
              <p className="text-muted-foreground">Use a barra de busca para encontrar a localização, depois desenhe a área no mapa</p>
            </DialogHeader>

            {/* Barra de busca externa */}
            <div className="px-6 pt-4">
              <ExternalMapSearch onLocationSelect={handleLocationSelect} />
            </div>

            <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
              {/* Mapa Interativo */}
              <div className="flex-1 relative z-0 min-h-0">
                <MapDrawer 
                  onPolygonCreated={handlePolygonCreated}
                  externalPolygons={polygonCoordinates}
                  initialCenter={[-15.7801, -47.9292]}
                  initialZoom={12}
                  centerTo={mapCenter}
                />
                
                {/* Info sobre coordenadas */}
                {polygonCoordinates.length > 0 && (
                  <div className="absolute bottom-4 left-4 z-[1100] bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs">
                    <p className="text-sm font-semibold mb-1">
                      {polygonCoordinates.length === 1 ? "Polígono desenhado" : `${polygonCoordinates.length} Polígonos`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {polygonCoordinates.reduce((total, poly) => total + poly.length, 0)} pontos capturados
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={copyCoordinates}
                        className="text-xs h-7 relative z-[1101]"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar JSON
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={downloadCoordinates}
                        className="text-xs h-7 relative z-[1101]"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Formulário lateral */}
              <div className="w-80 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="font-semibold mb-4">Informações da Área</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="area-name">Nome da Área *</Label>
                      <Input
                        id="area-name"
                        placeholder="Ex: Fazenda Modelo"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        className="bg-card border-border mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Estado *</Label>
                      <div className="relative">
                        <Input
                          id="state"
                          placeholder={isDetectingLocation ? "Detectando..." : "Digite o estado ou desenhe uma área no mapa"}
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="bg-card border-border mt-1"
                          disabled={isDetectingLocation}
                        />
                        {isDetectingLocation && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                      {selectedState && !isDetectingLocation && (
                        <p className="text-xs text-success mt-1">
                          ✓ Detectado automaticamente
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">Município *</Label>
                      <div className="relative">
                        <Input
                          id="city"
                          placeholder={isDetectingLocation ? "Detectando..." : "Digite o município ou desenhe uma área no mapa"}
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="bg-card border-border mt-1"
                          disabled={isDetectingLocation}
                        />
                        {isDetectingLocation && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                        )}
                      </div>
                      {selectedCity && !isDetectingLocation && (
                        <p className="text-xs text-success mt-1">
                          ✓ Detectado automaticamente
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="crop">Cultura principal (opcional)</Label>
                      <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger id="crop" className="bg-card border-border mt-1">
                          <SelectValue placeholder="Selecione a cultura" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soja">Soja</SelectItem>
                          <SelectItem value="milho">Milho</SelectItem>
                          <SelectItem value="cafe">Café</SelectItem>
                          <SelectItem value="cana">Cana-de-açúcar</SelectItem>
                          <SelectItem value="algodao">Algodão</SelectItem>
                          <SelectItem value="trigo">Trigo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Importar KML */}
                    <div className="border-t border-border pt-4">
                      <Label className="mb-2 block">Ou importe de um arquivo</Label>
                      <KmlImporter onPolygonsImported={handlePolygonsImported} />
                    </div>

                    {polygonCoordinates.length > 0 && (
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <p className="text-sm font-semibold text-success">✓ Polígono desenhado</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {polygonCoordinates.length} polígono(s) • Área pronta para ser salva
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end gap-3 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setPolygonCoordinates([]);
                  setAreaName("");
                }}
                className="border-border"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveArea}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!areaName || polygonCoordinates.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Área
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Areas;
