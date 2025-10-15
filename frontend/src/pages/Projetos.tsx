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
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const projects = [
  { id: 1, name: "Projeto 1", lastAccess: "Há 1 hora", createdAt: "14/10/2025", status: "Ativo" },
  { id: 2, name: "Projeto 2", lastAccess: "Ontem", createdAt: "10/10/2025", status: "Ativo" },
  { id: 3, name: "Projeto 3", lastAccess: "Há 3 dias", createdAt: "08/09/2025", status: "Ativo" },
  { id: 4, name: "Projeto 4", lastAccess: "Há 1 semana", createdAt: "07/09/2025", status: "Ativo" },
];

const Projetos = () => {
  const navigate = useNavigate();

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
                placeholder="Pesquisar por projetos"
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Criar novo projeto
          </Button>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Projetos disponíveis</h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Nome</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-border">
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{project.lastAccess}</TableCell>
                    <TableCell className="text-muted-foreground">{project.createdAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/projeto/${project.id}`)}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          Abrir
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
    </Layout>
  );
};

export default Projetos;
