/**
 * Azul Score Master - Frontend Application Logic
 * Summer Pavilion (Pavilhão de Verão) Scoring & Interactive Board
 */

// Configuração geométrica e de cores das 7 estrelas
const STARS_CONFIG = {
  center: { namePt: 'Multicolorida (Centro)', nameEn: 'Multicolor (Center)', colorClass: 'filled-center', color: '#1e293b', bonus: 12 },
  red:    { namePt: 'Vermelha',  nameEn: 'Red',    colorClass: 'filled-red',    phi: -90,  color: '#dc2626', bonus: 14 },
  blue:   { namePt: 'Azul',      nameEn: 'Blue',   colorClass: 'filled-blue',   phi: -30,  color: '#0284c7', bonus: 15 },
  yellow: { namePt: 'Amarela',   nameEn: 'Yellow', colorClass: 'filled-yellow', phi: 30,   color: '#d97706', bonus: 16 },
  green:  { namePt: 'Verde',     nameEn: 'Green',  colorClass: 'filled-green',  phi: 90,   color: '#65a30d', bonus: 18 },
  purple: { namePt: 'Roxa',      nameEn: 'Purple', colorClass: 'filled-purple', phi: 150,  color: '#9333ea', bonus: 20 },
  orange: { namePt: 'Laranja',   nameEn: 'Orange', colorClass: 'filled-orange', phi: -150, color: '#ea580c', bonus: 17 },
};

// Bandeiras SVG vetoriais (garantem exibição da bandeira colorida inclusive no Windows)
const FLAG_SVGS = {
  pt: `<svg viewBox="0 0 28 20" width="20" height="14" class="country-flag-svg" aria-label="Bandeira do Brasil">
    <rect width="28" height="20" rx="2" fill="#009b3a"/>
    <polygon points="14,2.2 25.5,10 14,17.8 2.5,10" fill="#fedf00"/>
    <circle cx="14" cy="10" r="4.6" fill="#002776"/>
    <path d="M9.6,8.8 Q14,7.4 18.4,10.5" fill="none" stroke="#ffffff" stroke-width="1.1"/>
  </svg>`,
  en: `<svg viewBox="0 0 28 20" width="20" height="14" class="country-flag-svg" aria-label="USA Flag">
    <rect width="28" height="20" rx="2" fill="#b22234"/>
    <path d="M0,3.08 H28 M0,6.15 H28 M0,9.23 H28 M0,12.31 H28 M0,15.38 H28 M0,18.46 H28" stroke="#ffffff" stroke-width="1.54"/>
    <rect width="12" height="10.77" rx="1" fill="#3c3b6e"/>
    <circle cx="2.5" cy="2.5" r="0.7" fill="#ffffff"/><circle cx="6" cy="2.5" r="0.7" fill="#ffffff"/><circle cx="9.5" cy="2.5" r="0.7" fill="#ffffff"/>
    <circle cx="4.2" cy="5.3" r="0.7" fill="#ffffff"/><circle cx="7.8" cy="5.3" r="0.7" fill="#ffffff"/>
    <circle cx="2.5" cy="8.1" r="0.7" fill="#ffffff"/><circle cx="6" cy="8.1" r="0.7" fill="#ffffff"/><circle cx="9.5" cy="8.1" r="0.7" fill="#ffffff"/>
  </svg>`,
};

