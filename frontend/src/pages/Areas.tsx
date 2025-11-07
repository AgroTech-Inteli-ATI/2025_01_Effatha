import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { areaService } from "@/services/areaService";
import { propriedadeService } from "@/services/propriedadeService";
import { AreaFormDialog } from "@/components/AreaFormDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import type { Area, CreateAreaDTO } from "@/types/area";
import type { Propriedade } from "@/types/propriedade";

const Areas = () => {
  const { toast } = useToast();

  // Estados
  const [areas, setAreas] = useState<Area[]>([]);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal de criação/edição
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingArea, setDeletingArea] = useState<Area | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar áreas quando a busca mudar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAreas(areas);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = areas.filter(
        (a) =>
          a.nome_area.toLowerCase().includes(query) ||
          a.municipio.toLowerCase().includes(query) ||
          a.estado.toLowerCase().includes(query) ||
          (a.cultura_principal && a.cultura_principal.toLowerCase().includes(query))
      );
      setFilteredAreas(filtered);
    }
  }, [searchQuery, areas]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [areasData, propriedadesData] = await Promise.all([
        areaService.getAll(),
        propriedadeService.getAll(),
      ]);
      setAreas(areasData);
      setFilteredAreas(areasData);
      setPropriedades(propriedadesData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: CreateAreaDTO) => {
    try {
      setIsSubmitting(true);

      if (editingArea) {
        // Atualizar
        await areaService.update(editingArea.id, data);
        toast({
          title: "Área atualizada!",
          description: `"${data.nome_area}" foi atualizada com sucesso.`,
        });
      } else {
        // Criar
        await areaService.create(data);
        toast({
          title: "Área criada!",
          description: `"${data.nome_area}" foi adicionada com sucesso.`,
        });
      }

      setIsFormDialogOpen(false);
      setEditingArea(null);
      await loadData();
    } catch (error) {
      toast({
        title: "Erro ao salvar área",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingArea) return;

    try {
      setIsDeleting(true);
      await areaService.delete(deletingArea.id);
      
      toast({
        title: "Área excluída!",
        description: `"${deletingArea.nome_area}" foi removida com sucesso.`,
      });

      setIsDeleteDialogOpen(false);
      setDeletingArea(null);
      await loadData();
    } catch (error) {
      toast({
        title: "Erro ao excluir área",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingArea(null);
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (area: Area) => {
    setEditingArea(area);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (area: Area) => {
    setDeletingArea(area);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const getPropriedadeNome = (propriedadeId: number) => {
    const propriedade = propriedades.find(p => p.id === propriedadeId);
    return propriedade?.nome || "N/A";
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
                placeholder="Pesquisar por nome, município, estado ou cultura"
                className="pl-10 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            disabled={propriedades.length === 0}
          >
            <Plus className="h-4 w-4" />
            Adicionar nova área
          </Button>
          
          {propriedades.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">
              Crie uma propriedade primeiro para poder adicionar áreas.
            </p>
          )}
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Áreas disponíveis</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando áreas...</span>
              </div>
            ) : filteredAreas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Nenhuma área encontrada com esse termo."
                    : "Nenhuma área cadastrada ainda."}
                </p>
                {!searchQuery && propriedades.length > 0 && (
                  <Button 
                    onClick={openCreateDialog}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira área
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead>Nome</TableHead>
                      <TableHead>Propriedade</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Município</TableHead>
                      <TableHead>Cultura</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAreas.map((area) => (
                      <TableRow key={area.id} className="border-border">
                        <TableCell className="font-medium">{area.nome_area}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {getPropriedadeNome(area.propriedade_id)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{area.estado}</TableCell>
                        <TableCell className="text-muted-foreground">{area.municipio}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {area.cultura_principal || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                            Ativa
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(area)}
                              className="border-border"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openDeleteDialog(area)}
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {filteredAreas.length} {filteredAreas.length === 1 ? 'área' : 'áreas'} 
                    {searchQuery && ' encontrada(s)'}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de Criação/Edição */}
      <AreaFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleCreateOrUpdate}
        area={editingArea}
        propriedades={propriedades}
        isLoading={isSubmitting}
      />

      {/* Modal de Exclusão */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Área?"
        description={`Tem certeza que deseja excluir "${deletingArea?.nome_area}"? Esta ação não pode ser desfeita e todas as métricas associadas também serão removidas.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Areas;
