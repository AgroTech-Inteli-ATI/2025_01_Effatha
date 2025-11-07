/**
 * Modal para seleção de múltiplas áreas para comparação
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { Area } from "@/types/area";

interface CompareAreasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (selectedAreaIds: number[]) => void;
  areas: Area[];
  isLoading?: boolean;
}

export function CompareAreasDialog({
  open,
  onOpenChange,
  onSubmit,
  areas,
  isLoading = false,
}: CompareAreasDialogProps) {
  const [selectedAreaIds, setSelectedAreaIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setSelectedAreaIds([]);
      setError("");
    }
  }, [open]);

  const handleToggleArea = (areaId: number) => {
    setSelectedAreaIds((prev) => {
      if (prev.includes(areaId)) {
        return prev.filter((id) => id !== areaId);
      } else {
        if (prev.length >= 5) {
          setError("Você pode selecionar no máximo 5 áreas para comparação");
          return prev;
        }
        setError("");
        return [...prev, areaId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAreaIds.length < 2) {
      setError("Selecione pelo menos 2 áreas para comparação");
      return;
    }

    onSubmit(selectedAreaIds);
  };

  // Agrupar áreas por propriedade
  const areasByPropriedade = areas.reduce((acc, area) => {
    const key = area.propriedade_id || 0;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(area);
    return acc;
  }, {} as Record<number, Area[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Comparar Áreas
          </DialogTitle>
          <DialogDescription>
            Selecione de 2 a 5 áreas para gerar um relatório comparativo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Áreas Disponíveis
              </Label>
              <span className="text-sm text-muted-foreground">
                {selectedAreaIds.length} selecionada(s)
              </span>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
                {error}
              </div>
            )}

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {Object.entries(areasByPropriedade).map(([propriedadeId, propriedadeAreas]) => (
                  <div key={propriedadeId} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      Propriedade #{propriedadeId}
                    </h4>
                    <div className="space-y-2 pl-4 border-l-2 border-border">
                      {propriedadeAreas.map((area) => (
                        <div
                          key={area.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => handleToggleArea(area.id)}
                        >
                          <Checkbox
                            id={`area-${area.id}`}
                            checked={selectedAreaIds.includes(area.id)}
                            onCheckedChange={() => handleToggleArea(area.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`area-${area.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {area.nome_area}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {area.municipio}/{area.estado}
                              {area.cultura_principal && ` • ${area.cultura_principal}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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
              disabled={isLoading || selectedAreaIds.length < 2}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Gerando..." : "Gerar Comparativo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
