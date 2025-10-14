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
import { Search, Plus, MapPin } from "lucide-react";

const areas = [
  { id: 1, name: "Fazenda 1", state: "Minas Gerais", city: "Ouro Preto", crop: "Milho", status: "Ativa" },
  { id: 2, name: "Fazenda 2", state: "Minas Gerais", city: "Ouro Preto", crop: "Soja", status: "Ativa" },
  { id: 3, name: "Fazenda 3", state: "Goiás", city: "Goiânia", crop: "-", status: "Ativa" },
  { id: 4, name: "Fazenda 4", state: "Minas Gerais", city: "Ouro Preto", crop: "Milho", status: "Ativa" },
];

const Areas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold">Nome da nova área</DialogTitle>
              <p className="text-muted-foreground">Selecione a área de interesse</p>
            </DialogHeader>

            <div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
              <div className="flex-1 bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Mapa será exibido aqui</p>
                  </div>
                </div>
              </div>

              <div className="w-80 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="font-semibold mb-4">Informações iniciais</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Estado</Label>
                      <Select defaultValue="sp">
                        <SelectTrigger className="bg-card border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sp">São Paulo</SelectItem>
                          <SelectItem value="mg">Minas Gerais</SelectItem>
                          <SelectItem value="go">Goiás</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Município</Label>
                      <Select>
                        <SelectTrigger className="bg-card border-border">
                          <SelectValue placeholder="Selecione o município" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="city1">Cidade 1</SelectItem>
                          <SelectItem value="city2">Cidade 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cultura principal (opcional)</Label>
                      <Select>
                        <SelectTrigger className="bg-card border-border">
                          <SelectValue placeholder="Soja" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soja">Soja</SelectItem>
                          <SelectItem value="milho">Milho</SelectItem>
                          <SelectItem value="cafe">Café</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-border"
              >
                Cancelar
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Adicionar nova área
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Areas;
