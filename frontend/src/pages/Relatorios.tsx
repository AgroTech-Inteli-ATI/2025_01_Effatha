/**
 * Página de Relatórios/Métricas
 */

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Loader2, Eye, Trash2, Download, GitCompare } from "lucide-react";
import { CalculateMetricsDialog } from "@/components/CalculateMetricsDialog";
import { CompareAreasDialog } from "@/components/CompareAreasDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { metricasService } from "@/services/metricasService";
import { areaService } from "@/services/areaService";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const Relatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [metricas, setMetricas] = useState<Metricas[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialogs
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metricaToDelete, setMetricaToDelete] = useState<Metricas | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar dados
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricasData, areasData] = await Promise.all([
        metricasService.getAll(),
        areaService.getAll(),
      ]);
      setMetricas(metricasData);
      setAreas(areasData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateMetrics = async (
    areaId: number,
    startDate: string,
    endDate: string,
    maxBiomass?: number
  ) => {
    setIsCalculating(true);
    try {
      const area = areas.find(a => a.id === areaId);
      if (!area || !area.coordenada || area.coordenada.length === 0) {
        throw new Error("Área não possui coordenadas definidas");
      }

      // Converter coordenadas para GeoJSON
      const geometry = metricasService.convertToGeoJSON(area.coordenada);

      // Calcular métricas via Google Earth Engine
      const computeResponse = await metricasService.computeMetrics({
        geometry,
        start_date: startDate,
        end_date: endDate,
        collection: "SENTINEL2",
        max_biomass: maxBiomass,
        timeseries: false,
      });

      // Verificar se há imagens disponíveis
      if (computeResponse.image_count === 0) {
        toast({
          variant: "destructive",
          title: "Nenhuma imagem disponível",
          description: "Não foram encontradas imagens para o período selecionado",
        });
        return;
      }

      // Salvar métricas no banco de dados
      const metricasDTO = metricasService.mapEarthEngineToDTO(
        areaId,
        startDate,
        endDate,
        computeResponse
      );

      const savedMetricas = await metricasService.create(metricasDTO);

      toast({
        title: "Métricas calculadas com sucesso!",
        description: `${computeResponse.image_count} imagens processadas`,
      });

      // Fechar dialog e recarregar lista
      setIsCalculateDialogOpen(false);
      await loadData();

      // Navegar para detalhes
      navigate(`/relatorio/${savedMetricas.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao calcular métricas",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = async () => {
    if (!metricaToDelete) return;

    setIsDeleting(true);
    try {
      await metricasService.delete(metricaToDelete.id);
      toast({
        title: "Métrica excluída",
        description: "A métrica foi removida com sucesso",
      });
      await loadData();
      setDeleteDialogOpen(false);
      setMetricaToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir métrica",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (metrica: Metricas) => {
    setMetricaToDelete(metrica);
    setDeleteDialogOpen(true);
  };

  const exportToCSV = (metrica: Metricas) => {
    const area = areas.find(a => a.id === metrica.area_id);
    
    const csvData = [
      ["Métrica", "Valor"],
      ["Área", area?.nome_area || "N/A"],
      ["Período Início", metrica.periodo_inicio],
      ["Período Fim", metrica.periodo_fim],
      ["NDVI Média", metrica.ndvi_mean ?? "N/A"],
      ["NDVI Mediana", metrica.ndvi_median ?? "N/A"],
      ["NDVI Desvio Padrão", metrica.ndvi_std ?? "N/A"],
      ["EVI Média", metrica.evi_mean ?? "N/A"],
      ["EVI Mediana", metrica.evi_median ?? "N/A"],
      ["EVI Desvio Padrão", metrica.evi_std ?? "N/A"],
      ["NDWI Média", metrica.ndwi_mean ?? "N/A"],
      ["NDWI Mediana", metrica.ndwi_median ?? "N/A"],
      ["NDWI Desvio Padrão", metrica.ndwi_std ?? "N/A"],
      ["NDMI Média", metrica.ndmi_mean ?? "N/A"],
      ["NDMI Mediana", metrica.ndmi_median ?? "N/A"],
      ["NDMI Desvio Padrão", metrica.ndmi_std ?? "N/A"],
      ["GNDVI Média", metrica.gndvi_mean ?? "N/A"],
      ["GNDVI Mediana", metrica.gndvi_median ?? "N/A"],
      ["GNDVI Desvio Padrão", metrica.gndvi_std ?? "N/A"],
      ["NDRE Média", metrica.ndre_mean ?? "N/A"],
      ["NDRE Mediana", metrica.ndre_median ?? "N/A"],
      ["NDRE Desvio Padrão", metrica.ndre_std ?? "N/A"],
      ["RENDVI Média", metrica.rendvi_mean ?? "N/A"],
      ["RENDVI Mediana", metrica.rendvi_median ?? "N/A"],
      ["RENDVI Desvio Padrão", metrica.rendvi_std ?? "N/A"],
      ["Biomassa", metrica.biomassa ?? "N/A"],
      ["Cobertura Vegetal", metrica.cobertura_vegetal ?? "N/A"],
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `metricas_${area?.nome_area || metrica.id}_${metrica.periodo_inicio}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV exportado",
      description: "O arquivo foi baixado com sucesso",
    });
  };

  // Filtrar métricas por busca
  const filteredMetricas = metricas.filter(metrica => {
    if (!searchTerm) return true;
    
    const area = areas.find(a => a.id === metrica.area_id);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      area?.nome_area.toLowerCase().includes(searchLower) ||
      area?.municipio.toLowerCase().includes(searchLower) ||
      area?.estado.toLowerCase().includes(searchLower) ||
      metrica.periodo_inicio.includes(searchLower) ||
      metrica.periodo_fim.includes(searchLower)
    );
  });

  const getAreaName = (areaId: number): string => {
    const area = areas.find(a => a.id === areaId);
    return area ? `${area.nome_area} - ${area.municipio}/${area.estado}` : "N/A";
  };

  const formatDate = (dateStr: string): string => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Relatórios de Métricas</h1>

        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Buscar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por área, município, estado ou período"
                className="pl-10 bg-card border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => setIsCalculateDialogOpen(true)}
              disabled={areas.length === 0}
            >
              <Plus className="h-4 w-4" />
              Calcular novas métricas
            </Button>

            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground gap-2"
              onClick={() => setIsCompareDialogOpen(true)}
              disabled={areas.length < 2}
            >
              <GitCompare className="h-4 w-4" />
              Comparar Áreas
            </Button>
          </div>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Métricas calculadas</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredMetricas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "Nenhuma métrica encontrada com os filtros aplicados" : "Nenhuma métrica calculada ainda"}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead>ID</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Período Início</TableHead>
                      <TableHead>Período Fim</TableHead>
                      <TableHead>NDVI Médio</TableHead>
                      <TableHead>Biomassa</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMetricas.map((metrica) => (
                      <TableRow key={metrica.id} className="border-border">
                        <TableCell className="font-medium">#{metrica.id}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {getAreaName(metrica.area_id)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(metrica.periodo_inicio)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(metrica.periodo_fim)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            metrica.ndvi_mean && metrica.ndvi_mean >= 0.6 
                              ? "text-green-600" 
                              : metrica.ndvi_mean && metrica.ndvi_mean >= 0.4 
                              ? "text-yellow-600" 
                              : "text-red-600"
                          }`}>
                            {metrica.ndvi_mean?.toFixed(3) || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {metrica.biomassa ? `${metrica.biomassa.toFixed(2)} t/ha` : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/relatorio/${metrica.id}`)}
                              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportToCSV(metrica)}
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              CSV
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(metrica)}
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {filteredMetricas.length} métrica(s) encontrada(s)
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Dialog de cálculo */}
        <CalculateMetricsDialog
          open={isCalculateDialogOpen}
          onOpenChange={setIsCalculateDialogOpen}
          onSubmit={handleCalculateMetrics}
          areas={areas}
          isLoading={isCalculating}
        />

        {/* Dialog de comparação de áreas */}
        <CompareAreasDialog
          open={isCompareDialogOpen}
          onOpenChange={setIsCompareDialogOpen}
          onSubmit={(selectedAreaIds) => {
            setIsCompareDialogOpen(false);
            navigate(`/comparativo-areas?areas=${selectedAreaIds.join(",")}`);
          }}
          areas={areas}
        />

        {/* Dialog de confirmação de exclusão */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setMetricaToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Excluir métrica"
          description="Tem certeza que deseja excluir esta métrica? Esta ação não pode ser desfeita."
          isLoading={isDeleting}
        />
      </div>
    </Layout>
  );
};

export default Relatorios;
