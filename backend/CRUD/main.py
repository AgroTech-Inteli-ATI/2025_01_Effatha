from flask import Flask
from flasgger import Swagger
from CRUD import create_app
from CRUD.database import engine
from CRUD.models import Base
from flask_cors import CORS

# Inicialização do Flask
app = create_app()

# CORS(app, origins=["http://localhost:8080", "http://127.0.0.1:8080"])
CORS(app)

# Cria tabelas automaticamente
Base.metadata.create_all(bind=engine)

# Bloco de execução principal
if __name__ == "__main__":
    app.run(debug=True)
