import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";

const ProjetoDetalhes = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Projeto {id}</h1>

        <Tabs defaultValue="areas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
            <TabsTrigger value="areas">Áreas</TabsTrigger>
            <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="areas" className="mt-6">
            <Card className="border-border p-6">
              <h2 className="text-xl font-bold mb-4">Áreas do Projeto</h2>
              <p className="text-muted-foreground">
                Aqui você pode visualizar todas as áreas associadas a este projeto.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="variaveis" className="mt-6">
            <Card className="border-border p-6">
              <h2 className="text-xl font-bold mb-4">Variáveis do Projeto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card className="p-4 border-border">
                  <h3 className="font-semibold mb-2">NVDI</h3>
                  <p className="text-2xl font-bold text-primary">0.75</p>
                  <p className="text-sm text-muted-foreground">Índice de vegetação</p>
                </Card>
                <Card className="p-4 border-border">
                  <h3 className="font-semibold mb-2">SAVI</h3>
                  <p className="text-2xl font-bold text-primary">0.68</p>
                  <p className="text-sm text-muted-foreground">Ajustado ao solo</p>
                </Card>
                <Card className="p-4 border-border">
                  <h3 className="font-semibold mb-2">Biomassa</h3>
                  <p className="text-2xl font-bold text-primary">3.2 t/ha</p>
                  <p className="text-sm text-muted-foreground">Tonelada/Hectare</p>
                </Card>
                <Card className="p-4 border-border">
                  <h3 className="font-semibold mb-2">EVI</h3>
                  <p className="text-2xl font-bold text-primary">0.82</p>
                  <p className="text-sm text-muted-foreground">Enhanced Vegetation</p>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="mt-6">
            <Card className="border-border p-6">
              <h2 className="text-xl font-bold mb-4">Relatórios do Projeto</h2>
              <p className="text-muted-foreground">
                Aqui você pode visualizar todos os relatórios gerados para este projeto.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProjetoDetalhes;
