import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Calendar } from "lucide-react";

// Dados simulados para diferentes períodos de tempo
const generateData = (days: number, metric: string) => {
  const data = [];
  const baseValues: { [key: string]: number } = {
    ndvi: 0.6,
    savi: 0.5,
    biomass: 2500,
    evi: 0.4,
  };
  
  const base = baseValues[metric] || 0.5;
  
  for (let i = 0; i < days; i++) {
    const variation = (Math.random() - 0.5) * 0.2;
    data.push({
      name: `Dia ${i + 1}`,
      value: base + variation,
    });
  }
  return data;
};

const generateComparativeData = (days: number, metric: string) => {
  const data = [];
  const baseValues: { [key: string]: number } = {
    ndvi: 0.6,
    savi: 0.5,
    biomass: 2500,
    evi: 0.4,
  };
  
  const base = baseValues[metric] || 0.5;
  
  for (let i = 0; i < days; i++) {
    const variation1 = (Math.random() - 0.5) * 0.2;
    const variation2 = (Math.random() - 0.5) * 0.2;
    data.push({
      name: `Dia ${i + 1}`,
      fazenda1: base + variation1,
      fazenda2: base + variation2,
    });
  }
  return data;
};


const RelatorioDetalhes = () => {
  const { id } = useParams();
  const [timeRange1, setTimeRange1] = useState("7");
  const [timeRange2, setTimeRange2] = useState("7");
  const [timeRangeComparative, setTimeRangeComparative] = useState("7");

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Relatório {id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fazenda 1 */}
          <Card className="border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variáveis básicas Fazenda 1</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={timeRange1} onValueChange={setTimeRange1}>
                    <SelectTrigger className="w-[140px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Últimos 7 dias</SelectItem>
                      <SelectItem value="15">Últimos 15 dias</SelectItem>
                      <SelectItem value="30">Últimos 30 dias</SelectItem>
                      <SelectItem value="60">Últimos 60 dias</SelectItem>
                      <SelectItem value="90">Últimos 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="ndvi" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger 
                    value="ndvi" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    NDVI
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

                <TabsContent value="ndvi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDVI - Índice de Vegetação</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange1), "ndvi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(160, 85%, 20%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="savi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">SAVI - Índice Ajustado do Solo</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange1), "savi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(220, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="biomass" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Biomassa Estimada (kg/ha)</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange1), "biomass")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(40, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="evi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">EVI - Índice de Vegetação Melhorado</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange1), "evi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(280, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Fazenda 2 */}
          <Card className="border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variáveis básicas Fazenda 2</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={timeRange2} onValueChange={setTimeRange2}>
                    <SelectTrigger className="w-[140px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Últimos 7 dias</SelectItem>
                      <SelectItem value="15">Últimos 15 dias</SelectItem>
                      <SelectItem value="30">Últimos 30 dias</SelectItem>
                      <SelectItem value="60">Últimos 60 dias</SelectItem>
                      <SelectItem value="90">Últimos 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="ndvi" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger 
                    value="ndvi"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    NDVI
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

                <TabsContent value="ndvi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDVI - Índice de Vegetação</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange2), "ndvi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(160, 85%, 20%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="savi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">SAVI - Índice Ajustado do Solo</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange2), "savi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(220, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="biomass" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Biomassa Estimada (kg/ha)</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange2), "biomass")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(40, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="evi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">EVI - Índice de Vegetação Melhorado</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={generateData(parseInt(timeRange2), "evi")}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(280, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Comparativo das áreas */}
        <Card className="border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Comparativo das áreas</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={timeRangeComparative} onValueChange={setTimeRangeComparative}>
                  <SelectTrigger className="w-[140px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="15">Últimos 15 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="60">Últimos 60 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="ndvi" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                <TabsTrigger 
                  value="ndvi"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  NDVI
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

              <TabsContent value="ndvi" className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">NDVI - Índice de Vegetação</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateComparativeData(parseInt(timeRangeComparative), "ndvi")}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fazenda1" stroke="hsl(160, 85%, 20%)" strokeWidth={2} name="Fazenda 1" dot={false} />
                    <Line type="monotone" dataKey="fazenda2" stroke="hsl(280, 85%, 50%)" strokeWidth={2} name="Fazenda 2" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="savi" className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">SAVI - Índice Ajustado do Solo</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateComparativeData(parseInt(timeRangeComparative), "savi")}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fazenda1" stroke="hsl(220, 85%, 50%)" strokeWidth={2} name="Fazenda 1" dot={false} />
                    <Line type="monotone" dataKey="fazenda2" stroke="hsl(180, 85%, 40%)" strokeWidth={2} name="Fazenda 2" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="biomass" className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">Biomassa Estimada (kg/ha)</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateComparativeData(parseInt(timeRangeComparative), "biomass")}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fazenda1" stroke="hsl(40, 85%, 50%)" strokeWidth={2} name="Fazenda 1" dot={false} />
                    <Line type="monotone" dataKey="fazenda2" stroke="hsl(10, 85%, 50%)" strokeWidth={2} name="Fazenda 2" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="evi" className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">EVI - Índice de Vegetação Melhorado</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateComparativeData(parseInt(timeRangeComparative), "evi")}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fazenda1" stroke="hsl(280, 85%, 50%)" strokeWidth={2} name="Fazenda 1" dot={false} />
                    <Line type="monotone" dataKey="fazenda2" stroke="hsl(320, 85%, 50%)" strokeWidth={2} name="Fazenda 2" dot={false} />
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

