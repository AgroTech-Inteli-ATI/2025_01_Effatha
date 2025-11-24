// src/pages/Areas.tsx
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Search,
	Plus,
	MapPin,
	Download,
	Copy,
	Check,
	Loader2,
} from 'lucide-react';
import MapDrawer, { Coordinate } from '@/components/MapDrawer';
import ExternalMapSearch from '@/components/ExternalMapSearch';
import KmlImporter from '@/components/KmlImporter';
import { useToast } from '@/hooks/use-toast';

type Propriedade = { id: number; nome: string };
type AreaBackend = {
	id: number;
	nome_area?: string;
	municipio?: string;
	estado?: string;
	cultura_principal?: string | null;
	propriedade_id?: number | null;
	coordenada?: any;
	data_criacao?: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? '';
console.log('VITE_API_URL (import.meta.env):', import.meta.env.VITE_API_URL);

const Areas = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[][]>(
		[]
	);
	const [areaName, setAreaName] = useState('');
	const [selectedState, setSelectedState] = useState('');
	const [selectedCity, setSelectedCity] = useState('');
	const [selectedCrop, setSelectedCrop] = useState('');
	const [observacoes, setObservacoes] = useState('');
	const [copied, setCopied] = useState(false);
	const [mapCenter, setMapCenter] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [isDetectingLocation, setIsDetectingLocation] = useState(false);
	const { toast } = useToast();

	const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
	const [selectedPropriedadeId, setSelectedPropriedadeId] = useState<
		number | null
	>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [editingArea, setEditingArea] = useState<any>(null);

	const [areas, setAreas] = useState<
		{
			id: number;
			name: string;
			state: string;
			city: string;
			crop: string;
			status: string;
			raw?: AreaBackend;
		}[]
	>([]);

	// PAGINAÇÃO
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 10;
	const filteredAreas = areas.filter((area) =>
		[area.name, area.state, area.city, area.crop]
			.join(' ')
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.max(1, Math.ceil(filteredAreas.length / pageSize));

	// Ajusta currentPage se areas mudar e página ficar fora do range
	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [areas, totalPages, currentPage]);

	const paginatedAreas = filteredAreas.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const getPageItems = () => {
		// Retorna uma lista como [1, 2, 3, '...', 9, 10] dependendo do totalPages e currentPage
		const pages: (number | string)[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		// sempre mostra 1, 2, ..., last-1, last com elipses quando necessário
		const left = Math.max(2, currentPage - 1);
		const right = Math.min(totalPages - 1, currentPage + 1);

		pages.push(1);
		if (left > 2) pages.push('...');
		for (let p = left; p <= right; p++) pages.push(p);
		if (right < totalPages - 1) pages.push('...');
		pages.push(totalPages);
		return pages;
	};

	const goToPage = (p: number) => {
		if (p < 1 || p > totalPages) return;
		setCurrentPage(p);
		// opcional: rolar para topo da lista
		const el = document.querySelector('#areas-list-top');
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
	const prevPage = () => goToPage(Math.max(1, currentPage - 1));
	const nextPage = () => goToPage(Math.min(totalPages, currentPage + 1));

	// fetch propriedades
	useEffect(() => {
		const fetchPropriedades = async () => {
			try {
				const url = `${API_BASE}/api/propriedade/`;
				console.log('[Areas] buscando propriedades em:', url);
				const r = await fetch(url, { headers: { Accept: 'application/json' } });
				if (!r.ok) throw new Error(`Status ${r.status}`);
				const data = await r.json();
				if (!Array.isArray(data)) return setPropriedades([]);
				const normalized = data.map((p: any) => ({
					id: Number(p.id),
					nome: p.nome || '',
				}));
				setPropriedades(normalized);
			} catch (err) {
				console.error('[Areas] Erro buscando propriedades:', err);
				toast({
					title: 'Aviso',
					description: 'Não foi possível carregar propriedades.',
				});
				setPropriedades([]);
			}
		};
		fetchPropriedades();
	}, []);

	// fetch areas
	useEffect(() => {
		const fetchAreas = async () => {
			try {
				const url = `${API_BASE}/api/area/`;
				console.log('[Areas] buscando areas em:', url);
				const r = await fetch(url, { headers: { Accept: 'application/json' } });
				if (!r.ok) {
					const txt = await r.text().catch(() => '');
					console.error('[Areas] erro fetch areas:', r.status, txt);
					throw new Error(`Status ${r.status}`);
				}
				const data = await r.json();
				if (!Array.isArray(data)) {
					console.warn('[Areas] resposta areas nao é array:', data);
					setAreas([]);
					return;
				}
				const normalized = data.map((a: AreaBackend) => ({
					id: Number(a.id),
					name: a.nome_area ?? `Área ${a.id}`,
					state: a.estado ?? '-',
					city: a.municipio ?? '-',
					crop: a.cultura_principal ?? '-',
					status: 'Ativa',
					raw: a,
				}));
				setAreas(normalized);
				setCurrentPage(1); // opcional: reset para 1 após fetch inicial
			} catch (err) {
				console.error('[Areas] Erro buscando areas:', err);
				toast({
					title: 'Aviso',
					description: 'Não foi possível carregar áreas.',
				});
				setAreas([]);
			}
		};
		fetchAreas();
	}, []);

	// Função para detectar estado e município a partir de coordenadas
	const detectLocationFromCoordinates = async (lat: number, lng: number) => {
		setIsDetectingLocation(true);
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`,
				{
					headers: {
						'Accept-Language': 'pt-BR',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Erro ao detectar localização');
			}

			const data = await response.json();

			if (data.address) {
				const state = data.address.state || data.address.region || '';
				const city =
					data.address.city ||
					data.address.town ||
					data.address.village ||
					data.address.municipality ||
					'';

				if (state) setSelectedState(state);
				if (city) setSelectedCity(city);

				if (state && city) {
					toast({
						title: 'Localização detectada!',
						description: `${city}, ${state}`,
					});
				}
			}
		} catch (error) {
			console.error('Erro ao detectar localização:', error);
			toast({
				title: 'Aviso',
				description:
					'Não foi possível detectar automaticamente a localização. Por favor, selecione manualmente.',
				variant: 'default',
			});
		} finally {
			setIsDetectingLocation(false);
		}
	};

	const handlePolygonCreated = (coordinates: Coordinate[][]) => {
		setPolygonCoordinates(coordinates);
		console.log('Coordenadas do polígono:', coordinates);

		if (coordinates.length > 0 && coordinates[0].length > 0) {
			const firstPoint = coordinates[0][0];
			detectLocationFromCoordinates(firstPoint.lat, firstPoint.lng);
		}
	};

	const handlePolygonsImported = (polygons: Coordinate[][]) => {
		setPolygonCoordinates(polygons);
		console.log('Polígonos importados do KML:', polygons);

		if (polygons.length > 0 && polygons[0].length > 0) {
			const firstPoint = polygons[0][0];
			detectLocationFromCoordinates(firstPoint.lat, firstPoint.lng);
		}
	};

	const resetForm = () => {
		setEditingArea(null);
		setPolygonCoordinates([]);
		setAreaName('');
		setSelectedState('');
		setSelectedCity('');
		setSelectedCrop('');
		setObservacoes('');
		setSelectedPropriedadeId(null);
		setMapCenter(null);
	};

	const parseGeoToPolygons = (geo: any): Coordinate[][] | null => {
		if (!geo) return null;
		// se veio como string
		const obj = typeof geo === 'string' ? JSON.parse(geo) : geo;

		// suporta GeoJSON Polygon e MultiPolygon diretamente em 'coordinates'
		if (obj.type === 'Polygon' && Array.isArray(obj.coordinates)) {
			const ring = obj.coordinates[0] || [];
			const coords = ring.map(([lng, lat]: [number, number]) => ({ lat, lng }));
			return [coords];
		}
		if (obj.type === 'MultiPolygon' && Array.isArray(obj.coordinates)) {
			return obj.coordinates.map((poly: any) =>
				(poly[0] || []).map(([lng, lat]: [number, number]) => ({ lat, lng }))
			);
		}
		// alguns retornos podem trazer { geometry: { type: 'Polygon', coordinates: [...] } }
		const geometry = obj.geometry || obj;
		if (geometry && geometry.type) {
			return parseGeoToPolygons(geometry);
		}

		return null;
	};

	const loadAreaIntoForm = (areaNormalized: any) => {
		// areaNormalized é o objeto que você usa em setAreas(...) (tem campos .raw)
		const raw = areaNormalized.raw ?? areaNormalized;
		setEditingArea(areaNormalized);
		setAreaName(raw.nome_area ?? areaNormalized.name ?? '');
		setSelectedState(raw.estado ?? areaNormalized.state ?? '');
		setSelectedCity(raw.municipio ?? areaNormalized.city ?? '');
		setSelectedCrop(
			raw.cultura_principal ??
				areaNormalized.cultura_principal ??
				areaNormalized.crop ??
				''
		);
		setSelectedPropriedadeId(raw.propriedade_id ?? null);
		setObservacoes(raw.observacoes ?? '');

		// converter coordenada para polygonCoordinates (Coordinate[][])
		try {
			const geo = raw.coordenada ?? null;
			const parsed = parseGeoToPolygons(geo);
			if (parsed) {
				setPolygonCoordinates(parsed);
				// centraliza mapa no primeiro ponto
				const firstPoly = parsed[0];
				if (firstPoly && firstPoly.length > 0) {
					setMapCenter({ lat: firstPoly[0].lat, lng: firstPoly[0].lng });
				}
			} else {
				setPolygonCoordinates([]);
			}
		} catch (err) {
			console.error('Erro ao interpretar coordenada da área:', err);
			setPolygonCoordinates([]);
		}
	};

	const handleLocationSelect = (lat: number, lng: number, name: string) => {
		setMapCenter({ lat, lng });
		toast({
			title: 'Centralizando mapa',
			description: name,
		});
	};

	const downloadCoordinates = () => {
		if (polygonCoordinates.length === 0) {
			toast({
				title: 'Erro',
				description: 'Nenhum polígono foi desenhado ainda.',
				variant: 'destructive',
			});
			return;
		}

		const data = {
			areaName: areaName || 'Area sem nome',
			state: selectedState,
			city: selectedCity,
			crop: selectedCrop,
			polygons: polygonCoordinates,
			createdAt: new Date().toISOString(),
		};

		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `area_${
			areaName.replace(/\s+/g, '_') || 'sem_nome'
		}_${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast({
			title: 'Download concluído',
			description: 'As coordenadas foram exportadas com sucesso.',
		});
	};

	const copyCoordinates = () => {
		if (polygonCoordinates.length === 0) {
			toast({
				title: 'Erro',
				description: 'Nenhum polígono foi desenhado ainda.',
				variant: 'destructive',
			});
			return;
		}

		const data = {
			areaName: areaName || 'Area sem nome',
			state: selectedState,
			city: selectedCity,
			crop: selectedCrop,
			polygons: polygonCoordinates,
		};

		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
		setCopied(true);

		toast({
			title: 'Copiado!',
			description:
				'As coordenadas foram copiadas para a área de transferência.',
		});

		setTimeout(() => setCopied(false), 2000);
	};

	// converte polygonCoordinates (Coordinate[][]) em GeoJSON compatível
	const buildGeoJSONFromPolygons = () => {
		if (polygonCoordinates.length === 0) return null;

		const polygons = polygonCoordinates.map((poly) =>
			poly.map((pt) => [pt.lng, pt.lat])
		);

		if (polygons.length === 1) {
			const ring = polygons[0];
			const closed =
				ring.length > 0 &&
				ring[0][0] === ring[ring.length - 1][0] &&
				ring[0][1] === ring[ring.length - 1][1];
			const coords = closed ? ring : [...ring, ring[0]];
			return { type: 'Polygon', coordinates: [coords] };
		} else {
			const multipoly = polygons.map((ring) => {
				const closed =
					ring.length > 0 &&
					ring[0][0] === ring[ring.length - 1][0] &&
					ring[0][1] === ring[ring.length - 1][1];
				const coords = closed ? ring : [...ring, ring[0]];
				return [coords];
			});
			return { type: 'MultiPolygon', coordinates: multipoly };
		}
	};

	const handleSaveArea = async () => {
		if (polygonCoordinates.length === 0) {
			toast({
				title: 'Erro',
				description: 'Por favor, desenhe um polígono no mapa antes de salvar.',
				variant: 'destructive',
			});
			return;
		}

		if (!selectedPropriedadeId) {
			toast({
				title: 'Erro',
				description:
					'Selecione a propriedade (proprietário) a qual a área pertence.',
				variant: 'destructive',
			});
			return;
		}

		setIsSaving(true);
		const geojson = buildGeoJSONFromPolygons();
		if (!geojson) {
			toast({ title: 'Erro', description: 'GeoJSON inválido.' });
			setIsSaving(false);
			return;
		}

		const payload = {
			propriedade_id: selectedPropriedadeId,
			coordenada: geojson,
			municipio: selectedCity || '',
			estado: selectedState || '',
			nome_area: areaName,
			cultura_principal: selectedCrop || null,
			imagens: null,
			observacoes: observacoes || null,
		};

		try {
			let r;
			if (editingArea) {
				// Atualização (PUT)
				// obtém id real (raw pode conter o id vindo do backend)
				const areaId = editingArea.raw?.id ?? editingArea.id;
				r = await fetch(`${API_BASE}/api/area/${areaId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});

				if (!r.ok) {
					const text = await r.text();
					throw new Error(`Status ${r.status}: ${text}`);
				}

				const updated = await r.json();
				toast({
					title: 'Área atualizada!',
					description: `Área "${updated.nome_area ?? areaName}" atualizada.`,
				});

				// atualizar lista local de areas (substituir item)
				const normalized = {
					id: Number(updated.id),
					name: updated.nome_area ?? areaName ?? `Área ${updated.id}`,
					state: updated.estado ?? selectedState ?? '-',
					city: updated.municipio ?? selectedCity ?? '-',
					crop: updated.cultura_principal ?? selectedCrop ?? '-',
					status: 'Ativa',
					raw: updated,
				};
				setAreas((prev) =>
					prev.map((a) => (a.id === normalized.id ? normalized : a))
				);
			} else {
				// Criação (POST) — comportamento anterior
				r = await fetch(`${API_BASE}/api/area/`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});

				if (!r.ok) {
					const text = await r.text();
					throw new Error(`Status ${r.status}: ${text}`);
				}

				const created = await r.json();
				toast({
					title: 'Área salva!',
					description: `Área "${areaName}" criada (id: ${created.id ?? '?'}).`,
				});

				const createdNormalized = {
					id: Number(created.id),
					name: created.nome_area ?? areaName ?? `Área ${created.id}`,
					state: created.estado ?? selectedState ?? '-',
					city: created.municipio ?? selectedCity ?? '-',
					crop: created.cultura_principal ?? selectedCrop ?? '-',
					status: 'Ativa',
					raw: created,
				};
				setAreas((prev) => [createdNormalized, ...prev]);
			}

			// limpa formulário e fecha modal
			resetForm();
			setIsDialogOpen(false);
		} catch (err) {
			console.error('Erro salvando/atualizando área:', err);
			toast({
				title: 'Erro',
				description: 'Falha ao salvar/atualizar área (verifique o backend).',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteArea = async (areaId: number) => {
		if (
			!confirm(
				'Deseja realmente excluir esta área? Esta ação não pode ser desfeita.'
			)
		)
			return;

		try {
			const r = await fetch(`${API_BASE}/api/area/${areaId}`, {
				method: 'DELETE',
			});

			if (!r.ok) {
				const text = await r.text();
				throw new Error(`Status ${r.status}: ${text}`);
			}

			setAreas((prev) => prev.filter((a) => a.id !== areaId));
			toast({
				title: 'Área excluída',
				description: 'A área foi removida com sucesso.',
			});
		} catch (err) {
			console.error('Erro ao deletar área:', err);
			toast({
				title: 'Erro',
				description: 'Não foi possível excluir a área.',
				variant: 'destructive',
			});
		}
	};

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
								{paginatedAreas.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center text-muted-foreground py-6"
										>
											Nenhuma área cadastrada.
										</TableCell>
									</TableRow>
								) : (
									paginatedAreas.map((area) => (
										<TableRow key={area.id} className="border-border">
											<TableCell className="font-medium">{area.name}</TableCell>
											<TableCell className="text-muted-foreground">
												{area.state}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{area.city}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{area.crop}
											</TableCell>
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
														onClick={() => {
															// area é o item do map
															loadAreaIntoForm(area);
															setIsDialogOpen(true);
														}}
													>
														Atualizar
													</Button>

													<Button
														variant="outline"
														size="sm"
														className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
														onClick={() => handleDeleteArea(area.id)}
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
								{areas.length} projetos disponíveis
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
									disabled={currentPage === totalPages}
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
				<DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
					<div className="flex flex-col h-full">
						<DialogHeader className="p-6 pb-4 border-b border-border">
							<DialogTitle className="text-2xl font-bold">
								{editingArea ? 'Editar Área' : 'Criar Nova Área'}
							</DialogTitle>
							<p className="text-muted-foreground">
								Use a barra de busca para encontrar a localização, depois
								desenhe a área no mapa
							</p>
						</DialogHeader>

						<div className="px-6 pt-4">
							<ExternalMapSearch onLocationSelect={handleLocationSelect} />
						</div>

						<div className="flex-1 flex gap-6 px-6 pb-6 overflow-hidden">
							<div className="flex-1 relative z-0 min-h-0">
								<MapDrawer
									onPolygonCreated={handlePolygonCreated}
									externalPolygons={polygonCoordinates}
									initialCenter={[-15.7801, -47.9292]}
									initialZoom={12}
									centerTo={mapCenter}
								/>

								{polygonCoordinates.length > 0 && (
									<div className="absolute bottom-4 left-4 z-[1100] bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs">
										<p className="text-sm font-semibold mb-1">
											{polygonCoordinates.length === 1
												? 'Polígono desenhado'
												: `${polygonCoordinates.length} Polígonos`}
										</p>
										<p className="text-xs text-muted-foreground">
											{polygonCoordinates.reduce(
												(total, poly) => total + poly.length,
												0
											)}{' '}
											pontos capturados
										</p>
										<div className="flex gap-2 mt-2">
											<Button
												size="sm"
												variant="outline"
												onClick={copyCoordinates}
												className="text-xs h-7 relative z-[1101]"
											>
												{copied ? (
													<>
														<Check className="h-3 w-3 mr-1" />
														Copiado
													</>
												) : (
													<>
														<Copy className="h-3 w-3 mr-1" />
														Copiar JSON
													</>
												)}
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={downloadCoordinates}
												className="text-xs h-7 relative z-[1101]"
											>
												<Download className="h-3 w-3 mr-1" />
												Exportar
											</Button>
										</div>
									</div>
								)}
							</div>

							<div className="w-80 space-y-4 overflow-y-auto">
								<div>
									<h3 className="font-semibold mb-4">Informações da Área</h3>

									<div className="space-y-4">
										<div>
											<Label htmlFor="area-name">Nome da Área *</Label>
											<Input
												id="area-name"
												placeholder="Ex: Fazenda Modelo"
												value={areaName}
												onChange={(e) => setAreaName(e.target.value)}
												className="bg-card border-border mt-1"
											/>
										</div>

										<div>
											<Label htmlFor="propriedade">Propriedade *</Label>

											<Select
												value={
													selectedPropriedadeId
														? String(selectedPropriedadeId)
														: ''
												}
												onValueChange={(v) =>
													setSelectedPropriedadeId(v ? Number(v) : null)
												}
											>
												<SelectTrigger
													id="propriedade"
													className="bg-card border-border mt-1"
												>
													<SelectValue placeholder="Selecione a propriedade" />
												</SelectTrigger>
												<SelectContent>
													{propriedades.map((p) => (
														<SelectItem key={p.id} value={String(p.id)}>
															{p.nome}
														</SelectItem>
													))}
													{propriedades.length === 0 && (
														<div className="px-3 py-2 text-sm text-muted-foreground">
															Nenhuma propriedade cadastrada — crie uma antes.
														</div>
													)}
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label htmlFor="state">Estado *</Label>
											<div className="relative">
												<Input
													id="state"
													placeholder={
														isDetectingLocation
															? 'Detectando...'
															: 'Digite o estado ou desenhe uma área no mapa'
													}
													value={selectedState}
													onChange={(e) => setSelectedState(e.target.value)}
													className="bg-card border-border mt-1"
													disabled={isDetectingLocation}
												/>
												{isDetectingLocation && (
													<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
												)}
											</div>
											{selectedState && !isDetectingLocation && (
												<p className="text-xs text-success mt-1">
													✓ Detectado automaticamente
												</p>
											)}
										</div>

										<div>
											<Label htmlFor="city">Município *</Label>
											<div className="relative">
												<Input
													id="city"
													placeholder={
														isDetectingLocation
															? 'Detectando...'
															: 'Digite o município ou desenhe uma área no mapa'
													}
													value={selectedCity}
													onChange={(e) => setSelectedCity(e.target.value)}
													className="bg-card border-border mt-1"
													disabled={isDetectingLocation}
												/>
												{isDetectingLocation && (
													<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
												)}
											</div>
											{selectedCity && !isDetectingLocation && (
												<p className="text-xs text-success mt-1">
													✓ Detectado automaticamente
												</p>
											)}
										</div>

										<div>
											<Label htmlFor="crop">Cultura principal (opcional)</Label>
											<Select
												value={selectedCrop}
												onValueChange={setSelectedCrop}
											>
												<SelectTrigger
													id="crop"
													className="bg-card border-border mt-1"
												>
													<SelectValue placeholder="Selecione a cultura" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="soja">Soja</SelectItem>
													<SelectItem value="milho">Milho</SelectItem>
													<SelectItem value="cafe">Café</SelectItem>
													<SelectItem value="cana">Cana-de-açúcar</SelectItem>
													<SelectItem value="algodao">Algodão</SelectItem>
													<SelectItem value="trigo">Trigo</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="observacoes">
												Observações (opcional)
											</Label>
											<Textarea
												id="observacoes"
												placeholder="Digite observações sobre esta área..."
												value={observacoes}
												onChange={(e) => setObservacoes(e.target.value)}
												className="bg-card border-border mt-1"
												rows={4}
											/>
										</div>
										<div className="border-t border-border pt-4">
											<Label className="mb-2 block">
												Ou importe de um arquivo
											</Label>
											<KmlImporter
												onPolygonsImported={handlePolygonsImported}
											/>
										</div>

										{polygonCoordinates.length > 0 && (
											<div className="bg-success/10 border border-success/20 rounded-lg p-3">
												<p className="text-sm font-semibold text-success">
													✓ Polígono desenhado
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{polygonCoordinates.length} polígono(s) • Área pronta
													para ser salva
												</p>
											</div>
										)}
									</div>
								</div>
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
								onClick={handleSaveArea}
								className="bg-primary hover:bg-primary/90 text-primary-foreground"
								disabled={
									!areaName ||
									polygonCoordinates.length === 0 ||
									!selectedPropriedadeId ||
									isSaving
								}
							>
								{isSaving ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : editingArea ? (
									// ícone para editar/guardar (mantive Plus para simplicidade — opcional trocar)
									<Plus className="h-4 w-4 mr-2" />
								) : (
									<Plus className="h-4 w-4 mr-2" />
								)}
								{editingArea ? 'Salvar alterações' : 'Adicionar Área'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Layout>
	);
};

export default Areas;
