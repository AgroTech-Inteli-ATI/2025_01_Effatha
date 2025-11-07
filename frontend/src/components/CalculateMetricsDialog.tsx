/**
 * Modal para calcular métricas usando Google Earth Engine
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Area } from "@/types/area";

interface CalculateMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (areaId: number, startDate: string, endDate: string, maxBiomass?: number) => Promise<void>;
  areas: Area[];
  isLoading?: boolean;
}

export function CalculateMetricsDialog({
  open,
  onOpenChange,
  onSubmit,
  areas,
  isLoading = false,
}: CalculateMetricsDialogProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [maxBiomass, setMaxBiomass] = useState<string>("");
  const [errors, setErrors] = useState<{ area?: string; dates?: string }>({});

  useEffect(() => {
    if (open && areas.length > 0) {
      setSelectedAreaId(areas[0].id);
      
      // Definir datas padrão (últimos 30 dias)
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      
      setStartDate(start);
      setEndDate(end);
    } else {
      setSelectedAreaId(0);
      setStartDate(undefined);
      setEndDate(undefined);
      setMaxBiomass("");
    }
    setErrors({});
  }, [open, areas]);

  const validate = (): boolean => {
    const newErrors: { area?: string; dates?: string } = {};

    if (!selectedAreaId) {
      newErrors.area = "Selecione uma área";
    }

    if (!startDate || !endDate) {
      newErrors.dates = "Selecione as datas de início e fim";
    } else if (startDate > endDate) {
      newErrors.dates = "Data de início deve ser anterior à data de fim";
    } else {
      // Verificar se o período não é muito longo (máximo 1 ano)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        newErrors.dates = "O período máximo é de 1 ano";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const startDateStr = startDate!.toISOString().split('T')[0];
    const endDateStr = endDate!.toISOString().split('T')[0];
    const biomassValue = maxBiomass ? parseFloat(maxBiomass) : undefined;

    await onSubmit(selectedAreaId, startDateStr, endDateStr, biomassValue);
  };

  const selectedArea = areas.find(a => a.id === selectedAreaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Calcular Métricas
          </DialogTitle>
          <DialogDescription>
            Calcule índices de vegetação usando imagens de satélite Sentinel-2 via Google Earth Engine
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Área */}
          <div className="space-y-2">
            <Label htmlFor="area">Área *</Label>
            <Select 
              value={selectedAreaId.toString()} 
              onValueChange={(value) => setSelectedAreaId(parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger 
                id="area" 
                className={cn("bg-card border-border", errors.area && "border-red-500")}
              >
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.nome_area} - {area.municipio}/{area.estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && (
              <p className="text-sm text-red-500">{errors.area}</p>
            )}
            
            {selectedArea && (
              <div className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                <p><strong>Município:</strong> {selectedArea.municipio}</p>
                <p><strong>Estado:</strong> {selectedArea.estado}</p>
                {selectedArea.cultura_principal && (
                  <p><strong>Cultura:</strong> {selectedArea.cultura_principal}</p>
                )}
              </div>
            )}
          </div>

          {/* Período de Análise */}
          <div className="space-y-2">
            <Label>Período de Análise *</Label>
            <div className="grid grid-cols-2 gap-4">
              {/* Data Início */}
              <div>
                <Label htmlFor="start-date" className="text-sm text-muted-foreground">
                  Data Início
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !startDate && "text-muted-foreground",
                        errors.dates && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Data Fim */}
              <div>
                <Label htmlFor="end-date" className="text-sm text-muted-foreground">
                  Data Fim
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !endDate && "text-muted-foreground",
                        errors.dates && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {errors.dates && (
              <p className="text-sm text-red-500">{errors.dates}</p>
            )}
            
            {startDate && endDate && !errors.dates && (
              <p className="text-sm text-muted-foreground">
                Período: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} dias
              </p>
            )}
          </div>

          {/* Informações sobre o que será calculado */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-sm mb-2">📊 Métricas que serão calculadas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>NDVI</strong> - Índice de Vegetação por Diferença Normalizada</li>
              <li>• <strong>EVI</strong> - Índice de Vegetação Melhorado</li>
              <li>• <strong>NDWI</strong> - Índice de Água por Diferença Normalizada</li>
              <li>• <strong>NDMI</strong> - Índice de Umidade por Diferença Normalizada</li>
              <li>• <strong>GNDVI</strong> - Índice de Vegetação Verde Normalizado</li>
              <li>• <strong>NDRE</strong> - Índice de Red Edge Normalizado</li>
              <li>• <strong>RENDVI</strong> - Índice Red Edge NDVI</li>
              <li>• <strong>Biomassa</strong> - Estimativa de biomassa</li>
            </ul>
          </div>

          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Calculando..." : "Calcular Métricas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
