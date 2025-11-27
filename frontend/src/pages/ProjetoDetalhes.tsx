const API_BASE = import.meta.env.VITE_API_URL ?? '';

import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjetoDetalhes = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();

	const [areas, setAreas] = useState<any[]>([]);
	const [isLoadingAreas, setIsLoadingAreas] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 10;
	const [isDeleting, setIsDeleting] = useState<number | null>(null);

	const propriedadeId = id ? Number(id) : null;

	const fetchAreas = async () => {
		if (!propriedadeId) return;
		setIsLoadingAreas(true);

		try {
			const r = await fetch(`${API_BASE}/api/area/`, {
				headers: { Accept: 'application/json' },
			});

			if (!r.ok) throw new Error(`Status ${r.status}`);

			const data = await r.json();

			if (!Array.isArray(data)) {
				setAreas([]);
				return;
			}

			const filtered = data
				.filter((a: any) => Number(a.propriedade_id) === propriedadeId)
				.map((a: any) => ({
					id: Number(a.id),
					nome_area: a.nome_area ?? `Área ${a.id}`,
					municipio: a.municipio ?? '-',
					estado: a.estado ?? '-',
					cultura_principal: a.cultura_principal ?? '-',
					raw: a,
				}));

			setAreas(filtered);
			setCurrentPage(1);
		} catch (err) {
			console.error(err);
			toast({
				title: 'Erro',
				description: 'Não foi possível carregar as áreas desta propriedade.',
			});
			setAreas([]);
		} finally {
			setIsLoadingAreas(false);
		}
	};

	useEffect(() => {
		if (propriedadeId) fetchAreas();
	}, [propriedadeId]);

	const filteredAreas = areas.filter((area) =>
		[area.nome_area, area.municipio, area.estado, area.cultura_principal]
			.join(' ')
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.max(1, Math.ceil(filteredAreas.length / pageSize));

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [filteredAreas.length, totalPages, currentPage]);

	const paginatedAreas = filteredAreas.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const goToPage = (p: number) => {
		if (p < 1 || p > totalPages) return;
		setCurrentPage(p);
		const el = document.querySelector('#propriedade-areas-list-top');
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const prevPage = () => goToPage(Math.max(1, currentPage - 1));
	const nextPage = () => goToPage(Math.min(totalPages, currentPage + 1));

	const getPageItems = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		const left = Math.max(2, currentPage - 1);
		const right = Math.min(totalPages - 1, currentPage + 1);

		pages.push(1);
		if (left > 2) pages.push('...');
		for (let p = left; p <= right; p++) pages.push(p);
		if (right < totalPages - 1) pages.push('...');
		pages.push(totalPages);

		return pages;
	};

	const handleDeleteArea = async (areaId: number) => {
		if (!confirm('Deseja realmente excluir esta área?')) return;

		setIsDeleting(areaId);

		try {
			const r = await fetch(`${API_BASE}/api/area/${areaId}`, {
				method: 'DELETE',
			});

			if (!r.ok) throw new Error();

			setAreas((prev) => prev.filter((a) => a.id !== areaId));

			toast({
				title: 'Área excluída',
				description: 'A área foi removida com sucesso.',
			});
		} catch {
			toast({
				title: 'Erro',
				description: 'Não foi possível excluir a área.',
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(null);
		}
	};

	const handleOpenArea = (areaId: number) => {
		navigate(`/area/${areaId}`);
	};

	return (
		<Layout>
			<div className="p-8">
				<h1 className="text-4xl font-bold text-primary mb-8">Projeto {id}</h1>

				{/* AGORA SOMENTE A ABA ÁREAS */}
				<Tabs defaultValue="areas" className="w-full">
					<TabsList className="w-full max-w-md bg-muted">
						<TabsTrigger value="areas" className="w-full">
							Áreas
						</TabsTrigger>
					</TabsList>

					<TabsContent value="areas" className="mt-6">
						<Card className="border-border p-6" id="propriedade-areas-list-top">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-bold mb-2">
										Áreas da Propriedade
									</h2>
									<p className="text-muted-foreground">
										Visualize e gerencie as áreas desta propriedade.
									</p>
								</div>

								<div className="flex items-center gap-2">
									<Input
										placeholder="Pesquisar por nome, cidade ou cultura"
										className="pl-8 bg-card border-border"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>

									<Button
										className="bg-primary text-primary-foreground gap-2"
										onClick={() => navigate('/areas')}
									>
										<Plus className="h-4 w-4" />
										Nova Área
									</Button>
								</div>
							</div>

							<div className="mt-6">
								{isLoadingAreas ? (
									<div className="py-12 flex justify-center">
										<Loader2 className="animate-spin h-6 w-6 text-primary" />
									</div>
								) : paginatedAreas.length === 0 ? (
									<div className="py-12 text-center text-muted-foreground">
										Nenhuma área encontrada.
									</div>
								) : (
									<>
										<Table>
											<TableHeader>
												<TableRow className="hover:bg-transparent border-border">
													<TableHead>Nome</TableHead>
													<TableHead>Estado</TableHead>
													<TableHead>Município</TableHead>
													<TableHead>Cultura</TableHead>
													<TableHead className="text-right">Ações</TableHead>
												</TableRow>
											</TableHeader>

											<TableBody>
												{paginatedAreas.map((area) => (
													<TableRow key={area.id} className="border-border">
														<TableCell>{area.nome_area}</TableCell>
														<TableCell>{area.estado}</TableCell>
														<TableCell>{area.municipio}</TableCell>
														<TableCell>{area.cultura_principal}</TableCell>

														<TableCell className="text-right">
															<div className="flex justify-end gap-2">
																<Button
																	onClick={() => navigate(`/areas/${area.id}`)}
																>
																	Abrir
																</Button>

																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleDeleteArea(area.id)}
																	disabled={isDeleting === area.id}
																>
																	{isDeleting === area.id
																		? 'Excluindo...'
																		: 'Excluir'}
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>

										<div className="flex items-center justify-between mt-6">
											<p className="text-sm text-muted-foreground">
												{filteredAreas.length} área(s) encontrada(s)
											</p>

											<div className="flex items-center gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={prevPage}
													disabled={currentPage === 1}
												>
													‹
												</Button>

												{getPageItems().map((p, idx) =>
													typeof p === 'string' ? (
														<Button
															key={idx}
															size="sm"
															variant="ghost"
															disabled
														>
															...
														</Button>
													) : (
														<Button
															key={p}
															size="sm"
															variant={
																p === currentPage ? 'default' : 'outline'
															}
															onClick={() => goToPage(p)}
														>
															{p}
														</Button>
													)
												)}

												<Button
													size="sm"
													variant="outline"
													onClick={nextPage}
													disabled={currentPage === totalPages}
												>
													›
												</Button>
											</div>
										</div>
									</>
								)}
							</div>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</Layout>
	);
};

export default ProjetoDetalhes;
