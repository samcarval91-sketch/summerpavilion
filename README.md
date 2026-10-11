# Azul Score Master (Pavilhão de Verão)

Webapp acessível via browser para cálculo de pontuação do jogo de tabuleiro **Azul: Pavilhão de Verão (Mini / Standard)** a partir de fotos de celular ou preenchimento interativo, baseado estritamente no **manual oficial de regras**.

---

## 🌟 Funcionalidades

1. **Captura por Câmera ou Arquivo:**
   - Suporte direto à câmera do smartphone (`capture="environment"`).
   - Suporte a múltiplos formatos de imagem: **JPEG, PNG e HEIC** (fotos nativas de iPhone).
2. **Cálculo Autônomo de Pontuação (Dispensando a Trilha Física):**
   - **Pontuação de Colocação ($C_6$ Adjacency):** Reconhece os grupos contíguos de cada uma das 7 estrelas e calcula a pontuação oficial ($\frac{k(k+1)}{2}$).
   - **Bônus de Estrelas Completas (Manual pág. 9):**
     - Centro (Multicolorida): 12 pts
     - Vermelha: 14 pts
     - Azul: 15 pts
     - Amarela: 16 pts
     - Laranja: 17 pts
     - Verde: 18 pts
     - Roxa: 20 pts
   - **Bônus de Séries Numéricas Completas (Manual pág. 9):**
     - Todos os 1s cobertos (7/7 estrelas): +4 pts
     - Todos os 2s cobertos (7/7 estrelas): +8 pts
     - Todos os 3s cobertos (7/7 estrelas): +12 pts
     - Todos os 4s cobertos (7/7 estrelas): +16 pts
   - **Penalidade de Cantos:** -1 pt por azulejo não utilizado restante nos 4 cantos.
   - **Ajustes Opcionais:** Campo para descontos de jogo (ex: 1º jogador a pegar do centro da mesa).
3. **Tabuleiro Interativo SVG (Human-in-the-Loop):**
   - Renderização geométrica das 7 estrelas com seus 6 losangos numerados.
   - Toque em qualquer losango para alternar entre preenchido e vazio com recálculo instantâneo.
4. **Placar Multijogador (Leaderboard):**
   - Salve os resultados de cada participante da mesa e visualize o ranking final.

---

## 🚀 Como Executar

### 1. Iniciar o Servidor Web
No terminal, na pasta raiz do projeto, execute:

```bash
python run.py
```

O servidor iniciará em `http://localhost:8000`.

### 2. Acessar pelo Celular (Na Mesma Rede Wi-Fi)
Para abrir no celular e usar a câmera diretamente:
1. Descubra o IP local do seu computador (ex: `ipconfig` -> `192.168.1.X`).
2. No navegador do smartphone, acesse: `http://192.168.1.X:8000`.

### 3. Configurar Análise por IA (Opcional)
Para habilitar a análise de imagem automatizada por visão computacional (Google Gemini Vision):

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="sua_chave_aqui"
python run.py
```

*(Se nenhuma chave for informada, o sistema abre em modo interativo com detecção assistida e edição manual em 1 toque).*

---

## 🧪 Testes Automatizados

Para rodar toda a suíte de testes unitários e de integração:

```bash
python -m pytest tests
```
