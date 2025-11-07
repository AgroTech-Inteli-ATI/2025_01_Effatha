from .propriedade_routes import propriedade_bp
from .area_routes import area_bp
from .metricas_routes import metricas_bp
from .metricas_preditivas_routes import metricas_preditivas_bp

all_blueprints = [
    propriedade_bp,
    area_bp,
    metricas_bp,
    metricas_preditivas_bp
]