from sqlalchemy import Integer, String, TIMESTAMP, ForeignKey, DECIMAL, Date, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from CRUD.database import Base
from datetime import datetime
from typing import Optional, Dict


class Propriedade(Base):
    __tablename__ = "propriedade"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=False), server_default=func.now(), nullable=False)
    responsavel: Mapped[str] = mapped_column(String(100), nullable=False)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)

    areas = relationship("Area", back_populates="propriedade", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "data_criacao": str(self.data_criacao),
            "responsavel": self.responsavel,
            "nome": self.nome,
        }

    def __repr__(self):
        return f"<Propriedade id={self.id} nome='{self.nome}' responsavel='{self.responsavel}'>"


class Area(Base):
    __tablename__ = "area"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    propriedade_id: Mapped[int] = mapped_column(Integer, ForeignKey("propriedade.id", ondelete="CASCADE"))
    coordenada: Mapped[Optional[Dict]] = mapped_column(JSONB)
    municipio: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)
    nome_area: Mapped[str] = mapped_column(String(100), nullable=False)
    cultura_principal: Mapped[Optional[str]] = mapped_column(String(100))
    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=False), server_default=func.now(), nullable=False)
    imagens: Mapped[Optional[str]] = mapped_column(Text)
    observacoes: Mapped[Optional[str]] = mapped_column(Text)

    propriedade = relationship("Propriedade", back_populates="areas")
    metricas = relationship("Metricas", back_populates="area", cascade="all, delete-orphan")
    metricas_preditivas = relationship("MetricasPreditivas", back_populates="area", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "propriedade_id": self.propriedade_id,
            "coordenada": self.coordenada,
            "municipio": self.municipio,
            "estado": self.estado,
            "nome_area": self.nome_area,
            "cultura_principal": self.cultura_principal,
            "data_criacao": str(self.data_criacao),
            "imagens": self.imagens,
            "observacoes": self.observacoes,
        }

    def __repr__(self):
        return (
            f"<Area id={self.id} nome='{self.nome_area}' municipio='{self.municipio}' "
            f"estado='{self.estado}' cultura='{self.cultura_principal}'>"
        )


class Metricas(Base):
    __tablename__ = "metricas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    area_id: Mapped[int] = mapped_column(Integer, ForeignKey("area.id", ondelete="CASCADE"), nullable=False)
    periodo_inicio: Mapped[datetime] = mapped_column(Date, nullable=False)
    periodo_fim: Mapped[datetime] = mapped_column(Date, nullable=False)

    # Campos NDVI
    ndvi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndvi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndvi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # Campos EVI
    evi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    evi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    evi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # NDWI
    ndwi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndwi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndwi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # NDMI
    ndmi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndmi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndmi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # GNDVI
    gndvi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    gndvi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    gndvi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # NDRE
    ndre_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndre_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndre_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    # RENDVI
    rendvi_mean: Mapped[Optional[float]] = mapped_column(DECIMAL)
    rendvi_median: Mapped[Optional[float]] = mapped_column(DECIMAL)
    rendvi_std: Mapped[Optional[float]] = mapped_column(DECIMAL)

    biomassa: Mapped[Optional[float]] = mapped_column(DECIMAL)
    cobertura_vegetal: Mapped[Optional[float]] = mapped_column(DECIMAL)

    area = relationship("Area", back_populates="metricas")

    def to_dict(self):
        return {c.name: (float(getattr(self, c.name)) if isinstance(getattr(self, c.name), (int, float, complex)) else getattr(self, c.name)) for c in self.__table__.columns}

    def __repr__(self):
        return (
            f"<Metricas id={self.id} area_id={self.area_id} "
            f"periodo=({self.periodo_inicio} → {self.periodo_fim})>"
        )


class MetricasPreditivas(Base):
    __tablename__ = "metricas_preditivas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    area_id: Mapped[int] = mapped_column(Integer, ForeignKey("area.id", ondelete="CASCADE"), nullable=False)
    modelo_utilizado: Mapped[str] = mapped_column(String(100), nullable=False)
    periodo_previsto_inicio: Mapped[datetime] = mapped_column(Date, nullable=False)
    periodo_previsto_fim: Mapped[datetime] = mapped_column(Date, nullable=False)

    # Campos preditivos
    ndvi_mean_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndvi_min_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndvi_max_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndvi_std_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)

    evi_mean_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    evi_min_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    evi_max_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    evi_std_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)

    ndwi_mean_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndwi_min_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndwi_max_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)
    ndwi_std_pred: Mapped[Optional[float]] = mapped_column(DECIMAL)

    data_criacao: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=False), server_default=func.now())
    observacoes: Mapped[Optional[str]] = mapped_column(Text)

    area = relationship("Area", back_populates="metricas_preditivas")

    def to_dict(self):
        return {c.name: (float(getattr(self, c.name)) if isinstance(getattr(self, c.name), (int, float, complex)) else getattr(self, c.name)) for c in self.__table__.columns}

    def __repr__(self):
        return f"<MetricasPreditivas id={self.id} modelo={self.modelo_utilizado} area_id={self.area_id}>"
