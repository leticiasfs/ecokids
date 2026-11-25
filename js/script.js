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
  function fechar(botao) {
    botao.className = "memory-card clay closed";
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
    if (viradas.length === 2 || botao.classList.contains("open")) return;
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
      } else {                                       // errou: desvira depois de 1,2 s
        setTimeout(function () {
          fechar(a.botao); fechar(b.botao);
          viradas = [];
        }, 1200);
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
  // Itens do jogo: só imagens (pasta imagens/lixeira/). "alt" é o texto lido por leitores de tela.
  const itens = [
    { imagem: "imagens/lixeira/garrafa-pet.jpg", alt: "Garrafa de água", lixeira: "Plástico" },
    { imagem: "imagens/lixeira/jornal.jpg", alt: "Jornal", lixeira: "Papel" },
    { imagem: "imagens/lixeira/lata.jpg", alt: "Lata de refrigerante", lixeira: "Metal" },
    { imagem: "imagens/lixeira/parafusos.jpg", alt: "Pregos e parafusos", lixeira: "Metal" },
    { imagem: "imagens/lixeira/banana.jpg", alt: "Casca de banana", lixeira: "Orgânico" },
    { imagem: "imagens/lixeira/casca-ovo.jpg", alt: "Cascas de ovo", lixeira: "Orgânico" },
    { imagem: "imagens/lixeira/pote-vidro.jpg", alt: "Pote de vidro", lixeira: "Vidro" }
  ];
  const sorteados = embaralhar(itens);
  let rodada = 0, acertos = 0, travado = false;
  const elItem = document.getElementById("item-imagem");
  const elDica = document.getElementById("item-dica");
  const elPlacar = document.getElementById("placar");
  const elTitoLixeira = document.querySelector(".trash-prompt-row .mascot");

  function mostrarItem() {
    trocarRosto(elTitoLixeira, "curioso");
    elItem.src = sorteados[rodada].imagem;
    elItem.alt = sorteados[rodada].alt;
    elDica.className = "";
    elDica.textContent = "";
    travado = false;
  }

  areaLixeiras.querySelectorAll("button").forEach(function (botao) {
    botao.addEventListener("click", function () {
      if (travado) return;
      travado = true;
      const certa = sorteados[rodada].lixeira;
      const escolhida = botao.dataset.lixeira;
      if (escolhida === certa) {
        acertos++;
        elPlacar.textContent = "Acertos: " + acertos;
        elDica.className = "certo"; elDica.textContent = "Certo!"; trocarRosto(elTitoLixeira, "animado");
      } else {
        elDica.className = "errado"; elDica.textContent = "Era a lixeira de " + certa.toLowerCase() + "."; trocarRosto(elTitoLixeira, "triste");
      }
      setTimeout(function () {
        rodada++;
        if (rodada === sorteados.length) { terminarJogo("lixeira.html", estrelasPor(acertos / sorteados.length), acertos, sorteados.length); } else { mostrarItem(); }
      }, 1200);
    });
  });
  mostrarItem();
}

