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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { propriedadeService } from "@/services/propriedadeService";
import { PropriedadeFormDialog } from "@/components/PropriedadeFormDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import type { Propriedade, CreatePropriedadeDTO } from "@/types/propriedade";

const Projetos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [filteredPropriedades, setFilteredPropriedades] = useState<Propriedade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal de criação/edição
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingPropriedade, setEditingPropriedade] = useState<Propriedade | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPropriedade, setDeletingPropriedade] = useState<Propriedade | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPropriedades = async () => {
    try {
      setIsLoading(true);
      const data = await propriedadeService.getAll();
      setPropriedades(data);
      setFilteredPropriedades(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar propriedades",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar propriedades ao montar o componente
  useEffect(() => {
    loadPropriedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar propriedades quando a busca mudar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPropriedades(propriedades);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = propriedades.filter(
        (p) =>
          p.nome.toLowerCase().includes(query) ||
          p.responsavel.toLowerCase().includes(query)
      );
      setFilteredPropriedades(filtered);
    }
  }, [searchQuery, propriedades]);

  const handleCreateOrUpdate = async (data: CreatePropriedadeDTO) => {
    try {
      setIsSubmitting(true);

      if (editingPropriedade) {
        // Atualizar
        await propriedadeService.update(editingPropriedade.id, data);
        toast({
          title: "Propriedade atualizada!",
          description: `"${data.nome}" foi atualizada com sucesso.`,
        });
      } else {
        // Criar
        await propriedadeService.create(data);
        toast({
          title: "Propriedade criada!",
          description: `"${data.nome}" foi adicionada com sucesso.`,
        });
      }

      setIsFormDialogOpen(false);
      setEditingPropriedade(null);
      await loadPropriedades();
    } catch (error) {
      toast({
        title: "Erro ao salvar propriedade",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPropriedade) return;

    try {
      setIsDeleting(true);
      await propriedadeService.delete(deletingPropriedade.id);
      
      toast({
        title: "Propriedade excluída!",
        description: `"${deletingPropriedade.nome}" foi removida com sucesso.`,
      });

      setIsDeleteDialogOpen(false);
      setDeletingPropriedade(null);
      await loadPropriedades();
    } catch (error) {
      toast({
        title: "Erro ao excluir propriedade",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingPropriedade(null);
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (propriedade: Propriedade) => {
    setEditingPropriedade(propriedade);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (propriedade: Propriedade) => {
    setDeletingPropriedade(propriedade);
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

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Projetos</h1>

        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Buscar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou responsável"
                className="pl-10 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar nova propriedade
          </Button>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Propriedades disponíveis</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando propriedades...</span>
              </div>
            ) : filteredPropriedades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Nenhuma propriedade encontrada com esse termo."
                    : "Nenhuma propriedade cadastrada ainda."}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={openCreateDialog}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira propriedade
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead>Nome</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data de criação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropriedades.map((propriedade) => (
                      <TableRow key={propriedade.id} className="border-border">
                        <TableCell className="font-medium">{propriedade.nome}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {propriedade.responsavel}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(propriedade.data_criacao)}
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
                              onClick={() => navigate(`/projeto/${propriedade.id}`)}
                              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                            >
                              Abrir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(propriedade)}
                              className="border-border"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openDeleteDialog(propriedade)}
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
                    {filteredPropriedades.length} {filteredPropriedades.length === 1 ? 'propriedade' : 'propriedades'} 
                    {searchQuery && ' encontrada(s)'}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modal de Criação/Edição */}
      <PropriedadeFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleCreateOrUpdate}
        propriedade={editingPropriedade}
        isLoading={isSubmitting}
      />

      {/* Modal de Exclusão */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Propriedade?"
        description={`Tem certeza que deseja excluir "${deletingPropriedade?.nome}"? Esta ação não pode ser desfeita e todas as áreas associadas também serão removidas.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Projetos;
