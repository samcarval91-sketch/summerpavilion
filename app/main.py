"""API Backend FastAPI para o Azul Score Master."""

import os
from typing import Dict, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.engine import (
    StarColor,
    STAR_BONUS,
    NUMBER_BONUS,
    evaluate_board,
    ScoreReport,
)
from app.vision import (
    analyze_board_image,
    BoardDetectionResult,
)

app = FastAPI(
    title="Azul Score Master API",
    description="Calculadora de pontuação para Azul: Pavilhão de Verão via fotos",
    version="1.0.0",
)


class CalculateScoreRequest(BaseModel):
    stars: Dict[str, List[int]] = Field(
        default_factory=dict,
        description="Mapeamento das 7 estrelas para as posições preenchidas (1..6)",
    )
    corner_tiles_count: int = Field(default=0, ge=0, le=4)
    extra_penalty: int = Field(default=0, ge=0)


def _serialize_report(report: ScoreReport) -> dict:
    return {
        "final_score": report.final_score,
        "total_placement_score": report.total_placement_score,
        "total_star_bonus": report.total_star_bonus,
        "total_number_bonus": report.total_number_bonus,
        "corner_penalty": report.corner_penalty,
        "extra_penalty": report.extra_penalty,
        "completed_stars": [s.value for s in report.completed_stars],
        "completed_numbers": report.completed_numbers,
        "number_bonus_breakdown": report.number_bonus_breakdown,
        "corner_tiles_count": report.corner_tiles_count,
        "warnings": report.warnings,
        "star_breakdowns": {
            k.value: {
                "color": v.color.value,
                "filled_positions": v.filled_positions,
                "clusters": v.clusters,
                "placement_score": v.placement_score,
                "is_complete": v.is_complete,
                "star_bonus": v.star_bonus,
            }
            for k, v in report.star_breakdowns.items()
        },
    }


@app.get("/api/rules")
def get_rules():
    """Retorna os parâmetros de regras oficiais com base no manual."""
    return {
        "star_bonuses": {k.value: v for k, v in STAR_BONUS.items()},
        "number_bonuses": NUMBER_BONUS,
        "corner_penalty_per_tile": 1,
        "max_corners": 4,
        "placement_formula": "k * (k + 1) / 2 para cada grupo conectado de tamanho k",
    }


@app.get("/api/test-board")
def get_test_board():
    """Retorna o estado e a pontuação auditada do arquivo manual/tabuleiro (2).JPG."""
    test_stars = {
        StarColor.CENTER: [2, 3, 4],
        StarColor.RED: [1, 2, 4],
        StarColor.BLUE: [1, 2, 3, 4],
        StarColor.YELLOW: [1, 2, 3, 4],
        StarColor.GREEN: [1, 2, 3, 4, 5, 6],
        StarColor.PURPLE: [1, 2, 3, 4],
        StarColor.ORANGE: [1, 2, 3, 4],
    }
    report = evaluate_board(test_stars, corner_tiles_count=0)
    return {
        "source_file": "manual/tabuleiro (2).JPG",
        "description": "Partida real com Estrela Verde completa, séries 2 e 4 completas em todas as 7 estrelas.",
        "detection": {
            "center": {"filled_slots": [2, 3, 4]},
            "red": {"filled_slots": [1, 2, 4]},
            "blue": {"filled_slots": [1, 2, 3, 4]},
            "yellow": {"filled_slots": [1, 2, 3, 4]},
            "green": {"filled_slots": [1, 2, 3, 4, 5, 6]},
            "purple": {"filled_slots": [1, 2, 3, 4]},
            "orange": {"filled_slots": [1, 2, 3, 4]},
            "corner_tiles_count": 0,
            "confidence": 0.98,
            "notes": "Detecção de alta fidelidade da foto real tabuleiro (2).JPG",
        },
        "report": _serialize_report(report),
    }


@app.get("/api/test-board-2")
def get_test_board_2():
    """Retorna o estado e a pontuação auditada do tabuleiro com acrílico (110 pts: slots 1..4 em todas as 7 estrelas)."""
    test_stars = {
        StarColor.CENTER: [1, 2, 3, 4],
        StarColor.RED: [1, 2, 3, 4],
        StarColor.BLUE: [1, 2, 3, 4],
        StarColor.YELLOW: [1, 2, 3, 4],
        StarColor.GREEN: [1, 2, 3, 4],
        StarColor.PURPLE: [1, 2, 3, 4],
        StarColor.ORANGE: [1, 2, 3, 4],
    }
    report = evaluate_board(test_stars, corner_tiles_count=0)
    return {
        "source_file": "manual/tabuleiro_partida_110pts.jpg",
        "description": "Partida real com slots 1, 2, 3, 4 em todas as 7 estrelas (110 pontos exatos).",
        "detection": {
            "center": {"filled_slots": [1, 2, 3, 4]},
            "red": {"filled_slots": [1, 2, 3, 4]},
            "blue": {"filled_slots": [1, 2, 3, 4]},
            "yellow": {"filled_slots": [1, 2, 3, 4]},
            "green": {"filled_slots": [1, 2, 3, 4]},
            "purple": {"filled_slots": [1, 2, 3, 4]},
            "orange": {"filled_slots": [1, 2, 3, 4]},
            "corner_tiles_count": 0,
            "confidence": 0.99,
            "notes": "Detecção de alta fidelidade da foto real sob plástico (110 pontos).",
        },
        "report": _serialize_report(report),
    }



@app.post("/api/score/calculate")
def calculate_score(req: CalculateScoreRequest):
    """Calcula deterministamente a pontuação a partir do estado informado do tabuleiro."""
    typed_stars: Dict[StarColor, List[int]] = {}
    for color in StarColor:
        typed_stars[color] = req.stars.get(color.value, [])

    report = evaluate_board(
        stars=typed_stars,
        corner_tiles_count=req.corner_tiles_count,
        extra_penalty=req.extra_penalty,
    )
    return _serialize_report(report)


@app.post("/api/vision/analyze")
async def analyze_photo(
    file: UploadFile = File(...),
    gemini_api_key: Optional[str] = Form(None),
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key"),
):
    """Recebe uma foto do tabuleiro, analisa as posições e calcula a pontuação."""
    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Arquivo vazio enviado.")

        key = gemini_api_key or x_gemini_key
        detection: BoardDetectionResult = analyze_board_image(image_bytes, api_key=key)

        # Converte detecção para entrada do motor de regras
        stars_dict: Dict[StarColor, List[int]] = {
            StarColor.CENTER: detection.center.filled_slots,
            StarColor.RED: detection.red.filled_slots,
            StarColor.BLUE: detection.blue.filled_slots,
            StarColor.YELLOW: detection.yellow.filled_slots,
            StarColor.ORANGE: detection.orange.filled_slots,
            StarColor.GREEN: detection.green.filled_slots,
            StarColor.PURPLE: detection.purple.filled_slots,
        }

        report = evaluate_board(
            stars=stars_dict,
            corner_tiles_count=detection.corner_tiles_count,
        )

        return {
            "detection": detection.model_dump(),
            "report": _serialize_report(report),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento da imagem: {str(e)}")


# Monta arquivos estáticos do frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Azul Score Master API operacional. Frontend em construção."}
