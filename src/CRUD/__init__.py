from flask import Flask, jsonify
from flasgger import Swagger
from flask_cors import CORS
from .routes import all_blueprints
from .models import Base, Propriedade, Area, Metricas, MetricasPreditivas

def create_app():
    """
    Função de fábrica que cria e configura a instância do aplicativo Flask.
    """
    # Inicialização do Flask
    app = Flask(__name__)

    # Habilitar CORS para permitir requisições do frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

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