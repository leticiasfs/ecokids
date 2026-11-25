/* ============================================================
   EcoKids - JavaScript do site
   Este arquivo é usado por todas as páginas. Cada bloco abaixo
   só faz algo se a página tiver o elemento que ele procura.
   Blocos: 0) tema claro/escuro  1) ícones  2) janela do Aprenda  3) jogo da memória
           4) quiz  5) lixeira certa  6) quebra-cabeça  7) tela final
           8) caça-palavras  9) palavras cruzadas  10) EcoBot
           11) menu hambúrguer  12) decoração (folhas e confete)
   A interatividade do Tito (olhar, respirar, modelo 3D) fica em js/tito.js.
   ============================================================ */

// 0) TEMA CLARO / ESCURO ------------------------------------
// Guarda a escolha em localStorage ("ecokids-tema") e troca o atributo data-tema do <html>.
// Se a pessoa nunca escolheu, o script do <head> segue o tema do sistema (claro ou escuro).
// As cores mudam aos poucos porque o CSS anima as variáveis de cor.
(function () {
  const botao = document.querySelector(".theme-toggle");
  if (!botao) return;
  const raiz = document.documentElement;

  function atualizar() {
    const escuro = raiz.dataset.tema === "escuro";
    botao.setAttribute("aria-pressed", escuro ? "true" : "false");
    botao.setAttribute("aria-label", escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro");
  }
  atualizar();

  botao.addEventListener("click", function () {
    const escuro = raiz.dataset.tema !== "escuro";
    if (escuro) raiz.dataset.tema = "escuro"; else delete raiz.dataset.tema;
    try { localStorage.setItem("ecokids-tema", escuro ? "escuro" : "claro"); } catch (e) {}
    atualizar();
  });
})();

// Embaralha uma lista (usado nos jogos)
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Estrelas (0 a 5) a partir de um desempenho de 0 a 1. "minimo" garante ao menos 1 estrela
// nos jogos em que a criança sempre termina (memória e quebra-cabeça).
function estrelasPor(desempenho, minimo) {
  const e = Math.round(Math.max(0, Math.min(1, desempenho)) * 5);
  return Math.max(minimo || 0, e);
}

// Vai para a tela final levando: qual jogo, quantas estrelas e dois números (a, t) para o texto.
function terminarJogo(paginaDoJogo, estrelas, a, t) {
  window.location.href = "conclusao.html?jogo=" + paginaDoJogo +
    "&estrelas=" + (estrelas === undefined ? 5 : estrelas) + "&a=" + (a || 0) + "&t=" + (t || 0);
}

// Troca a expressão do Tito: trocarRosto(elemento, "feliz")  (nomes: veja a pasta imagens/tito/)
function trocarRosto(elemento, nome) {
  if (!elemento) return;
  elemento.className = elemento.className.replace(/\brosto-[\w-]+/g, "").trim() + " rosto-" + nome;
}

/* ---------- 1) ÍCONES (desenhos em SVG) ---------- */
const ICONES = {
  reciclar: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>',
  agua: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 7S17 25 17 38a15 15 0 0 0 30 0C47 25 32 7 32 7Z"/></svg>',
  energia: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 29a12 12 0 1 1 24 0c0 7-6 9-7 16H27c-1-7-7-9-7-16Z"/><path d="M27 51h10M29 57h6"/></svg>',
  folha: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M51 11C31 12 15 21 13 42c11 3 23 0 31-8 8-8 8-17 7-23Z"/><path d="M14 47c8-12 17-20 30-27"/></svg>',
  estrela: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m32 8 7 15 17 2-12 12 3 17-15-8-15 8 3-17L8 25l17-2Z"/></svg>',
  quebraCabeca: '<svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 21h12a6 6 0 1 1 10 0h14v13a6 6 0 1 0 0 10v8H14V40a6 6 0 1 1 0-10Z"/></svg>'
};

/* ---------- 2) JANELA (modal) DA PÁGINA APRENDA: as miniaulas ---------- */
// Ilustrações de massinha usadas nas miniaulas (desenhos SVG próprios do EcoKids).
// O volume de massinha vem do filtro "ek-massa", que fica no HTML da página aprenda.html.
const ILUSTRA = (function () {
  const M = ' filter="url(#ek-massa)"';
  const SOMBRA = '<ellipse cx="32" cy="59.5" rx="19" ry="3.2" fill="#0b2200" opacity=".2"/>';
  const RECICLAR = '<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>';
  function gota(x, y, cor) { return '<path d="M' + x + " " + y + 'c-2.6 3.6-3.6 5.6-3.6 7.2a3.6 3.6 0 0 0 7.2 0c0-1.6-1-3.6-3.6-7.2Z" fill="' + (cor || "#3b9de3") + '"/>'; }
  function svg(conteudo) { return '<svg class="ilustra" viewBox="0 0 64 64" aria-hidden="true">' + SOMBRA + conteudo + "</svg>"; }
  const raios = [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<rect x="29.5" y="3" width="5" height="10" rx="2.5" transform="rotate(' + a + ' 32 32)"/>'; }).join("");
  const pas = [0, 120, 240].map(function (a) { return '<path d="M32 24c-3-7-2.5-15 1-19 2.5 6 1.5 13-1 19Z" transform="rotate(' + a + ' 32 24)"/>'; }).join("");

  return {
    // lixeira de massinha na cor do material (cor do corpo, cor da tampa, cor do símbolo)
    lixeira: function (cor, tampa, simbolo) {
      return svg('<g' + M + '><path d="M15 23h34l-3.4 29.5a6 6 0 0 1-6 5.5H24.4a6 6 0 0 1-6-5.5Z" fill="' + cor + '"/><rect x="11" y="13" width="42" height="12" rx="6" fill="' + tampa + '"/><rect x="25.5" y="8" width="13" height="8" rx="4" fill="' + tampa + '"/></g>' +
        '<g transform="translate(20 28)" fill="none" stroke="' + simbolo + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + RECICLAR + "</g>");
    },
    reciclar: svg('<g' + M + '><g transform="translate(4.5 3) scale(2.3)" fill="none" stroke="#3fa047" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + RECICLAR + "</g></g>"),
    composto: svg('<g' + M + '><path d="M7 56c2-12 12-18 25-18s23 6 25 18Z" fill="#8b5a2b"/><path d="M30.5 40c0-6 0-11 1-16h2c1 5 1 10 1 16Z" fill="#4c9a33"/><path d="M32 27C22 29 14 24 12 14c11-2 20 3 20 13Z" fill="#6cc04a"/><path d="M33 23c0-10 7-16 19-17 1 11-7 17-19 17Z" fill="#58b043"/><path d="M38 45c4-6 10-7 14-5-3 1-6 3-8 6Z" fill="#ffd23f"/></g><g fill="#5e3a18"><circle cx="19" cy="50" r="2"/><circle cx="29" cy="53" r="1.5"/><circle cx="45" cy="52" r="2"/></g>'),
    biodegradavel: svg('<g' + M + '><path d="M8 57c2-8 11-12 24-12s22 4 24 12Z" fill="#8b5a2b"/><path d="M13 43C15 25 31 12 54 11c0 23-14 35-41 32Z" fill="#e8a33a"/></g><path d="M16 40C26 30 37 22 50 15" stroke="#b86e1c" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#5e3a18"><circle cx="22" cy="53" r="1.6"/><circle cx="40" cy="52" r="1.8"/></g>'),
    garrafa: svg('<g' + M + '><rect x="25" y="4" width="14" height="8" rx="3" fill="#1f74b8"/><path d="M27 11h10v5c6 3 9 7 9 13v23a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V29c0-6 3-10 9-13Z" fill="#8fd3f4"/><rect x="18" y="31" width="28" height="13" fill="#2f86c6"/></g><path d="M23 22c-1 6-1 22 0 30" stroke="#fff" stroke-width="2.6" opacity=".6" fill="none" stroke-linecap="round"/><path d="M32 41c-4 0-6-3-6-6 4 0 6 2 6 6Zm0 0c3 0 5-3 5-6-3 0-5 2-5 6Z" fill="#c6ef9a"/>'),
    sacola: svg('<g' + M + '><path d="M23 25v-5a9 9 0 0 1 18 0v5" fill="none" stroke="#b98a4e" stroke-width="4.5" stroke-linecap="round"/><path d="M12 24h40l-3 29a5 5 0 0 1-5 4.5H20a5 5 0 0 1-5-4.5Z" fill="#f3dcae"/></g><path d="M32 50c-7-1-10-6-9-13 7 0 11 5 9 13Zm0 0c6-1 9-6 8-12-6 1-9 5-8 12Z" fill="#58b043"/>'),
    gota: svg('<g' + M + '><path d="M32 4C22 18 12 28 12 40a20 20 0 0 0 40 0C52 28 42 18 32 4Z" fill="#3b9de3"/></g><circle cx="25" cy="40" r="3" fill="#17402d"/><circle cx="39" cy="40" r="3" fill="#17402d"/><circle cx="26" cy="39" r="1" fill="#fff"/><circle cx="40" cy="39" r="1" fill="#fff"/><path d="M27 47q5 5 10 0" fill="none" stroke="#17402d" stroke-width="2.8" stroke-linecap="round"/><circle cx="21" cy="46" r="2.6" fill="#ff9aa2" opacity=".75"/><circle cx="43" cy="46" r="2.6" fill="#ff9aa2" opacity=".75"/>'),
    torneira: svg('<g' + M + '><rect x="5" y="17" width="10" height="17" rx="3" fill="#9fb2b8"/><path d="M13 19h23a10 10 0 0 1 10 10v9H36v-7H13Z" fill="#c3d0d6"/><rect x="22" y="8" width="16" height="6" rx="3" fill="#e0453a"/><rect x="28" y="12" width="4" height="8" fill="#9fb2b8"/></g><g' + M + ">" + gota(41, 43) + "</g>"),
    chuveiro: svg('<g' + M + '><path d="M12 5v8a6 6 0 0 0 6 6h14v6" fill="none" stroke="#b9c7cf" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 36a15 12 0 0 1 30 0Z" fill="#9fb2b8"/></g><g fill="#3b9de3"><ellipse cx="22" cy="44" rx="2" ry="3"/><ellipse cx="32" cy="45" rx="2" ry="3"/><ellipse cx="42" cy="44" rx="2" ry="3"/><ellipse cx="27" cy="53" rx="2" ry="3"/><ellipse cx="37" cy="53" rx="2" ry="3"/></g>'),
    chuva: svg('<g' + M + '><path d="M17 36C8 36 6 26 13 23c0-9 10-13 16-8 4-8 17-8 20 1 8 0 11 9 6 14-1 4-4 6-8 6Z" fill="#eaf2f8"/></g><g' + M + ">" + gota(20, 42) + gota(32, 46) + gota(44, 42) + "</g>"),
    rio: svg('<g' + M + '><path d="M6 34c5-5 10-5 13 0s9 5 13 0 9-5 13 0 9 5 13 0v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" fill="#5fb3ea"/><path d="M6 45c5-4 10-4 13 0s9 4 13 0 9-4 13 0 9 4 13 0v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" fill="#1f74b8"/></g><path d="M12 31c3-3 6-3 8 0M38 31c3-3 6-3 8 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>'),
    regador: svg('<g' + M + '><path d="M36 37l15-13 5 5-15 13Z" fill="#4c9a33"/><path d="M12 28h28l-2 25a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4Z" fill="#58b043"/><path d="M18 28a9 9 0 0 1 16 0" fill="none" stroke="#4c9a33" stroke-width="4"/></g><g fill="#3b9de3"><ellipse cx="58" cy="35" rx="1.8" ry="2.8"/><ellipse cx="54" cy="40" rx="1.8" ry="2.8"/><ellipse cx="59" cy="44" rx="1.8" ry="2.8"/></g>'),
    lampada: svg('<g' + M + '><path d="M32 4a20 20 0 0 0-11 36c2 2 3 4 3 7h16c0-3 1-5 3-7A20 20 0 0 0 32 4Z" fill="#ffd23f"/><rect x="23" y="47" width="18" height="6" rx="3" fill="#a9b9be"/><rect x="26" y="53" width="12" height="6" rx="3" fill="#8597a0"/></g><path d="M26 30c2-4 4 4 6 0s4 4 6 0" stroke="#e08a00" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 34v12M35 34v12" stroke="#e08a00" stroke-width="2" opacity=".6"/>'),
    tomada: svg('<g' + M + '><rect x="10" y="9" width="44" height="46" rx="13" fill="#f4f6f2"/><circle cx="32" cy="32" r="14" fill="#dfe6e2"/></g><g fill="#5b6b66"><circle cx="26.5" cy="29.5" r="3"/><circle cx="37.5" cy="29.5" r="3"/><circle cx="32" cy="38.5" r="3"/></g>'),
    sol: svg('<g' + M + '><g fill="#ff9f1c">' + raios + '</g><circle cx="32" cy="32" r="14" fill="#ffd23f"/></g><circle cx="27" cy="30" r="2" fill="#7a4a00"/><circle cx="37" cy="30" r="2" fill="#7a4a00"/><path d="M27.5 36q4.5 4 9 0" fill="none" stroke="#7a4a00" stroke-width="2.4" stroke-linecap="round"/>'),
    catavento: svg('<g' + M + '><path d="M8 58c3-5 12-8 24-8s21 3 24 8Z" fill="#6aae38"/><path d="M30 26h4l2.5 28h-9Z" fill="#e8eef0"/><g fill="#f4f8f9">' + pas + '</g><circle cx="32" cy="24" r="4" fill="#c3d0d6"/></g>'),
    janela: svg('<g' + M + '><rect x="9" y="9" width="46" height="46" rx="8" fill="#c98a4b"/></g><rect x="14" y="14" width="36" height="36" rx="4" fill="#bfe4f7"/><circle cx="41" cy="24" r="6" fill="#ffd23f"/><path d="M20 44c4-5 9-5 13 0" fill="#7cc35a"/><path d="M32 14v36M14 32h36" stroke="#c98a4b" stroke-width="4"/>'),
    arvore: svg('<g' + M + '><path d="M28 34h8l1.5 22h-11Z" fill="#9a6a3d"/><circle cx="20" cy="31" r="11" fill="#4c9a33"/><circle cx="44" cy="31" r="11" fill="#4c9a33"/><circle cx="32" cy="22" r="17" fill="#58b043"/></g><g fill="#e0453a"><circle cx="24" cy="20" r="2.6"/><circle cx="40" cy="26" r="2.6"/><circle cx="33" cy="13" r="2.4"/></g>'),
    muda: svg('<g' + M + '><path d="M8 56c1-9 10-14 24-14s23 5 24 14Z" fill="#9a6a3d"/><path d="M30 44V24h4v20Z" fill="#3f9a37"/><path d="M32 30C20 32 11 26 10 14c13-1 22 5 22 16Z" fill="#6cc04a"/><path d="M32 24c0-12 8-19 22-19 0 13-8 20-22 19Z" fill="#58b043"/></g>'),
    ar: svg('<g' + M + '><path d="M7 27h29a7.5 7.5 0 1 0-7.5-7.5" fill="none" stroke="#8fd3f4" stroke-width="5" stroke-linecap="round"/><path d="M7 39h39a7.5 7.5 0 1 1-7.5 7.5" fill="none" stroke="#5fb3ea" stroke-width="5" stroke-linecap="round"/><path d="M47 22c0-8 5-12 12-12 0 8-5 12-12 12Z" fill="#58b043"/></g>'),
    joaninha: svg('<g' + M + '><circle cx="32" cy="21" r="8" fill="#2b2b2b"/><path d="M14 38a18 17 0 0 1 36 0c0 10-8 17-18 17S14 48 14 38Z" fill="#e0453a"/></g><path d="M32 22v33" stroke="#2b2b2b" stroke-width="2.4"/><g fill="#2b2b2b"><circle cx="23" cy="36" r="3.2"/><circle cx="41" cy="36" r="3.2"/><circle cx="24.5" cy="47" r="2.6"/><circle cx="39.5" cy="47" r="2.6"/></g><g fill="#fff"><circle cx="29" cy="19" r="1.6"/><circle cx="35" cy="19" r="1.6"/></g><path d="M28 14c-2-4-4-6-7-6M36 14c2-4 4-6 7-6" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/>'),
    peixe: svg('<g' + M + '><path d="M44 32l15-11v22Z" fill="#ff8c42"/><ellipse cx="29" cy="32" rx="20" ry="13" fill="#ffa552"/></g><circle cx="19" cy="29" r="3" fill="#17402d"/><circle cx="18" cy="28" r="1" fill="#fff"/><path d="M30 24c3 5 3 11 0 16" stroke="#e0752a" stroke-width="2.4" fill="none" stroke-linecap="round"/><g fill="none" stroke="#5fb3ea" stroke-width="2"><circle cx="8" cy="20" r="2.5"/><circle cx="12" cy="12" r="1.8"/></g>'),
    toco: svg('<g' + M + '><path d="M7 57c2-6 10-9 25-9s23 3 25 9Z" fill="#6aae38"/><path d="M20 28v21c-3 2-4 5-4 5h32s-1-3-4-5V28Z" fill="#9a6a3d"/><ellipse cx="32" cy="28" rx="12" ry="5" fill="#d9a062"/></g><ellipse cx="32" cy="28" rx="7" ry="2.8" fill="none" stroke="#9a6a3d" stroke-width="1.6"/><ellipse cx="32" cy="28" rx="2.6" ry="1.1" fill="#9a6a3d"/><path d="M45 40c3-1 6 0 7 3" stroke="#4c9a33" stroke-width="2.6" fill="none" stroke-linecap="round"/>'),
    papel: svg('<g' + M + '><path d="M16 7h22l11 11v36a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z" fill="#fbfbf6"/><path d="M38 7v11h11Z" fill="#dfe3d6"/></g><g stroke="#9fb2b8" stroke-width="2.4" stroke-linecap="round"><path d="M19 26h20M19 33h23M19 40h23M19 47h14"/></g>'),
    flor: svg('<g' + M + '><path d="M30 58V32h4v26Z" fill="#4c9a33"/><path d="M32 50c-9 0-13-5-13-11 8 0 13 4 13 11Z" fill="#58b043"/><g fill="#ff7aa8"><circle cx="32" cy="11" r="8"/><circle cx="42" cy="18" r="8"/><circle cx="38" cy="29" r="8"/><circle cx="26" cy="29" r="8"/><circle cx="22" cy="18" r="8"/></g><circle cx="32" cy="21" r="6.5" fill="#ffd23f"/></g>')
  };
})();

// Conteúdo das miniaulas. Cada tema tem: introdução, tópicos (seções) e uma curiosidade ("Você sabia?").
// Tipos de seção:
//   "lixeiras" = as 5 cores da coleta seletiva     "cartoes" = cartõezinhos com ilustração
//   "lista"    = linhas com ilustração e texto      "dicas"   = o que fazer (com ✓)
//   "evite"    = atitudes que desperdiçam (com ✗)
// "icone" é o nome de um desenho do ILUSTRA (acima). Use <b>...</b> para destacar palavras.
// IMPORTANTE: as palavras do caça-palavras e das palavras cruzadas aparecem neste conteúdo. Se tirar uma, confira os jogos.
// Vídeo do Tito: quando tiver o arquivo, escreva o caminho em "video" (ex.: video: "videos/agua.mp4", capa: "videos/agua.jpg").
const TEMAS = {
  lixeira: {
    titulo: "Lixeira",
    imagem: "imagens/cuidar/lixeira",
    intro: "<b>Lixo</b> é tudo o que a gente joga fora. Mas muita coisa que vai para a lixeira pode ganhar uma vida nova!",
    secoes: [
      { titulo: "Cada cor guarda um material", tipo: "lixeiras", itens: [
        { cor: "#0072ce", tampa: "#00599f", simbolo: "#fff", titulo: "Azul = <b>Papel</b>", texto: "jornal, caderno, caixa" },
        { cor: "#e03c31", tampa: "#b52c22", simbolo: "#fff", titulo: "Vermelha = <b>Plástico</b>", texto: "garrafa PET, pote, sacola" },
        { cor: "#2e9e4f", tampa: "#227a3b", simbolo: "#fff", titulo: "Verde = <b>Vidro</b>", texto: "garrafa, pote de conserva" },
        { cor: "#ffd100", tampa: "#e5b400", simbolo: "#17402d", titulo: "Amarela = <b>Metal</b>", texto: "lata, tampinha, prego e parafuso" },
        { cor: "#8b5a2b", tampa: "#6b4220", simbolo: "#fff", titulo: "Marrom = <b>Orgânico</b>", texto: "casca de fruta, casca de ovo, restos de comida" }
      ] },
      { titulo: "O que acontece com o lixo?", tipo: "cartoes", itens: [
        { icone: "reciclar", titulo: "Reciclar", texto: "é transformar o lixo em um produto novo e útil. Uma lata velha pode virar uma lata nova!" },
        { icone: "composto", titulo: "Compostagem", texto: "restos de comida viram <b>adubo</b> rico para as plantas, o <b>composto orgânico</b>." },
        { icone: "biodegradavel", titulo: "Biodegradável", texto: "é o que se decompõe com a ajuda da natureza e vira parte da terra, como a casca de banana." }
      ] },
      { titulo: "Como você pode ajudar", tipo: "dicas", itens: [
        { icone: "reciclar", texto: "<b>Separe o lixo</b> antes de jogar fora: cada material na sua cor." },
        { icone: "garrafa", texto: "Use uma <b>garrafa reutilizável</b>: usar a mesma garrafa várias vezes evita muito lixo de plástico." },
        { icone: "garrafa", texto: "Prefira a garrafa <b>retornável</b>: ela volta para a fábrica para ser usada de novo." },
        { icone: "sacola", texto: "Leve uma <b>sacola de pano</b> para as compras." }
      ] }
    ],
    curiosidade: "O <b>vidro</b> pode ser reciclado muitas e muitas vezes, sem perder a qualidade!"
  },
  agua: {
    titulo: "Água",
    imagem: "imagens/cuidar/agua",
    intro: "Todo ser vivo precisa de <b>água</b>: pessoas, bichos e plantas. A água limpa que bebemos é um tesouro e pode acabar.",
    secoes: [
      { titulo: "Onde encontramos água?", tipo: "cartoes", itens: [
        { icone: "torneira", titulo: "Na torneira", texto: "para beber, cozinhar e escovar os dentes" },
        { icone: "chuveiro", titulo: "No banho", texto: "para deixar o corpo limpinho" },
        { icone: "chuva", titulo: "Na chuva", texto: "que enche os rios e molha as plantas" },
        { icone: "rio", titulo: "No rio e no mar", texto: "onde vivem peixes e muitos outros bichos" }
      ] },
      { titulo: "Como economizar água", tipo: "dicas", itens: [
        { icone: "torneira", texto: "<b>Feche a torneira</b> enquanto escova os dentes." },
        { icone: "chuveiro", texto: "Tome um <b>banho curto</b>: um banho rápido gasta menos água." },
        { icone: "regador", texto: "<b>Reaproveite</b> a água da chuva para regar as plantas." }
      ] },
      { titulo: "Atitudes que desperdiçam", tipo: "evite", itens: [
        { texto: "<b>Torneira pingando</b>: o vazamento desperdiça muita água. Avise um adulto!" },
        { texto: "Deixar a torneira <b>aberta</b> sem estar usando." },
        { texto: "Lavar a calçada com a <b>mangueira</b> ligada." }
      ] }
    ],
    curiosidade: "Quase toda a água do planeta é <b>salgada</b>, do mar. Só um pouquinho é doce e pode ser bebida. Por isso, cada gota conta!"
  },
  energia: {
    titulo: "Energia",
    imagem: "imagens/cuidar/energia",
    intro: "A <b>energia</b> elétrica faz a lâmpada acender, a TV ligar e a geladeira gelar. Ela é muito útil, mas não pode ser desperdiçada.",
    secoes: [
      { titulo: "De onde vem a energia?", tipo: "cartoes", texto: "A energia de casa vem de fontes da natureza:", itens: [
        { icone: "sol", titulo: "Sol", texto: "placas guardam a energia da luz do sol" },
        { icone: "catavento", titulo: "Vento", texto: "o vento faz as hélices girarem" },
        { icone: "rio", titulo: "Água dos rios", texto: "a força da água gira as máquinas da usina" }
      ] },
      { titulo: "Como economizar energia", tipo: "dicas", itens: [
        { icone: "lampada", texto: "Saiu do quarto? <b>Apague a luz</b>." },
        { icone: "tomada", texto: "Tire da <b>tomada</b> o que não está usando: aparelhos desligados ainda podem gastar energia." },
        { icone: "janela", texto: "De dia, <b>abra a janela</b> e aproveite a luz do sol." },
        { icone: "lampada", texto: "A <b>lâmpada LED</b> gasta menos energia." }
      ] },
      { titulo: "Atitudes que desperdiçam", tipo: "evite", itens: [
        { texto: "Deixar a <b>TV ligada</b> sem ninguém assistindo." },
        { texto: "Deixar a porta da <b>geladeira</b> aberta." },
        { texto: "Deixar a <b>luz acesa</b> em um lugar vazio." }
      ] }
    ],
    curiosidade: "No Brasil, grande parte da energia elétrica vem da <b>força da água dos rios</b>, nas usinas hidrelétricas."
  },
  natureza: {
    titulo: "Natureza",
    imagem: "imagens/cuidar/planta",
    intro: "<b>Natureza</b> são as plantas, os bichos, os rios, o mar e as florestas. Nós também fazemos parte dela!",
    secoes: [
      { titulo: "Por que as árvores são importantes?", tipo: "cartoes", itens: [
        { icone: "arvore", titulo: "Sombra", texto: "a <b>árvore</b> refresca num dia quente" },
        { icone: "ar", titulo: "Ar limpo", texto: "as plantas ajudam a deixar o ar mais limpo" },
        { icone: "joaninha", titulo: "Casa para os bichos", texto: "pássaros e insetos moram nelas" }
      ], fecho: "Por isso, <b>plantar árvores</b> é um presente para o planeta!" },
      { titulo: "Cuidado com a floresta e os rios", tipo: "lista", itens: [
        { icone: "toco", titulo: "Desmatamento", texto: "cortar <b>florestas</b> deixa os animais sem casa e coloca mais gás carbônico no ar." },
        { icone: "peixe", titulo: "Rios limpos", texto: "o lixo jogado no chão vai parar nos rios e no <b>mar</b>." }
      ] },
      { titulo: "Como você pode ajudar", tipo: "dicas", itens: [
        { icone: "muda", texto: "Cuide de uma <b>planta</b>: ela precisa de água e de carinho." },
        { icone: "joaninha", texto: "<b>Respeite os bichos</b>: observe de longe e não alimente." },
        { icone: "flor", texto: "No <b>parque</b> e na praça: jogue o lixo na lixeira, não arranque flores e não escreva nas árvores." },
        { icone: "papel", texto: "<b>Economize papel</b>: use os dois lados da folha." }
      ] }
    ],
    curiosidade: "As <b>abelhas</b> levam o pólen de flor em flor. É assim que muitas plantas conseguem dar frutos!"
  }
};

const janela = document.getElementById("modal");
if (janela) {
  const caixaJanela = janela.querySelector(".learn-modal");
  const aula = janela.querySelector(".aula");
  const espacoVideo = janela.querySelector(".video-slot");
  const corpo = janela.querySelector(".modal-body");
  const dica = janela.querySelector(".scroll-hint");
  const titulo = janela.querySelector("h2");
  const simbolo = janela.querySelector(".modal-simbolo");

  // Monta o HTML de uma seção da miniaula
  function montarSecao(s, n) {
    let miolo = "";
    if (s.tipo === "lixeiras") {
      miolo = '<div class="aula-lixeiras">' + s.itens.map(function (it) {
        return '<div class="lixeira-card" style="--bin:' + it.cor + '">' + ILUSTRA.lixeira(it.cor, it.tampa, it.simbolo) +
          "<strong>" + it.titulo + "</strong><small>" + it.texto + "</small></div>";
      }).join("") + "</div>";
    } else if (s.tipo === "cartoes") {
      miolo = '<div class="aula-cartoes">' + s.itens.map(function (it) {
        return '<div class="aula-cartao"><span class="aula-ilustra">' + ILUSTRA[it.icone] + "</span><strong>" + it.titulo + "</strong><small>" + it.texto + "</small></div>";
      }).join("") + "</div>";
    } else if (s.tipo === "lista") {
      miolo = '<div class="aula-lista">' + s.itens.map(function (it) {
        return '<div class="aula-linha"><span class="aula-ilustra">' + ILUSTRA[it.icone] + "</span><div><strong>" + it.titulo + "</strong><small>" + it.texto + "</small></div></div>";
      }).join("") + "</div>";
    } else {   // "dicas" ou "evite"
      miolo = '<ul class="aula-dicas' + (s.tipo === "evite" ? " evite" : "") + '">' + s.itens.map(function (it) {
        const desenho = it.icone ? '<span class="aula-ilustra">' + ILUSTRA[it.icone] + "</span>" : "";
        return "<li" + (it.icone || s.tipo === "evite" ? "" : ' class="sem-desenho"') + ">" + desenho + '<span class="aula-marca" aria-hidden="true"></span><p>' + it.texto + "</p></li>";
      }).join("") + "</ul>";
    }
    return '<section class="aula-secao"><h3><span class="aula-num" aria-hidden="true">' + n + "</span>" + s.titulo + "</h3>" +
      (s.texto ? '<p class="aula-texto">' + s.texto + "</p>" : "") + miolo +
      (s.fecho ? '<p class="aula-fecho">' + s.fecho + "</p>" : "") + "</section>";
  }

  function abrirJanela(tema) {
    const dados = TEMAS[tema];
    titulo.textContent = dados.titulo;
    caixaJanela.setAttribute("aria-label", dados.titulo);
    caixaJanela.dataset.assunto = tema;   // as cores da janela mudam com o tema (veja o CSS, parte 10)
    // Símbolo do tema no cabeçalho (a mesma ilustração 3D do cartão)
    simbolo.innerHTML = '<picture><source srcset="' + dados.imagem + '.webp" type="image/webp"><img src="' + dados.imagem + '.png" alt="" width="512" height="512"></picture>';
    aula.innerHTML =
      '<p class="aula-intro">' + dados.intro + "</p>" +
      dados.secoes.map(function (s, i) { return montarSecao(s, i + 1); }).join("") +
      (dados.curiosidade ? '<aside class="aula-curiosidade"><span class="mascot rosto-curioso" aria-hidden="true"></span><div><strong>Você sabia?</strong><p>' + dados.curiosidade + "</p></div></aside>" : "");
    // Vídeo do Tito: quando tiver o arquivo, escreva o caminho em "video" no TEMAS (ex.: "videos/agua.mp4")
    if (dados.video) {
      espacoVideo.innerHTML = '<video controls preload="metadata" src="' + dados.video + '"' +
        (dados.capa ? ' poster="' + dados.capa + '"' : "") + "></video>";
      espacoVideo.classList.remove("vazio");
    } else {
      espacoVideo.innerHTML = '<div class="video-vazio"><span class="video-play">' +
        '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>' +
        "<div><strong>Vídeo do Tito</strong><small>em breve</small></div></div>";
      espacoVideo.classList.add("vazio");
    }
    janela.hidden = false;
    corpo.scrollTop = 0;
    atualizarDica();
    // Acessibilidade: o foco do teclado vai para dentro da janela (botão Fechar)
    janela.querySelector(".modal-close").focus();
  }
  // Mostra "Role para ver mais" enquanto ainda tem conteúdo embaixo
  function atualizarDica() {
    const temMais = corpo.scrollHeight - corpo.scrollTop - corpo.clientHeight > 6;
    dica.hidden = !temMais;
  }
  corpo.addEventListener("scroll", atualizarDica);
  window.addEventListener("resize", atualizarDica);
  let cartaoAberto = null;   // cartão que abriu a janela (o foco volta para ele ao fechar)
  function fecharJanela() {
    if (janela.hidden) return;
    janela.hidden = true;
    if (cartaoAberto) cartaoAberto.focus();
  }

  // Cada cartão tem data-tema="lixeira" (ou agua, energia, natureza).
  // ".learn-card" é importante: o <html> também usa data-tema="escuro" (tema escuro) e não é um cartão.
  document.querySelectorAll(".learn-card[data-tema]").forEach(function (cartao) {
    cartao.addEventListener("click", function () { cartaoAberto = cartao; abrirJanela(cartao.dataset.tema); });
  });
  janela.addEventListener("click", function (e) { if (e.target === janela) fecharJanela(); }); // clicar fora
  janela.querySelector(".modal-close").addEventListener("click", fecharJanela);
  document.addEventListener("keydown", function (e) {
    if (janela.hidden) return;
    if (e.key === "Escape") fecharJanela();
    // Tab fica "preso" dentro da janela enquanto ela está aberta
    if (e.key === "Tab") {
      const focaveis = janela.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1']), video");
      const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });
}

/* ---------- 3) JOGO DA MEMÓRIA ---------- */
const gradeMemoria = document.getElementById("memoria-grid");
if (gradeMemoria) {
  // 6 pares de cartas, cada um com uma imagem da pasta imagens/memoria/.
  // Para trocar uma figura, troque o arquivo da pasta (mantendo o nome) ou o "arquivo" abaixo.
  const pares = [
    { id: "plantar", arquivo: "imagens/memoria/plantar.jpg", alt: "Crianças plantando uma árvore e guardando uma garrafa no saco" },
    { id: "terra-triste", arquivo: "imagens/memoria/terra-triste.jpg", alt: "Planeta chorando com lixo no mar" },
    { id: "economize", arquivo: "imagens/memoria/economize.jpg", alt: "Planeta pedindo para economizar água e energia" },
    { id: "luz-ligada", arquivo: "imagens/memoria/luz-ligada.jpg", alt: "Quarto com a luz ligada à toa" },
    { id: "animais", arquivo: "imagens/memoria/animais.jpg", alt: "Menina fazendo carinho em um cachorro" },
    { id: "lixo-rua", arquivo: "imagens/memoria/lixo-rua.jpg", alt: "Rua cheia de lixo" }
  ];
  const baralho = embaralhar(pares.concat(pares)); // cada carta aparece 2 vezes
  const placar = document.getElementById("placar");
  const tentativasTexto = document.getElementById("tentativas");
  let viradas = [];        // cartas viradas agora (no máximo 2)
  let paresAchados = 0;
  let tentativas = 0;

  // Carta fechada = folha. Carta aberta = a imagem do par.
  // Tempo (em ms) que as duas cartas erradas ficam abertas antes de desvirar.
  // Dá para ver as figuras e lembrar delas, sem deixar a criança esperando muito.
  const ESPERA_ERRO = 800;
  let travado = false;     // true enquanto as cartas erradas estão desvirando: cliques são ignorados

  function fechar(botao, animar) {
    botao.className = "memory-card clay closed" + (animar ? " desvira" : "");
    botao.setAttribute("aria-label", "Carta fechada");
    botao.innerHTML = ICONES.folha;
  }
  function abrir(botao, carta) {
    botao.className = "memory-card clay open foto";
    botao.setAttribute("aria-label", carta.alt);
    botao.innerHTML = '<img src="' + carta.arquivo + '" alt="' + carta.alt + '">';
  }

  baralho.forEach(function (carta) {
    const botao = document.createElement("button");
    fechar(botao);
    botao.addEventListener("click", function () { virar(botao, carta); });
    gradeMemoria.appendChild(botao);
  });

  function virar(botao, carta) {
    if (travado || viradas.length === 2 || botao.classList.contains("open")) return;
    abrir(botao, carta);
    viradas.push({ botao: botao, carta: carta });
    if (viradas.length === 2) {
      tentativas++;
      tentativasTexto.textContent = "Tentativas: " + tentativas;
      const a = viradas[0], b = viradas[1];
      if (a.carta.id === b.carta.id) {                // achou um par!
        a.botao.classList.add("matched"); b.botao.classList.add("matched");
        viradas = [];
        paresAchados++;
        placar.textContent = "Pares: " + paresAchados + " de 6";
        if (paresAchados === 6) setTimeout(function () { terminarJogo("memoria.html", estrelasPor(6 / tentativas, 1), 6, tentativas); }, 900);
      } else {                                       // errou: as duas tremem e desviram logo depois
        travado = true;
        gradeMemoria.classList.add("esperando");
        // a segunda carta termina de virar (0,35 s) e só então as duas tremem
        setTimeout(function () { a.botao.classList.add("errou"); b.botao.classList.add("errou"); }, 360);
        setTimeout(function () {
          fechar(a.botao, true); fechar(b.botao, true);
          viradas = [];
          travado = false;
          gradeMemoria.classList.remove("esperando");
        }, ESPERA_ERRO);
      }
    }
  }
}

/* ---------- 4) QUIZ ---------- */
const areaQuiz = document.getElementById("quiz-respostas");
if (areaQuiz) {
  // BANCO DE PERGUNTAS: cada vez que o quiz começa, 5 perguntas são sorteadas daqui
  // (e as respostas também mudam de posição). Para criar uma pergunta, copie um bloco:
  //   texto  = a pergunta
  //   certa  = a resposta certa
  //   erradas = as 3 respostas erradas
  //   dica   = a ajuda que aparece só quando a criança clica em "Ver dica"
  const banco = [
    { texto: "Por que é importante desligar a torneira enquanto escovamos os dentes?",
      certa: "Para evitar o desperdício de água potável",
      erradas: ["Para a pasta de dentes fazer mais espuma", "Para a escova de dentes durar mais tempo", "Para o banheiro ficar com um cheiro melhor"],
      dica: "A água limpa que sai da torneira é um recurso precioso que pode acabar." },
    { texto: "O que significa a atitude de 'reciclar' um material?",
      certa: "Transformar o lixo em um novo produto útil",
      erradas: ["Esconder o lixo dentro de caixas de papelão", "Jogar o lixo em um terreno baldio bem longe", "Queimar os resíduos para produzir cinzas"],
      dica: "É dar uma nova vida para algo que iria para o lixo." },
    { texto: "De onde vem a maior parte da energia que acende as lâmpadas e liga a televisão na nossa casa?",
      certa: "Da natureza, através de fontes como sol, vento e água",
      erradas: ["De pilhas gigantes escondidas embaixo da terra", "Do calor gerado pelas estrelas cadentes", "Da fumaça escura que sai das fábricas"],
      dica: "Pense em elementos naturais que geram força e movimento, como rios correndo ou o vento soprando." },
    { texto: "O que é composto orgânico e para que serve a compostagem?",
      certa: "Restos de alimentos que viram adubo rico para as plantas",
      erradas: ["Embalagens de plástico que servem para guardar brinquedos", "Pilhas velhas usadas para consertar relógios", "Vidros quebrados que podem ser usados como cerâmica"],
      dica: "Pense na casca da banana ou da maçã virando comida nutritiva para a terra." },
    { texto: "Qual atitude demonstra respeito pelos parques e praças públicas?",
      certa: "Jogar o lixo na lixeira correta e preservar as plantas",
      erradas: ["Deixar embalagens espalhadas na grama", "Arrancar as flores para levar para casa", "Escrever nomes nos troncos das árvores"],
      dica: "Pense em deixar o lugar tão limpo quanto você o encontrou." },
    { texto: "Qual é a principal consequência do desmatamento das florestas para o planeta?",
      certa: "A perda de habitat para os animais e aumento do gás carbônico",
      erradas: ["O aumento na quantidade de água doce nos rios", "A formação de mais praias de areia branca", "A diminuição da temperatura em todas as cidades"],
      dica: "Pense em quem mora nas florestas e em quem limpa o ar que respiramos." },
    { texto: "Qual é a importância de utilizarmos garrafas retornáveis ou reutilizáveis?",
      certa: "Evitar o acúmulo de plásticos descartáveis na natureza",
      erradas: ["Ajudar a garrafa a crescer mais rápido no jardim", "Impedir que a água evapore de dentro dela", "Fazer com que a água fique com gosto de doce"],
      dica: "Pense em quanto lixo deixamos de produzir quando usamos a mesma garrafa várias vezes." },
    { texto: "O que é um produto biodegradável?",
      certa: "Um material que se decompõe facilmente com a ajuda da natureza",
      erradas: ["Uma embalagem feita de ferro pesado que não enferruja", "Um objeto feito inteiramente de vidro temperado colorido", "Um brinquedo que funciona apenas com pilhas recarregáveis"],
      dica: "É algo que 'desmancha' e vira parte da terra de forma natural sem machucar o meio ambiente." }
  ];
  const QUANTAS = 5;                                   // perguntas por partida
  const perguntas = embaralhar(banco).slice(0, QUANTAS);
  const letras = ["A", "B", "C", "D"];
  let atual = 0, acertos = 0;
  const elTexto = document.getElementById("quiz-pergunta");
  const elNumero = document.getElementById("quiz-numero");
  const elBarra = document.getElementById("quiz-barra");
  const elPontos = document.getElementById("placar");
  const elFeedback = document.getElementById("quiz-feedback");
  const botaoProxima = document.getElementById("quiz-proxima");
  const botaoDica = document.getElementById("quiz-dica-botao");
  const elDica = document.getElementById("quiz-dica");
  const elTito = document.querySelector(".quiz-question-row .mascot");

  botaoDica.addEventListener("click", function () {
    const mostrar = elDica.hidden;                     // se está escondida, vai mostrar
    elDica.hidden = !mostrar;
    botaoDica.setAttribute("aria-expanded", mostrar ? "true" : "false");
    botaoDica.querySelector("span").textContent = mostrar ? "Esconder dica" : "Ver dica";
  });

  function mostrarPergunta() {
    const p = perguntas[atual];
    elTexto.textContent = p.texto;
    elNumero.textContent = "Pergunta " + (atual + 1) + " de " + perguntas.length;
    elBarra.style.width = ((atual + 1) / perguntas.length * 100) + "%";
    elFeedback.textContent = "";
    botaoProxima.hidden = true;
    trocarRosto(elTito, "pensativo");
    // a dica começa escondida em toda pergunta
    elDica.hidden = true; elDica.textContent = p.dica;
    botaoDica.hidden = false; botaoDica.setAttribute("aria-expanded", "false");
    botaoDica.querySelector("span").textContent = "Ver dica";
    // respostas em ordem aleatória, com letras A, B, C, D
    areaQuiz.innerHTML = "";
    embaralhar([p.certa].concat(p.erradas)).forEach(function (resposta, i) {
      const botao = document.createElement("button");
      botao.className = "quiz-option clay";
      botao.innerHTML = '<b class="quiz-letter">' + letras[i] + '</b><span></span>';
      botao.querySelector("span").textContent = resposta;
      botao.addEventListener("click", function () { responder(botao, resposta, p.certa); });
      areaQuiz.appendChild(botao);
    });
  }

  function responder(botao, escolhida, certa) {
    areaQuiz.querySelectorAll("button").forEach(function (b) {
      b.disabled = true;
      if (b.querySelector("span").textContent === certa) b.classList.add("certa"); else b.classList.add("errada");
    });
    if (escolhida === certa) {
      acertos++; elFeedback.textContent = "Muito bem! Resposta certa!"; trocarRosto(elTito, "animado");
    } else {
      elFeedback.textContent = "Quase! Veja a resposta certa em destaque."; trocarRosto(elTito, "triste");
    }
    elPontos.textContent = "Acertos: " + acertos;
    botaoDica.hidden = true; elDica.hidden = true;
    botaoProxima.textContent = (atual === perguntas.length - 1) ? "Ver resultado" : "Próxima";
    botaoProxima.hidden = false;
  }

  botaoProxima.addEventListener("click", function () {
    if (atual === perguntas.length - 1) { terminarJogo("quiz.html", estrelasPor(acertos / perguntas.length), acertos, perguntas.length); return; }
    atual++;
    mostrarPergunta();
  });
  mostrarPergunta();
}

/* ---------- 5) LIXEIRA CERTA ---------- */
const areaLixeiras = document.getElementById("lixeiras");
if (areaLixeiras) {
  // Itens do jogo: desenhos de massinha recortados (SVG, fundo transparente), para parecerem objetos de verdade.
  // O volume vem do filtro "ek-massa" que está no lixeira.html. Cada desenho tem "pistas" do material:
  //   plástico = translúcido/colorido, fino, amassável (garrafa PET com "pétalas" no fundo e selo PET)
  //   vidro    = grosso, rígido, com brilhos fortes e fundo espesso       papel/papelão = folha branca ou papelão pardo
  //   metal    = cinza prateado, com frisos e bordas serrilhadas          orgânico = restos de comida
  // (As fotos antigas continuam na pasta imagens/lixeira/, mas não são mais usadas.)
  const M = ' filter="url(#ek-massa)"';
  const BRILHO = function (x, y, t) {   // estrelinha de brilho (usada no vidro)
    return '<path d="M' + x + " " + (y - t) + "q" + (t * .2) + " " + (t * .8) + " " + t + " " + t + "q-" + (t * .8) + " " + (t * .2) + "-" + t + " " + t + "q-" + (t * .2) + "-" + (t * .8) + "-" + t + "-" + t + "q" + (t * .8) + "-" + (t * .2) + " " + t + "-" + t + 'Z" fill="#fff"/>';
  };
  const SERRILHA = (function () {   // contorno serrilhado da tampinha de metal
    let d = "";
    for (let i = 0; i < 42; i++) { const r = i % 2 ? 36 : 31, a = i / 42 * Math.PI * 2; d += (i ? "L" : "M") + (60 + r * Math.cos(a)).toFixed(1) + " " + (62 + r * Math.sin(a) * .92).toFixed(1); }
    return d + "Z";
  })();
  const DESENHOS = {
    // ---------- PLÁSTICO ----------
    garrafaPet: '<g' + M + '><rect x="50" y="3" width="20" height="12" rx="3" fill="#2f86c6"/><rect x="47" y="14" width="26" height="5" rx="2.5" fill="#2f86c6"/>' +
      '<path d="M53 19h14v8c11 5 16 11 16 20v9c-5 3-5 7 0 10v10c-6 2-6 6 0 9v15c0 6-3 9-7 9h-3l-5-5-5 5-5-5-5 5h-3c-4 0-7-3-7-9V85c6-3 6-7 0-9V66c5-3 5-7 0-10v-9c0-9 5-15 16-20Z" fill="#cfeefa" opacity=".8"/></g>' +
      '<rect x="37" y="60" width="46" height="17" fill="#4fb3e8" opacity=".55"/><text x="60" y="73" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="12" fill="#fff">PET</text>' +
      '<path d="M44 46c-1 8-1 50 0 56" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".85"/><g stroke="#8fcbe6" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M50 50l9 5M70 84l-9 4M48 92l8-3M66 40l6 6"/></g>',
    sacola: '<g' + M + '><path d="M38 42c-3-18 3-28 10-28s9 8 9 16M82 42c3-18-3-28-10-28s-9 8-9 16" fill="none" stroke="#e4ecf4" stroke-width="7" stroke-linecap="round"/><path d="M28 40h64l5 62c0 5-4 8-9 8H32c-5 0-9-3-9-8Z" fill="#f4f8fc"/></g>' +
      '<g stroke="#c5d4e2" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M38 52c7 12 5 26-2 40M76 50c-5 14 1 28 10 38M50 98c8-5 16-5 24 0"/></g><text x="60" y="78" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="9.5" fill="#e03c31">OBRIGADO!</text><path d="M52 62q8 6 16 0" stroke="#e03c31" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
    poteIogurte: '<g' + M + '><path d="M30 42h60l-7 60c-1 5-4 8-9 8H46c-5 0-8-3-9-8Z" fill="#ffffff"/><rect x="24" y="30" width="72" height="15" rx="6" fill="#ff8fb3"/></g>' +
      '<path d="M33 60h54l-2.6 24H35.6Z" fill="#ffd3e1"/><circle cx="60" cy="72" r="8" fill="#e8413b"/><path d="M55 64c3 2 7 2 10 0l-2-4h-6Z" fill="#58b043"/><g fill="#ffe27a"><circle cx="57" cy="71" r="1"/><circle cx="63" cy="73" r="1"/><circle cx="59" cy="76" r="1"/></g>' +
      '<path d="M30 37h60" stroke="#ffc2d6" stroke-width="2.4" stroke-linecap="round"/><path d="M38 50l4 46" stroke="#eef2f5" stroke-width="4" stroke-linecap="round"/>',
    xampu: '<g' + M + '><rect x="56" y="8" width="8" height="10" rx="2" fill="#f2a93b"/><rect x="45" y="16" width="30" height="22" rx="7" fill="#f4b740"/><path d="M36 38h48c4 0 6 3 6 7l-4 56c0 5-4 8-9 8H43c-5 0-9-3-9-8l-4-56c0-4 2-7 6-7Z" fill="#8b5cf6"/></g>' +
      '<rect x="42" y="56" width="36" height="34" rx="9" fill="#ffffff" opacity=".92"/><g fill="#9fd8f5"><circle cx="52" cy="68" r="5"/><circle cx="64" cy="64" r="3.5"/><circle cx="66" cy="77" r="6"/></g><path d="M40 46v52" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>',
    // ---------- PAPEL E PAPELÃO ----------
    jornal: '<g transform="rotate(-8 60 60)"><g' + M + '><rect x="20" y="20" width="84" height="76" rx="5" fill="#e3ddcb"/><rect x="14" y="24" width="84" height="76" rx="5" fill="#f6f2e6"/></g>' +
      '<rect x="22" y="32" width="68" height="10" rx="3" fill="#5b6b66"/><rect x="22" y="48" width="30" height="26" rx="3" fill="#9fc9e0"/><circle cx="44" cy="56" r="4" fill="#ffd23f"/><path d="M24 72l9-9 7 6 6-5 6 8Z" fill="#58b043"/>' +
      '<g stroke="#a3aeaa" stroke-width="3" stroke-linecap="round"><path d="M58 50h32M58 57h32M58 64h32M58 71h24M22 82h68M22 89h56"/></g></g>',
    caixaPapelao: '<g' + M + '><path d="M32 52l4-12h48l4 12Z" fill="#8a5a2b"/><path d="M22 52L10 36h40l12 16Z" fill="#dcab6c"/><path d="M98 52l12-16H70L58 52Z" fill="#d29c5c"/><rect x="22" y="50" width="76" height="58" rx="4" fill="#c8955a"/></g>' +
      '<rect x="54" y="50" width="12" height="58" fill="#e9c98f" opacity=".85"/><g fill="none" stroke="#a8733e" stroke-width="2" stroke-linecap="round"><path d="M12 38q2-3 4 0t4 0 4 0 4 0 4 0 4 0 4 0 4 0M72 38q2-3 4 0t4 0 4 0 4 0 4 0 4 0 4 0 4 0"/></g>' +
      '<g fill="#7a4a1d"><path d="M32 74l5-7 5 7h-3v8h-4v-8Z"/><path d="M80 74l5-7 5 7h-3v8h-4v-8Z"/></g>',
    papelAmassado: '<g' + M + '><path d="M28 54l14-24 24-6 22 10 12 22-4 26-18 16-26 2-18-14-8-18Z" fill="#f1efe6" stroke="#c9ccc4" stroke-width="2.5" stroke-linejoin="round"/></g>' +
      '<g fill="none" stroke-linecap="round"><path d="M34 62c14-4 30 0 48-6M36 78c12 2 28-2 46 2M44 46c10-2 22 0 34-4" stroke="#a9c8ec" stroke-width="2"/><path d="M48 32l-8 66" stroke="#f08a8a" stroke-width="2"/>' +
      '<path d="M42 30l10 26-22-2M66 24l-14 32 28 8M88 34l-10 30 20 4M52 56l-6 30 24 10M80 64l-6 32" stroke="#b9bfc8" stroke-width="2.6"/></g>',
    roloPapelao: '<g' + M + '><rect x="36" y="32" width="48" height="74" rx="6" fill="#c8955a"/><ellipse cx="60" cy="32" rx="24" ry="9" fill="#dcab6c"/></g>' +
      '<ellipse cx="60" cy="32" rx="17" ry="5.5" fill="#7a4a1d"/><g stroke="#a8733e" stroke-width="2.4" stroke-linecap="round"><path d="M37 56l46-14M37 80l46-14M37 104l46-14"/></g>',
    // ---------- VIDRO ----------
    garrafaVidro: '<g' + M + '><rect x="52" y="10" width="16" height="34" rx="4" fill="#2f9a5a"/><rect x="49" y="6" width="22" height="8" rx="3" fill="#237a46"/>' +
      '<path d="M52 40c-12 6-18 14-18 26v38c0 5 4 8 9 8h34c5 0 9-3 9-8V66c0-12-6-20-18-26Z" fill="#46b874" opacity=".9"/></g>' +
      '<rect x="34" y="100" width="52" height="11" rx="5" fill="#1d6b3e" opacity=".6"/><path d="M43 66v32" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".95"/><path d="M50 70v12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M56 15v22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>' + BRILHO(80, 58, 7) + BRILHO(30, 30, 5),
    poteVidro: '<g' + M + '><rect x="28" y="30" width="64" height="78" rx="18" fill="#c9f1e3" opacity=".9"/><rect x="34" y="24" width="52" height="10" rx="4" fill="#9fd8c4"/><rect x="30" y="8" width="60" height="18" rx="6" fill="#d6ad55"/></g>' +
      '<rect x="32" y="96" width="56" height="10" rx="5" fill="#8fd0b8" opacity=".8"/><path d="M40 44v46" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".95"/><path d="M50 40v10" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
      '<g stroke="#b08530" stroke-width="2.4" stroke-linecap="round"><path d="M38 13v8M48 13v8M58 13v8M68 13v8M78 13v8"/></g>' + BRILHO(82, 50, 7),
    copoVidro: '<g' + M + '><path d="M28 22h64l-7 82c-.5 5-4 8-9 8H44c-5 0-8.5-3-9-8Z" fill="#cdeef8" opacity=".9" stroke="#7cc4dc" stroke-width="3" stroke-linejoin="round"/></g>' +
      '<path d="M35 94h50l-1 10c-.5 5-4 8-9 8H45c-5 0-8.5-3-9-8Z" fill="#a9dcee"/><ellipse cx="60" cy="22" rx="32" ry="5" fill="none" stroke="#fff" stroke-width="3"/>' +
      '<g stroke="#93d0e4" stroke-width="2.6" stroke-linecap="round"><path d="M45 28l3 62M60 28v62M75 28l-3 62"/></g><path d="M38 32l5 54" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".95"/>' + BRILHO(84, 40, 7) + BRILHO(26, 70, 5),
    // ---------- METAL ----------
    lata: '<g' + M + '><rect x="34" y="20" width="52" height="84" rx="12" fill="#d93a3a"/><rect x="36" y="12" width="48" height="14" rx="7" fill="#c9d2d6"/><rect x="36" y="98" width="48" height="12" rx="6" fill="#aab6bb"/></g>' +
      '<path d="M34 58c10-8 20 8 30 0s16-8 22-2v14c-6-6-12-6-22 2s-20-8-30 0Z" fill="#fff" opacity=".9"/><rect x="52" y="14" width="16" height="7" rx="3.5" fill="#8a979c"/><path d="M41 32v58" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>',
    lataMilho: '<g' + M + '><rect x="28" y="34" width="64" height="74" rx="8" fill="#c3cdd2"/><ellipse cx="72" cy="20" rx="22" ry="7" fill="#dfe5e8" transform="rotate(-24 72 20)"/></g>' +
      '<ellipse cx="60" cy="35" rx="31" ry="6" fill="#7f8d93"/><path d="M41 31l-2 3 3 1-2 3" stroke="#e8edf0" stroke-width="2" fill="none"/><rect x="28" y="54" width="64" height="34" fill="#58b043"/>' +
      '<ellipse cx="60" cy="71" rx="7" ry="12" fill="#ffd23f"/><path d="M53 80c-6-4-8-12-6-18 4 4 6 10 6 18ZM67 80c6-4 8-12 6-18-4 4-6 10-6 18Z" fill="#a3dc6f"/>' +
      '<g stroke="#9aa8ae" stroke-width="2.2" stroke-linecap="round"><path d="M30 44h60M30 48h60M30 96h60M30 100h60"/></g><path d="M34 56v30" stroke="#fff" stroke-width="3" opacity=".3"/>',
    tampinha: '<g transform="rotate(-10 60 62)"><g' + M + '><path d="' + SERRILHA + '" fill="#b9c4c9"/><ellipse cx="60" cy="62" rx="27" ry="24" fill="#e03c31"/></g>' +
      '<ellipse cx="60" cy="62" rx="20" ry="17.5" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8"/><path d="M60 50l3.5 7.5 8 1-6 5.5 1.5 8-7-4-7 4 1.5-8-6-5.5 8-1Z" fill="#ffd23f"/><path d="M38 46c4-6 10-9 16-10" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/></g>',
    parafusos: '<g transform="rotate(-24 42 60)"><g' + M + '><rect x="25" y="14" width="34" height="13" rx="5" fill="#b8c4c9"/><path d="M36 27h12v58l-6 14-6-14Z" fill="#9fb0b8"/></g><g stroke="#6f8189" stroke-width="2.6" stroke-linecap="round"><path d="M36 38l12-4M36 48l12-4M36 58l12-4M36 68l12-4M36 78l12-4"/></g><path d="M42 16v9" stroke="#6f8189" stroke-width="3" stroke-linecap="round"/></g>' +
      '<g transform="rotate(22 80 62)"><g' + M + '><ellipse cx="80" cy="20" rx="15" ry="6" fill="#c3ced3"/><path d="M76 22h8v70l-4 12-4-12Z" fill="#aab9c0"/></g></g>',
    // ---------- ORGÂNICO ----------
    banana: '<g' + M + '><path d="M57 26C45 42 30 58 20 86c12-2 26-20 36-42Z" fill="#ffd23f"/><path d="M63 26c12 16 28 32 37 60-12-2-26-20-36-42Z" fill="#f4c230"/><path d="M53 24h14c4 26 6 52 2 78H51c-4-26-2-52 2-78Z" fill="#ffe27a"/><rect x="55" y="8" width="10" height="20" rx="4" fill="#8b6b2e"/></g>' +
      '<g fill="#7a5320"><circle cx="22" cy="84" r="3"/><circle cx="98" cy="84" r="3"/><rect x="52" y="98" width="16" height="5" rx="2.5"/></g><path d="M60 34v58" stroke="#fff3b0" stroke-width="3" stroke-linecap="round" opacity=".8"/>',
    ovo: '<g transform="rotate(-18 52 42)"><g' + M + '><path d="M28 50a26 24 0 0 1 52 0l-6.5 6-6.5-6-6.5 6-6.5-6-6.5 6-6.5-6-6.5 6Z" fill="#fbf1e2"/></g></g>' +
      '<g' + M + '><path d="M18 66l8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7 8 7 8-7a42 38 0 0 1-84 0Z" fill="#f4e4cc"/></g><ellipse cx="60" cy="74" rx="34" ry="6" fill="#e2cba8" opacity=".7"/>',
    maca: '<g' + M + '><path d="M38 38c10 3 34 3 44 0-7 10-9 18-5 30 4 12 2 22-2 30-10 3-30 3-40 0-4-8-6-18-2-30 4-12 2-20-5-30Z" fill="#fbe9c4"/>' +
      '<path d="M32 36c0-11 13-18 28-18s28 7 28 18c-9 5-47 5-56 0Z" fill="#e0453a"/><path d="M32 98c9-5 47-5 56 0 0 10-13 15-28 15s-28-5-28-15Z" fill="#e0453a"/></g>' +
      '<rect x="57" y="5" width="6" height="16" rx="3" fill="#8b6b2e"/><path d="M63 12c6-8 16-8 20-3-6 6-14 6-20 3Z" fill="#58b043"/><g fill="#5e3a18"><ellipse cx="56" cy="64" rx="2.6" ry="4.5" transform="rotate(-15 56 64)"/><ellipse cx="64" cy="66" rx="2.6" ry="4.5" transform="rotate(15 64 66)"/></g>' +
      '<path d="M40 26c4-4 10-6 16-6" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".6"/>',
    melancia: '<g transform="translate(0 4)"><g' + M + '><path d="M10 52a50 50 0 0 0 100 0Z" fill="#3f9a37"/></g><path d="M18 52a42 42 0 0 0 84 0Z" fill="#eaf6d2"/>' +
      '<path d="M26 52a34 30 0 0 0 68 0c-5 6-9 5-13 0s-9 6-14 0-9 6-14 0-8 5-14 0Z" fill="#ff6b6b"/><g fill="#2b2b2b"><ellipse cx="46" cy="66" rx="2" ry="3.2"/><ellipse cx="62" cy="72" rx="2" ry="3.2"/><ellipse cx="76" cy="64" rx="2" ry="3.2"/></g>' +
      '<g stroke="#2c7a2a" stroke-width="3" stroke-linecap="round"><path d="M18 74l6-4M34 92l4-6M60 100v-7M86 92l-4-6M102 74l-6-4"/></g></g>'
  };
  function desenhoItem(nome) {
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="114" rx="34" ry="5" fill="#0b2200" opacity=".16"/>' + DESENHOS[nome] + "</svg>";
  }

  // CATÁLOGO DE OBJETOS. Para colocar um objeto novo, copie uma linha e troque:
  //   id      = nome curto, sem espaço e sem acento
  //   desenho = o nome de um desenho da lista DESENHOS (acima)
  //   nome    = o nome que aparece embaixo do objeto (e que o leitor de tela lê)
  //   lixeira = "Papel", "Plástico", "Vidro", "Metal" ou "Orgânico" (igual ao data-lixeira das lixeiras no HTML)
  const itens = [
    { id: "garrafa-pet", desenho: "garrafaPet", nome: "Garrafa PET", lixeira: "Plástico" },
    { id: "sacola", desenho: "sacola", nome: "Sacolinha plástica", lixeira: "Plástico" },
    { id: "pote-iogurte", desenho: "poteIogurte", nome: "Pote de iogurte", lixeira: "Plástico" },
    { id: "xampu", desenho: "xampu", nome: "Frasco de xampu", lixeira: "Plástico" },
    { id: "jornal", desenho: "jornal", nome: "Jornal", lixeira: "Papel" },
    { id: "caixa-papelao", desenho: "caixaPapelao", nome: "Caixa de papelão", lixeira: "Papel" },
    { id: "papel-amassado", desenho: "papelAmassado", nome: "Folha de caderno amassada", lixeira: "Papel" },
    { id: "rolo-papelao", desenho: "roloPapelao", nome: "Rolo de papelão", lixeira: "Papel" },
    { id: "garrafa-vidro", desenho: "garrafaVidro", nome: "Garrafa de vidro", lixeira: "Vidro" },
    { id: "pote-vidro", desenho: "poteVidro", nome: "Pote de vidro", lixeira: "Vidro" },
    { id: "copo-vidro", desenho: "copoVidro", nome: "Copo de vidro", lixeira: "Vidro" },
    { id: "lata-refri", desenho: "lata", nome: "Lata de refrigerante", lixeira: "Metal" },
    { id: "lata-milho", desenho: "lataMilho", nome: "Lata de milho", lixeira: "Metal" },
    { id: "tampinha", desenho: "tampinha", nome: "Tampinha de garrafa", lixeira: "Metal" },
    { id: "prego-parafuso", desenho: "parafusos", nome: "Prego e parafuso", lixeira: "Metal" },
    { id: "banana", desenho: "banana", nome: "Casca de banana", lixeira: "Orgânico" },
    { id: "ovo", desenho: "ovo", nome: "Cascas de ovo", lixeira: "Orgânico" },
    { id: "maca", desenho: "maca", nome: "Restos de maçã", lixeira: "Orgânico" },
    { id: "melancia", desenho: "melancia", nome: "Casca de melancia", lixeira: "Orgânico" }
  ];

  // SORTEIO DE CADA PARTIDA: ITENS_POR_PARTIDA objetos, com pelo menos 1 de cada lixeira e no máximo 2 iguais.
  // Os objetos da partida anterior ficam por último na fila, para a criança ver coisas diferentes.
  const ITENS_POR_PARTIDA = 8;
  const CHAVE_RECENTES = "ecokids-lixeira-recentes";
  function sortearItens() {
    let recentes = [];
    try { recentes = JSON.parse(localStorage.getItem(CHAVE_RECENTES)) || []; } catch (e) {}
    const grupos = {};
    embaralhar(itens).forEach(function (it) { (grupos[it.lixeira] = grupos[it.lixeira] || []).push(it); });
    Object.keys(grupos).forEach(function (g) {   // os que a criança acabou de ver vão para o fim da fila
      grupos[g].sort(function (a, b) { return (recentes.indexOf(a.id) !== -1) - (recentes.indexOf(b.id) !== -1); });
    });
    const escolhidos = [];
    Object.keys(grupos).forEach(function (g) { escolhidos.push(grupos[g].shift()); });          // 1 de cada lixeira
    const extras = embaralhar(Object.keys(grupos).filter(function (g) { return grupos[g].length; }));
    for (let i = 0; escolhidos.length < ITENS_POR_PARTIDA && i < extras.length; i++) escolhidos.push(grupos[extras[i]].shift());   // completa sem repetir lixeira
    // mistura evitando duas lixeiras iguais seguidas
    let ordem = embaralhar(escolhidos);
    for (let t = 0; t < 30 && ordem.some(function (it, i) { return i && it.lixeira === ordem[i - 1].lixeira; }); t++) ordem = embaralhar(escolhidos);
    try { localStorage.setItem(CHAVE_RECENTES, JSON.stringify(ordem.map(function (it) { return it.id; }))); } catch (e) {}
    return ordem;
  }
  const sorteados = sortearItens();
  // Pontuação (igual a antes): conta acerto quando a criança acerta a lixeira na PRIMEIRA tentativa.
  // Se errar, ela pode tentar de novo até acertar, mas aquele item não conta como acerto.
  let rodada = 0, acertos = 0, travado = false, primeiraTentativa = true;
  const elItem = document.getElementById("item-imagem");
  const elDica = document.getElementById("item-dica");
  const elNome = document.getElementById("item-nome");
  const elPlacar = document.getElementById("placar");
  const elTitoLixeira = document.querySelector(".trash-prompt-row .mascot");
  const lixeiras = areaLixeiras.querySelectorAll(".big-bin-option");

  function mostrarItem() {
    trocarRosto(elTitoLixeira, "curioso");
    const item = sorteados[rodada];
    elItem.innerHTML = desenhoItem(item.desenho);
    elItem.setAttribute("aria-label", item.nome);
    if (elNome) elNome.textContent = item.nome;
    elItem.className = "item-imagem item-arrastavel";
    elItem.style.transform = "";
    desloc = { x: 0, y: 0 };
    elDica.className = "";
    elDica.textContent = "";
    lixeiras.forEach(function (b) { b.classList.remove("tentou", "certa", "errada", "alvo"); });
    primeiraTentativa = true;
    travado = false;
  }

  // A criança escolheu uma lixeira (soltando o item nela ou tocando/clicando na lixeira)
  function responder(botao, soltouNaLixeira) {
    if (travado || botao.classList.contains("tentou")) return;
    const certa = sorteados[rodada].lixeira;
    if (botao.dataset.lixeira === certa) {
      travado = true;
      if (primeiraTentativa) { acertos++; elPlacar.textContent = "Acertos: " + acertos; }
      elDica.className = "certo"; elDica.textContent = "Isso! É a lixeira de " + certa.toLowerCase() + "!";
      trocarRosto(elTitoLixeira, "animado");
      botao.classList.add("certa");
      // o item "voa" para dentro da lixeira (sai de onde está agora e encolhe na boca da lixeira)
      const ri = elItem.getBoundingClientRect(), rb = botao.getBoundingClientRect();
      const base = soltouNaLixeira ? desloc : { x: 0, y: 0 };
      const destinoX = base.x + (rb.left + rb.width / 2) - (ri.left + ri.width / 2);
      const destinoY = base.y + (rb.top + rb.height * .3) - (ri.top + ri.height / 2);
      elItem.classList.remove("arrastando");
      elItem.classList.add("entrando");
      requestAnimationFrame(function () { elItem.style.transform = "translate(" + destinoX + "px, " + destinoY + "px) scale(.2)"; });
      setTimeout(function () {
        rodada++;
        if (rodada === sorteados.length) { terminarJogo("lixeira.html", estrelasPor(acertos / sorteados.length), acertos, sorteados.length); } else { mostrarItem(); }
      }, 1100);
    } else {
      primeiraTentativa = false;
      elDica.className = "errado";
      elDica.textContent = "Ops! Não é a de " + botao.dataset.lixeira.toLowerCase() + ". Tente outra!";
      void elDica.offsetWidth;   // reinicia a animação de "tremer" se a criança errar de novo
      trocarRosto(elTitoLixeira, "triste");
      botao.classList.add("errada", "tentou");
      setTimeout(function () { botao.classList.remove("errada"); }, 450);
      voltarItem();
    }
  }

  // Jeito 1: tocar/clicar na lixeira (também funciona com o teclado)
  lixeiras.forEach(function (botao) {
    botao.addEventListener("click", function () { responder(botao, false); });
  });

  // Jeito 2: arrastar o item com o mouse ou com o dedo e soltar dentro da lixeira
  let arraste = null;
  let desloc = { x: 0, y: 0 };   // quanto o item já foi arrastado
  function voltarItem() {
    desloc = { x: 0, y: 0 };
    elItem.classList.remove("arrastando");
    elItem.classList.add("voltando");
    elItem.style.transform = "";
    setTimeout(function () { elItem.classList.remove("voltando"); }, 300);
  }
  function lixeiraEm(x, y) {
    const sob = document.elementFromPoint(x, y);
    return sob && sob.closest ? sob.closest(".big-bin-option") : null;
  }
  elItem.addEventListener("pointerdown", function (e) {
    if (travado || e.button > 0) return;
    e.preventDefault();
    arraste = { id: e.pointerId, x0: e.clientX, y0: e.clientY, alvo: null };
    try { elItem.setPointerCapture(e.pointerId); } catch (erro) {}   // o item continua "preso" ao dedo/mouse
    elItem.classList.remove("voltando");
    elItem.classList.add("arrastando");
    trocarRosto(elTitoLixeira, "curioso");
  });
  window.addEventListener("pointermove", function (e) {
    if (!arraste || e.pointerId !== arraste.id) return;
    e.preventDefault();
    desloc = { x: e.clientX - arraste.x0, y: e.clientY - arraste.y0 };
    elItem.style.transform = "translate(" + desloc.x + "px, " + desloc.y + "px) scale(1.08) rotate(-4deg)";
    let alvo = lixeiraEm(e.clientX, e.clientY);
    if (alvo && alvo.classList.contains("tentou")) alvo = null;
    if (alvo !== arraste.alvo) {
      if (arraste.alvo) arraste.alvo.classList.remove("alvo");
      if (alvo) alvo.classList.add("alvo");
      arraste.alvo = alvo;
    }
  }, { passive: false });
  function soltarItem(e, cancelou) {
    if (!arraste || e.pointerId !== arraste.id) return;
    const alvo = cancelou ? null : (arraste.alvo || lixeiraEm(e.clientX, e.clientY));
    if (arraste.alvo) arraste.alvo.classList.remove("alvo");
    arraste = null;
    if (alvo && !alvo.classList.contains("tentou")) responder(alvo, true);
    else voltarItem();
  }
  window.addEventListener("pointerup", function (e) { soltarItem(e, false); });
  window.addEventListener("pointercancel", function (e) { soltarItem(e, true); });
  mostrarItem();
}

/* ---------- 6) QUEBRA-CABEÇA ---------- */
const tabuleiro = document.getElementById("tabuleiro");
if (tabuleiro) {
  // FIGURAS DO QUEBRA-CABEÇA: a criança escolhe qual quer montar na tela de seleção.
  // Para colocar uma figura nova: salve a imagem na pasta imagens/ e copie uma linha abaixo, trocando:
  //   id      = nome curto, sem espaço e sem acento (serve para lembrar quais a criança já montou)
  //   nome    = o nome que aparece no cartão
  //   arquivo = o caminho da imagem. Pode ser de qualquer tamanho: se não for quadrada,
  //             o jogo usa só o meio dela (sem esticar). O ideal é uma imagem quadrada de 900 x 900.
  //   miniatura = (opcional) uma versão pequena (320 x 320, WebP) só para o cartão da tela de seleção,
  //             para a tela abrir rápido. Sem ela, o cartão usa a imagem grande.
  const figuras = [
    { id: "planeta", nome: "Planeta feliz", arquivo: "imagens/quebra-cabeca-1-quadrado.webp", miniatura: "imagens/quebra-cabeca-1-mini.webp" },
    { id: "cuidar", nome: "Vamos cuidar do planeta", arquivo: "imagens/quebra-cabeca-2-quadrado.webp", miniatura: "imagens/quebra-cabeca-2-mini.webp" },
    { id: "paisagem", nome: "Natureza em harmonia", arquivo: "imagens/quebra-cabeca-3-grande.webp", miniatura: "imagens/quebra-cabeca-3-mini.webp" }
  ];
  const COLUNAS = 3, LINHAS = 3;   // todas as figuras têm o mesmo tamanho: 3 x 3 = 9 peças
  const total = COLUNAS * LINHAS;

  // O navegador lembra quais figuras a criança já montou, só para mostrar o selo "Já montou!"
  // (ela pode montar a mesma figura quantas vezes quiser).
  const CHAVE = "ecokids-quebra-montadas";
  function lerMontadas() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { return []; }
  }
  function marcarMontada(id) {
    const lista = lerMontadas();
    if (lista.indexOf(id) === -1) lista.push(id);
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {}
  }

  const placarPecas = document.getElementById("placar");
  const telaEscolha = document.getElementById("escolha-figura");
  const listaFiguras = document.getElementById("lista-figuras");
  const layoutJogo = document.getElementById("layout-quebra");
  const modelo = document.getElementById("modelo");

  // Estado da partida (começa de novo a cada figura escolhida)
  let figura = null;
  let recorte = null;      // onde fica o quadrado do meio da imagem (para imagens que não são quadradas)
  let ordem = [];          // "ordem[i]" diz qual pedaço da imagem está na posição i. Certo = [0,1,2,...]
  let selecionada = null;
  let trocas = 0;          // quantas trocas a criança fez (usado nas estrelas)
  let terminou = false;

  // Tela de seleção: um cartão para cada figura
  function mostrarEscolha() {
    const montadas = lerMontadas();
    listaFiguras.innerHTML = "";
    figuras.forEach(function (f) {
      const cartao = document.createElement("button");
      cartao.type = "button";
      cartao.className = "figure-card";
      cartao.innerHTML = '<span class="figure-thumb"><img src="' + (f.miniatura || f.arquivo) + '" alt="" width="320" height="320" loading="lazy"></span>' +
        "<strong></strong><small>" + total + " peças</small>" +
        (montadas.indexOf(f.id) !== -1 ? '<span class="figure-done">Já montou!</span>' : "");
      cartao.querySelector("strong").textContent = f.nome;
      cartao.setAttribute("aria-label", "Montar " + f.nome + (montadas.indexOf(f.id) !== -1 ? " (você já montou esta)" : ""));
      cartao.addEventListener("click", function () { comecar(f); });
      listaFiguras.appendChild(cartao);
    });
    layoutJogo.hidden = true;
    telaEscolha.hidden = false;
    placarPecas.textContent = "Escolha uma figura";
  }

  // Começa a montar a figura escolhida
  function comecar(f) {
    figura = f;
    const img = new Image();
    img.onload = function () { recorte = { w: img.naturalWidth, h: img.naturalHeight }; iniciarPartida(); };
    img.onerror = function () { recorte = { w: 1, h: 1 }; iniciarPartida(); };   // sem as medidas: trata como quadrada
    img.src = f.arquivo;
  }
  function iniciarPartida() {
    modelo.src = figura.arquivo;
    modelo.alt = "Modelo da figura: " + figura.nome;
    const certo = [];
    for (let i = 0; i < total; i++) certo.push(i);
    ordem = embaralhar(certo);
    while (ordem.every(function (n, i) { return n === i; })) ordem = embaralhar(ordem); // nunca começa pronto
    selecionada = null; trocas = 0; terminou = false;
    telaEscolha.hidden = true;
    layoutJogo.hidden = false;
    desenhar();
    if (tabuleiro.children[0]) tabuleiro.children[0].focus({ preventScroll: true });
  }
  document.getElementById("trocar-figura").addEventListener("click", function () { if (!terminou) mostrarEscolha(); });

  // Qual parte da imagem cada peça mostra. Usa só o quadrado do meio da imagem
  // (numa imagem quadrada, é a imagem toda), dividido em COLUNAS x LINHAS.
  function fundoDaPeca(pedaco) {
    const lado = Math.min(recorte.w, recorte.h);
    const larg = recorte.w / lado * COLUNAS, alt = recorte.h / lado * LINHAS;    // tamanho da imagem, medido em "peças"
    const sobraX = (recorte.w - lado) / 2 / lado * COLUNAS, sobraY = (recorte.h - lado) / 2 / lado * LINHAS;
    const col = pedaco % COLUNAS, lin = Math.floor(pedaco / COLUNAS);
    return {
      tamanho: (larg * 100) + "% " + (alt * 100) + "%",
      posicao: ((sobraX + col) / (larg - 1) * 100) + "% " + ((sobraY + lin) / (alt - 1) * 100) + "%"
    };
  }

  function desenhar() {
    tabuleiro.innerHTML = "";
    let certas = 0;
    ordem.forEach(function (pedaco, posicao) {
      if (pedaco === posicao) certas++;
      const botao = document.createElement("button");
      botao.className = "puzzle-piece" + (selecionada === posicao ? " selected" : "");
      botao.setAttribute("aria-label", "Peça " + (posicao + 1));
      // mostra só o pedaço certo da imagem (coluna e linha dentro da grade)
      const fundo = fundoDaPeca(pedaco);
      botao.style.backgroundImage = 'url("' + figura.arquivo + '")';
      botao.style.backgroundSize = fundo.tamanho;
      botao.style.backgroundPosition = fundo.posicao;
      botao.addEventListener("click", function () { clicar(posicao); });
      tabuleiro.appendChild(botao);
    });
    placarPecas.textContent = "Peças certas: " + certas + " de " + total;
    return certas;
  }

  let ignorarClique = false;   // o "clique" que o navegador manda logo depois de um arraste não conta

  // Troca duas peças de lugar (vale para o clique e para o arraste: cada troca conta 1 nas estrelas)
  function trocar(de, para) {
    const temp = ordem[de];
    ordem[de] = ordem[para];
    ordem[para] = temp;
    selecionada = null;
    trocas++;
    const certasAgora = desenhar();
    // as peças são redesenhadas: devolve o foco do teclado para a peça que foi tocada
    const peca = tabuleiro.children[para];
    if (peca) { peca.focus({ preventScroll: true }); peca.classList.add("encaixou"); }
    if (certasAgora === total) {
      terminou = true;
      marcarMontada(figura.id);
      // quanto menos trocas, mais estrelas (com folga: 1,3 troca por peça já dá 5 estrelas)
      const estrelas = estrelasPor(total * 1.3 / trocas, 1);
      setTimeout(function () { terminarJogo("quebra-cabeca.html", estrelas, total, trocas); }, 900);
    }
  }

  // Jeito 1 (clique, toque ou teclado): escolhe uma peça e depois a outra
  function clicar(posicao) {
    if (terminou || ignorarClique) return;
    if (selecionada === null || selecionada === posicao) {
      selecionada = selecionada === posicao ? null : posicao;   // tocar de novo na mesma peça cancela
      desenhar();
      if (tabuleiro.children[posicao]) tabuleiro.children[posicao].focus({ preventScroll: true });
      return;
    }
    trocar(selecionada, posicao);   // segunda peça escolhida: troca as duas de lugar
  }

  // Jeito 2 (arrastar e soltar, com mouse ou dedo): uma cópia da peça segue o ponteiro;
  // a peça que está embaixo fica destacada e, ao soltar, as duas trocam de lugar.
  let arraste = null;
  function posicaoDe(peca) { return Array.prototype.indexOf.call(tabuleiro.children, peca); }
  function limparAlvo() { if (arraste && arraste.alvo) arraste.alvo.classList.remove("alvo"); }

  tabuleiro.addEventListener("pointerdown", function (e) {
    const peca = e.target.closest(".puzzle-piece");
    if (!peca || terminou || e.button > 0) return;
    arraste = { id: e.pointerId, peca: peca, de: posicaoDe(peca), x0: e.clientX, y0: e.clientY, fantasma: null, alvo: null };
  });
  window.addEventListener("pointermove", function (e) {
    if (!arraste || e.pointerId !== arraste.id) return;
    const dx = e.clientX - arraste.x0, dy = e.clientY - arraste.y0;
    if (!arraste.fantasma) {
      if (Math.hypot(dx, dy) < 8) return;   // mexeu pouquinho: ainda é um toque
      const r = arraste.peca.getBoundingClientRect();
      const f = arraste.peca.cloneNode(false);
      f.className = "puzzle-piece fantasma";
      f.removeAttribute("aria-label"); f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
      f.style.left = r.left + "px"; f.style.top = r.top + "px";
      f.style.width = r.width + "px"; f.style.height = r.height + "px";
      document.body.appendChild(f);
      arraste.fantasma = f;
      arraste.peca.classList.add("origem");
      if (selecionada !== null) { selecionada = null; tabuleiro.querySelectorAll(".selected").forEach(function (p) { p.classList.remove("selected"); }); }
    }
    e.preventDefault();
    arraste.fantasma.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.08) rotate(3deg)";
    const sob = document.elementFromPoint(e.clientX, e.clientY);
    let alvo = sob && sob.closest ? sob.closest(".puzzle-piece") : null;
    if (alvo && (alvo.parentNode !== tabuleiro || alvo === arraste.peca)) alvo = null;
    if (alvo !== arraste.alvo) { limparAlvo(); if (alvo) alvo.classList.add("alvo"); arraste.alvo = alvo; }
  }, { passive: false });
  function soltar(e, cancelou) {
    if (!arraste || e.pointerId !== arraste.id) return;
    const a = arraste; limparAlvo(); arraste = null;
    if (!a.fantasma) return;                       // não arrastou: o clique normal cuida
    ignorarClique = true; setTimeout(function () { ignorarClique = false; }, 80);
    if (!cancelou && a.alvo) { a.fantasma.remove(); trocar(a.de, posicaoDe(a.alvo)); return; }
    // soltou fora do tabuleiro: a peça volta suavemente para o lugar
    a.fantasma.classList.add("voltando");
    a.fantasma.style.transform = "translate(0, 0)";
    setTimeout(function () { a.fantasma.remove(); a.peca.classList.remove("origem"); }, 260);
  }
  window.addEventListener("pointerup", function (e) { soltar(e, false); });
  window.addEventListener("pointercancel", function (e) { soltar(e, true); });
  mostrarEscolha();   // ao entrar no jogo, a criança primeiro escolhe a figura
}

/* ---------- 8) CAÇA-PALAVRAS ---------- */
const gradeLetras = document.getElementById("grade-letras");
if (gradeLetras) {
  // Palavras possíveis (sem acento), todas ensinadas na página Aprenda. A cada partida, 6 delas são sorteadas.
  // Pode acrescentar palavras: use só letras de A a Z e no máximo 10 letras.
  const BANCO = [
    "RECICLAR", "PREGO", "LIXO", "LIXEIRA", "PAPEL", "JORNAL", "PLASTICO", "VIDRO", "METAL", "LATA", "GARRAFA", "SACOLA",
    "ORGANICO", "COMPOSTO", "ADUBO", "AGUA", "TORNEIRA", "BANHO", "CHUVA", "RIO", "ENERGIA", "TOMADA", "LAMPADA", "SOL",
    "VENTO", "PLANTA", "ARVORE", "FLORESTA", "PARQUE", "SOMBRA", "BICHOS", "NATUREZA"
  ];   // 32 palavras; cada partida sorteia 6
  const TAM = 10;            // grade de 10 x 10
  const QUANTAS_PALAVRAS = 6;

  // Direções das palavras: sempre no sentido de leitura, para ficar fácil para as crianças.
  //   h = para a direita →   v = para baixo ↓   d = na diagonal, descendo para a direita ↘
  const DIRECOES = { h: [0, 1], v: [1, 0], d: [1, 1] };
  const QUANTAS_DIAGONAIS = 2;   // em cada partida, 2 das 6 palavras ficam na diagonal

  // Tenta colocar todas as palavras. Se não couber, sorteia de novo.
  function montarGrade() {
    for (let tentativa = 0; tentativa < 200; tentativa++) {
      const escolhidas = embaralhar(BANCO).slice(0, QUANTAS_PALAVRAS).sort(function (x, y) { return y.length - x.length; });
      const diagonais = embaralhar(escolhidas.map(function (p, i) { return i; })).slice(0, QUANTAS_DIAGONAIS);
      const grade = [];
      for (let l = 0; l < TAM; l++) grade.push(new Array(TAM).fill(""));
      let deuCerto = true;
      escolhidas.forEach(function (palavra, idx) {
        if (!deuCerto) return;
        let colocou = false;
        for (let k = 0; k < 300 && !colocou; k++) {
          const dir = diagonais.indexOf(idx) !== -1 ? "d" : (Math.random() < 0.5 ? "h" : "v");
          const dl = DIRECOES[dir][0], dc = DIRECOES[dir][1];
          const l = Math.floor(Math.random() * (TAM - dl * (palavra.length - 1)));
          const c = Math.floor(Math.random() * (TAM - dc * (palavra.length - 1)));
          let cabe = true;
          for (let i = 0; i < palavra.length; i++) {
            const atual = grade[l + dl * i][c + dc * i];
            if (atual !== "" && atual !== palavra[i]) { cabe = false; break; }
          }
          if (!cabe) continue;
          for (let i = 0; i < palavra.length; i++) grade[l + dl * i][c + dc * i] = palavra[i];
          colocou = true;
        }
        if (!colocou) deuCerto = false;
      });
      if (deuCerto) return { grade: grade, palavras: escolhidas };
    }
  }

  const jogoCaca = montarGrade();
  const LETRAS = "ABCDEFGHIJLMNOPRSTUVX";
  for (let l = 0; l < TAM; l++) for (let c = 0; c < TAM; c++) {
    if (jogoCaca.grade[l][c] === "") jogoCaca.grade[l][c] = LETRAS[Math.floor(Math.random() * LETRAS.length)];
  }

  const placarCaca = document.getElementById("placar");
  const listaPalavras = document.getElementById("lista-palavras");
  const dicaToque = listaPalavras.querySelector(".words-tip");
  const itensLista = {};
  jogoCaca.palavras.slice().sort().forEach(function (palavra) {
    const item = document.createElement("span");
    item.textContent = palavra;
    listaPalavras.insertBefore(item, dicaToque);
    itensLista[palavra] = item;
  });

  const botoesLetras = [];
  let inicio = null, achadas = 0, erros = 0, terminou = false;

  function limparSelecao() { gradeLetras.querySelectorAll(".sel").forEach(function (b) { b.classList.remove("sel"); }); inicio = null; }

  // Jeito 1 (toque, clique ou teclado): toca na primeira letra e depois na última
  function clicarLetra(l, c) {
    if (terminou) return;
    if (inicio === null) { inicio = { l: l, c: c }; botoesLetras[l][c].classList.add("sel"); return; }
    if (inicio.l === l && inicio.c === c) { limparSelecao(); return; }     // clicou de novo: cancela
    const emLinha = inicio.l === l || inicio.c === c || Math.abs(l - inicio.l) === Math.abs(c - inicio.c);
    if (!emLinha) {                                                           // fora de linha/coluna/diagonal: vira o novo começo
      limparSelecao(); inicio = { l: l, c: c }; botoesLetras[l][c].classList.add("sel"); return;
    }
    // monta as letras do começo até o fim (em linha reta: horizontal, vertical ou diagonal)
    const passoL = Math.sign(l - inicio.l), passoC = Math.sign(c - inicio.c);
    const celulas = [];
    let x = inicio.l, y = inicio.c;
    while (true) { celulas.push([x, y]); if (x === l && y === c) break; x += passoL; y += passoC; }
    avaliar(celulas);
  }

  // Confere se as letras escolhidas formam uma das palavras (de frente para trás ou de trás para frente)
  function avaliar(celulas) {
    const texto = celulas.map(function (p) { return jogoCaca.grade[p[0]][p[1]]; }).join("");
    const inverso = texto.split("").reverse().join("");
    const achou = jogoCaca.palavras.filter(function (p) { return !itensLista[p].classList.contains("done") && (p === texto || p === inverso); })[0];
    if (achou) {
      celulas.forEach(function (p) { botoesLetras[p[0]][p[1]].classList.add("found"); });
      itensLista[achou].classList.add("done");
      achadas++;
      placarCaca.textContent = "Achadas: " + achadas + " de " + jogoCaca.palavras.length;
      limparSelecao();
      if (achadas === jogoCaca.palavras.length) {
        terminou = true;
        const est = estrelasPor(jogoCaca.palavras.length / (jogoCaca.palavras.length + erros), 1);
        setTimeout(function () { terminarJogo("caca-palavras.html", est, jogoCaca.palavras.length, erros); }, 900);
      }
    } else {
      erros++;
      celulas.forEach(function (p) { botoesLetras[p[0]][p[1]].classList.add("erro"); });
      limparSelecao();
      setTimeout(function () { gradeLetras.querySelectorAll(".erro").forEach(function (b) { b.classList.remove("erro"); }); }, 500);
    }
  }

  for (let l = 0; l < TAM; l++) {
    botoesLetras.push([]);
    for (let c = 0; c < TAM; c++) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "letter";
      botao.textContent = jogoCaca.grade[l][c];
      botao.dataset.l = l; botao.dataset.c = c;
      botao.addEventListener("click", function () { if (!ignorarClique) clicarLetra(l, c); });
      gradeLetras.appendChild(botao);
      botoesLetras[l].push(botao);
    }
  }

  // Jeito 2 (arrastar com o mouse ou o dedo): da primeira até a última letra.
  // O caminho "gruda" na linha reta mais próxima (horizontal, vertical ou diagonal), e as letras ficam destacadas.
  let arrasto = null;
  let ignorarClique = false;   // o "clique" que o navegador manda logo depois de um arraste não conta
  function letraEm(x, y) {
    const el = document.elementFromPoint(x, y);
    const b = el && el.closest ? el.closest(".letter") : null;
    return b && b.parentNode === gradeLetras ? { l: +b.dataset.l, c: +b.dataset.c } : null;
  }
  function caminho(a, b) {
    const dl = b.l - a.l, dc = b.c - a.c;
    const oitavo = Math.round(Math.atan2(dl, dc) / (Math.PI / 4));   // uma das 8 direções
    const sl = Math.round(Math.sin(oitavo * Math.PI / 4)), sc = Math.round(Math.cos(oitavo * Math.PI / 4));
    let n = Math.max(Math.abs(dl), Math.abs(dc));
    while (n > 0 && (a.l + sl * n < 0 || a.l + sl * n >= TAM || a.c + sc * n < 0 || a.c + sc * n >= TAM)) n--;   // não sai da grade
    const celulas = [];
    for (let i = 0; i <= n; i++) celulas.push([a.l + sl * i, a.c + sc * i]);
    return celulas;
  }
  gradeLetras.addEventListener("pointerdown", function (e) {
    if (terminou || e.button > 0) return;
    const cel = letraEm(e.clientX, e.clientY);
    if (cel) arrasto = { id: e.pointerId, inicio: cel, moveu: false, celulas: [] };
  });
  window.addEventListener("pointermove", function (e) {
    if (!arrasto || e.pointerId !== arrasto.id) return;
    const cel = letraEm(e.clientX, e.clientY);
    if (!cel) return;
    if (!arrasto.moveu) {
      if (cel.l === arrasto.inicio.l && cel.c === arrasto.inicio.c) return;   // ainda na primeira letra
      arrasto.moveu = true;
      limparSelecao();   // começou a arrastar: esquece uma letra que estava marcada pelo toque
    }
    e.preventDefault();
    gradeLetras.querySelectorAll(".sel").forEach(function (b) { b.classList.remove("sel"); });
    arrasto.celulas = caminho(arrasto.inicio, cel);
    arrasto.celulas.forEach(function (p) { botoesLetras[p[0]][p[1]].classList.add("sel"); });
  }, { passive: false });
  function soltarArrasto(e, cancelou) {
    if (!arrasto || e.pointerId !== arrasto.id) return;
    const a = arrasto; arrasto = null;
    if (!a.moveu) return;                       // não arrastou: o toque normal (clique) cuida
    ignorarClique = true; setTimeout(function () { ignorarClique = false; }, 80);
    if (!cancelou && a.celulas.length >= 2) avaliar(a.celulas); else limparSelecao();
  }
  window.addEventListener("pointerup", function (e) { soltarArrasto(e, false); });
  window.addEventListener("pointercancel", function (e) { soltarArrasto(e, true); });
}

/* ---------- 9) PALAVRAS CRUZADAS ---------- */
const areaCruzadas = document.getElementById("cruzadas");
if (areaCruzadas) {
  // CRUZADINHAS: são 3 opções, e uma delas é sorteada cada vez que o jogo abre (sem repetir até passar pelas 3).
  // Cada palavra: dir = "h" (→) ou "v" (↓), l/c = linha e coluna da primeira letra (contando de 0).
  // Os números das dicas são calculados sozinhos. Se mudar uma palavra, confira os cruzamentos.
  const CRUZADINHAS = [
    { tema: "Lixo e reciclagem", linhas: 9, colunas: 8, palavras: [
      { dir: "h", l: 4, c: 0, resposta: "PLASTICO", dica: "Garrafa PET e sacola são feitas disso." },
      { dir: "v", l: 3, c: 2, resposta: "SACOLA", dica: "Serve para levar as compras. Pode ser de plástico." },
      { dir: "v", l: 0, c: 5, resposta: "LIXEIRA", dica: "Onde jogamos o lixo. Ela tem várias cores!" },
      { dir: "h", l: 6, c: 4, resposta: "LATA", dica: "Embalagem de refrigerante. Vai na lixeira amarela." },
      { dir: "v", l: 4, c: 0, resposta: "PAPEL", dica: "Jornal e caderno são feitos disso." },
      { dir: "v", l: 0, c: 7, resposta: "VIDRO", dica: "Garrafa e pote de conserva são feitos disso." },
      { dir: "h", l: 8, c: 2, resposta: "ADUBO", dica: "Restos de comida viram isso para as plantas." },
      { dir: "h", l: 0, c: 1, resposta: "METAL", dica: "Lata e tampinha são feitas disso." }
    ] },
    { tema: "Água e energia", linhas: 9, colunas: 7, palavras: [
      { dir: "v", l: 2, c: 2, resposta: "BANHO", dica: "Se for curto, gasta menos água." },
      { dir: "h", l: 4, c: 0, resposta: "VENTO", dica: "Ele faz as hélices girarem e gera energia." },
      { dir: "h", l: 6, c: 1, resposta: "TOMADA", dica: "Tire o aparelho dela quando não usar." },
      { dir: "v", l: 2, c: 6, resposta: "LAMPADA", dica: "A do tipo LED gasta menos energia." },
      { dir: "h", l: 8, c: 0, resposta: "ENERGIA", dica: "A luz de casa vem dela. Use só o necessário." },
      { dir: "v", l: 1, c: 0, resposta: "CHUVA", dica: "Cai das nuvens e ajuda a regar as plantas." },
      { dir: "h", l: 2, c: 4, resposta: "SOL", dica: "De dia, a luz dele entra pela janela." },
      { dir: "v", l: 0, c: 5, resposta: "RIO", dica: "Lixo no chão vai parar nele e no mar." }
    ] },
    { tema: "Natureza", linhas: 9, colunas: 8, palavras: [
      { dir: "v", l: 1, c: 3, resposta: "BICHOS", dica: "Os animais. Observe de longe e não alimente." },
      { dir: "h", l: 5, c: 0, resposta: "ARVORE", dica: "Dá sombra, ar limpo e casa para os bichos." },
      { dir: "v", l: 3, c: 1, resposta: "PARQUE", dica: "Lugar público para brincar. Deixe limpo!" },
      { dir: "h", l: 3, c: 3, resposta: "CHUVA", dica: "Cai das nuvens e ajuda a regar as plantas." },
      { dir: "v", l: 0, c: 5, resposta: "NATUREZA", dica: "Plantas, animais e rios fazem parte dela." },
      { dir: "h", l: 7, c: 4, resposta: "MAR", dica: "Lixo jogado no chão pode chegar até ele." },
      { dir: "h", l: 1, c: 0, resposta: "SOMBRA", dica: "A árvore dá ela num dia quente." },
      { dir: "v", l: 1, c: 7, resposta: "PLANTA", dica: "Precisa de água e de cuidado." }
    ] }
  ];

  const CHAVE_CRUZ = "ecokids-cruzadinhas";
  function escolherCruzadinha() {
    let vistas = [];
    try { vistas = JSON.parse(localStorage.getItem(CHAVE_CRUZ)) || []; } catch (e) {}
    let faltam = CRUZADINHAS.map(function (x, i) { return i; }).filter(function (i) { return vistas.indexOf(i) === -1; });
    if (faltam.length === 0) {                        // passou pelas 3: recomeça, sem repetir a última
      const ultima = vistas[vistas.length - 1];
      vistas = [];
      faltam = CRUZADINHAS.map(function (x, i) { return i; }).filter(function (i) { return i !== ultima; });
    }
    const escolhida = faltam[Math.floor(Math.random() * faltam.length)];
    vistas.push(escolhida);
    try { localStorage.setItem(CHAVE_CRUZ, JSON.stringify(vistas)); } catch (e) {}
    return CRUZADINHAS[escolhida];
  }
  const cruzadinha = escolherCruzadinha();
  const LINHAS = cruzadinha.linhas, COLUNAS = cruzadinha.colunas;
  const palavras = cruzadinha.palavras;
  areaCruzadas.style.gridTemplateColumns = "repeat(" + COLUNAS + ", 1fr)";
  document.getElementById("cruz-tema").textContent = "Tema: " + cruzadinha.tema;

  // Numera as dicas na ordem de leitura (linha a linha); palavras que começam na mesma casa dividem o número
  const inicios = [];
  palavras.forEach(function (p) {
    if (!inicios.some(function (x) { return x.l === p.l && x.c === p.c; })) inicios.push({ l: p.l, c: p.c });
  });
  inicios.sort(function (x, y) { return x.l - y.l || x.c - y.c; });
  palavras.forEach(function (p) { p.n = 1 + inicios.findIndex(function (x) { return x.l === p.l && x.c === p.c; }); });
  palavras.sort(function (x, y) { return x.n - y.n || (x.dir === "h" ? -1 : 1); });

  // Mapa das casas: "linha,coluna" -> { letra certa, palavras que passam ali }
  const casas = {};
  palavras.forEach(function (p, idx) {
    for (let i = 0; i < p.resposta.length; i++) {
      const l = p.l + (p.dir === "v" ? i : 0), c = p.c + (p.dir === "h" ? i : 0);
      const chave = l + "," + c;
      if (!casas[chave]) casas[chave] = { letra: p.resposta[i], palavras: [], l: l, c: c };
      casas[chave].palavras.push(idx);
    }
  });

  const placarCruz = document.getElementById("placar");
  const listaDicas = document.getElementById("lista-dicas");
  const elFeedbackCruz = document.getElementById("cruz-feedback");
  let dicasUsadas = 0, direcao = "h", palavraAtual = 0, terminou = false;

  // Desenha a grade
  for (let l = 0; l < LINHAS; l++) for (let c = 0; c < COLUNAS; c++) {
    const casa = casas[l + "," + c];
    if (!casa) { const vazio = document.createElement("span"); vazio.className = "crossword-cell"; areaCruzadas.appendChild(vazio); continue; }
    const rotulo = document.createElement("label");
    rotulo.className = "crossword-cell active";
    const numeros = palavras.filter(function (p) { return p.l === l && p.c === c; });
    if (numeros.length) { const pequeno = document.createElement("small"); pequeno.textContent = numeros[0].n; rotulo.appendChild(pequeno); }
    const campo = document.createElement("input");
    campo.type = "text"; campo.autocomplete = "off"; campo.autocapitalize = "characters"; campo.spellcheck = false;
    campo.setAttribute("aria-label", "Linha " + (l + 1) + ", coluna " + (c + 1));
    rotulo.appendChild(campo);
    areaCruzadas.appendChild(rotulo);
    casa.rotulo = rotulo; casa.campo = campo;
  }

  // Lista de dicas
  palavras.forEach(function (p, idx) {
    const linha = document.createElement("p");
    linha.innerHTML = "<strong>" + p.n + (p.dir === "h" ? "→" : "↓") + "</strong> ";
    linha.appendChild(document.createTextNode(p.dica));
    linha.addEventListener("click", function () { direcao = p.dir; palavraAtual = idx; casaDe(idx, 0).campo.focus(); marcar(); });
    listaDicas.appendChild(linha);
    p.elDica = linha;
  });

  function casaDe(idx, i) {
    const p = palavras[idx];
    return casas[(p.l + (p.dir === "v" ? i : 0)) + "," + (p.c + (p.dir === "h" ? i : 0))];
  }
  // Pinta a palavra que está sendo preenchida e a dica dela
  function marcar() {
    areaCruzadas.querySelectorAll(".cur").forEach(function (e) { e.classList.remove("cur"); });
    palavras.forEach(function (p) { p.elDica.classList.remove("cur"); });
    const p = palavras[palavraAtual];
    p.elDica.classList.add("cur");
    for (let i = 0; i < p.resposta.length; i++) casaDe(palavraAtual, i).rotulo.classList.add("cur");
  }
  // Escolhe a palavra da casa: mantém a direção atual se der; senão usa a outra
  function escolherPalavra(casa, alternar) {
    const daDirecao = casa.palavras.filter(function (i) { return palavras[i].dir === direcao; });
    const outra = casa.palavras.filter(function (i) { return palavras[i].dir !== direcao; });
    if (alternar && outra.length && daDirecao.length) { direcao = direcao === "h" ? "v" : "h"; palavraAtual = outra[0]; }
    else if (daDirecao.length) palavraAtual = daDirecao[0];
    else { direcao = palavras[outra[0]].dir; palavraAtual = outra[0]; }
    marcar();
  }
  function posicaoNaPalavra(casa) {
    const p = palavras[palavraAtual];
    return p.dir === "h" ? casa.c - p.c : casa.l - p.l;
  }
  function vizinha(casa, dl, dc) { return casas[(casa.l + dl) + "," + (casa.c + dc)]; }

  Object.keys(casas).forEach(function (chave) {
    const casa = casas[chave];
    // seleciona a letra ao entrar na casa: assim a nova letra digitada substitui a antiga
    casa.campo.addEventListener("focus", function () { casa.campo.select(); });
    casa.campo.addEventListener("click", function () { casa.campo.select(); });
    casa.campo.addEventListener("focus", function () { elFeedbackCruz.textContent = ""; if (casa.palavras.indexOf(palavraAtual) === -1) escolherPalavra(casa, false); else marcar(); });
    casa.campo.addEventListener("click", function () {
      // clicar de novo na mesma casa (cruzamento) troca entre → e ↓
      if (casa.ultimoClique && casa.palavras.length > 1) escolherPalavra(casa, true);
      casa.ultimoClique = true;
      Object.keys(casas).forEach(function (k) { if (casas[k] !== casa) casas[k].ultimoClique = false; });
    });
    casa.campo.addEventListener("input", function () {
      // sem limite de tamanho no campo: ficamos sempre com a última letra digitada (mesmo se a casa já tinha uma)
      const letra = casa.campo.value.toUpperCase().normalize("NFD").replace(/[^A-Z]/g, "").slice(-1);
      casa.campo.value = letra;
      casa.rotulo.classList.remove("errada");
      if (letra) {
        const p = palavras[palavraAtual], i = posicaoNaPalavra(casa);
        if (i + 1 < p.resposta.length) casaDe(palavraAtual, i + 1).campo.focus();
      }
      verificarFim();
    });
    casa.campo.addEventListener("keydown", function (e) {
      const setas = { ArrowRight: [0, 1, "h"], ArrowLeft: [0, -1, "h"], ArrowDown: [1, 0, "v"], ArrowUp: [-1, 0, "v"] };
      if (setas[e.key]) {
        e.preventDefault();
        const alvo = vizinha(casa, setas[e.key][0], setas[e.key][1]);
        if (alvo) { direcao = setas[e.key][2]; alvo.campo.focus(); if (alvo.palavras.indexOf(palavraAtual) === -1 || palavras[palavraAtual].dir !== direcao) escolherPalavra(alvo, false); }
      } else if (e.key === "Backspace" && casa.campo.value === "" && !casa.campo.readOnly) {
        const i = posicaoNaPalavra(casa);
        if (i > 0) { e.preventDefault(); const anterior = casaDe(palavraAtual, i - 1); anterior.campo.focus(); if (!anterior.campo.readOnly) anterior.campo.value = ""; }
      } else if (e.key === "Enter") {
        e.preventDefault();
        irParaProxima();
      }
    });
    casa.campo.enterKeyHint = "next";   // no teclado do celular, o botão Enter aparece como "próximo"
  });

  // ENTER: quando a palavra está completa, vai para a próxima palavra que ainda tem casas vazias
  // (na ordem das dicas; se chegar ao fim, volta ao começo). Palavras já preenchidas são puladas.
  function palavraCompleta(idx) {
    for (let i = 0; i < palavras[idx].resposta.length; i++) if (casaDe(idx, i).campo.value === "") return false;
    return true;
  }
  function primeiraVazia(idx) {
    for (let i = 0; i < palavras[idx].resposta.length; i++) { const cs = casaDe(idx, i); if (cs.campo.value === "") return cs; }
    return casaDe(idx, 0);
  }
  function irParaPalavra(idx) {
    direcao = palavras[idx].dir;
    palavraAtual = idx;
    primeiraVazia(idx).campo.focus();
    marcar();
  }
  function irParaProxima() {
    if (terminou) return;
    if (!palavraCompleta(palavraAtual)) {               // ainda falta letra: vai para a primeira casa vazia desta palavra
      irParaPalavra(palavraAtual);
      elFeedbackCruz.textContent = "Ainda faltam letras nesta palavra.";
      return;
    }
    for (let k = 1; k < palavras.length; k++) {
      const idx = (palavraAtual + k) % palavras.length;
      if (!palavraCompleta(idx)) { irParaPalavra(idx); return; }
    }
    elFeedbackCruz.textContent = "Todas as palavras estão preenchidas! Toque em Verificar para conferir.";   // não há próxima palavra
  }

  function verificarFim() {
    if (terminou) return;
    const tudoCerto = Object.keys(casas).every(function (k) { return casas[k].campo.value === casas[k].letra; });
    if (!tudoCerto) return;
    terminou = true;
    Object.keys(casas).forEach(function (k) { casas[k].campo.readOnly = true; });
    elFeedbackCruz.textContent = "Muito bem! Todas as palavras certas!";
    const est = Math.max(1, 5 - dicasUsadas);   // cada dica usada tira 1 estrela (mínimo 1)
    setTimeout(function () { terminarJogo("palavras-cruzadas.html", est, palavras.length, dicasUsadas); }, 1100);
  }

  document.getElementById("cruz-verificar").addEventListener("click", function () {
    if (terminou) return;
    let erradas = 0, vazias = 0;
    Object.keys(casas).forEach(function (k) {
      const casa = casas[k], v = casa.campo.value;
      if (v === "") vazias++;
      else if (v !== casa.letra) { casa.rotulo.classList.add("errada"); erradas++; }
    });
    elFeedbackCruz.textContent = erradas ? "Tem " + (erradas === 1 ? "1 letra errada" : erradas + " letras erradas") + " (em vermelho)." : (vazias ? "Tudo certo até aqui! Continue." : "");
  });

  document.getElementById("cruz-dica").addEventListener("click", function () {
    if (terminou) return;
    // revela uma letra que ainda não está certa, começando pela palavra atual
    const p = palavras[palavraAtual];
    let candidatas = [];
    for (let i = 0; i < p.resposta.length; i++) { const cs = casaDe(palavraAtual, i); if (cs.campo.value !== cs.letra) candidatas.push(cs); }
    if (!candidatas.length) candidatas = Object.keys(casas).map(function (k) { return casas[k]; }).filter(function (cs) { return cs.campo.value !== cs.letra; });
    if (!candidatas.length) return;
    const casa = candidatas[0];
    casa.campo.value = casa.letra; casa.campo.readOnly = true;
    casa.rotulo.classList.remove("errada"); casa.rotulo.classList.add("dica");
    dicasUsadas++;
    placarCruz.textContent = "Dicas usadas: " + dicasUsadas;
    elFeedbackCruz.textContent = "";
    verificarFim();
  });

  palavraAtual = 0; direcao = palavras[0].dir; marcar();   // começa na dica 1
}

/* ---------- 7) TELA FINAL ("Muito bem!") ---------- */
const botaoDeNovo = document.getElementById("jogar-de-novo");
if (botaoDeNovo) {
  // O endereço traz: conclusao.html?jogo=quiz.html&estrelas=3&a=3&t=5
  const params = new URLSearchParams(window.location.search);
  const jogo = params.get("jogo");
  const permitidos = ["memoria.html", "quiz.html", "lixeira.html", "quebra-cabeca.html", "caca-palavras.html", "palavras-cruzadas.html"];
  if (permitidos.indexOf(jogo) !== -1) botaoDeNovo.href = jogo;

  // Número entre 0 e 5 (se alguém mexer no endereço, nunca passa disso)
  function numero(nome, max) {
    const n = parseInt(params.get(nome), 10);
    return isNaN(n) ? 0 : Math.max(0, Math.min(max, n));
  }
  const estrelas = params.has("estrelas") ? numero("estrelas", 5) : 5;
  const a = numero("a", 999), t = numero("t", 999);

  // Mensagem, expressão do Tito e frase de acordo com as estrelas (0 a 5).
  // Todas as mensagens incentivam: a criança nunca vê "fracassou" ou um Tito triste.
  const resultados = [
    { rosto: "confiante", titulo: "Boa tentativa!",     frase: "Continue praticando e você vai conseguir!" },
    { rosto: "confiante", titulo: "Boa tentativa!",     frase: "Continue praticando e você vai conseguir!" },
    { rosto: "confiante", titulo: "Boa tentativa!",     frase: "Continue praticando e você vai conseguir!" },
    { rosto: "feliz",     titulo: "Muito bem!",         frase: "Você está aprendendo cada vez mais!" },
    { rosto: "animado",   titulo: "Muito bem!",         frase: "Você está aprendendo cada vez mais!" },
    { rosto: "comemorando", titulo: "Uau! Você arrasou!", frase: "Continue assim, guardião da natureza!" }
  ];
  const r = resultados[estrelas];
  document.getElementById("resultado-titulo").textContent = r.titulo;
  document.title = "EcoKids - " + r.titulo;
  const titoFinal = document.querySelector(".completion-content .mascot");
  trocarRosto(titoFinal, r.rosto);
  // "comemorando" é o Tito de corpo inteiro: sem o arbusto na frente (veja o CSS, parte 19)
  titoFinal.parentNode.classList.toggle("corpo-inteiro", r.rosto === "comemorando");
  titoFinal.setAttribute("aria-label", "Tito, a tartaruga do EcoKids, " + ({ confiante: "fazendo joinha", feliz: "feliz", animado: "animado", comemorando: "comemorando" })[r.rosto]);
  const painel = document.querySelector(".placar-final");
  if (painel) painel.dataset.nivel = estrelas === 5 ? "excelente" : estrelas >= 3 ? "bom" : "praticando";

  // Nome do jogo em cima do título
  const nomes = { "memoria.html": "Jogo da memória", "quiz.html": "Quiz", "lixeira.html": "Lixeira certa", "quebra-cabeca.html": "Quebra-cabeça", "caca-palavras.html": "Caça-palavras", "palavras-cruzadas.html": "Palavras cruzadas" };
  const elJogo = document.getElementById("resultado-jogo");
  if (elJogo && nomes[jogo]) elJogo.textContent = "Você terminou: " + nomes[jogo];

  // Texto com o resultado de cada jogo (a e t são os dois números que o jogo mandou)
  const detalhes = {
    "quiz.html": function () { return "Você acertou " + a + " de " + t + " perguntas."; },
    "lixeira.html": function () { return "Você acertou " + a + " de " + t + " itens."; },
    "memoria.html": function () { return "Você achou os " + a + " pares em " + t + " tentativas."; },
    "quebra-cabeca.html": function () { return "Você montou as " + a + " peças com " + t + " trocas."; },
    "caca-palavras.html": function () { return t === 0 ? "Você achou as " + a + " palavras sem errar nenhuma vez!" : "Você achou as " + a + " palavras com " + t + (t === 1 ? " tentativa errada." : " tentativas erradas."); },
    "palavras-cruzadas.html": function () { return t === 0 ? "Você completou as palavras cruzadas sem usar dicas!" : "Você completou as palavras cruzadas usando " + t + (t === 1 ? " dica." : " dicas."); }
  };
  document.getElementById("resultado-frase").textContent = r.frase;
  const elDetalhe = document.getElementById("resultado-detalhe");
  if (elDetalhe && params.has("a") && detalhes[jogo]) { elDetalhe.textContent = detalhes[jogo](); elDetalhe.hidden = false; }

  // 5 estrelas de massinha: as conquistadas ficam douradas (com carinha), as outras ficam "vazias".
  // Elas aparecem uma de cada vez (a animação fica no CSS, parte 19).
  const PONTAS = "M50 12 61.2 36.6 88 39.6 68.1 57.9 73.5 84.4 50 71 26.5 84.4 31.9 57.9 12 39.6 38.8 36.6Z";
  function desenhoEstrela(cheia) {
    const cor = cheia ? "url(#g-estrela)" : "url(#g-estrela-vazia)";
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="' + PONTAS + '" class="estrela-base" stroke-width="12" stroke-linejoin="round" transform="translate(0 5)"/>' +
      '<g filter="url(#ek-massa-estrela)"><path d="' + PONTAS + '" fill="' + cor + '" stroke="' + cor + '" stroke-width="12" stroke-linejoin="round"/></g>' +
      '<ellipse cx="38" cy="33" rx="7" ry="3.6" fill="#fff" opacity=".7" transform="rotate(-32 38 33)"/>' +
      (cheia ? '<circle cx="42" cy="52" r="3.6" fill="#5a3200"/><circle cx="58" cy="52" r="3.6" fill="#5a3200"/><circle cx="43" cy="51" r="1.2" fill="#fff"/><circle cx="59" cy="51" r="1.2" fill="#fff"/>' +
        '<path d="M44.5 60q5.5 5 11 0" fill="none" stroke="#5a3200" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="59" r="3.4" fill="#ff8a65" opacity=".55"/><circle cx="64" cy="59" r="3.4" fill="#ff8a65" opacity=".55"/>' : "") +
      "</svg>";
  }
  const caixaEstrelas = document.getElementById("estrelas");
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.className = "star-badge" + (i <= estrelas ? " cheia" : " vazia");
    estrela.style.setProperty("--i", i - 1);
    estrela.innerHTML = desenhoEstrela(i <= estrelas);
    estrela.setAttribute("aria-hidden", "true");
    caixaEstrelas.appendChild(estrela);
  }
  caixaEstrelas.setAttribute("role", "img");
  caixaEstrelas.setAttribute("aria-label", estrelas + " de 5 estrelas");
  caixaEstrelas.style.setProperty("--total", estrelas);

  // Contagem bem clara embaixo das estrelas: "3 de 5 estrelas"
  const contagem = document.getElementById("estrelas-contagem");
  if (contagem) contagem.innerHTML = "<b>" + estrelas + "</b> de 5 estrelas";
}

