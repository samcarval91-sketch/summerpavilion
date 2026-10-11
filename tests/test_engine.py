"""Testes unitários para o motor de regras de pontuação de Azul: Pavilhão de Verão.

Baseados diretamente nos exemplos e especificações do manual oficial (páginas 6 a 9).
"""

import pytest
from app.engine import (
    StarColor,
    find_connected_components,
    calculate_cluster_score,
    evaluate_board,
    STAR_BONUS,
    NUMBER_BONUS,
)


def test_connected_components_empty():
    assert find_connected_components(set()) == []


def test_connected_components_single():
    assert find_connected_components({3}) == [[3]]


def test_connected_components_adjacent():
    assert find_connected_components({1, 2}) == [[1, 2]]


def test_connected_components_non_adjacent():
    assert find_connected_components({1, 4}) == [[1], [4]]


def test_connected_components_wrap_around():
    # 6 e 1 são adjacentes no ciclo C6
    assert find_connected_components({6, 1}) == [[1, 6]]
    # 5, 6, 1 contíguos
    assert find_connected_components({5, 6, 1}) == [[1, 5, 6]]


def test_connected_components_full_star():
    assert find_connected_components({1, 2, 3, 4, 5, 6}) == [[1, 2, 3, 4, 5, 6]]


def test_connected_components_alternating():
    # 1, 3, 5 nenhum é adjacente ao outro
    assert find_connected_components({1, 3, 5}) == [[1], [3], [5]]


def test_cluster_scoring():
    # 1 azulejo: 1 pt
    assert calculate_cluster_score(1) == 1
    # 2 azulejos: 1 + 2 = 3 pts
    assert calculate_cluster_score(2) == 3
    # 3 azulejos: 1 + 2 + 3 = 6 pts
    assert calculate_cluster_score(3) == 6
    # 4 azulejos: 1 + 2 + 3 + 4 = 10 pts
    assert calculate_cluster_score(4) == 10
    # 5 azulejos: 15 pts
    assert calculate_cluster_score(5) == 15
    # 6 azulejos (estrela cheia): 21 pts
    assert calculate_cluster_score(6) == 21


def test_manual_example_b_isolated():
    # Exemplo B do manual (pág. 8):
    # Ana tem posições 1, 3 e 5 preenchidas (nenhuma adjacente).
    # Cada uma é um cluster isolado valendo 1 pt -> total 3 pts
    board = {
        StarColor.RED: [1, 3, 5]
    }
    report = evaluate_board(board)
    red_report = report.star_breakdowns[StarColor.RED]
    assert len(red_report.clusters) == 3
    assert red_report.placement_score == 3
    assert not red_report.is_complete


def test_manual_example_c_connected():
    # Exemplo C do manual (pág. 8):
    # Andrea preenche posição 6 tendo 1 e 5 já preenchidos.
    # O cluster formado é {1, 5, 6} (tamanho 3) -> 6 pts de colocação
    board = {
        StarColor.BLUE: [1, 5, 6]
    }
    report = evaluate_board(board)
    blue_report = report.star_breakdowns[StarColor.BLUE]
    assert blue_report.clusters == [[1, 5, 6]]
    assert blue_report.placement_score == 6


def test_completed_star_bonus():
    # Completando apenas a estrela Verde (manual pág. 9: 18 pts bônus)
    board = {
        StarColor.GREEN: [1, 2, 3, 4, 5, 6]
    }
    report = evaluate_board(board)
    assert StarColor.GREEN in report.completed_stars
    assert report.total_star_bonus == 18
    # 21 pts de colocação + 18 pts de bônus = 39 pts
    assert report.total_placement_score == 21
    assert report.final_score == 39


def test_completed_number_bonus():
    # Manual pág. 9: cobrir todos os 1s concede 4 pontos; todos os 2s concede 8 pontos
    # Preenchendo a posição 1 em todas as 7 estrelas
    board = {
        color: [1] for color in StarColor
    }
    report = evaluate_board(board)
    assert 1 in report.completed_numbers
    assert report.total_number_bonus == 4
    # 7 azulejos isolados de tamanho 1 = 7 pts
    # 7 pts colocação + 4 pts bônus = 11 pts
    assert report.final_score == 11


def test_incomplete_number_bonus():
    # Preenchendo '1' em apenas 6 estrelas (falta uma): 0 bônus
    colors = list(StarColor)
    board = {
        color: [1] for color in colors[:-1]
    }
    report = evaluate_board(board)
    assert 1 not in report.completed_numbers
    assert report.total_number_bonus == 0


def test_corner_penalty():
    # Manual pág. 9: cada azulejo remanescente nos cantos desconta 1 ponto
    board = {
        StarColor.RED: [1, 2]  # 3 pts colocação
    }
    report = evaluate_board(board, corner_tiles_count=3)
    assert report.corner_penalty == 3
    # 3 pts colocação - 3 pts penalidade = 0 pts
    assert report.final_score == 0


def test_realistic_full_match_scenario():
    """Cenário realista de fim de jogo:
    - 1 estrela completa (Roxa: 20 pts de bônus)
    - Algumas peças espalhadas
    - Cobriu todos os 1s em todas as 7 estrelas (4 pts de bônus)
    - 2 azulejos guardados no canto (-2 pts)
    """
    board = {
        StarColor.PURPLE: [1, 2, 3, 4, 5, 6],  # 21 colocação + 20 bônus
        StarColor.CENTER: [1, 2],              # 3 colocação
        StarColor.RED: [1, 3],                 # 1 + 1 = 2 colocação
        StarColor.BLUE: [1],                   # 1 colocação
        StarColor.YELLOW: [1],                 # 1 colocação
        StarColor.ORANGE: [1, 2, 3],           # 6 colocação
        StarColor.GREEN: [1, 4],               # 1 + 1 = 2 colocação
    }
    report = evaluate_board(board, corner_tiles_count=2)
    
    # Colocação: 21 (roxa) + 3 (centro) + 2 (vermelha) + 1 (azul) + 1 (amarela) + 6 (laranja) + 2 (verde) = 36 pts
    assert report.total_placement_score == 36
    
    # Bônus estrela: apenas Roxa = 20 pts
    assert report.completed_stars == [StarColor.PURPLE]
    assert report.total_star_bonus == 20
    
    # Bônus número: todos os 1s cobertos (7/7) = 4 pts
    assert report.completed_numbers == [1]
    assert report.total_number_bonus == 4
    
    # Penalidade canto: 2 azulejos = -2 pts
    assert report.corner_penalty == 2
    
    # Total esperado: 36 + 20 + 4 - 2 = 58 pts
    assert report.final_score == 58
