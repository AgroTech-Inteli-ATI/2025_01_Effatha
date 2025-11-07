from flask import Flask, jsonify
from flasgger import Swagger
from .routes import all_blueprints
from .models import Base, Propriedade, Area, Metricas, MetricasPreditivas

def create_app():
    """
    Função de fábrica que cria e configura a instância do aplicativo Flask.
    """
    # Inicialização do Flask
    app = Flask(__name__)

    # Inicialização do Swagger
    Swagger(app)

    # Registro dos Blueprints
    for bp in all_blueprints:
        app.register_blueprint(bp)
    
    # Rota de Health Check
    @app.route("/", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok"}), 200

    # Retorna a instância do aplicativo
    return app