/* ---------- 6) QUEBRA-CABEÇA ---------- */
const tabuleiro = document.getElementById("tabuleiro");
if (tabuleiro) {
  // As figuras do jogo. "colunas" x "linhas" = quantidade de peças.
  // Ordem de entrada: as figuras normais (3x3) alternam; depois que a criança monta todas,
  // vem a figura "grande" (mais peças). Quando termina a grande, o ciclo recomeça.
  const figuras = [
    { id: "planeta", arquivo: "imagens/quebra-cabeca-1-quadrado.png", colunas: 3, linhas: 3, grande: false },
    { id: "natureza", arquivo: "imagens/quebra-cabeca-2-quadrado.jpg", colunas: 3, linhas: 3, grande: false },
    { id: "paisagem", arquivo: "imagens/quebra-cabeca-3-grande.jpg", colunas: 6, linhas: 3, grande: true }
  ];

  // O navegador lembra quais figuras já foram montadas neste ciclo (localStorage).
  const CHAVE = "ecokids-quebra-cabeca";
  function lerFeitas() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { return []; }
  }
  function salvarFeitas(lista) {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {}
  }
  function escolherFigura() {
    const feitas = lerFeitas();
    const normais = figuras.filter(function (f) { return !f.grande; });
    const faltam = normais.filter(function (f) { return feitas.indexOf(f.id) === -1; });
    if (faltam.length > 0) return faltam[Math.floor(Math.random() * faltam.length)];
    return figuras.filter(function (f) { return f.grande; })[0];
  }
  function registrarConclusao(figura) {
    if (figura.grande) { salvarFeitas([]); return; }           // terminou a grande: recomeça o ciclo
    const feitas = lerFeitas();
    if (feitas.indexOf(figura.id) === -1) feitas.push(figura.id);
    salvarFeitas(feitas);
  }

  const figura = escolherFigura();
  const total = figura.colunas * figura.linhas;
  const placarPecas = document.getElementById("placar");
  document.getElementById("modelo").src = figura.arquivo;
  if (figura.grande) {
    tabuleiro.classList.add("grande");
    document.getElementById("layout-quebra").classList.add("grande");
    tabuleiro.style.gridTemplateColumns = "repeat(" + figura.colunas + ", var(--pw))";
    tabuleiro.style.gridTemplateRows = "repeat(" + figura.linhas + ", var(--ph))";
  }

  // "ordem[i]" diz qual pedaço da imagem está na posição i. Certo = [0,1,2,...]
  const certo = [];
  for (let i = 0; i < total; i++) certo.push(i);
  let ordem = embaralhar(certo);
  while (ordem.every(function (n, i) { return n === i; })) ordem = embaralhar(ordem); // nunca começa pronto
  let selecionada = null;
  let trocas = 0;          // quantas trocas a criança fez (usado nas estrelas)

  function desenhar() {
    tabuleiro.innerHTML = "";
    let certas = 0;
    ordem.forEach(function (pedaco, posicao) {
      if (pedaco === posicao) certas++;
      const botao = document.createElement("button");
      botao.className = "puzzle-piece" + (selecionada === posicao ? " selected" : "");
      botao.setAttribute("aria-label", "Peça " + (posicao + 1));
      // mostra só o pedaço certo da imagem (coluna e linha dentro da grade)
      const col = pedaco % figura.colunas, lin = Math.floor(pedaco / figura.colunas);
      botao.style.backgroundImage = 'url("' + figura.arquivo + '")';
      botao.style.backgroundSize = (figura.colunas * 100) + "% " + (figura.linhas * 100) + "%";
      botao.style.backgroundPosition = (col / (figura.colunas - 1) * 100) + "% " + (lin / (figura.linhas - 1) * 100) + "%";
      botao.addEventListener("click", function () { clicar(posicao); });
      tabuleiro.appendChild(botao);
    });
    placarPecas.textContent = "Peças certas: " + certas + " de " + total;
    return certas;
  }

  function clicar(posicao) {
    if (selecionada === null) {
      selecionada = posicao; desenhar();
      if (tabuleiro.children[posicao]) tabuleiro.children[posicao].focus({ preventScroll: true });
      return;
    }
    // segunda peça escolhida: troca as duas de lugar
    const temp = ordem[selecionada];
    ordem[selecionada] = ordem[posicao];
    ordem[posicao] = temp;
    selecionada = null;
    trocas++;
    const certasAgora = desenhar();
    // as peças são redesenhadas: devolve o foco do teclado para a peça que foi tocada
    if (tabuleiro.children[posicao]) tabuleiro.children[posicao].focus({ preventScroll: true });
    if (certasAgora === total) {
      registrarConclusao(figura);
      // quanto menos trocas, mais estrelas (com folga: 1,3 troca por peça já dá 5 estrelas)
      const estrelas = estrelasPor(total * 1.3 / trocas, 1);
      setTimeout(function () { terminarJogo("quebra-cabeca.html", estrelas, total, trocas); }, 900);
    }
  }
  desenhar();
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

  // Tenta colocar todas as palavras (para a direita ou para baixo). Se não couber, tenta de novo.
  function montarGrade() {
    for (let tentativa = 0; tentativa < 100; tentativa++) {
      const escolhidas = embaralhar(BANCO).slice(0, QUANTAS_PALAVRAS).sort(function (x, y) { return y.length - x.length; });
      const grade = [];
      for (let l = 0; l < TAM; l++) grade.push(new Array(TAM).fill(""));
      let deuCerto = true;
      escolhidas.forEach(function (palavra) {
        if (!deuCerto) return;
        let colocou = false;
        for (let k = 0; k < 300 && !colocou; k++) {
          const horizontal = Math.random() < 0.5;
          const l = Math.floor(Math.random() * (horizontal ? TAM : TAM - palavra.length + 1));
          const c = Math.floor(Math.random() * (horizontal ? TAM - palavra.length + 1 : TAM));
          let cabe = true;
          for (let i = 0; i < palavra.length; i++) {
            const atual = grade[horizontal ? l : l + i][horizontal ? c + i : c];
            if (atual !== "" && atual !== palavra[i]) { cabe = false; break; }
          }
          if (!cabe) continue;
          for (let i = 0; i < palavra.length; i++) grade[horizontal ? l : l + i][horizontal ? c + i : c] = palavra[i];
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
  let inicio = null, achadas = 0, erros = 0;

  function limparSelecao() { gradeLetras.querySelectorAll(".sel").forEach(function (b) { b.classList.remove("sel"); }); inicio = null; }

  function clicarLetra(l, c) {
    if (inicio === null) { inicio = { l: l, c: c }; botoesLetras[l][c].classList.add("sel"); return; }
    if (inicio.l === l && inicio.c === c) { limparSelecao(); return; }     // clicou de novo: cancela
    if (inicio.l !== l && inicio.c !== c) {                                   // fora de linha/coluna: vira o novo começo
      limparSelecao(); inicio = { l: l, c: c }; botoesLetras[l][c].classList.add("sel"); return;
    }
    // monta as letras do começo até o fim (em linha reta)
    const passoL = Math.sign(l - inicio.l), passoC = Math.sign(c - inicio.c);
    const celulas = [];
    let x = inicio.l, y = inicio.c;
    while (true) { celulas.push([x, y]); if (x === l && y === c) break; x += passoL; y += passoC; }
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
      botao.addEventListener("click", function () { clicarLetra(l, c); });
      gradeLetras.appendChild(botao);
      botoesLetras[l].push(botao);
    }
  }
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
      }
    });
  });

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
        '<div><strong>EcoBot</strong><small>Seu amigo da natureza</small></div>' +
        '<button class="ecobot-close" type="button" aria-label="Fechar o chat">×</button></header>' +
      '<div class="ecobot-messages" id="ecobot-msgs" aria-live="polite"></div>' +
      '<form class="ecobot-form" id="ecobot-form" autocomplete="off">' +
        '<input id="ecobot-input" type="text" maxlength="300" placeholder="Pergunte algo sobre a natureza..." aria-label="Sua pergunta">' +
        '<button class="clay-button yellow" type="submit">Enviar</button></form>' +
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

  function abrir(abrirAgora) {
    painel.hidden = !abrirAgora;
    botao.setAttribute("aria-expanded", abrirAgora ? "true" : "false");
    if (abrirAgora) {
      if (!caixa.children.length) mensagem("Olá! Eu sou o EcoBot. Quer aprender algo legal sobre a natureza ou os animais hoje? 🌿🐾", "bot");
      campo.focus();
    }
  }
  botao.addEventListener("click", function () { abrir(painel.hidden); });
  raiz.querySelector(".ecobot-close").addEventListener("click", function () { abrir(false); botao.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !painel.hidden) abrir(false); });

  async function perguntar(texto) {
    // Modo servidor (o certo para o site publicado): a chave fica guardada no Worker
    if (ECOBOT_URL) {
      const r = await fetch(ECOBOT_URL, {
        method: "POST",
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto || ocupado) return;
    ocupado = true;
    campo.value = "";
    mensagem(texto, "user");
    const pensando = mensagem("EcoBot está pensando...", "bot pensando");
    let resposta;
    try {
      resposta = await perguntar(texto);
      if (resposta.indexOf("😴") === -1 && resposta.indexOf("🌳") === -1 && resposta.indexOf("⏳") === -1) {
        historico.push({ role: "user", parts: [{ text: texto }] }, { role: "model", parts: [{ text: resposta }] });
        while (historico.length > MAX_HISTORICO) historico.shift();
      }
    } catch (erro) {
      console.error("EcoBot:", erro);
      resposta = "Erro de conexão com a floresta mágica da IA. Tente de novo mais tarde! 🌳";
    }
    pensando.remove();
    mensagem(resposta, "bot");
    ocupado = false;
    campo.focus();
  });

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