// ============================================================
// 10) ECOBOT - assistente de IA (Gemini) para as crianças
//    Aparece nas páginas cuja <main> tem o atributo data-ecobot.
//    A chave fica em js/config.js (fora do GitHub). Sem a chave, o EcoBot avisa com carinho.
// ============================================================
(function () {
  if (!document.querySelector("[data-ecobot]")) return;

  // Endereço do mini servidor do EcoBot (veja servidor/LEIA-ME.md). Depois de publicar o Worker, cole aqui, ex.:
  // "https://ecobot.SEU-USUARIO.workers.dev". Com o endereço preenchido, a chave NÃO é usada no navegador.
  const ECOBOT_URL = "https://ecobot.anaaforte1.workers.dev";

  const MODELO = "gemini-2.5-flash";
  const PERSONALIDADE =
    "Você é o EcoBot, o amigo da natureza do site EcoKids, ao lado do Tito, a tartaruga. " +
    "Ajude crianças de 6 a 11 anos a aprender sobre reciclagem, água, energia, animais, plantas e cuidados com o planeta. " +
    "Fale em português do Brasil, com frases curtas, linguagem simples, alegre e encorajadora, e alguns emojis (🌿🐢♻️). " +
    "Responda em no máximo 4 frases. Se a pergunta fugir de natureza, meio ambiente ou amizade, " +
    "diga gentilmente que você só conversa sobre a natureza e sugira um assunto legal. " +
    "NUNCA peça nem aceite dados pessoais (nome completo, endereço, telefone, escola, fotos). " +
    "Se a criança parecer triste, em perigo ou com algum problema sério, incentive-a a conversar com um adulto de confiança.";
  const CATEGORIAS = ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"];
  const MAX_HISTORICO = 8; // quantas mensagens anteriores o EcoBot lembra
  const historico = [];
  let ocupado = false;

  // Monta o botão flutuante e a janela do chat
  const raiz = document.createElement("div");
  raiz.className = "ecobot";
  raiz.innerHTML =
    '<section class="ecobot-panel clay" id="ecobot-panel" role="dialog" aria-label="Conversa com o EcoBot" hidden>' +
      '<header class="ecobot-header"><span class="ecobot-avatar mascot rosto-feliz" aria-hidden="true"></span>' +
        '<div class="ecobot-titulo"><strong>EcoBot</strong><small>Seu amigo para descobrir e cuidar da natureza!</small></div>' +
        '<button class="ecobot-close" type="button" aria-label="Fechar o chat">×</button></header>' +
      '<div class="ecobot-messages" id="ecobot-msgs" aria-live="polite"></div>' +
      '<form class="ecobot-form" id="ecobot-form" autocomplete="off">' +
        '<input id="ecobot-input" type="text" maxlength="300" placeholder="Pergunte algo sobre a natureza..." aria-label="Sua pergunta" aria-describedby="ecobot-aviso">' +
        '<button class="clay-button yellow ecobot-enviar" type="submit"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2Z"/></svg><span>Enviar</span></button></form>' +
      // Aviso de privacidade (o público do site são crianças)
      '<p class="ecobot-aviso" id="ecobot-aviso"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="3" fill="currentColor"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>' +
        '<span>Não compartilhe seu nome, endereço, telefone ou outras informações pessoais na conversa.</span></p>' +
    '</section>' +
    '<button class="ecobot-fab clay-button" id="ecobot-fab" type="button" aria-expanded="false" aria-controls="ecobot-panel">' +
      '<span class="ecobot-avatar mascot rosto-feliz" aria-hidden="true"></span><span>EcoBot</span></button>';
  document.body.appendChild(raiz);

  const painel = raiz.querySelector(".ecobot-panel");
  const botao = raiz.querySelector(".ecobot-fab");
  const caixa = raiz.querySelector(".ecobot-messages");
  const form = raiz.querySelector(".ecobot-form");
  const campo = raiz.querySelector("#ecobot-input");

  function mensagem(texto, quem) {
    const div = document.createElement("div");
    div.className = "ecobot-msg " + quem;
    div.textContent = texto; // textContent: nunca interpreta HTML
    caixa.appendChild(div);
    caixa.scrollTop = caixa.scrollHeight;
    return div;
  }

  // Sugestões de perguntas (aparecem antes da primeira mensagem; somem quando a conversa começa).
  // Para trocar uma sugestão, mude o texto abaixo. "icone" é o desenho pequeno ao lado.
  const SUGESTOES = [
    { texto: "Como posso cuidar do meio ambiente?", icone: "folha" },
    { texto: "Onde devo jogar uma garrafa?", icone: "reciclar" },
    { texto: "Como economizar água?", icone: "gota" },
    { texto: "Me conte uma curiosidade sobre animais!", icone: "pata" },
    { texto: "O que é sustentabilidade?", icone: "planeta" },
    { texto: "Por que as árvores são importantes?", icone: "arvore" }
  ];
  const ICONES_SUGESTAO = {
    folha: '<path d="M20 4C11 4 5 9 5 17c5 1 10 0 13-4 2-3 2-6 2-9Z" fill="#58b043"/><path d="M5 19c3-5 6-8 11-11" stroke="#2f7a2a" stroke-width="2" fill="none" stroke-linecap="round"/>',
    reciclar: '<g fill="none" stroke="#e03c31" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L7.2 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.3-2.1"/><path d="m14 16-3 3 3 3"/><path d="M8.3 13.6 7.2 9.5 3.1 10.6"/><path d="m9.3 5.8 1.1-1.9a1.8 1.8 0 0 1 3.1 0l3.9 6.8"/><path d="m13.4 9.6 4.1 1.1 1.1-4.1"/></g>',
    gota: '<path d="M12 3C9 7.5 6 11 6 14.5a6 6 0 0 0 12 0C18 11 15 7.5 12 3Z" fill="#2f86c6"/><path d="M9.5 14c0 1.5 1 2.6 2.4 2.9" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    pata: '<g fill="#8b5a2b"><ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6.5" cy="10.5" r="2"/><circle cx="10" cy="6.8" r="2"/><circle cx="14.4" cy="6.8" r="2"/><circle cx="17.8" cy="10.5" r="2"/></g>',
    planeta: '<circle cx="12" cy="12" r="8.5" fill="#2f86c6"/><path d="M7 7c3 1 3 4 1 5s0 4 2 5M15 5c-1 3 2 3 3 5s-2 4-1 6" fill="none" stroke="#7bd162" stroke-width="2.6" stroke-linecap="round"/>',
    arvore: '<rect x="10.8" y="13" width="2.4" height="8" rx="1.2" fill="#8b5a2b"/><circle cx="12" cy="9.5" r="6.5" fill="#58b043"/><circle cx="9.5" cy="8" r="1.5" fill="#fff" opacity=".45"/>'
  };
  function mostrarSugestoes() {
    const grupo = document.createElement("div");
    grupo.className = "ecobot-sugestoes";
    grupo.setAttribute("role", "group");
    grupo.setAttribute("aria-label", "Sugestões de perguntas");
    grupo.innerHTML = '<p class="ecobot-sugestoes-titulo">Escolha uma pergunta ou escreva a sua:</p>';
    SUGESTOES.forEach(function (s) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ecobot-sugestao";
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES_SUGESTAO[s.icone] + "</svg><span></span>";
      b.querySelector("span").textContent = s.texto;
      b.addEventListener("click", function () { enviar(s.texto); });   // envia como se a criança tivesse digitado
      grupo.appendChild(b);
    });
    caixa.appendChild(grupo);
  }
  function esconderSugestoes() {
    const grupo = caixa.querySelector(".ecobot-sugestoes");
    if (grupo) grupo.remove();
  }

  // "EcoBot está digitando": três pontinhos animados enquanto a resposta não chega
  function digitando() {
    const div = document.createElement("div");
    div.className = "ecobot-msg bot pensando";
    div.innerHTML = '<span class="ecobot-pontos" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">EcoBot está digitando...</span>';
    caixa.appendChild(div);
    caixa.scrollTop = caixa.scrollHeight;
    return div;
  }

  function abrir(abrirAgora) {
    painel.hidden = !abrirAgora;
    botao.setAttribute("aria-expanded", abrirAgora ? "true" : "false");
    if (abrirAgora) {
      if (!caixa.children.length) {
        mensagem("Olá! Eu sou o EcoBot. Quer aprender algo legal sobre a natureza ou os animais hoje? 🌿🐾", "bot");
        mostrarSugestoes();
      }
      caixa.scrollTop = caixa.scrollHeight;
      campo.focus();
    }
  }
  botao.addEventListener("click", function () { abrir(painel.hidden); });
  raiz.querySelector(".ecobot-close").addEventListener("click", function () { abrir(false); botao.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !painel.hidden) abrir(false); });

  // "sinal" permite cancelar o pedido quando passa do tempo limite (veja TEMPO_LIMITE em enviar)
  async function perguntar(texto, sinal) {
    // Modo servidor (o certo para o site publicado): a chave fica guardada no Worker
    if (ECOBOT_URL) {
      const r = await fetch(ECOBOT_URL, {
        method: "POST",
        signal: sinal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversa: historico.map(function (m) { return { papel: m.role, texto: m.parts[0].text }; }).concat([{ papel: "user", texto: texto }])
        })
      });
      const d = await r.json().catch(function () { return {}; });
      // O erro real vai para o console (F12), para quem cuida do site descobrir o problema.
      // A criança vê só a mensagem amigável.
      if (!r.ok || !d.texto) console.error("EcoBot: o servidor respondeu HTTP " + r.status, d);
      if (r.status === 429 || d.erro === "muitos-pedidos") return "Estou com muitas perguntas agora! Espere um minutinho e tente de novo. ⏳";
      if (!r.ok || !d.texto) return "Ops! Minha floresta mágica da IA não respondeu. Tente de novo mais tarde! 🌳";
      return d.texto;
    }
    // Modo local (só para testes no seu computador): usa a chave de js/config.js direto
    const chave = window.ECOKIDS_CONFIG && window.ECOKIDS_CONFIG.GEMINI_API_KEY;
    if (!chave || chave.indexOf("COLE_") === 0) return "O EcoBot ainda está dormindo (falta a chave da IA). Peça ajuda a um adulto! 😴";
    const resposta = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + MODELO + ":generateContent", {
      method: "POST",
      signal: sinal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PERSONALIDADE }] },
        contents: historico.concat([{ role: "user", parts: [{ text: texto }] }]),
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        safetySettings: CATEGORIAS.map(function (c) { return { category: c, threshold: "BLOCK_LOW_AND_ABOVE" }; })
      })
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
      console.error("EcoBot:", dados);
      if (resposta.status === 429) return "Estou com muitas perguntas agora! Espere um minutinho e tente de novo. ⏳";
      return "Ops! Minha floresta mágica da IA não respondeu. Tente de novo mais tarde! 🌳";
    }
    const parte = dados.candidates && dados.candidates[0] && dados.candidates[0].content &&
      dados.candidates[0].content.parts && dados.candidates[0].content.parts[0];
    if (!parte || !parte.text) return "Hmm, essa eu prefiro não responder. Que tal perguntar sobre animais, plantas, reciclagem ou amizade? 🌿";
    return parte.text.replace(/\*+/g, "").trim();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    enviar(campo.value.trim());
  });

  // Envia uma pergunta (digitada no campo ou tocada nas sugestões)
  // Enquanto o EcoBot responde: o botão Enviar fica desligado (não dá para mandar duas perguntas juntas)
  const botaoEnviar = form.querySelector(".ecobot-enviar");
  function marcarRespondendo(sim) {
    ocupado = sim;
    botaoEnviar.disabled = sim;
    botaoEnviar.setAttribute("aria-label", sim ? "Aguarde, o EcoBot está respondendo" : "Enviar");
    painel.classList.toggle("respondendo", sim);
    campo.placeholder = sim ? "O EcoBot está respondendo..." : "Pergunte algo sobre a natureza...";
  }

  // Tempo máximo de espera pela resposta (em milissegundos). Depois disso, o pedido é cancelado
  // e a criança pode perguntar de novo.
  const TEMPO_LIMITE = 30000;
  let numeroDoPedido = 0;   // cada pergunta tem um número: uma resposta atrasada de um pedido antigo é ignorada

  async function enviar(texto) {
    if (!texto || ocupado) return;
    marcarRespondendo(true);
    const meuPedido = ++numeroDoPedido;
    campo.value = "";
    esconderSugestoes();   // a conversa começou: as sugestões saem para dar espaço às mensagens
    mensagem(texto, "user");
    const pensando = digitando();
    const controle = window.AbortController ? new AbortController() : null;
    let esgotou = false;
    const relogio = setTimeout(function () { esgotou = true; if (controle) controle.abort(); }, TEMPO_LIMITE);
    let resposta;
    try {
      resposta = await perguntar(texto, controle ? controle.signal : undefined);
      if (esgotou) throw new Error("tempo esgotado");   // navegador sem AbortController: ignora a resposta atrasada
      if (resposta.indexOf("😴") === -1 && resposta.indexOf("🌳") === -1 && resposta.indexOf("⏳") === -1) {
        historico.push({ role: "user", parts: [{ text: texto }] }, { role: "model", parts: [{ text: resposta }] });
        while (historico.length > MAX_HISTORICO) historico.shift();
      }
    } catch (erro) {
      console.error("EcoBot:", esgotou ? "a resposta passou de " + (TEMPO_LIMITE / 1000) + " segundos" : erro);
      resposta = esgotou
        ? "Puxa, o EcoBot não conseguiu responder agora. 😕 Tente perguntar de novo daqui a pouquinho! 🌳"
        : "Erro de conexão com a floresta mágica da IA. Tente de novo mais tarde! 🌳";
    } finally {
      clearTimeout(relogio);
      pensando.remove();   // os pontinhos sempre somem, com resposta ou com erro
    }
    if (meuPedido !== numeroDoPedido) return;
    mensagem(resposta, "bot");
    marcarRespondendo(false);
    campo.focus();
  }

  // Carrega a chave local (js/config.js) só no modo local; com o servidor (ECOBOT_URL) ela nem é necessária
  if (!ECOBOT_URL && !window.ECOKIDS_CONFIG) {
    const s = document.createElement("script");
    s.src = "js/config.js";
    s.onerror = function () {};
    document.head.appendChild(s);
  }
})();

