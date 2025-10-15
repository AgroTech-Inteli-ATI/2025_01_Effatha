import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, MapPin, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentAccess = [
  { id: 1, item: "Projeto 1", lastAccess: "Há 1 hora", type: "Projeto", status: "Ativo" },
  { id: 2, item: "Projeto 2", lastAccess: "Ontem", type: "Projeto", status: "Ativo" },
  { id: 3, item: "Área 1", lastAccess: "Há 3 dias", type: "Área", status: "Ativo" },
  { id: 4, item: "Relatório 1", lastAccess: "Há 1 semana", type: "Relatório", status: "Ativo" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Bem-vindo, Fulano!</h1>
          <p className="text-xl text-muted-foreground">No que vamos trabalhar hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/projetos")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Projetos</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>3 nos últimos 7 dias</span>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/areas")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Áreas</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>3 nos últimos 7 dias</span>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/relatorios")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Relatórios</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>3 nos últimos 7 dias</span>
            </div>
          </Card>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Acessos recentes</h2>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Item</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAccess.map((access) => (
                  <TableRow key={access.id} className="border-border">
                    <TableCell className="font-medium">{access.item}</TableCell>
                    <TableCell className="text-muted-foreground">{access.lastAccess}</TableCell>
                    <TableCell className="text-muted-foreground">{access.type}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                        {access.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
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
              <p className="text-sm text-muted-foreground">100 itens disponíveis</p>
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

export default Home;
