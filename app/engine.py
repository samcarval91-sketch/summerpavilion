"""Azul: Pavilhão de Verão - Motor de Regras e Cálculo de Pontuação

Implementação determinística baseada estritamente no livro de regras oficial
(Manual Azul: Pavilhão de Verão Mini, Plan B Games / Galápagos Jogos).
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Set, Tuple


class StarColor(str, Enum):
    CENTER = "center"      # Estrela Central Multicolorida (12 pts)
    RED = "red"            # Estrela Vermelha (14 pts)
    BLUE = "blue"          # Estrela Azul (15 pts)
    YELLOW = "yellow"      # Estrela Amarela (16 pts)
    ORANGE = "orange"      # Estrela Laranja (17 pts)
    GREEN = "green"        # Estrela Verde (18 pts)
    PURPLE = "purple"      # Estrela Roxa (20 pts)


STAR_BONUS: Dict[StarColor, int] = {
    StarColor.CENTER: 12,
    StarColor.RED: 14,
    StarColor.BLUE: 15,
    StarColor.YELLOW: 16,
    StarColor.ORANGE: 17,
    StarColor.GREEN: 18,
    StarColor.PURPLE: 20,
}

NUMBER_BONUS: Dict[int, int] = {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
}

# Em uma estrela de 6 pontas (C6), as posições 1..6 formam um ciclo:
# 1-2-3-4-5-6-1
STAR_ADJACENCY: Dict[int, List[int]] = {
    1: [6, 2],
    2: [1, 3],
    3: [2, 4],
    4: [3, 5],
    5: [4, 6],
    6: [5, 1],
}


def find_connected_components(filled_positions: Set[int]) -> List[List[int]]:
    """Encontra os grupos conectados de azulejos adjacentes em uma estrela C6.
    
    Retorna uma lista de componentes, onde cada componente é uma lista
    de posições contíguas.
    """
    valid = set(p for p in filled_positions if 1 <= p <= 6)
    if not valid:
        return []
    
    if len(valid) == 6:
        # Estrela completamente preenchida forma um único componente de 6
        return [[1, 2, 3, 4, 5, 6]]
    
    visited: Set[int] = set()
    components: List[List[int]] = []
    
    for pos in sorted(valid):
        if pos in visited:
            continue
        # Inicia busca em largura/profundidade
        component: List[int] = []
        queue = [pos]
        visited.add(pos)
        while queue:
            curr = queue.pop(0)
            component.append(curr)
            for neighbor in STAR_ADJACENCY[curr]:
                if neighbor in valid and neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        components.append(sorted(component))
        
    return components


def calculate_cluster_score(cluster_size: int) -> int:
    """Calcula a pontuação canônica de colocação de um cluster conectado de tamanho k.
    
    Regra do manual (pág. 6-8):
    1º azulejo: 1 pt
    2º azulejo: 2 pts (conectado ao 1º)
    ...
    k-ésimo azulejo: k pts
    Soma = k * (k + 1) / 2
    """
    if cluster_size <= 0:
        return 0
    return (cluster_size * (cluster_size + 1)) // 2


@dataclass
class StarScoreBreakdown:
    color: StarColor
    filled_positions: List[int]
    clusters: List[List[int]]
    placement_score: int
    is_complete: bool
    star_bonus: int


@dataclass
class ScoreReport:
    # Pontuação por colocação (In-Game / Adjacência nas estrelas)
    star_breakdowns: Dict[StarColor, StarScoreBreakdown]
    total_placement_score: int
    
    # Bônus de fim de jogo
    completed_stars: List[StarColor]
    total_star_bonus: int
    
    completed_numbers: List[int]
    number_bonus_breakdown: Dict[int, int]
    total_number_bonus: int
    
    # Penalidades
    corner_tiles_count: int
    corner_penalty: int
    extra_penalty: int
    
    # Total consolidado
    final_score: int
    
    # Metadados de validação
    warnings: List[str] = field(default_factory=list)


def evaluate_board(
    stars: Dict[StarColor, List[int]],
    corner_tiles_count: int = 0,
    extra_penalty: int = 0,
) -> ScoreReport:
    """Calcula a pontuação completa do tabuleiro de um jogador de acordo com as regras oficiais.
    
    Args:
        stars: Mapeamento de cada cor para a lista de posições preenchidas (1..6).
        corner_tiles_count: Quantidade de azulejos nos 4 cantos de reserva (0..4).
        extra_penalty: Penalidades extras opcionais (ex: pegar primeiro do centro).
        
    Returns:
        ScoreReport com todo o extrato auditável de pontuação.
    """
    warnings: List[str] = []
    
    # Validações básicas
    if corner_tiles_count < 0:
        corner_tiles_count = 0
    if corner_tiles_count > 4:
        warnings.append(
            f"O tabuleiro só possui 4 espaços de cantos, mas foram informados {corner_tiles_count}. "
            f"Limitado a 4 penalidades de cantos."
        )
        corner_tiles_count = 4

    corner_penalty = corner_tiles_count  # 1 ponto por azulejo não utilizado (pág. 9)

    star_breakdowns: Dict[StarColor, StarScoreBreakdown] = {}
    total_placement = 0
    completed_stars: List[StarColor] = []
    total_star_bonus = 0

    # Dicionário de contagem de cada número (1..4) coberto em todas as estrelas
    number_counts = {1: 0, 2: 0, 3: 0, 4: 0}

    for color in StarColor:
        positions = sorted(list(set(stars.get(color, []))))
        # Filtra apenas válidos 1..6
        valid_positions = [p for p in positions if 1 <= p <= 6]
        
        # Componentes conexos
        clusters = find_connected_components(set(valid_positions))
        
        # Pontuação de colocação para cada cluster
        star_placement = sum(calculate_cluster_score(len(c)) for c in clusters)
        total_placement += star_placement
        
        is_complete = len(valid_positions) == 6
        star_bonus_val = STAR_BONUS[color] if is_complete else 0
        if is_complete:
            completed_stars.append(color)
            total_star_bonus += star_bonus_val
            
        star_breakdowns[color] = StarScoreBreakdown(
            color=color,
            filled_positions=valid_positions,
            clusters=clusters,
            placement_score=star_placement,
            is_complete=is_complete,
            star_bonus=star_bonus_val,
        )
        
        # Atualiza contagem de números cobertos
        for num in (1, 2, 3, 4):
            if num in valid_positions:
                number_counts[num] += 1

    # Bônus de números completos (deve estar presente em TODAS as 7 estrelas)
    completed_numbers: List[int] = []
    number_bonus_breakdown: Dict[int, int] = {}
    total_number_bonus = 0

    for num in (1, 2, 3, 4):
        if number_counts[num] == 7:  # Coberto nas 7 estrelas
            bonus_pts = NUMBER_BONUS[num]
            completed_numbers.append(num)
            number_bonus_breakdown[num] = bonus_pts
            total_number_bonus += bonus_pts
        else:
            number_bonus_breakdown[num] = 0

    # Total final
    final_score = (
        total_placement
        + total_star_bonus
        + total_number_bonus
        - corner_penalty
        - extra_penalty
    )

    return ScoreReport(
        star_breakdowns=star_breakdowns,
        total_placement_score=total_placement,
        completed_stars=completed_stars,
        total_star_bonus=total_star_bonus,
        completed_numbers=completed_numbers,
        number_bonus_breakdown=number_bonus_breakdown,
        total_number_bonus=total_number_bonus,
        corner_tiles_count=corner_tiles_count,
        corner_penalty=corner_penalty,
        extra_penalty=extra_penalty,
        final_score=final_score,
        warnings=warnings,
    )
