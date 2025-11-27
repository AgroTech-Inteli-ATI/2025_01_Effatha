// src/pages/Relatorios.tsx
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type Area = {
  id: number;
  nome_area?: string;
  municipio?: string;
  estado?: string;
};

type Relatorio = {
  id: number;
  area_id: number;
  nome?: string | null;
  periodo_inicio: string;
  periodo_fim: string;
  period_days?: number;
  collection?: string;
  include_soil_metrics?: boolean;
  status?: string;
  data_criacao?: string;
  results?: any;
};

const pageSizeDefault = 10;

const Relatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reports, setReports] = useState<Relatorio[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(pageSizeDefault);

  // create form state
  const [showCreate, setShowCreate] = useState(false);
  const [createAreaId, setCreateAreaId] = useState<number | null>(null);
  const [createName, setCreateName] = useState<string>("");
  const [createStart, setCreateStart] = useState<string>("");
  const [createEnd, setCreateEnd] = useState<string>("");
  const [createPeriodDays, setCreatePeriodDays] = useState<number>(10);
  const [createCollection, setCreateCollection] = useState<string>("SENTINEL2");
  const [createIncludeSoil, setCreateIncludeSoil] = useState<boolean>(false);
  const [createSoilScale, setCreateSoilScale] = useState<number | "">("");
  const [createSoilUrl, setCreateSoilUrl] = useState<string>("");

  // creating/loading states for creation request
  const [isCreating, setIsCreating] = useState(false);

  // fetch areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/area/`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setAreas(data || []);
        // set default create area if none selected
        if (data && data.length > 0 && createAreaId === null) {
          setCreateAreaId(data[0].id);
        }
      } catch (err) {
        console.error("Erro ao buscar áreas:", err);
        toast({ title: "Erro", description: "Não foi possível carregar áreas." });
      }
    };
    fetchAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch reports
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/relatorios/`);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const data = await res.json();
      // backend may return floats for numeric fields depending on JSON serialiser: normalizar id para number
      const normalized: Relatorio[] = (data || []).map((r: any) => ({
        ...r,
        id: Number(r.id),
        area_id: Number(r.area_id),
      }));
      setReports(normalized);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
      toast({ title: "Erro", description: "Não foi possível carregar os relatórios." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search + filtered
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reports;
    const areaMap = new Map<number, Area>();
    areas.forEach((a) => areaMap.set(a.id, a));
    return reports.filter((r) => {
      const area = areaMap.get(r.area_id);
      const areaName = area?.nome_area ?? "";
      const fields = [
        String(r.nome ?? ""),
        areaName,
        String(r.id),
        String(r.collection ?? ""),
        r.periodo_inicio ?? "",
        r.periodo_fim ?? "",
      ];
      return fields.join(" ").toLowerCase().includes(term);
    });
  }, [reports, searchTerm, areas]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filtered.length, totalPages, currentPage]);

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageItems = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const el = document.querySelector("#reports-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevPage = () => goToPage(Math.max(1, currentPage - 1));
  const nextPage = () => goToPage(Math.min(totalPages, currentPage + 1));

  // delete report
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este relatório?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/relatorios/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Status ${res.status}: ${txt}`);
      }
      toast({ title: "Relatório excluído", description: "Operação finalizada." });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erro ao deletar relatório:", err);
      toast({ title: "Erro", description: "Não foi possível excluir o relatório." });
    }
  };

  // create report
  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!createAreaId) {
      toast({ title: "Erro", description: "Selecione uma área para o relatório." });
      return;
    }
    if (!createStart || !createEnd) {
      toast({ title: "Erro", description: "Período de início e fim são obrigatórios." });
      return;
    }
    // basic validation dates
    if (new Date(createStart) > new Date(createEnd)) {
      toast({ title: "Erro", description: "Data de início maior que data de fim." });
      return;
    }

    const payload: any = {
      area_id: createAreaId,
      periodo_inicio: createStart,
      periodo_fim: createEnd,
      period_days: createPeriodDays,
      collection: createCollection,
      include_soil_metrics: createIncludeSoil,
    };
    if (createName) payload.nome = createName;
    if (createSoilScale !== "") payload.soil_scale = Number(createSoilScale);
    if (createSoilUrl) payload.soil_url = createSoilUrl;

    setIsCreating(true);
    try {
      // Show loading overlay/message because backend may take long
      const res = await fetch(`${API_BASE}/api/relatorios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data?.erro || JSON.stringify(data);
        throw new Error(errMsg);
      }
      const newRelatorio = data?.relatorio ?? data?.relatorio ?? data; // support variations
      const id = Number(newRelatorio.id ?? newRelatorio.ID ?? newRelatorio.relatorio?.id);
      if (!id) {
        // if backend returned summary only, try to refresh list
        toast({ title: "Relatório criado", description: "Relatório criado (sem id retornado). Atualizando lista..." });
        await fetchReports();
      } else {
        // add to local state
        const normalized: Relatorio = {
          id,
          area_id: Number(newRelatorio.area_id ?? payload.area_id),
          nome: (newRelatorio.nome ?? createName) || `Relatório ${id}`,
          periodo_inicio: String(newRelatorio.periodo_inicio ?? createStart),
          periodo_fim: String(newRelatorio.periodo_fim ?? createEnd),
          period_days: Number(newRelatorio.period_days ?? createPeriodDays),
          collection: newRelatorio.collection ?? createCollection,
          include_soil_metrics: Boolean(newRelatorio.include_soil_metrics ?? createIncludeSoil),
          status: newRelatorio.status ?? "done",
          data_criacao: newRelatorio.data_criacao ?? newRelatorio.created_at ?? new Date().toISOString(),
          results: newRelatorio.results ?? newRelatorio.summary ?? null,
        };
        setReports((prev) => [normalized, ...prev]);
        toast({ title: "Relatório criado", description: "Métricas solicitadas — verifique o relatório." });
        // navigate to detail page (if exists)
        navigate(`/relatorio/${id}`);
      }
      // reset form
      setShowCreate(false);
      setCreateName("");
    } catch (err: any) {
      console.error("Erro criar relatório:", err);
      toast({ title: "Erro", description: String(err?.message ?? err) });
    } finally {
      setIsCreating(false);
    }
  };

  const areaName = (areaId: number) => {
    const a = areas.find((x) => Number(x.id) === Number(areaId));
    return a ? a.nome_area ?? `${a.municipio ?? ""} ${a.estado ?? ""}` : `Área ${areaId}`;
  };

  return (
    <Layout>
      <div className="p-8" id="reports-top">
        <h1 className="text-4xl font-bold text-primary mb-8">Relatórios</h1>

        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Buscar</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por relatórios, área, collection..."
                className="pl-10 bg-card border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => setShowCreate((s) => !s)}
            >
              <Plus className="h-4 w-4" />
              {showCreate ? "Fechar formulário" : "Criar novo relatório"}
            </Button>
            <Button variant="ghost" onClick={fetchReports}>
              Atualizar
            </Button>
          </div>
        </div>

        {showCreate && (
          <Card className="border-border mb-6">
            <form className="p-6 space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome (opcional)</label>
                  <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Ex: Relatório Janeiro" />
                </div>

                <div>
                  <label className="text-sm font-medium">Área</label>
                  <select
                    className="w-full h-10 rounded-md border border-border px-3 bg-card"
                    value={createAreaId ?? ""}
                    onChange={(e) => setCreateAreaId(Number(e.target.value))}
                    required
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nome_area ?? `${a.municipio ?? ""} ${a.estado ?? ""} (#${a.id})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Collection</label>
                  <select
                    className="w-full h-10 rounded-md border border-border px-3 bg-card"
                    value={createCollection}
                    onChange={(e) => setCreateCollection(e.target.value)}
                  >
                    <option value="SENTINEL2">SENTINEL2</option>
                    <option value="LANDSAT">LANDSAT</option>
                    <option value="SENTINEL1">SENTINEL1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Período início</label>
                  <Input type="date" value={createStart} onChange={(e) => setCreateStart(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Período fim</label>
                  <Input type="date" value={createEnd} onChange={(e) => setCreateEnd(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Janela (dias)</label>
                  <Input
                    type="number"
                    min={1}
                    value={createPeriodDays}
                    onChange={(e) => setCreatePeriodDays(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex items-center gap-2">
                  <input
                    id="include_soil"
                    type="checkbox"
                    checked={createIncludeSoil}
                    onChange={(e) => setCreateIncludeSoil(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="include_soil" className="text-sm">Coletar métricas de solo (todas as faixas)</label>
                </div>

                <div>
                  <label className="text-sm font-medium">Soil scale (opcional)</label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="250"
                    value={createSoilScale}
                    onChange={(e) => setCreateSoilScale(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Soil service URL (opcional)</label>
                  <Input placeholder="http://127.0.0.1:8001/clay" value={createSoilUrl} onChange={(e) => setCreateSoilUrl(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary text-primary-foreground" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" /> Gerando métricas...
                    </>
                  ) : (
                    "Criar relatório"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isCreating}>
                  Cancelar
                </Button>
              </div>

              {isCreating && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Coleta solicitada — este processo é síncrono e pode demorar alguns segundos/minutos dependendo do período e da infraestrutura. A página será redirecionada quando o relatório for criado.
                </div>
              )}
            </form>
          </Card>
        )}

        <Card className="border-border">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Relatórios disponíveis</h2>

            {isLoading ? (
              <div className="py-12 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="py-2">Relatório</th>
                        <th className="py-2">Data de emissão</th>
                        <th className="py-2">Área</th>
                        <th className="py-2">Período</th>
                        <th className="py-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((report) => (
                        <tr key={report.id} className="border-b border-border">
                          <td className="py-3 font-medium">{report.nome ?? `Relatório #${report.id}`}</td>
                          <td className="py-3 text-muted-foreground">
                            {report.data_criacao ? new Date(report.data_criacao).toLocaleString() : ""}
                          </td>
                          <td className="py-3 text-muted-foreground">{areaName(report.area_id)}</td>
                          <td className="py-3 text-muted-foreground">
                            {report.periodo_inicio ? new Date(report.periodo_inicio).toLocaleDateString() : ""} → {report.periodo_fim ? new Date(report.periodo_fim).toLocaleDateString() : ""}
                          </td>
                          <td className="py-3 text-right">
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
                                onClick={() => handleDelete(report.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {paginated.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-muted-foreground">
                            Nenhum relatório encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {filtered.length} relatório(s)
                  </p>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={prevPage} disabled={currentPage === 1} className="border-border">‹</Button>
                    {getPageItems().map((p, idx) =>
                      typeof p === "string" && p === "..." ? (
                        <Button key={`dots-${idx}`} size="sm" variant="ghost" disabled className="border-border">...</Button>
                      ) : (
                        <Button
                          key={`page-${p}`}
                          size="sm"
                          variant={p === currentPage ? "default" : "outline"}
                          onClick={() => goToPage(Number(p))}
                          className={p === currentPage ? "bg-primary text-primary-foreground" : "border-border"}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    <Button size="sm" variant="outline" onClick={nextPage} disabled={currentPage === totalPages} className="border-border">›</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;
