/**
 * Modal para criar/editar Área com mapa integrado
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Copy, Check } from "lucide-react";
import MapDrawer, { Coordinate } from "@/components/MapDrawer";
import ExternalMapSearch from "@/components/ExternalMapSearch";
import KmlImporter from "@/components/KmlImporter";
import { useToast } from "@/hooks/use-toast";
import type { Area, CreateAreaDTO } from "@/types/area";
import type { Propriedade } from "@/types/propriedade";

interface AreaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAreaDTO) => Promise<void>;
  area?: Area | null;
  propriedades: Propriedade[];
  isLoading?: boolean;
}

export function AreaFormDialog({
  open,
  onOpenChange,
  onSubmit,
  area,
  propriedades,
  isLoading = false,
}: AreaFormDialogProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateAreaDTO>({
    propriedade_id: 0,
    coordenada: [],
    municipio: "",
    estado: "",
    nome_area: "",
    cultura_principal: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAreaDTO, string>>>({});
  const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[][]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preencher formulário ao editar
  useEffect(() => {
    if (area) {
      setFormData({
        propriedade_id: area.propriedade_id,
        coordenada: area.coordenada || [],
        municipio: area.municipio,
        estado: area.estado,
        nome_area: area.nome_area,
        cultura_principal: area.cultura_principal || "",
        observacoes: area.observacoes || "",
      });
      if (area.coordenada) {
        setPolygonCoordinates(area.coordenada);
      }
    } else {
      setFormData({
        propriedade_id: propriedades.length > 0 ? propriedades[0].id : 0,
        coordenada: [],
        municipio: "",
        estado: "",
        nome_area: "",
        cultura_principal: "",
        observacoes: "",
      });
      setPolygonCoordinates([]);
    }
    setErrors({});
    setMapCenter(null);
  }, [area, open, propriedades]);

  // Atualizar coordenadas no formData quando polígono muda
  useEffect(() => {
    setFormData(prev => ({ ...prev, coordenada: polygonCoordinates }));
  }, [polygonCoordinates]);

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
          setFormData(prev => ({ ...prev, estado: state }));
        }
        
        if (city) {
          setFormData(prev => ({ ...prev, municipio: city }));
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
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handlePolygonCreated = (coordinates: Coordinate[][]) => {
    setPolygonCoordinates(coordinates);
    
    if (coordinates.length > 0 && coordinates[0].length > 0) {
      const firstPoint = coordinates[0][0];
      detectLocationFromCoordinates(firstPoint.lat, firstPoint.lng);
    }
  };

  const handlePolygonsImported = (polygons: Coordinate[][]) => {
    setPolygonCoordinates(polygons);
    
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
      ...formData,
      polygons: polygonCoordinates,
      createdAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `area_${formData.nome_area.replace(/\s+/g, "_") || "sem_nome"}_${Date.now()}.json`;
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

    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    
    toast({
      title: "Copiado!",
      description: "As coordenadas foram copiadas para a área de transferência.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAreaDTO, string>> = {};

    if (!formData.nome_area.trim()) {
      newErrors.nome_area = "Nome da área é obrigatório";
    }

    if (!formData.propriedade_id) {
      newErrors.propriedade_id = "Propriedade é obrigatória";
    }

    if (!formData.municipio.trim()) {
      newErrors.municipio = "Município é obrigatório";
    }

    if (!formData.estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }

    if (polygonCoordinates.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, desenhe um polígono no mapa antes de salvar.",
        variant: "destructive",
      });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold">
              {area ? "Editar Área" : "Criar Nova Área"}
            </DialogTitle>
            <DialogDescription>
              {area 
                ? "Atualize as informações da área abaixo." 
                : "Use a barra de busca para encontrar a localização, depois desenhe a área no mapa"}
            </DialogDescription>
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
                      type="button"
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
                      type="button"
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
              <h3 className="font-semibold mb-4">Informações da Área</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propriedade">Propriedade *</Label>
                  <Select 
                    value={formData.propriedade_id.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, propriedade_id: parseInt(value) })}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="propriedade" className={`bg-card border-border mt-1 ${errors.propriedade_id ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione a propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      {propriedades.map((prop) => (
                        <SelectItem key={prop.id} value={prop.id.toString()}>
                          {prop.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propriedade_id && (
                    <p className="text-sm text-red-500 mt-1">{errors.propriedade_id}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nome_area">Nome da Área *</Label>
                  <Input
                    id="nome_area"
                    placeholder="Ex: Talhão A1"
                    value={formData.nome_area}
                    onChange={(e) => setFormData({ ...formData, nome_area: e.target.value })}
                    disabled={isLoading}
                    className={errors.nome_area ? "border-red-500" : ""}
                  />
                  {errors.nome_area && (
                    <p className="text-sm text-red-500 mt-1">{errors.nome_area}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <div className="relative">
                    <Input
                      id="estado"
                      placeholder={isDetectingLocation ? "Detectando..." : "Digite o estado ou desenhe no mapa"}
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      disabled={isLoading || isDetectingLocation}
                      className={errors.estado ? "border-red-500" : ""}
                    />
                    {isDetectingLocation && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  {formData.estado && !isDetectingLocation && !area && (
                    <p className="text-xs text-success mt-1">
                      ✓ Detectado automaticamente
                    </p>
                  )}
                  {errors.estado && (
                    <p className="text-sm text-red-500 mt-1">{errors.estado}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="municipio">Município *</Label>
                  <div className="relative">
                    <Input
                      id="municipio"
                      placeholder={isDetectingLocation ? "Detectando..." : "Digite o município ou desenhe no mapa"}
                      value={formData.municipio}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      disabled={isLoading || isDetectingLocation}
                      className={errors.municipio ? "border-red-500" : ""}
                    />
                    {isDetectingLocation && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  {formData.municipio && !isDetectingLocation && !area && (
                    <p className="text-xs text-success mt-1">
                      ✓ Detectado automaticamente
                    </p>
                  )}
                  {errors.municipio && (
                    <p className="text-sm text-red-500 mt-1">{errors.municipio}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cultura_principal">Cultura Principal (opcional)</Label>
                  <Select 
                    value={formData.cultura_principal} 
                    onValueChange={(value) => setFormData({ ...formData, cultura_principal: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="cultura_principal" className="bg-card border-border mt-1">
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

                <div>
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Informações adicionais sobre a área..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    disabled={isLoading}
                    className="bg-card border-border mt-1 min-h-[80px]"
                  />
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

          <DialogFooter className="p-6 pt-0 border-t border-border">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {area ? "Salvar Alterações" : "Criar Área"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
