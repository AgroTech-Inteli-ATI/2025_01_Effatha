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
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reports = [
  { id: 1, name: "Relatório 1", issueDate: "10/09/2025", project: "Projeto 1", areas: "Fazenda 1" },
  { id: 2, name: "Relatório 2", issueDate: "11/09/2025", project: "Projeto 2", areas: "Fazenda 1, Fazenda 2+" },
  { id: 3, name: "Relatório 3", issueDate: "15/09/2025", project: "Projeto 3", areas: "Fazenda 1 e Fazenda 2" },
  { id: 4, name: "Relatório 4", issueDate: "26/09/2025", project: "Projeto 1", areas: "Fazenda 1" },
];

const Relatorios = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Relatórios</h1>

        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Buscar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por relatórios"
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Criar novo relatório
          </Button>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Relatórios disponíveis</h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Relatório</TableHead>
                  <TableHead>Data de emissão</TableHead>
                  <TableHead>Projeto associado</TableHead>
                  <TableHead>Área(s) associada(s)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="border-border">
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="text-muted-foreground">{report.issueDate}</TableCell>
                    <TableCell className="text-muted-foreground">{report.project}</TableCell>
                    <TableCell className="text-muted-foreground">{report.areas}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/relatorio/${report.id}`)}
                          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        >
                          Visualizar
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

export default Relatorios;