// Dicionário de Internacionalização (i18n)
const I18N = {
  pt: {
    brand_badge: 'Azul Mini',
    brand_title: 'Pavilhão de Verão',
    nav_rules: 'Regras',
    lang_name: 'Português',
    lang_flag: '🇧🇷',
    ad_badge: 'PUBLICIDADE',
    ad_tag_store: '⚡ MERCADO LIVRE',
    ad_tag_shipping: '🚚 FRETE GRÁTIS FULL',
    ad_title: 'Ofertas de Boardgames: Azul Pavilhão de Verão & Mais!',
    ad_desc: 'Azul Pavilhão de Verão Mini • Azul Mini (33% OFF) • Trapwords',
    ad_cta: 'Ver Ofertas',
    upload_title: 'Fotografe o Tabuleiro',
    upload_desc: 'Tire uma foto de cima ou envie uma imagem do tabuleiro de jogador.',
    btn_camera: '📷 Tirar Foto',
    btn_file: '📁 Carregar Arquivo',
    btn_load_test: '🎲 Amostra 1 (113 pts)',
    btn_load_test_2: '🎲 Amostra 2 (110 pts)',
    loading_status: 'Analisando posições dos azulejos por IA...',
    board_title: 'Tabuleiro Interativo',
    board_subtext: 'Toque em qualquer azulejo para alternar preenchido / vazio',
    btn_clear_board: 'Limpar Tabuleiro',
    bonus_toolbar_title: 'Preenchimento Rápido por Número:',
    bonus_1_chip: 'Bônus 1 (+4)',
    bonus_2_chip: 'Bônus 2 (+8)',
    bonus_3_chip: 'Bônus 3 (+12)',
    bonus_4_chip: 'Bônus 4 (+16)',
    tile_usage_label: 'Azulejos Necessários (Regras do Manual):',
    tile_usage_subtext: 'Espaços 1 a 6 exigem de 1 a 6 azulejos cada (1 colocado + restantes descartados)',
    tile_total_placed: '({0} / 42 no tabuleiro)',
    tile_tooltip_pill: '{0}/21 azulejos necessários ({1}/6 colocados)',
    tile_tooltip_total: 'Total de azulejos gastos segundo o manual: {0} de 147 ({1} colocados no tabuleiro)',
    star_red: 'Vermelha',
    star_blue: 'Azul',
    star_yellow: 'Amarela',
    star_green: 'Verde',
    star_orange: 'Laranja',
    star_purple: 'Roxa',
    star_center: 'Centro',
    legend_header_title: 'Espaços Especiais (Marcados automaticamente ao cercar com azulejos):',
    legend_window: 'Janela',
    legend_statue: 'Estátua',
    legend_column: 'Coluna / Pilar',
    surrounding_bonus_tag: '+{0} azulejos bônus',
    corner_title: 'Cantos de Reserva (Azulejos não utilizados):',
    corner_subtext: '-1 ponto de penalidade por azulejo restante no fim do jogo',
    fp_penalty_title: 'Desconto de 1º Jogador do Centro (6 Rodadas):',
    fp_penalty_subtext: 'Pontos perdidos ao pegar o marcador de 1º jogador no centro da mesa em cada rodada',
    round_1: 'Rodada 1',
    round_2: 'Rodada 2',
    round_3: 'Rodada 3',
    round_4: 'Rodada 4',
    round_5: 'Rodada 5',
    round_6: 'Rodada 6',
    score_title: 'Pontuação Total',
    score_unit: 'pontos',
    breakdown_placement: 'Pontos de Colocação (Adjacência)',
    breakdown_stars: 'Bônus de Estrelas Completas',
    breakdown_numbers: 'Bônus de Números (1 a 4 em todas as 7 estrelas)',
    breakdown_penalties: 'Penalidades',
    no_completed_stars: 'Nenhuma estrela completa',
    no_completed_numbers: 'Nenhum conjunto numérico completo',
    player_input_placeholder: 'Nome do Jogador',
    btn_save_player: 'Salvar no Placar',
    leaderboard_title: '🏆 Placar da Mesa',
    btn_clear_leaderboard: 'Limpar Placar',
    confirm_clear_leaderboard: 'Tem certeza que deseja apagar todo o histórico do placar?',
    settings_title: '⚙️ Configurações de IA',
    settings_key_label: 'Chave de API Google Gemini (Opcional):',
    settings_key_help: 'Para fotos novas do celular em qualquer ângulo, o sistema pode usar visão computacional multimodal Gemini. A chave é gravada com segurança apenas no seu navegador.',
    btn_save_settings: 'Salvar',
    btn_cancel_settings: 'Fechar',
    settings_saved: 'Chave salva com sucesso!',
    vision_error: 'Não foi possível analisar a foto automaticamente. Você pode marcar os azulejos manualmente no tabuleiro.',
    all_numbers_covered: "Todos os '{0}' cobertos: +{1} pts",
    corners_label: 'Cantos: {0} azulejos (-{1} pts)',
    extra_penalty_label: '1º Jogador: -{0} pts',
    about_title: 'Sobre',
    about_text: 'Ferramenta independente criada por um fã e entusiasta para auxiliar na contagem de pontos de Azul: Pavilhão de Verão (criado por Michael Kiesling). Este site não possui vínculo oficial, patrocínio ou afiliação com a Next Move Games, Plan B Games, Asmodee ou Galápagos Jogos.',
    rules_modal_title: 'Regras Oficiais de Pontuação (Pavilhão de Verão)',
    rules_content: `
      <h4>1. Pontuação de Colocação (Páginas 6-8):</h4>
      <p>Ao colocar um azulejo em uma estrela, o jogador pontua 1 ponto por esse azulejo mais 1 ponto para cada azulejo conectado a ele no mesmo grupo contíguo. Assim, um grupo contíguo de tamanho <em>k</em> concede <code>k * (k + 1) / 2</code> pontos (1 azulejo = 1 pt, 2 = 3 pts, 3 = 6 pts, 4 = 10 pts, 5 = 15 pts, 6 = 21 pts).</p>
      
      <h4>2. Bônus de Estrelas Completas (Página 9):</h4>
      <ul>
        <li><strong>Multicolorida (Centro):</strong> 12 pontos</li>
        <li><strong>Vermelha:</strong> 14 pontos</li>
        <li><strong>Azul:</strong> 15 pontos</li>
        <li><strong>Amarela:</strong> 16 pontos</li>
        <li><strong>Laranja:</strong> 17 pontos</li>
        <li><strong>Verde:</strong> 18 pontos</li>
        <li><strong>Roxa:</strong> 20 pontos</li>
      </ul>
      <p><em>(Em um jogo normal, é comum completar 1 ou no máximo 2 estrelas).</em></p>

      <h4>3. Bônus por Cobrir Todos os Números (Página 9):</h4>
      <ul>
        <li>Cobrir todos os <strong>1</strong> em todas as 7 estrelas: <strong>4 pontos</strong></li>
        <li>Cobrir todos os <strong>2</strong> em todas as 7 estrelas: <strong>8 pontos</strong></li>
        <li>Cobrir todos os <strong>3</strong> em todas as 7 estrelas: <strong>12 pontos</strong></li>
        <li>Cobrir todos os <strong>4</strong> em todas as 7 estrelas: <strong>16 pontos</strong></li>
      </ul>

      <h4>4. Penalidade de Cantos (Página 9):</h4>
      <p>Cada azulejo não utilizado restante nos 4 cantos do tabuleiro desconta <strong>1 ponto</strong>.</p>

      <h4>5. Espaços Especiais ao Redor:</h4>
      <p>As <strong>Janelas (+3)</strong> ficam sempre posicionadas entre os azulejos 05 e 06. As <strong>Colunas (+1)</strong> ficam no meio do caminho entre a estrela central e a estrela externa. As <strong>Estátuas (+2)</strong> ficam nos vértices entre duas estrelas adjacentes. Ao cercar esses espaços, o jogador ganha azulejos bônus de reserva imediatos.</p>

      <h4>6. Custo de Azulejos Segundo o Manual (Página 6):</h4>
      <p>Cobrir um espaço numerado <em>N</em> (de 1 a 6) requer pagar <strong><em>N</em> azulejos</strong> da cor correspondente (1 azulejo é fixado no tabuleiro e os outros <em>N - 1</em> são descartados na torre). Para completar uma estrela inteira são necessários <code>1 + 2 + 3 + 4 + 5 + 6 = 21</code> azulejos (e 147 azulejos no total do tabuleiro).</p>
    `,
  },
  en: {
    brand_badge: 'Azul Mini',
    brand_title: 'Summer Pavilion',
    nav_rules: 'Rules',
    lang_name: 'English',
    lang_flag: '🇺🇸',
    ad_badge: 'ADVERTISEMENT',
    ad_tag_store: '⚡ MERCADO LIVRE',
    ad_tag_shipping: '🚚 FREE FULL SHIPPING',
    ad_title: 'Boardgame Deals: Azul Summer Pavilion & More!',
    ad_desc: 'Azul Summer Pavilion Mini • Azul Mini (33% OFF) • Trapwords',
    ad_cta: 'View Deals',
    upload_title: 'Photograph the Board',
    upload_desc: 'Take a top-down photo or upload an image of the player board.',
    btn_camera: '📷 Take Photo',
    btn_file: '📁 Upload File',
    btn_load_test: '🎲 Sample 1 (113 pts)',
    btn_load_test_2: '🎲 Sample 2 (110 pts)',
    loading_status: 'Analyzing tile positions via AI...',
    board_title: 'Interactive Board',
    board_subtext: 'Tap any tile to toggle filled / empty',
    btn_clear_board: 'Clear Board',
    bonus_toolbar_title: 'Quick Fill by Number:',
    bonus_1_chip: 'Bonus 1 (+4)',
    bonus_2_chip: 'Bonus 2 (+8)',
    bonus_3_chip: 'Bonus 3 (+12)',
    bonus_4_chip: 'Bonus 4 (+16)',
    tile_usage_label: 'Tiles Required (Manual Rules):',
    tile_usage_subtext: 'Spaces 1 to 6 require 1 to 6 tiles each (1 placed + remainder discarded)',
    tile_total_placed: '({0} / 42 on board)',
    tile_tooltip_pill: '{0}/21 required tiles ({1}/6 placed)',
    tile_tooltip_total: 'Total tiles spent under manual rules: {0} of 147 ({1} placed on board)',
    star_red: 'Red',
    star_blue: 'Blue',
    star_yellow: 'Yellow',
    star_green: 'Green',
    star_orange: 'Orange',
    star_purple: 'Purple',
    star_center: 'Center',
    legend_header_title: 'Special Spaces (Auto-selected when surrounded by tiles):',
    legend_window: 'Window',
    legend_statue: 'Statue',
    legend_column: 'Column / Pillar',
    surrounding_bonus_tag: '+{0} bonus tiles',
    corner_title: 'Corner Storage (Unused Tiles):',
    corner_subtext: '-1 penalty point per remaining tile at game end',
    fp_penalty_title: '1st Player Center Deduction (6 Rounds):',
    fp_penalty_subtext: 'Points lost when taking the 1st player token from the center in each round',
    round_1: 'Round 1',
    round_2: 'Round 2',
    round_3: 'Round 3',
    round_4: 'Round 4',
    round_5: 'Round 5',
    round_6: 'Round 6',
    score_title: 'Total Score',
    score_unit: 'points',
    breakdown_placement: 'Placement Points (Adjacency)',
    breakdown_stars: 'Completed Star Bonuses',
    breakdown_numbers: 'Number Bonuses (1 to 4 on all 7 stars)',
    breakdown_penalties: 'Penalties',
    no_completed_stars: 'No completed stars',
    no_completed_numbers: 'No completed number sets',
    player_input_placeholder: 'Player Name',
    btn_save_player: 'Save to Leaderboard',
    leaderboard_title: '🏆 Table Leaderboard',
    btn_clear_leaderboard: 'Clear Leaderboard',
    confirm_clear_leaderboard: 'Are you sure you want to clear the entire leaderboard history?',
    settings_title: '⚙️ AI Settings',
    settings_key_label: 'Google Gemini API Key (Optional):',
    settings_key_help: 'For taking phone photos at any angle, the app can use Gemini multimodal computer vision. The key is stored securely in your browser only.',
    btn_save_settings: 'Save',
    btn_cancel_settings: 'Close',
    settings_saved: 'API Key saved successfully!',
    vision_error: 'Could not automatically analyze the image. You can mark tiles manually on the interactive board.',
    all_numbers_covered: "All '{0}'s covered: +{1} pts",
    corners_label: 'Corners: {0} tiles (-{1} pts)',
    extra_penalty_label: '1st Player: -{0} pts',
    about_title: 'About',
    about_text: 'Independent fan-made companion tool created to assist with scoring in Azul: Summer Pavilion (designed by Michael Kiesling). This website is not affiliated with, endorsed, or sponsored by Next Move Games, Plan B Games, Asmodee, or Galápagos Jogos.',
    rules_modal_title: 'Official Scoring Rules (Summer Pavilion)',
    rules_content: `
      <h4>1. Placement Scoring (Pages 6-8):</h4>
      <p>When placing a tile on a star, score 1 point for that tile plus 1 point for each adjacent tile connected to it in the same star group. A contiguous cluster of size <em>k</em> awards <code>k * (k + 1) / 2</code> points (1 tile = 1 pt, 2 = 3 pts, 3 = 6 pts, 4 = 10 pts, 5 = 15 pts, 6 = 21 pts).</p>
      
      <h4>2. Completed Star Bonuses (Page 9):</h4>
      <ul>
        <li><strong>Multicolor (Center):</strong> 12 points</li>
        <li><strong>Red:</strong> 14 points</li>
        <li><strong>Blue:</strong> 15 points</li>
        <li><strong>Yellow:</strong> 16 points</li>
        <li><strong>Orange:</strong> 17 points</li>
        <li><strong>Green:</strong> 18 points</li>
        <li><strong>Purple:</strong> 20 points</li>
      </ul>
      <p><em>(In a typical game, players usually complete 1 or at most 2 stars).</em></p>

      <h4>3. Number Completion Bonuses (Page 9):</h4>
      <ul>
        <li>Covering all <strong>1</strong>s on all 7 stars: <strong>4 points</strong></li>
        <li>Covering all <strong>2</strong>s on all 7 stars: <strong>8 points</strong></li>
        <li>Covering all <strong>3</strong>s on all 7 stars: <strong>12 points</strong></li>
        <li>Covering all <strong>4</strong>s on all 7 stars: <strong>16 points</strong></li>
      </ul>

      <h4>4. Corner Tile Penalties (Page 9):</h4>
      <p>Each unused tile remaining in the 4 corner storage spaces deducts <strong>1 point</strong>.</p>

      <h4>5. Surrounding Bonus Spaces:</h4>
      <p><strong>Windows (+3)</strong> are situated between slots 05 and 06. <strong>Columns (+1)</strong> are placed midway between the center star and outer stars. <strong>Statues (+2)</strong> sit in the valleys between two adjacent stars. Surrounding these grants immediate bonus wild supply tiles.</p>

      <h4>6. Tile Costs by Rulebook (Page 6):</h4>
      <p>Placing a tile on numbered space <em>N</em> (from 1 to 6) requires paying <strong><em>N</em> tiles</strong> of that star's color (1 tile is placed on the board and the remaining <em>N - 1</em> tiles are discarded to the tower). Completing an entire star requires <code>1 + 2 + 3 + 4 + 5 + 6 = 21</code> tiles (and 147 tiles for all 7 stars).</p>
    `,
  },
};

// Estado da Aplicação
const appState = {
  lang: localStorage.getItem('azul_language') || 'pt',
  stars: {
    center: new Set(),
    red: new Set(),
    blue: new Set(),
    yellow: new Set(),
    green: new Set(),
    purple: new Set(),
    orange: new Set(),
  },
  surrounding: {
    windows: new Set(),
    statues: new Set(),
    columns: new Set(),
  },
  cornerTilesCount: 0,
  roundPenalties: [0, 0, 0, 0, 0, 0],
  extraPenalty: 0,
  players: JSON.parse(localStorage.getItem('azul_players') || '[]'),
  lastReport: null,
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(appState.lang);
  initBoardSvg();
  setupEventListeners();
  renderLeaderboard();
  updateTileUsageCounters();
  updateBonusToolbarButtons();
  updateSurroundingCounters();
  updateRoundPenaltiesUI();
  triggerRecalculate();
});

/**
 * Altera idioma da interface (pt / en)
 */
