# Plano de Desenvolvimento: Azul Score Master (Webapp de Pontuação via Foto)

Este plano especifica a arquitetura, a modelagem matemática das regras do jogo, o pipeline de visão computacional e a experiência de usuário para um **webapp acessível via browser** capaz de ler e calcular a pontuação de **Azul: Pavilhão de Verão (Mini / Standard)** diretamente a partir de fotos de smartphones, baseado estritamente no manual oficial do jogo (`manual/`).

---

## 1. Confirmação de Viabilidade e Qualidade das Imagens

### 1.1 Análise Técnica da Resolução
As imagens de referência registradas no dispositivo (`manual/IMG_1299.jpg` a `IMG_1303.jpg`) foram analisadas:
- **Resolução Nativa:** $4032 \times 3024$ pixels (12 Megapixels, formato padrão de smartphones).
- **Legibilidade:** Nessa resolução, o diâmetro de cada estrela possui mais de 1000 pixels. Os números internos (1 a 6), os contornos dos losangos, os cantos de reserva e até os detalhes das ilustrações (estátuas, janelas, pilares) apresentam altíssima nitidez e contraste.
- **Conclusão:** **SIM, a qualidade de imagem de smartphones convencionais é mais do que suficiente** para que o modelo de visão computacional detecte com alta fidelidade cada um dos 42 espaços das estrelas (7 estrelas $\times$ 6 espaços), bem como os 4 cantos de reserva.

---

## 2. Modelagem das Regras e Cálculo Autônomo de Pontuação

Atendendo ao feedback de **ignorar a dependência dos sliders da trilha física** e calcular a pontuação diretamente da **disposição geométrica dos azulejos colocados**, o motor de regras (`Score Engine`) calcula dois blocos principais:

$$\text{Pontuação Final} = S_{\text{colocação}} + B_{\text{fim\_de\_jogo}} - P_{\text{cantos}}$$

---

### 2.1 Cálculo da Pontuação de Colocação ($S_{\text{colocação}}$) — Sem Depender da Trilha

#### Regra Oficial do Manual (Páginas 6 a 8):
> *"Para cada azulejo que você coloca no seu tabuleiro de jogador, você recebe um ponto. Se colocar um azulejo ao lado de um ou mais azulejos conectados, você recebe um ponto para cada um deles... São considerados espaços conectados apenas aqueles que são adjacentes em uma estrela."*

#### Topologia da Estrela:
Cada uma das 7 estrelas é um anel cíclico de 6 losangos ($C_6$):
$$1 \longleftrightarrow 2 \longleftrightarrow 3 \longleftrightarrow 4 \longleftrightarrow 5 \longleftrightarrow 6 \longleftrightarrow 1$$

Dois azulejos são adjacentes se ocupam posições consecutivas na estrela.

#### Como o Algoritmo Calcula a Partir da Foto Estática:
Em uma foto estática do final da partida, cada estrela possui um conjunto de azulejos colocados que se agrupam em **componentes conexos** (clusters contíguos de tamanho $k$, onde $1 \le k \le 6$).

Para um cluster contíguo de tamanho $k$:
- **Se colocado sequencialmente (ordem canônica contígua):**
  - O 1º azulejo rende 1 ponto (isolado).
  - O 2º azulejo rende 2 pontos (está ligado ao 1º).
  - O 3º azulejo rende 3 pontos.
  - O $k$-ésimo azulejo rende $k$ pontos.
  
  $$\text{Pontos do Cluster}_k = \sum_{i=1}^k i = \frac{k(k+1)}{2}$$

| Tamanho do Cluster Conectado ($k$) | Pontuação Sequencial Canônica | Exemplo Prático |
| :---: | :---: | :--- |
| **1 azulejo isolado** | **1 pt** | Peça colocada sem vizinhos (Exemplos A e B do manual) |
| **2 azulejos adjacentes** | $1 + 2 =$ **3 pts** | Dupla contígua (ex: 1 e 2) |
| **3 azulejos conectados** | $1 + 2 + 3 =$ **6 pts** | Trinca contígua (ex: 4, 5 e 6 — Exemplos C, D, E) |
| **4 azulejos conectados** | $1 + 2 + 3 + 4 =$ **10 pts** | Quatro peças contíguas |
| **5 azulejos conectados** | $1 + 2 + 3 + 4 + 5 =$ **15 pts** | Cinco peças contíguas |
| **6 azulejos (estrela cheia)** | $1 + 2 + \dots + 6 =$ **21 pts** | Estrela 100% preenchida |

---

### 2.2 Bônus de Fim de Jogo ($B_{\text{fim\_de\_jogo}}$) — Manual Página 9

#### A. Estrelas Completas (todas as 6 pontas preenchidas):
*Dinâmica Real:* Em uma partida de 6 rodadas, um jogador normalmente completa 1 estrela, ou no máximo 2 estrelas.

| Estrela Concluída | Cor / Requisito | Bônus |
| :--- | :--- | :---: |
| **Centro** | Multicolorida (6 azulejos de cores distintas) | **12 pts** |
| **Topo** | Vermelha | **14 pts** |
| **Superior Direita** | Azul | **15 pts** |
| **Inferior Direita** | Amarela | **16 pts** |
| **Superior Esquerda** | Laranja | **17 pts** |
| **Base** | Verde | **18 pts** |
| **Inferior Esquerda** | Roxa | **20 pts** |

#### B. Séries Numéricas Completas (em todas as 7 estrelas):
| Conjunto Completo em Todas as 7 Estrelas | Bônus |
| :--- | :---: |
| **Todos os 1s cobertos** (7 azulejos '1') | **4 pts** |
| **Todos os 2s cobertos** (7 azulejos '2') | **8 pts** |
| **Todos os 3s cobertos** (7 azulejos '3') | **12 pts** |
| **Todos os 4s cobertos** (7 azulejos '4') | **16 pts** |

---

### 2.3 Penalidade de Cantos ($P_{\text{cantos}}$) — Manual Página 9
- Cada azulejo remanescente não utilizado nos 4 cantos de reserva desconta **1 ponto**:
$$P_{\text{cantos}} = 1 \times N_{\text{azulejos\_canto}} \quad (0 \le N_{\text{azulejos\_canto}} \le 4)$$

---

## 3. Próximos Passos de Implementação

1. **Fase 1 — Motor de Regras e Testes Unitários (`azul_engine.py`)**
2. **Fase 2 — Visão Computacional e Pipeline Multimodal**
3. **Fase 3 — Webapp PWA Responsivo**
