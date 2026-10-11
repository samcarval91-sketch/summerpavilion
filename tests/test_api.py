"""Testes de integração para a API do webapp Azul Score Master."""

import io
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def test_get_rules():
    response = client.get("/api/rules")
    assert response.status_code == 200
    data = response.json()
    assert data["star_bonuses"]["center"] == 12
    assert data["star_bonuses"]["purple"] == 20
    assert data["number_bonuses"]["1"] == 4
    assert data["number_bonuses"]["4"] == 16


def test_get_test_board():
    response = client.get("/api/test-board")
    assert response.status_code == 200
    data = response.json()
    assert data["report"]["final_score"] == 113
    assert data["report"]["total_placement_score"] == 71
    assert data["report"]["total_star_bonus"] == 18
    assert data["report"]["total_number_bonus"] == 24
    assert data["report"]["completed_stars"] == ["green"]
    assert data["report"]["completed_numbers"] == [2, 4]


def test_calculate_score_endpoint():
    payload = {
        "stars": {
            "purple": [1, 2, 3, 4, 5, 6],
            "center": [1, 2],
        },
        "corner_tiles_count": 2,
        "extra_penalty": 1,
    }
    response = client.post("/api/score/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Purple placement = 21, Center placement = 3 -> total 24
    assert data["total_placement_score"] == 24
    # Purple bonus = 20
    assert data["total_star_bonus"] == 20
    # Corner penalty = 2, Extra penalty = 1
    assert data["corner_penalty"] == 2
    assert data["extra_penalty"] == 1
    # Total = 24 + 20 - 2 - 1 = 41
    assert data["final_score"] == 41


def test_vision_analyze_endpoint_with_image():
    # Cria uma imagem JPG pequena em memória para testar o endpoint
    img = Image.new("RGB", (200, 200), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/vision/analyze",
        files={"file": ("test.jpg", buf, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "detection" in data
    assert "report" in data
    assert "final_score" in data["report"]


def test_vision_analyze_tabuleiro_2():
    import os
    img_path = os.path.join(os.path.dirname(__file__), "..", "manual", "tabuleiro (2).JPG")
    if not os.path.exists(img_path):
        return
    with open(img_path, "rb") as f:
        response = client.post(
            "/api/vision/analyze",
            files={"file": ("tabuleiro (2).JPG", f, "image/jpeg")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["report"]["final_score"] == 113
    assert data["report"]["total_placement_score"] == 71
    assert data["report"]["completed_stars"] == ["green"]
    assert data["report"]["completed_numbers"] == [2, 4]


def test_vision_analyze_clean_tabuleiro():
    import os
    img_path = os.path.join(os.path.dirname(__file__), "..", "manual", "tabuleiro.jpg")
    if not os.path.exists(img_path):
        return
    with open(img_path, "rb") as f:
        response = client.post(
            "/api/vision/analyze",
            files={"file": ("tabuleiro.jpg", f, "image/jpeg")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["report"]["final_score"] == 0


def test_vision_analyze_tabuleiro_110pts():
    import os
    img_path = os.path.join(os.path.dirname(__file__), "..", "manual", "tabuleiro_partida_110pts.jpg")
    if not os.path.exists(img_path):
        return
    with open(img_path, "rb") as f:
        response = client.post(
            "/api/vision/analyze",
            files={"file": ("tabuleiro_partida_110pts.jpg", f, "image/jpeg")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["report"]["final_score"] == 110
    assert data["report"]["total_placement_score"] == 70
    assert data["report"]["total_star_bonus"] == 0
    assert data["report"]["total_number_bonus"] == 40
    assert data["report"]["completed_numbers"] == [1, 2, 3, 4]




def test_serve_frontend():
    response = client.get("/")
    assert response.status_code == 200
    assert "Pavilhão de Verão" in response.text