function setLanguage(lang) {
  appState.lang = lang;
  localStorage.setItem('azul_language', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  const t = I18N[lang] || I18N.pt;

  // Atualiza botão de idioma com bandeira nacional SVG visível em qualquer sistema operacional
  const lblLangText = document.getElementById('lblLangText');
  const flagIcon = document.getElementById('flagIcon') || document.querySelector('.flag-icon');
  if (flagIcon) flagIcon.innerHTML = FLAG_SVGS[lang] || FLAG_SVGS.pt;
  if (lblLangText) lblLangText.textContent = t.lang_name;

  // Atualiza textos estáticos marcados com data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Atualiza placeholder do nome do jogador
  const inpPlayer = document.getElementById('inpPlayerName');
  if (inpPlayer && t.player_input_placeholder) {
    inpPlayer.placeholder = t.player_input_placeholder;
    if (inpPlayer.value.startsWith('Jogador') || inpPlayer.value.startsWith('Player')) {
      inpPlayer.value = lang === 'pt' ? `Jogador ${appState.players.length + 1}` : `Player ${appState.players.length + 1}`;
    }
  }

  // Atualiza contadores de espaços especiais, azulejos e rodadas
  updateSurroundingCounters();
  updateTileUsageCounters();
  updateRoundPenaltiesUI();

  // Atualiza Modal de Regras
  const rulesBody = document.getElementById('rulesModalBody');
  if (rulesBody && t.rules_content) {
    rulesBody.innerHTML = t.rules_content;
  }

  // Se já houver um relatório calculado, renderiza com textos atualizados
  if (appState.lastReport) {
    renderScoreReport(appState.lastReport);
  }
}

/**
 * Inicializa e desenha o tabuleiro vetorial autêntico no SVG
 */
function computeRhombusPoints(cx, cy, longAxisDeg, a, b) {
  const radL = (longAxisDeg * Math.PI) / 180;
  const radS = ((longAxisDeg + 90) * Math.PI) / 180;
  const pTip = { x: cx + a * Math.cos(radL), y: cy + a * Math.sin(radL) };
  const pRight = { x: cx + b * Math.cos(radS), y: cy + b * Math.sin(radS) };
  const pBase = { x: cx - a * Math.cos(radL), y: cy - a * Math.sin(radL) };
  const pLeft = { x: cx - b * Math.cos(radS), y: cy - b * Math.sin(radS) };
  const pointsStr = `${pTip.x.toFixed(1)},${pTip.y.toFixed(1)} ${pRight.x.toFixed(1)},${pRight.y.toFixed(1)} ${pBase.x.toFixed(1)},${pBase.y.toFixed(1)} ${pLeft.x.toFixed(1)},${pLeft.y.toFixed(1)}`;
  return { pTip, pRight, pBase, pLeft, pointsStr };
}

function initBoardSvg() {
  const svg = document.getElementById('boardSvg');
  if (!svg) return;
  svg.innerHTML = '';

  const board_cx = 400;
  const board_cy = 400;
  // Malha geométrica unificada real (tesselação rhombille de lado L):
  // R_ring = 3 * L une todas as 7 estrelas ponta-a-ponta e encaixa Pilares, Estátuas e Janelas em azulejos exatos
  const L = 68;
  const R_ring = 3 * L; // 204px
  const rPetalCenter = (Math.sqrt(3) / 2) * L; // 58.89px
  const seamMargin = 1.15;
  const aRhombus = rPetalCenter - 2 * seamMargin; // 56.59px (meia diagonal maior)
  const bRhombus = 0.5 * L - (2 * seamMargin) / Math.sqrt(3); // 32.67px (meia diagonal menor)
  const rLabel = 61.5;
  const rTipLabel = 93.0;

  // Definições visuais: filtros e gradientes 3D de resina acrílica e tabuleiro real
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="boardDropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
    </filter>
    <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.3" flood-opacity="0.22"/>
    </filter>
    <filter id="tileFilledShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-opacity="0.42"/>
    </filter>
    <radialGradient id="marbleBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#faf6ee"/>
      <stop offset="100%" stop-color="#efe5d2"/>
    </radialGradient>
    <radialGradient id="woodBorder" cx="50%" cy="50%" r="50%">
      <stop offset="88%" stop-color="#f5e6c8"/>
      <stop offset="94%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </radialGradient>

    <!-- Gradiente de mármore esculpido para os azulejos de bônus (Pilar, Estátua, Janela) -->
    <linearGradient id="grad-bonus-tile" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdf9"/>
      <stop offset="55%" stop-color="#f3ead8"/>
      <stop offset="100%" stop-color="#d9c7a7"/>
    </linearGradient>
    <linearGradient id="grad-bonus-tile-active" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ecfdf5"/>
      <stop offset="55%" stop-color="#a7f3d0"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>

    <!-- Brilho especular 3D de resina (chanfro superior iluminado / inferior sombreado) -->
    <linearGradient id="bevelEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="55%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.48"/>
    </linearGradient>
    <linearGradient id="tileGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="42%" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
    </linearGradient>

    <!-- Gradientes de espaços vazios impressos no tabuleiro -->
    <linearGradient id="grad-empty-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff1f2"/><stop offset="100%" stop-color="#fecdd3"/>
    </linearGradient>
    <linearGradient id="grad-empty-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
    <linearGradient id="grad-empty-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fefce8"/><stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
    <linearGradient id="grad-empty-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7fee7"/><stop offset="100%" stop-color="#d9f99d"/>
    </linearGradient>
    <linearGradient id="grad-empty-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
    <linearGradient id="grad-empty-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf4ff"/><stop offset="100%" stop-color="#f5d0fe"/>
    </linearGradient>
    <linearGradient id="grad-empty-center" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Gradientes 3D dos azulejos físicos reais de resina -->
    <linearGradient id="grad-filled-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff333d"/>
      <stop offset="50%" stop-color="#dc141f"/>
      <stop offset="100%" stop-color="#990912"/>
    </linearGradient>
    <linearGradient id="grad-filled-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22b8ff"/>
      <stop offset="50%" stop-color="#0088e0"/>
      <stop offset="100%" stop-color="#005596"/>
    </linearGradient>
    <linearGradient id="grad-filled-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffea85"/>
      <stop offset="50%" stop-color="#f0c441"/>
      <stop offset="100%" stop-color="#b88714"/>
    </linearGradient>
    <linearGradient id="grad-filled-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c2f567"/>
      <stop offset="50%" stop-color="#84cc16"/>
      <stop offset="100%" stop-color="#4d7c0f"/>
    </linearGradient>
    <linearGradient id="grad-filled-orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9429"/>
      <stop offset="50%" stop-color="#f76707"/>
      <stop offset="100%" stop-color="#b83906"/>
    </linearGradient>
    <linearGradient id="grad-filled-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e3229b"/>
      <stop offset="50%" stop-color="#b5006e"/>
      <stop offset="100%" stop-color="#700043"/>
    </linearGradient>
    <linearGradient id="grad-filled-center" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b4d66"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090e17"/>
    </linearGradient>
  `;
  svg.appendChild(defs);

  // Moldura externa autêntica do tabuleiro português
  const outerRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerRing.setAttribute('cx', board_cx);
  outerRing.setAttribute('cy', board_cy);
  outerRing.setAttribute('r', '396');
  outerRing.setAttribute('fill', '#0f172a');
  outerRing.setAttribute('stroke', '#1e3a8a');
  outerRing.setAttribute('stroke-width', '4');
  outerRing.setAttribute('filter', 'url(#boardDropShadow)');
  svg.appendChild(outerRing);

  const woodRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  woodRing.setAttribute('cx', board_cx);
  woodRing.setAttribute('cy', board_cy);
  woodRing.setAttribute('r', '384');
  woodRing.setAttribute('fill', 'url(#woodBorder)');
  svg.appendChild(woodRing);

  const marbleCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  marbleCircle.setAttribute('cx', board_cx);
  marbleCircle.setAttribute('cy', board_cy);
  marbleCircle.setAttribute('r', '366');
  marbleCircle.setAttribute('fill', 'url(#marbleBg)');
  marbleCircle.setAttribute('stroke', '#d4af37');
  marbleCircle.setAttribute('stroke-width', '2');
  svg.appendChild(marbleCircle);

  const dashedRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dashedRing.setAttribute('cx', board_cx);
  dashedRing.setAttribute('cy', board_cy);
  dashedRing.setAttribute('r', '356');
  dashedRing.setAttribute('fill', 'none');
  dashedRing.setAttribute('stroke', '#cbd5e1');
  dashedRing.setAttribute('stroke-width', '1.5');
  dashedRing.setAttribute('stroke-dasharray', '6 4');
  svg.appendChild(dashedRing);

  // 1. Desenha as 6 Estátuas (+2) dentro dos azulejos radiais entre estrelas adjacentes (-60°, 0°, 60°, 120°, 180°, -120°)
  const statueRadius = (3 * Math.sqrt(3) / 2) * L; // 176.67px
  const statueAngles = [-60, 0, 60, 120, 180, -120];
  statueAngles.forEach((statDeg) => {
    const statRad = (statDeg * Math.PI) / 180;
    const stx = board_cx + statueRadius * Math.cos(statRad);
    const sty = board_cy + statueRadius * Math.sin(statRad);

    const { pointsStr } = computeRhombusPoints(0, 0, statDeg, aRhombus, bRhombus);
    const { pointsStr: bevelStr } = computeRhombusPoints(0, 0, statDeg, aRhombus * 0.84, bRhombus * 0.84);
    const badgeX = (aRhombus * 0.62) * Math.cos(statRad);
    const badgeY = (aRhombus * 0.62) * Math.sin(statRad);

    const gStatue = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gStatue.setAttribute('id', `feature-statue-${statDeg}`);
    gStatue.setAttribute('class', `svg-feature-icon ${appState.surrounding.statues.has(statDeg) ? 'feature-active' : ''}`);
    gStatue.setAttribute('transform', `translate(${stx.toFixed(1)},${sty.toFixed(1)})`);
    gStatue.setAttribute('filter', 'url(#tileShadow)');
    gStatue.setAttribute('title', 'Estátua (+2 azulejos bônus)');
    gStatue.innerHTML = `
      <polygon class="feature-tile-poly" points="${pointsStr}" stroke-linejoin="round"/>
      <polygon class="feature-tile-bevel" points="${bevelStr}" stroke-linejoin="round"/>
      <g class="feature-art" transform="rotate(${statDeg + 90})">
        <ellipse cx="0" cy="3" rx="10" ry="14" fill="rgba(12, 74, 110, 0.16)"/>
        <!-- Pedestal escalonado isométrico azul-petróleo -->
        <polygon points="0,22 -13,14.5 0,8 13,14.5" fill="#082f49" stroke="#0c4a6e" stroke-width="0.9"/>
        <polygon points="0,17.5 -10,11.5 0,6 10,11.5" fill="#0369a1" stroke="#38bdf8" stroke-width="0.8"/>
        <!-- Corpo esculpido clássico com manto e braços -->
        <path d="M -4.5,11.5 L -6,2 L -3,-2 L 3,-2 L 5.5,3 L 4,11.5 Z" fill="#0284c7" stroke="#082f49" stroke-width="1"/>
        <path d="M -5.5,1.5 C -9.5,-1 -11.5,-5.5 -9,-9.5 C -7,-12.5 -3.5,-13.5 0,-13.5 C 4,-13.5 7.5,-11.5 10.5,-7 C 11.5,-5 12,-2 10,-0.8 C 8.5,0 7,-3 5,-4 L 4.2,3 L -4.2,3 Z" fill="#0ea5e9" stroke="#082f49" stroke-width="1"/>
        <path d="M -5,-7 Q 0,-3 4.5,-7 M -3.5,-1.5 Q 1,0.5 3.5,-2.5" fill="none" stroke="#bae6fd" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Cabeça clássica esculpida -->
        <circle cx="-0.8" cy="-15" r="4.6" fill="#0284c7" stroke="#082f49" stroke-width="1"/>
        <path d="M -4.5,-16.5 C -3,-19.5 2,-19.5 3.2,-15.5 C 1,-16.5 -2,-16.5 -4.5,-16.5 Z" fill="#bae6fd"/>
      </g>
      <text class="feature-bonus-badge" x="${badgeX.toFixed(1)}" y="${badgeY.toFixed(1)}">+2</text>
    `;
    gStatue.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSurroundingFeature('statues', statDeg);
    });
    svg.appendChild(gStatue);
  });

  // 2. Desenha as 6 Estrelas Externas Unidas (com Janela e Coluna/Pilar em azulejos exatos)
  const colRadius = 1.5 * L; // 102px (metade exata entre estrela central e externa)
  const winRadius = 4.5 * L; // 306px (encaixe exato entre slots 05 e 06)

  for (const [starKey, config] of Object.entries(STARS_CONFIG)) {
    if (starKey === 'center') continue;

    const phiDeg = config.phi;
    const phiRad = (phiDeg * Math.PI) / 180;
    const scx = board_cx + R_ring * Math.cos(phiRad);
    const scy = board_cy + R_ring * Math.sin(phiRad);

    const starGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    starGroup.setAttribute('id', `star-group-${starKey}`);

    // Janela (+3) dentro de azulejo encaixado na ponta externa entre slots 05 e 06
    const jx = board_cx + winRadius * Math.cos(phiRad);
    const jy = board_cy + winRadius * Math.sin(phiRad);
    const { pointsStr: winPts } = computeRhombusPoints(0, 0, phiDeg + 90, aRhombus, bRhombus);
    const { pointsStr: winBevelPts } = computeRhombusPoints(0, 0, phiDeg + 90, aRhombus * 0.84, bRhombus * 0.84);
    const winBadgeAngle = ((phiDeg + 90) * Math.PI) / 180;
    const winBadgeX = (aRhombus * 0.56) * Math.cos(winBadgeAngle);
    const winBadgeY = (aRhombus * 0.56) * Math.sin(winBadgeAngle);

    const gJanela = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gJanela.setAttribute('id', `feature-window-${starKey}`);
    gJanela.setAttribute('class', `svg-feature-icon ${appState.surrounding.windows.has(starKey) ? 'feature-active' : ''}`);
    gJanela.setAttribute('transform', `translate(${jx.toFixed(1)},${jy.toFixed(1)})`);
    gJanela.setAttribute('filter', 'url(#tileShadow)');
    gJanela.setAttribute('title', 'Janela (+3 azulejos bônus)');
    gJanela.innerHTML = `
      <polygon class="feature-tile-poly" points="${winPts}" stroke-linejoin="round"/>
      <polygon class="feature-tile-bevel" points="${winBevelPts}" stroke-linejoin="round"/>
      <g class="feature-art" transform="rotate(${phiDeg + 90})">
        <!-- Asas laterais azuis com arabescos brancos como no tabuleiro real -->
        <path d="M -25,5 L -12,-4 L -12,11 L 0,20 L 12,11 L 12,-4 L 25,5 L 0,23 Z" fill="#1e4e68" stroke="#0f2942" stroke-width="1"/>
        <path d="M -17,5 C -14.5,2 -12.5,4 -13.5,7.5 M 17,5 C 14.5,2 12.5,4 13.5,7.5" fill="none" stroke="#f8fafc" stroke-width="1.3" stroke-linecap="round"/>
        <!-- Moldura de arco mourisco em azul-marinho escuro -->
        <path d="M -12,12 L -12,-7 C -12,-15.5 -5.5,-20.5 0,-23 C 5.5,-20.5 12,-15.5 12,-7 L 12,12 Z" fill="#0f2942" stroke="#091526" stroke-width="1.1"/>
        <path d="M -9.5,-6 C -9.5,-13.5 -4.2,-17.5 0,-19.5 C 4.2,-17.5 9.5,-13.5 9.5,-6" fill="none" stroke="#38bdf8" stroke-width="1.4"/>
        <polygon points="0,-21 2.2,-18.8 0,-16.6 -2.2,-18.8" fill="#f59e0b"/>
        <!-- Colunas douradas laterais da janela -->
        <rect x="-10" y="-5" width="2.6" height="15.5" fill="#f59e0b" stroke="#78350f" stroke-width="0.6"/>
        <rect x="7.4" y="-5" width="2.6" height="15.5" fill="#f59e0b" stroke="#78350f" stroke-width="0.6"/>
        <!-- Vão central branco-marfim em arco trilobado -->
        <path d="M -7.2,10.5 L -7.2,-5 C -7.2,-8.2 -4.2,-9.2 -3.2,-7.5 C -3.2,-11.5 3.2,-11.5 3.2,-7.5 C 4.2,-9.2 7.2,-8.2 7.2,-5 L 7.2,10.5 Z" fill="#fffdf7" stroke="#d97706" stroke-width="1"/>
      </g>
      <text class="feature-bonus-badge" x="${winBadgeX.toFixed(1)}" y="${winBadgeY.toFixed(1)}">+3</text>
    `;
    gJanela.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSurroundingFeature('windows', starKey);
    });
    starGroup.appendChild(gJanela);

    // Coluna / Pilar (+1) dentro de azulejo tangencial na metade exata entre estrela central e externa
    const cx_col = board_cx + colRadius * Math.cos(phiRad);
    const cy_col = board_cy + colRadius * Math.sin(phiRad);
    const { pointsStr: colPts } = computeRhombusPoints(0, 0, phiDeg + 90, aRhombus, bRhombus);
    const { pointsStr: colBevelPts } = computeRhombusPoints(0, 0, phiDeg + 90, aRhombus * 0.84, bRhombus * 0.84);
    const colBadgeAngle = ((phiDeg + 90) * Math.PI) / 180;
    const colBadgeX = (aRhombus * 0.56) * Math.cos(colBadgeAngle);
    const colBadgeY = (aRhombus * 0.56) * Math.sin(colBadgeAngle);

    const gColuna = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gColuna.setAttribute('id', `feature-column-${starKey}`);
    gColuna.setAttribute('class', `svg-feature-icon ${appState.surrounding.columns.has(starKey) ? 'feature-active' : ''}`);
    gColuna.setAttribute('transform', `translate(${cx_col.toFixed(1)},${cy_col.toFixed(1)})`);
    gColuna.setAttribute('filter', 'url(#tileShadow)');
    gColuna.setAttribute('title', 'Coluna / Pilar (+1 azulejo bônus)');
    gColuna.innerHTML = `
      <polygon class="feature-tile-poly" points="${colPts}" stroke-linejoin="round"/>
      <polygon class="feature-tile-bevel" points="${colBevelPts}" stroke-linejoin="round"/>
      <g class="feature-art">
        <circle r="17.5" fill="rgba(30, 41, 59, 0.2)"/>
        <circle r="15.5" fill="#1e293b" stroke="#0f172a" stroke-width="1.2"/>
        <circle r="13.5" fill="#334155" stroke="#94a3b8" stroke-width="2.4" stroke-dasharray="2.5 1.9"/>
        <circle r="10.2" fill="#0f172a"/>
        <circle r="8.8" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <circle r="6.2" fill="#ffffff" stroke="#bae6fd" stroke-width="0.9"/>
      </g>
      <text class="feature-bonus-badge" x="${colBadgeX.toFixed(1)}" y="${colBadgeY.toFixed(1)}">+1</text>
    `;
    gColuna.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSurroundingFeature('columns', starKey);
    });
    starGroup.appendChild(gColuna);

    // Losangos numerados 1 a 6 com ornamentos reais de cada cor
    for (let slot = 1; slot <= 6; slot++) {
      const relDeg = (slot * 60 + 30) % 360;
      const angDeg = phiDeg + relDeg;
      const rad = (angDeg * Math.PI) / 180;

      const pcx = scx + rPetalCenter * Math.cos(rad);
      const pcy = scy + rPetalCenter * Math.sin(rad);
      const { pTip, pRight, pBase, pLeft, pointsStr } = computeRhombusPoints(pcx, pcy, angDeg, aRhombus, bRhombus);

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('class', `svg-slot slot-${starKey}`);
      polygon.setAttribute('id', `slot-${starKey}-${slot}`);
      polygon.setAttribute('data-star', starKey);
      polygon.setAttribute('data-slot', slot);
      polygon.setAttribute('stroke-linejoin', 'round');
      polygon.setAttribute('filter', 'url(#tileShadow)');

      polygon.addEventListener('click', () => toggleSlot(starKey, slot));
      starGroup.appendChild(polygon);

      // Coordenada central da face visível da pétala (para o ornamento e número quando vazio)
      const lblX = scx + rLabel * Math.cos(rad);
      const lblY = scy + rLabel * Math.sin(rad);
      // Coordenada na ponta externa para o número discreto quando o azulejo físico está colocado
      const tipLblX = scx + rTipLabel * Math.cos(rad);
      const tipLblY = scy + rTipLabel * Math.sin(rad);

      // Ornamento geométrico autêntico + peça 3D de resina com animação fluida
      const ornamentGroup = buildSlotOrnament(starKey, slot, pTip, pRight, pBase, pLeft, lblX, lblY, angDeg, pointsStr);
      starGroup.appendChild(ornamentGroup);

      // Texto do número dentro do azulejo (desliza suavemente via CSS transform)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', lblX.toFixed(1));
      text.setAttribute('y', lblY.toFixed(1));
      text.style.setProperty('--tx', `${(tipLblX - lblX).toFixed(1)}px`);
      text.style.setProperty('--ty', `${(tipLblY - lblY).toFixed(1)}px`);
      text.setAttribute('class', `slot-text text-${starKey}`);
      text.setAttribute('id', `text-${starKey}-${slot}`);
      text.setAttribute('font-size', '16');
      text.setAttribute('font-weight', '800');
      text.textContent = slot;

      starGroup.appendChild(text);
    }

    // Badge no miolo da estrela com o bônus (14, 15, etc.) - CLICÁVEL para preencher/limpar estrela inteira
    const centerBadgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    centerBadgeGroup.setAttribute('id', `star-center-btn-${starKey}`);
    centerBadgeGroup.setAttribute('class', 'star-center-btn');
    centerBadgeGroup.setAttribute('title', 'Toque no centro para preencher ou limpar toda a estrela');
    centerBadgeGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEntireStar(starKey);
    });

    const centerBadge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerBadge.setAttribute('cx', scx.toFixed(1));
    centerBadge.setAttribute('cy', scy.toFixed(1));
    centerBadge.setAttribute('r', '22');
    centerBadge.setAttribute('fill', '#ffffff');
    centerBadge.setAttribute('stroke', config.color);
    centerBadge.setAttribute('stroke-width', '2.8');
    centerBadge.setAttribute('filter', 'url(#tileShadow)');
    centerBadgeGroup.appendChild(centerBadge);

    const bonusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bonusText.setAttribute('x', scx.toFixed(1));
    bonusText.setAttribute('y', scy.toFixed(1));
    bonusText.setAttribute('dy', '0.04em');
    bonusText.setAttribute('class', 'star-label-text');
    bonusText.setAttribute('font-size', '16');
    bonusText.setAttribute('font-weight', '800');
    bonusText.setAttribute('fill', config.color);
    bonusText.textContent = `${config.bonus}`;
    centerBadgeGroup.appendChild(bonusText);

    starGroup.appendChild(centerBadgeGroup);
    svg.appendChild(starGroup);
  }

  // 3. Desenha a Estrela Central Multicolorida no centro (400, 400)
  const centerAngles = { 1: -120, 2: -60, 3: 0, 4: 60, 5: 120, 6: 180 };
  const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  centerGroup.setAttribute('id', 'star-group-center');

  for (let slot = 1; slot <= 6; slot++) {
    const angDeg = centerAngles[slot];
    const rad = (angDeg * Math.PI) / 180;

    const pcx = board_cx + rPetalCenter * Math.cos(rad);
    const pcy = board_cy + rPetalCenter * Math.sin(rad);
    const { pTip, pRight, pBase, pLeft, pointsStr } = computeRhombusPoints(pcx, pcy, angDeg, aRhombus, bRhombus);

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', pointsStr);
    polygon.setAttribute('class', 'svg-slot slot-center');
    polygon.setAttribute('id', `slot-center-${slot}`);
    polygon.setAttribute('data-star', 'center');
    polygon.setAttribute('data-slot', slot);
    polygon.setAttribute('stroke-linejoin', 'round');
    polygon.setAttribute('filter', 'url(#tileShadow)');

    polygon.addEventListener('click', () => toggleSlot('center', slot));
    centerGroup.appendChild(polygon);

    const lblX = board_cx + rLabel * Math.cos(rad);
    const lblY = board_cy + rLabel * Math.sin(rad);
    const tipLblX = board_cx + rTipLabel * Math.cos(rad);
    const tipLblY = board_cy + rTipLabel * Math.sin(rad);

    // Ornamento geométrico + chanfro 3D da estrela central
    const ornamentGroup = buildSlotOrnament('center', slot, pTip, pRight, pBase, pLeft, lblX, lblY, angDeg, pointsStr);
    centerGroup.appendChild(ornamentGroup);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lblX.toFixed(1));
    text.setAttribute('y', lblY.toFixed(1));
    text.style.setProperty('--tx', `${(tipLblX - lblX).toFixed(1)}px`);
    text.style.setProperty('--ty', `${(tipLblY - lblY).toFixed(1)}px`);
    text.setAttribute('class', 'slot-text text-center');
    text.setAttribute('id', `text-center-${slot}`);
    text.setAttribute('font-size', '16');
    text.setAttribute('font-weight', '800');
    text.textContent = slot;

    centerGroup.appendChild(text);
  }

  // Roseta central da estrela multicolorida com o badge de 12 - CLICÁVEL para preencher/limpar centro
  const centerRosetteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  centerRosetteGroup.setAttribute('id', 'star-center-btn-center');
  centerRosetteGroup.setAttribute('class', 'star-center-btn');
  centerRosetteGroup.setAttribute('title', 'Toque no centro para preencher ou limpar a estrela central');
  centerRosetteGroup.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEntireStar('center');
  });

  const rosette = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  rosette.setAttribute('cx', board_cx);
  rosette.setAttribute('cy', board_cy);
  rosette.setAttribute('r', '23');
  rosette.setAttribute('fill', '#0f172a');
  rosette.setAttribute('stroke', '#f59e0b');
  rosette.setAttribute('stroke-width', '2.8');
  rosette.setAttribute('filter', 'url(#tileShadow)');
  centerRosetteGroup.appendChild(rosette);

  const rosetteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  rosetteText.setAttribute('x', board_cx);
  rosetteText.setAttribute('y', board_cy);
  rosetteText.setAttribute('dy', '0.04em');
  rosetteText.setAttribute('class', 'star-label-text');
  rosetteText.setAttribute('font-size', '16');
  rosetteText.setAttribute('font-weight', '800');
  rosetteText.setAttribute('fill', '#f59e0b');
  rosetteText.textContent = '12';
  centerRosetteGroup.appendChild(rosetteText);

  centerGroup.appendChild(centerRosetteGroup);
  svg.appendChild(centerGroup);
}

/**
 * Constrói o grupo SVG de chanfro 3D e ornamento geométrico autêntico de cada azulejo real
 */
function buildSlotOrnament(starKey, slot, pTip, pRight, pBase, pLeft, lblX, lblY, angDeg, pointsStr) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', `ornament-${starKey}-${slot}`);
  g.setAttribute('class', `tile-ornament ornament-${starKey}`);
  g.setAttribute('pointer-events', 'none');

  // 1. Chanfro 3D interno (losango reduzido em torno do centro geométrico da pétala)
  const cx = (pTip.x + pRight.x + pBase.x + pLeft.x) / 4;
  const cy = (pTip.y + pRight.y + pBase.y + pLeft.y) / 4;
  const scale = 0.84;
  const bTip = { x: cx + scale * (pTip.x - cx), y: cy + scale * (pTip.y - cy) };
  const bRight = { x: cx + scale * (pRight.x - cx), y: cy + scale * (pRight.y - cy) };
  const bBase = { x: cx + scale * (pBase.x - cx), y: cy + scale * (pBase.y - cy) };
  const bLeft = { x: cx + scale * (pLeft.x - cx), y: cy + scale * (pLeft.y - cy) };

  const bevelPts = `${bTip.x.toFixed(1)},${bTip.y.toFixed(1)} ${bRight.x.toFixed(1)},${bRight.y.toFixed(1)} ${bBase.x.toFixed(1)},${bBase.y.toFixed(1)} ${bLeft.x.toFixed(1)},${bLeft.y.toFixed(1)}`;

  let patternHtml = '';
  if (starKey === 'blue') {
    // Sol / Roseta de 12 pontas autêntico do azulejo azul + círculo celeste + losango central
    const sunPts = [];
    for (let i = 0; i < 24; i++) {
      const a = (i * 15 * Math.PI) / 180;
      const r = i % 2 === 0 ? 14.2 : 8.8;
      sunPts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
    }
    patternHtml = `
      <polygon class="orn-outer" points="${sunPts.join(' ')}" />
      <circle class="orn-inner" cx="0" cy="0" r="8.4" />
      <polygon class="orn-core" points="4.5,0 0,4.5 -4.5,0 0,-4.5" />
    `;
  } else if (starKey === 'orange') {
    // Padrão mourisco autêntico do azulejo laranja: quadrado alinhado à pétala com 2 pontas triangulares em cada lado + quadrado escuro central
    const s = 6.6;
    const h = 4.0;
    const crownPath = [
      `M ${-s} ${-s}`,
      `L ${-s * 0.55} ${-(s + h)} L 0 ${-s} L ${s * 0.55} ${-(s + h)} L ${s} ${-s}`,
      `L ${s + h} ${-s * 0.55} L ${s} 0 L ${s + h} ${s * 0.55} L ${s} ${s}`,
      `L ${s * 0.55} ${s + h} L 0 ${s} L ${-s * 0.55} ${s + h} L ${-s} ${s}`,
      `L ${-(s + h)} ${s * 0.55} L ${-s} 0 L ${-(s + h)} ${-s * 0.55}`,
      'Z',
    ].join(' ');
    patternHtml = `
      <path class="orn-outer" d="${crownPath}" />
      <rect class="orn-inner" x="${-s}" y="${-s}" width="${s * 2}" height="${s * 2}" />
      <rect class="orn-core" x="-3.4" y="-3.4" width="6.8" height="6.8" />
    `;
  } else if (starKey === 'green') {
    // Padrão autêntico do azulejo verde: moldura quadrada alinhada à pétala + losango escuro interno a 45°
    patternHtml = `
      <rect class="orn-outer" x="-9.0" y="-9.0" width="18.0" height="18.0" rx="0.6" />
      <polygon class="orn-core" points="6.5,0 0,6.5 -6.5,0 0,-6.5" />
    `;
  } else {
    // Losango interno clássico (Vermelho, Amarelo, Roxo e Estrela Central)
    patternHtml = `
      <polygon class="orn-inner" points="14.5,0 0,9.5 -14.5,0 0,-9.5" />
    `;
  }

  g.innerHTML = `
    <g class="empty-ornament-layer">
      <polygon class="tile-bevel-empty" points="${bevelPts}" stroke-linejoin="round" />
      <g class="tile-pattern-empty" transform="translate(${lblX.toFixed(1)},${lblY.toFixed(1)}) rotate(${angDeg}) scale(1.22)">
        ${patternHtml}
      </g>
    </g>
    <g class="resin-tile-layer" style="transform-origin: ${cx.toFixed(1)}px ${cy.toFixed(1)}px">
      <polygon class="tile-resin-base" points="${pointsStr}" stroke-linejoin="round" />
      <polygon class="tile-bevel" points="${bevelPts}" stroke-linejoin="round" />
      <g class="tile-pattern" transform="translate(${lblX.toFixed(1)},${lblY.toFixed(1)}) rotate(${angDeg}) scale(1.22)">
        ${patternHtml}
      </g>
    </g>
  `;
  return g;
}

/**
 * Alterna estado de um azulejo (preenchido / vazio)
 */
function toggleSlot(starKey, slot) {
  const set = appState.stars[starKey];
  if (set.has(slot)) {
    set.delete(slot);
  } else {
    set.add(slot);
  }
  syncSurroundingFeaturesFromBoard();
  updateSvgVisuals();
  updateTileUsageCounters();
  updateBonusToolbarButtons();
  triggerRecalculate();
}

/**
 * Preenche ou limpa todos os 6 azulejos de uma estrela ao clicar no centro
 */
function toggleEntireStar(starKey) {
  const set = appState.stars[starKey];
  if (set.size === 6) {
    set.clear();
  } else {
    for (let s = 1; s <= 6; s++) {
      set.add(s);
    }
  }
  syncSurroundingFeaturesFromBoard();
  updateSvgVisuals();
  updateTileUsageCounters();
  updateBonusToolbarButtons();
  triggerRecalculate();
}

/**
 * Preenche ou limpa um número específico (1 a 4) em TODAS as 7 estrelas
 */
function toggleNumberAcrossAllStars(num) {
  const allHaveNum = Object.values(appState.stars).every((set) => set.has(num));
  for (const set of Object.values(appState.stars)) {
    if (allHaveNum) {
      set.delete(num);
    } else {
      set.add(num);
    }
  }
  syncSurroundingFeaturesFromBoard();
  updateSvgVisuals();
  updateTileUsageCounters();
  updateBonusToolbarButtons();
  triggerRecalculate();
}

// Mapeamento oficial dos espaços adjacentes que cercam cada Coluna/Pilar (+1) e Estátua (+2)
const COLUMN_CENTER_ADJACENCY = {
  red:    [1, 2],
  blue:   [2, 3],
  yellow: [3, 4],
  green:  [4, 5],
  purple: [5, 6],
  orange: [6, 1],
};

const STATUE_STAR_ADJACENCY = {
  '-60':  { cw: 'red',    ccw: 'blue' },
  '0':    { cw: 'blue',   ccw: 'yellow' },
  '60':   { cw: 'yellow', ccw: 'green' },
  '120':  { cw: 'green',  ccw: 'purple' },
  '180':  { cw: 'purple', ccw: 'orange' },
  '-120': { cw: 'orange', ccw: 'red' },
};

/**
 * Seleciona automaticamente Janelas (+3), Estátuas (+2) e Pilares (+1)
 * sempre que todos os azulejos adjacentes a cada espaço bônus estiverem preenchidos
 */
function syncSurroundingFeaturesFromBoard() {
  const outerStars = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];

  // 1. Janelas (+3): cercadas quando os espaços 5 e 6 da estrela externa estão preenchidos
  outerStars.forEach((starKey) => {
    const isSurrounded = appState.stars[starKey].has(5) && appState.stars[starKey].has(6);
    const el = document.getElementById(`feature-window-${starKey}`);
    if (isSurrounded) {
      appState.surrounding.windows.add(starKey);
      if (el) el.classList.add('feature-active');
    } else {
      appState.surrounding.windows.delete(starKey);
      if (el) el.classList.remove('feature-active');
    }
  });

  // 2. Pilares / Colunas (+1): cercados quando os espaços 2 e 3 da estrela externa + os 2 espaços adjacentes da estrela central estão preenchidos
  outerStars.forEach((starKey) => {
    const [c1, c2] = COLUMN_CENTER_ADJACENCY[starKey];
    const isSurrounded =
      appState.stars[starKey].has(2) &&
      appState.stars[starKey].has(3) &&
      appState.stars.center.has(c1) &&
      appState.stars.center.has(c2);
    const el = document.getElementById(`feature-column-${starKey}`);
    if (isSurrounded) {
      appState.surrounding.columns.add(starKey);
      if (el) el.classList.add('feature-active');
    } else {
      appState.surrounding.columns.delete(starKey);
      if (el) el.classList.remove('feature-active');
    }
  });

  // 3. Estátuas (+2): cercadas quando os espaços 1 e 2 da estrela horária + espaços 3 e 4 da estrela anti-horária estão preenchidos
  Object.entries(STATUE_STAR_ADJACENCY).forEach(([statKey, { cw, ccw }]) => {
    const statDeg = Number(statKey);
    const isSurrounded =
      appState.stars[cw].has(1) &&
      appState.stars[cw].has(2) &&
      appState.stars[ccw].has(3) &&
      appState.stars[ccw].has(4);
    const el = document.getElementById(`feature-statue-${statDeg}`);
    if (isSurrounded) {
      appState.surrounding.statues.add(statDeg);
      if (el) el.classList.add('feature-active');
    } else {
      appState.surrounding.statues.delete(statDeg);
      if (el) el.classList.remove('feature-active');
    }
  });

  updateSurroundingCounters();
}

/**
 * Atualiza estado visual ativo/inativo dos botões de bônus na toolbar
 */
function updateBonusToolbarButtons() {
  for (let num = 1; num <= 4; num++) {
    const allHaveNum = Object.values(appState.stars).every((set) => set.has(num));
    const btn = document.getElementById(`btnBonus${num}`);
    if (btn) {
      btn.classList.toggle('active', allHaveNum);
    }
  }
}

/**
 * Atualiza o contador de azulejos necessários segundo o manual (soma dos slots) e colocados
 */
function updateTileUsageCounters() {
  const t = I18N[appState.lang] || I18N.pt;
  let totalCost = 0;
  let totalPlaced = 0;

  for (const [starKey, set] of Object.entries(appState.stars)) {
    const count = set.size;
    let cost = 0;
    set.forEach((slotNum) => {
      cost += slotNum;
    });

    totalCost += cost;
    totalPlaced += count;

    const cap = starKey.charAt(0).toUpperCase() + starKey.slice(1);
    const pillVal = document.getElementById(`pillVal${cap}`);
    if (pillVal) {
      pillVal.innerHTML = `<span class="pill-val-cost">${cost}/21</span> <span class="pill-val-count">(${count}/6)</span>`;
      const tipTmpl = t.tile_tooltip_pill || '{0}/21 azulejos necessários ({1}/6 colocados)';
      pillVal.title = tipTmpl.replace('{0}', cost).replace('{1}', count);
    }
  }

  const lblTotal = document.getElementById('lblTotalTilesUsed');
  if (lblTotal) {
    lblTotal.textContent = `${totalCost} / 147`;
    const tipTotal = t.tile_tooltip_total || 'Total: {0} de 147 gastos ({1} no tabuleiro)';
    lblTotal.title = tipTotal.replace('{0}', totalCost).replace('{1}', totalPlaced);
  }

  const lblPlaced = document.getElementById('lblTotalTilesPlaced');
  if (lblPlaced) {
    const tmplPlaced = t.tile_total_placed || '({0} / 42 no tabuleiro)';
    lblPlaced.textContent = tmplPlaced.replace('{0}', totalPlaced);
  }
}

/**
 * Alterna estado de espaço especial (Janela, Estátua, Coluna)
 */
function toggleSurroundingFeature(type, key) {
  const set = appState.surrounding[type];
  const singular = type === 'statues' ? 'statue' : (type === 'windows' ? 'window' : 'column');
  const el = document.getElementById(`feature-${singular}-${key}`);

  if (set.has(key)) {
    set.delete(key);
    if (el) el.classList.remove('feature-active');
  } else {
    set.add(key);
    if (el) el.classList.add('feature-active');
  }
  updateSurroundingCounters();
}

/**
 * Atualiza contadores de espaços especiais na legenda
 */
function updateSurroundingCounters() {
  const t = I18N[appState.lang] || I18N.pt;
  const numWin = appState.surrounding.windows.size;
  const numStat = appState.surrounding.statues.size;
  const numCol = appState.surrounding.columns.size;
  const totalBonusTiles = (numWin * 3) + (numStat * 2) + (numCol * 1);

  const lblBonus = document.getElementById('lblSurroundingTilesEarned');
  if (lblBonus) {
    const tmpl = t.surrounding_bonus_tag || '+{0} azulejos bônus';
    lblBonus.textContent = tmpl.replace('{0}', totalBonusTiles);
  }

  const cntWin = document.getElementById('cntWindows');
  if (cntWin) cntWin.textContent = `${numWin}/6`;

  const cntStat = document.getElementById('cntStatues');
  if (cntStat) cntStat.textContent = `${numStat}/6`;

  const cntCol = document.getElementById('cntColumns');
  if (cntCol) cntCol.textContent = `${numCol}/6`;
}

/**
 * Atualiza classes visuais dos azulejos no SVG de acordo com appState
 */
function updateSvgVisuals() {
  for (const [starKey, config] of Object.entries(STARS_CONFIG)) {
    const set = appState.stars[starKey];
    for (let slot = 1; slot <= 6; slot++) {
      const polygon = document.getElementById(`slot-${starKey}-${slot}`);
      const text = document.getElementById(`text-${starKey}-${slot}`);
      const ornament = document.getElementById(`ornament-${starKey}-${slot}`);
      if (!polygon || !text) continue;

      if (set.has(slot)) {
        polygon.className.baseVal = `svg-slot slot-${starKey} ${config.colorClass}`;
        text.className.baseVal = `slot-text text-${starKey} filled`;
        if (ornament) ornament.className.baseVal = `tile-ornament ornament-${starKey} filled`;
      } else {
        polygon.className.baseVal = `svg-slot slot-${starKey}`;
        text.className.baseVal = `slot-text text-${starKey}`;
        if (ornament) ornament.className.baseVal = `tile-ornament ornament-${starKey}`;
      }
    }
  }
}

/**
 * Atualiza a interface das 6 rodadas de penalidade de 1º jogador do centro
 */
function updateRoundPenaltiesUI() {
  const totalFpPenalty = appState.roundPenalties.reduce((acc, v) => acc + v, 0);
  appState.extraPenalty = totalFpPenalty;

  const inpExtra = document.getElementById('inpExtraPenalty');
  if (inpExtra) inpExtra.value = String(totalFpPenalty);

  const lblFpTotal = document.getElementById('lblFpTotalPenalty');
  if (lblFpTotal) {
    lblFpTotal.textContent = `-${totalFpPenalty} pts`;
    lblFpTotal.classList.toggle('active-penalty', totalFpPenalty > 0);
  }

  for (let i = 0; i < 6; i++) {
    const rNum = i + 1;
    const val = appState.roundPenalties[i] || 0;
    const lblRound = document.getElementById(`lblRoundPenalty${rNum}`);
    if (lblRound) {
      lblRound.textContent = val > 0 ? `-${val}` : '0';
    }
    const box = document.querySelector(`.round-penalty-box[data-round-box="${rNum}"]`);
    if (box) {
      box.classList.toggle('has-penalty', val > 0);
    }
  }
}

/**
 * Altera a penalidade de 1º jogador em uma rodada específica (1 a 6)
 */
function changeRoundPenalty(roundNum, delta) {
  const idx = roundNum - 1;
  if (idx < 0 || idx >= 6) return;
  const nextVal = Math.max(0, Math.min(20, (appState.roundPenalties[idx] || 0) + delta));
  appState.roundPenalties[idx] = nextVal;
  updateRoundPenaltiesUI();
  triggerRecalculate();
}

/**
 * Limpa todos os azulejos do tabuleiro (reset para 0)
 */
function clearBoard() {
  for (const set of Object.values(appState.stars)) {
    set.clear();
  }
  appState.surrounding.windows.clear();
  appState.surrounding.statues.clear();
  appState.surrounding.columns.clear();

  document.querySelectorAll('.svg-feature-icon').forEach((el) => {
    el.classList.remove('feature-active');
  });

  appState.cornerTilesCount = 0;
  appState.roundPenalties = [0, 0, 0, 0, 0, 0];
  appState.extraPenalty = 0;

  const lblCorners = document.getElementById('lblCornersCount');
  if (lblCorners) lblCorners.textContent = '0';

  updateRoundPenaltiesUI();
  updateSvgVisuals();
  updateTileUsageCounters();
  updateBonusToolbarButtons();
  updateSurroundingCounters();
  triggerRecalculate();
}

/**
 * Motor determinístico local de pontuação (idêntico a app/engine.py para rodar 100% estático no Netlify)
 */
function findConnectedComponentsLocal(filledSet) {
  const valid = Array.from(filledSet).filter((p) => p >= 1 && p <= 6).sort((a, b) => a - b);
  if (valid.length === 0) return [];
  if (valid.length === 6) return [[1, 2, 3, 4, 5, 6]];

  const adj = {
    1: [6, 2],
    2: [1, 3],
    3: [2, 4],
    4: [3, 5],
    5: [4, 6],
    6: [5, 1],
  };
  const validSet = new Set(valid);
  const visited = new Set();
  const components = [];

  for (const pos of valid) {
    if (visited.has(pos)) continue;
    const comp = [];
    const queue = [pos];
    visited.add(pos);
    while (queue.length > 0) {
      const curr = queue.shift();
      comp.push(curr);
      for (const nb of adj[curr]) {
        if (validSet.has(nb) && !visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    components.push(comp.sort((a, b) => a - b));
  }
  return components;
}

function calculateScoreLocal(payload) {
  const starOrder = ['center', 'red', 'blue', 'yellow', 'orange', 'green', 'purple'];
  const numberBonuses = { 1: 4, 2: 8, 3: 12, 4: 16 };
  const numberCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };

  let totalPlacement = 0;
  let totalStarBonus = 0;
  const completedStars = [];
  const starBreakdowns = {};

  for (const colorKey of starOrder) {
    const rawList = payload.stars[colorKey] || [];
    const validSet = new Set(rawList.filter((p) => p >= 1 && p <= 6));
    const filledPositions = Array.from(validSet).sort((a, b) => a - b);
    const clusters = findConnectedComponentsLocal(validSet);
    const placementScore = clusters.reduce((acc, c) => acc + (c.length * (c.length + 1)) / 2, 0);
    totalPlacement += placementScore;

    const isComplete = filledPositions.length === 6;
    const starBonus = isComplete ? STARS_CONFIG[colorKey].bonus : 0;
    if (isComplete) {
      completedStars.push(colorKey);
      totalStarBonus += starBonus;
    }

    starBreakdowns[colorKey] = {
      color: colorKey,
      filled_positions: filledPositions,
      clusters,
      placement_score: placementScore,
      is_complete: isComplete,
      star_bonus: starBonus,
    };

    for (const num of [1, 2, 3, 4]) {
      if (validSet.has(num)) numberCounts[num] += 1;
    }
  }

  const completedNumbers = [];
  const numberBonusBreakdown = {};
  let totalNumberBonus = 0;

  for (const num of [1, 2, 3, 4]) {
    if (numberCounts[num] === 7) {
      completedNumbers.push(num);
      numberBonusBreakdown[num] = numberBonuses[num];
      totalNumberBonus += numberBonuses[num];
    } else {
      numberBonusBreakdown[num] = 0;
    }
  }

  const cornerTilesCount = Math.max(0, Math.min(4, payload.corner_tiles_count || 0));
  const cornerPenalty = cornerTilesCount;
  const extraPenalty = Math.max(0, payload.extra_penalty || 0);
  const finalScore = totalPlacement + totalStarBonus + totalNumberBonus - cornerPenalty - extraPenalty;

  return {
    final_score: finalScore,
    total_placement_score: totalPlacement,
    total_star_bonus: totalStarBonus,
    total_number_bonus: totalNumberBonus,
    corner_penalty: cornerPenalty,
    extra_penalty: extraPenalty,
    completed_stars: completedStars,
    completed_numbers: completedNumbers,
    number_bonus_breakdown: numberBonusBreakdown,
    corner_tiles_count: cornerTilesCount,
    warnings: [],
    star_breakdowns: starBreakdowns,
  };
}

/**
 * Calcula a pontuação instantaneamente no navegador (compatível com Netlify estático e FastAPI)
 */
async function triggerRecalculate() {
  const payload = {
    stars: {},
    corner_tiles_count: appState.cornerTilesCount,
    extra_penalty: appState.extraPenalty,
  };

  for (const [starKey, set] of Object.entries(appState.stars)) {
    payload.stars[starKey] = Array.from(set);
  }

  const report = calculateScoreLocal(payload);
  appState.lastReport = report;
  renderScoreReport(report);
}

/**
 * Renderiza o extrato detalhado de pontuação com suporte completo a i18n
 */
function renderScoreReport(report) {
  const t = I18N[appState.lang] || I18N.pt;

  // Pontuação Total
  const lblTotal = document.getElementById('lblTotalScore');
  if (lblTotal) lblTotal.textContent = report.final_score;

  // Pontos de Colocação
  const lblPlacement = document.getElementById('lblPlacementScore');
  if (lblPlacement) lblPlacement.textContent = `+${report.total_placement_score} pts`;

  // Detalhes por estrela
  const detailsContainer = document.getElementById('starBreakdownDetails');
  if (detailsContainer) {
    detailsContainer.innerHTML = '';
    for (const [starKey, config] of Object.entries(STARS_CONFIG)) {
      const starData = report.star_breakdowns[starKey];
      if (!starData) continue;

      const starName = appState.lang === 'pt' ? config.namePt : config.nameEn;
      const chip = document.createElement('div');
      chip.className = 'star-detail-chip';
      chip.style.borderLeftColor = config.color;
      chip.innerHTML = `
        <span><strong>${starName.split(' ')[0]}:</strong> ${starData.filled_positions.length}/6</span>
        <span>+${starData.placement_score} pts</span>
      `;
      detailsContainer.appendChild(chip);
    }
  }

  // Bônus de Estrelas
  const lblStarBonus = document.getElementById('lblStarBonus');
  if (lblStarBonus) lblStarBonus.textContent = `+${report.total_star_bonus} pts`;

  const starTagsContainer = document.getElementById('completedStarsTags');
  if (starTagsContainer) {
    starTagsContainer.innerHTML = '';
    if (report.completed_stars.length === 0) {
      starTagsContainer.innerHTML = `<span class="badge badge-muted">${t.no_completed_stars}</span>`;
    } else {
      report.completed_stars.forEach((colorKey) => {
        const config = STARS_CONFIG[colorKey];
        const starName = appState.lang === 'pt' ? config.namePt : config.nameEn;
        const badge = document.createElement('span');
        badge.className = 'badge badge-success';
        badge.textContent = `★ ${starName}: +${config.bonus} pts`;
        starTagsContainer.appendChild(badge);
      });
    }
  }

  // Bônus de Números
  const lblNumberBonus = document.getElementById('lblNumberBonus');
  if (lblNumberBonus) lblNumberBonus.textContent = `+${report.total_number_bonus} pts`;

  const numberTagsContainer = document.getElementById('completedNumbersTags');
  if (numberTagsContainer) {
    numberTagsContainer.innerHTML = '';
    if (report.completed_numbers.length === 0) {
      numberTagsContainer.innerHTML = `<span class="badge badge-muted">${t.no_completed_numbers}</span>`;
    } else {
      report.completed_numbers.forEach((num) => {
        const bonusPts = report.number_bonus_breakdown[num];
        const badge = document.createElement('span');
        badge.className = 'badge badge-success';
        const numText = t.all_numbers_covered.replace('{0}', num).replace('{1}', bonusPts);
        badge.textContent = numText;
        numberTagsContainer.appendChild(badge);
      });
    }
  }

  // Penalidades
  const totalPenalties = report.corner_penalty + report.extra_penalty;
  const lblPenalties = document.getElementById('lblPenalties');
  if (lblPenalties) lblPenalties.textContent = `-${totalPenalties} pts`;

  const penaltiesDetails = document.getElementById('penaltiesDetails');
  if (penaltiesDetails) {
    let text = t.corners_label.replace('{0}', report.corner_tiles_count).replace('{1}', report.corner_penalty);
    if (report.extra_penalty > 0) {
      const activeRounds = [];
      appState.roundPenalties.forEach((val, idx) => {
        if (val > 0) activeRounds.push(`R${idx + 1}: -${val}`);
      });
      const roundsSummary = activeRounds.length > 0 ? ` (${activeRounds.join(', ')})` : '';
      text += ` | ` + t.extra_penalty_label.replace('{0}', report.extra_penalty) + roundsSummary;
    }
    penaltiesDetails.textContent = text;
  }
}

/**
 * Upload de Foto e Análise via Câmera / Arquivo
 */
async function handlePhotoUpload(file) {
  if (!file) return;

  const t = I18N[appState.lang] || I18N.pt;
  const overlay = document.getElementById('loadingOverlay');
  const statusText = document.getElementById('loadingStatusText');
  if (overlay) overlay.classList.remove('hidden');
  if (statusText) statusText.textContent = t.loading_status;

  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  const userApiKey = localStorage.getItem('gemini_api_key');
  if (userApiKey) {
    headers['X-Gemini-Key'] = userApiKey;
  }

  try {
    const res = await fetch('/api/vision/analyze', {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!res.ok) throw new Error('Falha no processamento da imagem');
    const data = await res.json();

    const detection = data.detection;
    // Atualiza estado local
    for (const starKey of Object.keys(STARS_CONFIG)) {
      const slots = detection[starKey]?.filled_slots || [];
      appState.stars[starKey] = new Set(slots);
    }
    appState.cornerTilesCount = detection.corner_tiles_count || 0;

    const lblCorners = document.getElementById('lblCornersCount');
    if (lblCorners) lblCorners.textContent = appState.cornerTilesCount;

    updateSvgVisuals();
    updateTileUsageCounters();
    updateBonusToolbarButtons();
    appState.lastReport = data.report;
    renderScoreReport(data.report);

    if (detection.notes) {
      console.log('Notas da detecção:', detection.notes);
    }
  } catch (err) {
    console.error('Erro na análise da foto:', err);
    alert(t.vision_error);
  } finally {
    if (overlay) overlay.classList.add('hidden');
  }
}

/**
 * Configuração dos ouvintes de eventos da UI
 */
function setupEventListeners() {
  // Toggle de Idioma (PT / EN)
  const btnLangToggle = document.getElementById('btnLangToggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', () => {
      const nextLang = appState.lang === 'pt' ? 'en' : 'pt';
      setLanguage(nextLang);
    });
  }

  // Botão Limpar Tabuleiro
  const btnClearBoard = document.getElementById('btnClearBoard');
  if (btnClearBoard) {
    btnClearBoard.addEventListener('click', () => {
      clearBoard();
    });
  }

  // Toolbar de Bônus 1, 2, 3, 4
  for (let num = 1; num <= 4; num++) {
    const btn = document.getElementById(`btnBonus${num}`);
    if (btn) {
      btn.addEventListener('click', () => {
        toggleNumberAcrossAllStars(num);
      });
    }
  }

  // Inputs de arquivo / câmera
  const cameraInput = document.getElementById('cameraInput');
  const fileInput = document.getElementById('fileInput');
  const btnLoadTestSample = document.getElementById('btnLoadTestSample');
  const btnLoadTestSample2 = document.getElementById('btnLoadTestSample2');

  if (btnLoadTestSample) {
    btnLoadTestSample.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/test-board');
        if (!res.ok) throw new Error('Falha ao carregar tabuleiro de teste 1');
        const data = await res.json();
        
        const detection = data.detection;
        for (const starKey of Object.keys(STARS_CONFIG)) {
          const slots = detection[starKey]?.filled_slots || [];
          appState.stars[starKey] = new Set(slots);
        }
        appState.cornerTilesCount = detection.corner_tiles_count || 0;
        appState.roundPenalties = [0, 0, 0, 0, 0, 0];
        appState.extraPenalty = 0;

        const lblCorners = document.getElementById('lblCornersCount');
        if (lblCorners) lblCorners.textContent = appState.cornerTilesCount;

        updateRoundPenaltiesUI();
        updateSvgVisuals();
        updateTileUsageCounters();
        updateBonusToolbarButtons();
        appState.lastReport = data.report;
        renderScoreReport(data.report);
      } catch (err) {
        console.error('Erro ao carregar teste 1:', err);
      }
    });
  }

  if (btnLoadTestSample2) {
    btnLoadTestSample2.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/test-board-2');
        if (!res.ok) throw new Error('Falha ao carregar amostra 2');
        const data = await res.json();
        
        const detection = data.detection;
        for (const starKey of Object.keys(STARS_CONFIG)) {
          const slots = detection[starKey]?.filled_slots || [];
          appState.stars[starKey] = new Set(slots);
        }
        appState.cornerTilesCount = detection.corner_tiles_count || 0;
        appState.roundPenalties = [0, 0, 0, 0, 0, 0];
        appState.extraPenalty = 0;

        const lblCorners = document.getElementById('lblCornersCount');
        if (lblCorners) lblCorners.textContent = appState.cornerTilesCount;

        updateRoundPenaltiesUI();
        updateSvgVisuals();
        updateTileUsageCounters();
        updateBonusToolbarButtons();
        appState.lastReport = data.report;
        renderScoreReport(data.report);
      } catch (err) {
        console.error('Erro ao carregar teste 2:', err);
      }
    });
  }

  if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
    });
  }

  // Controles de cantos de reserva
  const btnDecCorners = document.getElementById('btnDecCorners');
  const btnIncCorners = document.getElementById('btnIncCorners');
  const lblCorners = document.getElementById('lblCornersCount');

  if (btnDecCorners) {
    btnDecCorners.addEventListener('click', () => {
      if (appState.cornerTilesCount > 0) {
        appState.cornerTilesCount--;
        lblCorners.textContent = appState.cornerTilesCount;
        triggerRecalculate();
      }
    });
  }
  if (btnIncCorners) {
    btnIncCorners.addEventListener('click', () => {
      if (appState.cornerTilesCount < 4) {
        appState.cornerTilesCount++;
        lblCorners.textContent = appState.cornerTilesCount;
        triggerRecalculate();
      }
    });
  }

  // Controles das 6 rodadas de desconto de 1º jogador do centro
  document.querySelectorAll('.btn-round-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      const roundNum = parseInt(btn.getAttribute('data-round'), 10);
      const dir = parseInt(btn.getAttribute('data-dir'), 10);
      if (roundNum && dir) {
        changeRoundPenalty(roundNum, dir);
      }
    });
  });

  // Fallback para input direto de penalidade extra
  const inpExtraPenalty = document.getElementById('inpExtraPenalty');
  if (inpExtraPenalty) {
    inpExtraPenalty.addEventListener('input', (e) => {
      appState.extraPenalty = parseInt(e.target.value) || 0;
      triggerRecalculate();
    });
  }

  // Salvar no placar multijogador
  const btnSavePlayer = document.getElementById('btnSavePlayer');
  if (btnSavePlayer) {
    btnSavePlayer.addEventListener('click', () => {
      const nameInput = document.getElementById('inpPlayerName');
      const defaultName = appState.lang === 'pt' ? `Jogador ${appState.players.length + 1}` : `Player ${appState.players.length + 1}`;
      const name = nameInput.value.trim() || defaultName;
      const totalScore = parseInt(document.getElementById('lblTotalScore').textContent) || 0;

      appState.players.push({ name, score: totalScore });
      appState.players.sort((a, b) => b.score - a.score);
      localStorage.setItem('azul_players', JSON.stringify(appState.players));

      renderLeaderboard();
      nameInput.value = appState.lang === 'pt' ? `Jogador ${appState.players.length + 1}` : `Player ${appState.players.length + 1}`;
    });
  }

  // Limpar placar
  const btnClearLeaderboard = document.getElementById('btnClearLeaderboard');
  if (btnClearLeaderboard) {
    btnClearLeaderboard.addEventListener('click', () => {
      const t = I18N[appState.lang] || I18N.pt;
      if (confirm(t.confirm_clear_leaderboard)) {
        appState.players = [];
        localStorage.removeItem('azul_players');
        renderLeaderboard();
      }
    });
  }

  // Modal de Regras
  const btnRulesModal = document.getElementById('btnRulesModal');
  const btnCloseRules = document.getElementById('btnCloseRules');
  const rulesModal = document.getElementById('rulesModal');

  if (btnRulesModal && rulesModal) {
    btnRulesModal.addEventListener('click', () => rulesModal.classList.remove('hidden'));
  }
  if (btnCloseRules && rulesModal) {
    btnCloseRules.addEventListener('click', () => rulesModal.classList.add('hidden'));
  }
  if (rulesModal) {
    rulesModal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      rulesModal.classList.add('hidden');
    });
  }

  // Modal de Configurações de IA
  const btnSettingsModal = document.getElementById('btnSettingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnCancelSettings = document.getElementById('btnCancelSettings');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const settingsModal = document.getElementById('settingsModal');
  const inpGeminiKey = document.getElementById('inpGeminiKey');

  if (btnSettingsModal && settingsModal) {
    btnSettingsModal.addEventListener('click', () => {
      if (inpGeminiKey) {
        inpGeminiKey.value = localStorage.getItem('gemini_api_key') || '';
      }
      settingsModal.classList.remove('hidden');
    });
  }

  const closeSettings = () => {
    if (settingsModal) settingsModal.classList.add('hidden');
  };

  if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettings);
  if (btnCancelSettings) btnCancelSettings.addEventListener('click', closeSettings);
  if (settingsModal) {
    settingsModal.querySelector('.modal-backdrop')?.addEventListener('click', closeSettings);
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const t = I18N[appState.lang] || I18N.pt;
      if (inpGeminiKey) {
        const val = inpGeminiKey.value.trim();
        if (val) {
          localStorage.setItem('gemini_api_key', val);
        } else {
          localStorage.removeItem('gemini_api_key');
        }
      }
      alert(t.settings_saved);
      closeSettings();
    });
  }
}

/**
 * Renderiza o placar da mesa (Leaderboard)
 */
function renderLeaderboard() {
  const container = document.getElementById('leaderboardContainer');
  const list = document.getElementById('leaderboardList');
  if (!container || !list) return;

  if (appState.players.length === 0) {
    container.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  list.innerHTML = '';

  appState.players.forEach((player, idx) => {
    const li = document.createElement('li');
    li.className = `leaderboard-item ${idx === 0 ? 'rank-1' : ''}`;
    li.innerHTML = `
      <span>${idx === 0 ? '👑 ' : ''}#${idx + 1} ${player.name}</span>
      <span>${player.score} pts</span>
    `;
    list.appendChild(li);
  });
}