/* ---------- 11) MENU HAMBÚRGUER (celular e tablet) ---------- */
// O botão "Menu" só aparece em telas pequenas (CSS). Ele abre e fecha a lista de links.
(function () {
  const cabecalho = document.querySelector(".site-header");
  const botao = cabecalho && cabecalho.querySelector(".menu-toggle");
  if (!botao) return;
  const menu = document.getElementById(botao.getAttribute("aria-controls"));
  const rotulo = botao.querySelector(".menu-label");

  function estaAberto() { return cabecalho.classList.contains("menu-aberto"); }
  function abrirMenu(abrir, peloTeclado) {
    cabecalho.classList.toggle("menu-aberto", abrir);
    botao.setAttribute("aria-expanded", abrir ? "true" : "false");
    if (rotulo) rotulo.textContent = abrir ? "Fechar" : "Menu";
    // quem usa teclado vai direto para o primeiro link
    if (abrir && peloTeclado) { const primeiro = menu.querySelector("a, button"); if (primeiro) primeiro.focus(); }
  }
  // e.detail === 0 quando o botão foi acionado pelo teclado (Enter ou Espaço)
  botao.addEventListener("click", function (e) { abrirMenu(!estaAberto(), e.detail === 0); });
  // Fecha com Esc, ao tocar fora do menu ou ao escolher um link
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && estaAberto()) { abrirMenu(false); botao.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (estaAberto() && !cabecalho.contains(e.target)) abrirMenu(false);
  });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) abrirMenu(false); });
  // Se a tela ficar grande (ex.: girar o tablet), o menu volta ao normal
  const telaGrande = window.matchMedia("(min-width: 901px)");
  if (telaGrande.addEventListener) telaGrande.addEventListener("change", function (e) { if (e.matches) abrirMenu(false); });
})();

