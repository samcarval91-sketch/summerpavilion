"""Script de inicialização do servidor web Azul Score Master."""

import os
import sys
import webbrowser
import uvicorn

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000
    local_url = f"http://localhost:{port}"

    print("=" * 60)
    print("  Azul: Pavilhão de Verão - Calculadora de Pontuação")
    print(f"  Servidor iniciando em: {local_url}")
    print("  Acessível em qualquer dispositivo na mesma rede local!")
    print("=" * 60)

    # Inicia o servidor Uvicorn com hot-reload habilitado
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
