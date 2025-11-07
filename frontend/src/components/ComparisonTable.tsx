/**
 * Tabela comparativa de métricas entre áreas
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";

interface ComparisonTableProps {
  metricas: Metricas[];
  areas: Area[];
}

export function ComparisonTable({ metricas, areas }: ComparisonTableProps) {
  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(4);
  };

  const getBestValue = (values: (number | null)[], higher: boolean = true): number | null => {
    const validValues = values.filter((v): v is number => v !== null);
    if (validValues.length === 0) return null;
    return higher ? Math.max(...validValues) : Math.min(...validValues);
  };

  const isBestValue = (value: number | null, bestValue: number | null): boolean => {
    if (value === null || bestValue === null) return false;
    return Math.abs(value - bestValue) < 0.0001;
  };

  // Coletar valores para comparação
  const ndviValues = metricas.map(m => m.ndvi_mean);
  const eviValues = metricas.map(m => m.evi_mean);
  const ndwiValues = metricas.map(m => m.ndwi_mean);
  const ndmiValues = metricas.map(m => m.ndmi_mean);
  const gndviValues = metricas.map(m => m.gndvi_mean);
  const biomassaValues = metricas.map(m => m.biomassa);

  const bestNdvi = getBestValue(ndviValues);
  const bestEvi = getBestValue(eviValues);
  const bestNdwi = getBestValue(ndwiValues);
  const bestNdmi = getBestValue(ndmiValues);
  const bestGndvi = getBestValue(gndviValues);
  const bestBiomassa = getBestValue(biomassaValues);

  return (
    <Card className="border-border overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Tabela Comparativa Detalhada</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[150px]">Métrica</TableHead>
                {areas.map((area) => (
                  <TableHead key={area.id} className="text-center">
                    <div className="font-semibold">{area.nome_area}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {area.municipio}/{area.estado}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* NDVI */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>NDVI Média</div>
                  <div className="text-xs text-muted-foreground">
                    Vegetação
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{formatValue(m.ndvi_mean)}</span>
                      {isBestValue(m.ndvi_mean, bestNdvi) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* EVI */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>EVI Média</div>
                  <div className="text-xs text-muted-foreground">
                    Enhanced VI
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{formatValue(m.evi_mean)}</span>
                      {isBestValue(m.evi_mean, bestEvi) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* NDWI */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>NDWI Média</div>
                  <div className="text-xs text-muted-foreground">
                    Água
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{formatValue(m.ndwi_mean)}</span>
                      {isBestValue(m.ndwi_mean, bestNdwi) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* NDMI */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>NDMI Média</div>
                  <div className="text-xs text-muted-foreground">
                    Umidade
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{formatValue(m.ndmi_mean)}</span>
                      {isBestValue(m.ndmi_mean, bestNdmi) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* GNDVI */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>GNDVI Média</div>
                  <div className="text-xs text-muted-foreground">
                    Veg. Verde
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{formatValue(m.gndvi_mean)}</span>
                      {isBestValue(m.gndvi_mean, bestGndvi) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Biomassa */}
              <TableRow className="border-border">
                <TableCell className="font-medium">
                  <div>Biomassa</div>
                  <div className="text-xs text-muted-foreground">
                    t/ha
                  </div>
                </TableCell>
                {metricas.map((m, idx) => (
                  <TableCell key={idx} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">
                        {m.biomassa ? m.biomassa.toFixed(2) : "N/A"}
                      </span>
                      {isBestValue(m.biomassa, bestBiomassa) && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Melhor
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