/* ---------- 12) DECORAÇÃO: folhas voando e confete na tela final ---------- */
// Só enfeite (aria-hidden). Não aparece para quem pediu "reduzir movimento" no sistema.
(function () {
  const pagina = document.querySelector(".page");
  if (!pagina || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function aleatorio(min, max) { return min + Math.random() * (max - min); }

  // Folhinhas caindo devagar no topo da página (à noite viram vaga-lumes, pelo CSS)
  const folhas = document.createElement("div");
  folhas.className = "decor-folhas";
  folhas.setAttribute("aria-hidden", "true");
  const quantas = window.innerWidth < 640 ? 3 : 6;
  for (let i = 0; i < quantas; i++) {
    const folha = document.createElement("span");
    folha.style.setProperty("--x", (i / quantas * 100 + aleatorio(0, 100 / quantas)).toFixed(1) + "%");
    folha.style.setProperty("--t", aleatorio(16, 28).toFixed(0) + "px");
    folha.style.setProperty("--d", aleatorio(15, 26).toFixed(1) + "s");
    folha.style.setProperty("--atraso", (-aleatorio(0, 24)).toFixed(1) + "s"); // negativo: já começa no meio do caminho
    folhas.appendChild(folha);
  }
  pagina.prepend(folhas);

  // Confete de comemoração na tela final, quando a criança ganhou 3 estrelas ou mais
  if (!pagina.classList.contains("completion-page")) return;
  const params = new URLSearchParams(window.location.search);
  const estrelas = params.has("estrelas") ? parseInt(params.get("estrelas"), 10) : 5;
  if (!(estrelas >= 3)) return;
  const cores = ["#5e9e34", "#a9cf4b", "#f4bf3f", "#1f74b8", "#c8473b", "#7a4fc0"];
  const confete = document.createElement("div");
  confete.className = "confete";
  confete.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 46; i++) {
    const pedaco = document.createElement("span");
    pedaco.style.setProperty("--x", aleatorio(0, 100).toFixed(1) + "%");
    pedaco.style.setProperty("--t", aleatorio(7, 14).toFixed(0) + "px");
    pedaco.style.setProperty("--c", cores[i % cores.length]);
    pedaco.style.setProperty("--r", Math.random() < 0.5 ? "50%" : "3px");
    pedaco.style.setProperty("--d", aleatorio(2.4, 4.2).toFixed(2) + "s");
    pedaco.style.setProperty("--atraso", aleatorio(0.2, 1.2).toFixed(2) + "s");
    pedaco.style.setProperty("--vento", aleatorio(-90, 90).toFixed(0) + "px");
    confete.appendChild(pedaco);
  }
  pagina.appendChild(confete);
  setTimeout(function () { confete.remove(); }, 6000);
})();
