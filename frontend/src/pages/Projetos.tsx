// src/pages/Propriedades.tsx
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type PropriedadeItem = {
	id: number;
	responsavel: string;
	nome: string;
	data_criacao?: string;
	raw?: any;
};

const API_BASE = import.meta.env.VITE_API_URL ?? '';

const Propriedades = () => {
	const navigate = useNavigate();
	const { toast } = useToast();

	// lista e fetch
	const [properties, setProperties] = useState<PropriedadeItem[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// formulário de criação
	const [responsavel, setResponsavel] = useState('');
	const [nome, setNome] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	// busca e paginação
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 10;

	const totalPages = Math.max(
		1,
		Math.ceil(
			properties.filter((p) =>
				(p.nome + ' ' + p.responsavel)
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			).length / pageSize
		)
	);

	// ajustar paginação se lista diminuir
	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [properties, totalPages, currentPage]);

	// busca inicial
	useEffect(() => {
		fetchPropriedades();
	}, []);

	const fetchPropriedades = async () => {
		try {
			const url = `${API_BASE}/api/propriedade/`;
			console.log('[Propriedades] GET', url);
			const r = await fetch(url, { headers: { Accept: 'application/json' } });
			if (!r.ok) {
				const txt = await r.text().catch(() => '');
				throw new Error(`Status ${r.status}: ${txt}`);
			}
			const data = await r.json();
			if (!Array.isArray(data)) {
				setProperties([]);
				return;
			}
			const normalized = data.map((p: any) => ({
				id: Number(p.id),
				responsavel: p.responsavel ?? '',
				nome: p.nome ?? '',
				data_criacao: p.data_criacao ?? undefined,
				raw: p,
			}));
			setProperties(normalized);
			setCurrentPage(1);
		} catch (err) {
			console.error('[Propriedades] erro fetch:', err);
			toast({
				title: 'Erro',
				description: 'Não foi possível carregar propriedades.',
			});
			setProperties([]);
		}
	};

	// search + pagination helpers
	const filteredProperties = properties.filter((p) =>
		`${p.nome} ${p.responsavel}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const paginatedProperties = filteredProperties.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const getPageItems = () => {
		const pages: (number | string)[] = [];
		const total = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
		if (total <= 7) {
			for (let i = 1; i <= total; i++) pages.push(i);
			return pages;
		}
		const left = Math.max(2, currentPage - 1);
		const right = Math.min(total - 1, currentPage + 1);

		pages.push(1);
		if (left > 2) pages.push('...');
		for (let p = left; p <= right; p++) pages.push(p);
		if (right < total - 1) pages.push('...');
		pages.push(total);
		return pages;
	};

	const goToPage = (p: number) => {
		if (p < 1) return;
		setCurrentPage(p);
		const el = document.querySelector('#propriedades-list-top');
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
	const prevPage = () => goToPage(Math.max(1, currentPage - 1));
	const nextPage = () =>
		goToPage(
			Math.min(
				Math.max(1, Math.ceil(filteredProperties.length / pageSize)),
				currentPage + 1
			)
		);

	// criação de propriedade
	const resetForm = () => {
		setResponsavel('');
		setNome('');
	};

	const handleSavePropriedade = async () => {
		if (!responsavel || !nome) {
			toast({
				title: 'Erro',
				description: 'Preencha o nome e o responsável.',
				variant: 'destructive',
			});
			return;
		}

		setIsSaving(true);
		const payload = {
			responsavel,
			nome,
		};

		try {
			const r = await fetch(`${API_BASE}/api/propriedade/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!r.ok) {
				const text = await r.text().catch(() => '');
				throw new Error(`Status ${r.status}: ${text}`);
			}
			const created = await r.json();
			toast({
				title: 'Propriedade criada',
				description: `Propriedade "${created.nome ?? nome}" criada (id: ${
					created.id ?? '?'
				}).`,
			});

			const createdNormalized: PropriedadeItem = {
				id: Number(created.id),
				responsavel: created.responsavel ?? responsavel,
				nome: created.nome ?? nome,
				data_criacao: created.data_criacao ?? undefined,
				raw: created,
			};
			setProperties((prev) => [createdNormalized, ...prev]);
			resetForm();
			setIsDialogOpen(false);
			setCurrentPage(1);
		} catch (err) {
			console.error('Erro criando propriedade:', err);
			toast({
				title: 'Erro',
				description: 'Não foi possível criar propriedade.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeletePropriedade = async (id: number) => {
		if (
			!confirm(
				'Deseja realmente excluir esta propriedade? Esta ação não pode ser desfeita.'
			)
		)
			return;

		try {
			const r = await fetch(`${API_BASE}/api/propriedade/${id}`, {
				method: 'DELETE',
			});
			if (!r.ok) {
				const text = await r.text().catch(() => '');
				throw new Error(`Status ${r.status}: ${text}`);
			}
			setProperties((prev) => prev.filter((p) => p.id !== id));
			toast({
				title: 'Propriedade excluída',
				description: 'A propriedade foi removida com sucesso.',
			});
		} catch (err) {
			console.error('Erro ao deletar propriedade:', err);
			toast({
				title: 'Erro',
				description: 'Não foi possível excluir a propriedade.',
				variant: 'destructive',
			});
		}
	};

	return (
		<Layout>
			<div className="p-8">
				<h1 className="text-4xl font-bold text-primary mb-8">Propriedades</h1>

				<div className="mb-6 space-y-4">
					<div>
						<h2 className="text-lg font-semibold mb-3">Buscar</h2>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Pesquisar por nome ou responsável"
								className="pl-10 bg-card border-border"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<Button
						onClick={() => {
							resetForm();
							setIsDialogOpen(true);
						}}
						className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
					>
						<Plus className="h-4 w-4" />
						Criar nova propriedade
					</Button>
				</div>

				<Card className="border-border">
					<div id="propriedades-list-top" className="p-6">
						<h2 className="text-xl font-bold mb-6">Propriedades disponíveis</h2>
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-border">
									<TableHead>Nome</TableHead>
									<TableHead>Responsável</TableHead>
									<TableHead>Data de criação</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedProperties.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center text-muted-foreground py-6"
										>
											Nenhuma propriedade encontrada.
										</TableCell>
									</TableRow>
								) : (
									paginatedProperties.map((p) => (
										<TableRow key={p.id} className="border-border">
											<TableCell className="font-medium">{p.nome}</TableCell>
											<TableCell className="text-muted-foreground">
												{p.responsavel}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{p.data_criacao
													? new Date(p.data_criacao).toLocaleString()
													: '-'}
											</TableCell>
											<TableCell>
												<Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
													Ativa
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => navigate(`/propriedade/${p.id}`)}
														className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
													>
														Abrir
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
														onClick={() => handleDeletePropriedade(p.id)}
													>
														Excluir
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>

						<div className="flex items-center justify-between mt-6">
							<p className="text-sm text-muted-foreground">
								{filteredProperties.length} propriedades encontradas
							</p>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={prevPage}
									disabled={currentPage === 1}
									className="border-border"
								>
									‹
								</Button>

								{getPageItems().map((p, idx) =>
									typeof p === 'string' && p === '...' ? (
										<Button
											key={`dots-${idx}`}
											size="sm"
											variant="ghost"
											disabled
											className="border-border"
										>
											...
										</Button>
									) : (
										<Button
											key={`page-${p}`}
											size="sm"
											variant={p === currentPage ? 'default' : 'outline'}
											onClick={() => goToPage(Number(p))}
											className={
												p === currentPage
													? 'bg-primary text-primary-foreground'
													: 'border-border'
											}
										>
											{p}
										</Button>
									)
								)}

								<Button
									size="sm"
									variant="outline"
									onClick={nextPage}
									disabled={
										currentPage ===
										Math.max(1, Math.ceil(filteredProperties.length / pageSize))
									}
									className="border-border"
								>
									›
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-md w-full p-0">
					<div className="flex flex-col h-full">
						<DialogHeader className="p-6 pb-4 border-b border-border">
							<DialogTitle className="text-2xl font-bold">
								Criar Propriedade
							</DialogTitle>
							<p className="text-muted-foreground">
								Informe o responsável e o nome da propriedade.
							</p>
						</DialogHeader>

						<div className="p-6 space-y-4">
							<div>
								<Label htmlFor="responsavel">Responsável *</Label>
								<Input
									id="responsavel"
									placeholder="Nome do responsável"
									value={responsavel}
									onChange={(e) => setResponsavel(e.target.value)}
									className="bg-card border-border mt-1"
								/>
							</div>

							<div>
								<Label htmlFor="nome">Nome da propriedade *</Label>
								<Input
									id="nome"
									placeholder="Ex: Fazenda Modelo"
									value={nome}
									onChange={(e) => setNome(e.target.value)}
									className="bg-card border-border mt-1"
								/>
							</div>
						</div>

						<div className="p-6 pt-0 flex justify-end gap-3 border-t border-border">
							<Button
								variant="outline"
								onClick={() => {
									setIsDialogOpen(false);
									resetForm();
								}}
								className="border-border"
							>
								Cancelar
							</Button>
							<Button
								onClick={handleSavePropriedade}
								className="bg-primary hover:bg-primary/90 text-primary-foreground"
								disabled={!responsavel || !nome || isSaving}
							>
								{isSaving ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Plus className="h-4 w-4 mr-2" />
								)}
								Criar propriedade
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default Propriedades;
