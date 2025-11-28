---
sidebar_position: 2
slug: /sprint-3/teor-de-argila/teor-de-argila
description: "Calculo do teor de argila"
---

# Cálculo do Teor de Argila (%) no Solo — Documentação (GEE + Python)

## Introdução

Este documento descreve, de forma objetiva e reprodutível, como estimar o **teor de argila (%)** do solo para uma área de interesse usando a **API do Google Earth Engine (GEE)** em **Python**. Utilizamos o dataset público **OpenLandMap – Clay mass fraction** e calculamos estatísticas descritivas (média, mínimo, máximo) sobre um polígono (AOI), mantendo o mesmo padrão de organização usado em NDVI/EVI no projeto.

---

## Dados e Fontes

- **Dataset:** `OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02`  
  **Conteúdo:** fração mássica de **argila (%)** por profundidade  
  **Resolução:** ~**250 m** (nativa)  
  **Bandas (profundidades):**
  - `b0` → 0–5 cm
  - `b10` → 5–15 cm
  - `b30` → 15–30 cm
  - `b60` → 30–60 cm
  - `b100` → 60–100 cm
  - `b200` → 100–200 cm
- **AOI:** variável `aoi` (`ee.Geometry`) definida no notebook ou carregada de um asset.

> Observação: valores representam **estimativas percentuais** provenientes de modelos globais; recomenda-se validação com amostras de campo quando necessário.

---

## Parâmetros

- `SCALE = 250` — usa a resolução nativa do OpenLandMap.
- `REGION = aoi` — geometria da área analisada (`ee.Geometry`).
- `DEPTH = '0-5cm'` — profundidade-alvo (pode ser trocada por `'5-15cm'`, `'15-30cm'`, `'30-60cm'`, `'60-100cm'`, `'100-200cm'`).

---

## Código (Python, pronto para colar)

```python
# ================================
# CÁLCULO DO TEOR DE ARGILA (%) NO SOLO — GOOGLE EARTH ENGINE (PYTHON)
# ================================

# 1) Setup
# !pip install earthengine-api geemap --quiet
import ee
try:
    ee.Initialize()
except Exception:
    ee.Authenticate()
    ee.Initialize()

# 2) Parâmetros
# Defina sua AOI antes (ex.: aoi = ee.Geometry.Polygon([...]) ou carregue de um asset)
SCALE = 250                 # resolução nativa do OpenLandMap (~250 m)
REGION = aoi                # ee.Geometry da área de interesse
DEPTH  = '0-5cm'            # '0-5cm' | '5-15cm' | '15-30cm' | '30-60cm' | '60-100cm' | '100-200cm'

# 3) Dataset e mapeamento
DATASET = 'OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02'
DEPTH_TO_BAND = {
    '0-5cm':     'b0',
    '5-15cm':    'b10',
    '15-30cm':   'b30',
    '30-60cm':   'b60',
    '60-100cm':  'b100',
    '100-200cm': 'b200',
}

# 4) Funções principais
def get_clay_image(depth_label: str) -> ee.Image:
    """Retorna imagem (% argila) para a profundidade desejada, renomeada para 'clay_pct'."""
    band = DEPTH_TO_BAND[depth_label]
    return (ee.Image(DATASET)
            .select(band)
            .rename('clay_pct'))

def clay_stats(image: ee.Image, region: ee.Geometry, scale: int = 250) -> dict:
    """Calcula média/mín/máx do teor de argila (%) na região."""
    img = image.select('clay_pct').clip(region)
    r = img.reduceRegion(
        reducer=(ee.Reducer.mean()
                 .combine(ee.Reducer.min(), sharedInputs=True)
                 .combine(ee.Reducer.max(), sharedInputs=True)),
        geometry=region,
        scale=scale,
        maxPixels=1e13,
        bestEffort=True,
        tileScale=4
    )
    d = r.getInfo() or {}
    stats = {
        'CLAY_mean_%': d.get('clay_pct_mean'),
        'CLAY_min_%':  d.get('clay_pct_min'),
        'CLAY_max_%':  d.get('clay_pct_max'),
    }
    print(f"ARGILA ({scale} m, {DEPTH}) stats:", stats)
    return stats

# 5) Execução (geração da imagem e estatísticas)
clay_img = get_clay_image(DEPTH)
stats = clay_stats(clay_img, REGION, SCALE)


```

O procedimento documentado permite estimar, de forma padronizada e reprodutível, o **teor de argila (%)** a partir do dataset OpenLandMap no Google Earth Engine usando Python. Ao selecionar a profundidade por rótulo, renomear a banda para `clay_pct` e aplicar estatísticas zonais sobre a AOI, garantimos consistência com outros indicadores do projeto (ex.: NDVI/EVI) e facilitamos a integração em dashboards e relatórios.
