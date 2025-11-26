import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Projetos from "./pages/Projetos";
import Areas from "./pages/Areas";
import Relatorios from "./pages/Relatorios";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";
import RelatorioDetalhes from "./pages/RelatorioDetalhes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/projeto/:id" element={<ProjetoDetalhes />} />
          <Route path="/relatorio/:id" element={<RelatorioDetalhes />} />
          {/* <Route path="/areas/:id" element={<AreaDetails />} /> */}
          <Route path="/propriedade/:id" element={<ProjetoDetalhes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
