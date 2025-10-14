import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data1 = [
  { name: "Mon", value: 10000 },
  { name: "Tue", value: 20000 },
  { name: "Wed", value: 35000 },
  { name: "Thu", value: 30000 },
  { name: "Fri", value: 40000 },
  { name: "Sat", value: 45000 },
  { name: "Sun", value: 35000 },
];

const data2 = [
  { name: "Mon", fazenda1: 10000, fazenda2: 8000 },
  { name: "Tue", fazenda1: 20000, fazenda2: 18000 },
  { name: "Wed", fazenda1: 30000, fazenda2: 35000 },
  { name: "Thu", fazenda1: 25000, fazenda2: 32000 },
  { name: "Fri", fazenda1: 40000, fazenda2: 28000 },
  { name: "Sat", fazenda1: 42000, fazenda2: 45000 },
  { name: "Sun", fazenda1: 30000, fazenda2: 32000 },
];

const RelatorioDetalhes = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Relatório {id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variáveis básicas Fazenda 1</h3>
                <button className="text-muted-foreground hover:text-foreground">⋮</button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Últimos 7 dias</p>
              
              <Tabs defaultValue="nvdi" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger 
                    value="nvdi" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    NVDI
                  </TabsTrigger>
                  <TabsTrigger 
                    value="savi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    SAVI
                  </TabsTrigger>
                  <TabsTrigger 
                    value="biomass"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Biomass.
                  </TabsTrigger>
                  <TabsTrigger 
                    value="evi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    EVI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nvdi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Absoluta</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data1}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(160, 85%, 20%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <Card className="border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variáveis básicas Fazenda 2</h3>
                <button className="text-muted-foreground hover:text-foreground">⋮</button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Últimos 7 dias</p>
              
              <Tabs defaultValue="nvdi" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger 
                    value="nvdi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    NVDI
                  </TabsTrigger>
                  <TabsTrigger 
                    value="savi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    SAVI
                  </TabsTrigger>
                  <TabsTrigger 
                    value="biomass"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Biomass.
                  </TabsTrigger>
                  <TabsTrigger 
                    value="evi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    EVI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nvdi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Absoluta</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data1}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(160, 85%, 20%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        <Card className="border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Comparativo das áreas</h3>
              <button className="text-muted-foreground hover:text-foreground">⋮</button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Últimos 7 dias</p>
            
            <Tabs defaultValue="nvdi" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                <TabsTrigger 
                  value="nvdi"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  NVDI
                </TabsTrigger>
                <TabsTrigger 
                  value="savi"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  SAVI
                </TabsTrigger>
                <TabsTrigger 
                  value="biomass"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Biomass.
                </TabsTrigger>
                <TabsTrigger 
                  value="evi"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  EVI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nvdi" className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">Absoluta</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fazenda1" stroke="hsl(160, 85%, 20%)" strokeWidth={2} name="Fazenda 1" />
                    <Line type="monotone" dataKey="fazenda2" stroke="hsl(280, 85%, 50%)" strokeWidth={2} name="Fazenda 2" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatorioDetalhes;
