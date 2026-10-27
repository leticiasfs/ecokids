/* ============================================================
   EcoKids - JavaScript do site
   Este arquivo é usado por todas as páginas. Cada bloco abaixo
   só faz algo se a página tiver o elemento que ele procura.
   Blocos: 1) ícones  2) janela do Aprenda  3) jogo da memória
           4) quiz  5) lixeira certa  6) quebra-cabeça  7) tela final
   ============================================================ */

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

/* ---------- 2) JANELA (modal) DA PÁGINA APRENDA ---------- */
// Conteúdo de cada cartão. "cor" usa as classes do CSS (.bin-color.blue, etc.)
const TEMAS = {
  lixeira: {
    titulo: "Lixeira",
    linhas: [
      { cor: "blue", titulo: "Azul = <b>Papel</b>", texto: "jornal, caderno, caixa" },
      { cor: "red", titulo: "Vermelha = <b>Plástico</b>", texto: "garrafa PET, pote, sacola" },
      { cor: "green", titulo: "Verde = <b>Vidro</b>", texto: "garrafa, pote de conserva" },
      { cor: "yellow", titulo: "Amarela = <b>Metal</b>", texto: "lata, tampinha, prego e parafuso" },
      { cor: "brown", titulo: "Marrom = <b>Orgânico</b>", texto: "casca de fruta, casca de ovo, restos de comida" },
      { cor: "green", icone: "reciclar", titulo: "<b>Reciclar</b>", texto: "é transformar o lixo em um produto novo e útil" },
      { cor: "brown", icone: "folha", titulo: "<b>Compostagem</b>", texto: "restos de comida viram adubo rico para as plantas (composto orgânico)" },
      { cor: "blue", icone: "agua", titulo: "Garrafa <b>reutilizável</b>", texto: "usar a mesma garrafa várias vezes evita muito lixo de plástico. A retornável volta para ser usada de novo" },
      { cor: "green", icone: "folha", titulo: "<b>Biodegradável</b>", texto: "é o que se decompõe com a ajuda da natureza e vira parte da terra" }
    ]
  },
  agua: {
    titulo: "Água",
    linhas: [
      { cor: "blue", icone: "agua", titulo: "Torneira <b>fechada</b>", texto: "feche ao escovar os dentes" },
      { cor: "blue", icone: "agua", titulo: "Banho <b>curto</b>", texto: "um banho rápido gasta menos água" },
      { cor: "green", icone: "folha", titulo: "<b>Vazamento</b>", texto: "torneira pingando desperdiça: avise um adulto" },
      { cor: "green", icone: "reciclar", titulo: "<b>Reaproveitar</b>", texto: "a água da chuva ajuda a regar as plantas" }
    ]
  },
  energia: {
    titulo: "Energia",
    linhas: [
      { cor: "yellow", icone: "energia", titulo: "<b>Apague</b> a luz", texto: "saiu do quarto? apague a luz" },
      { cor: "yellow", icone: "energia", titulo: "Tire da <b>tomada</b>", texto: "aparelhos desligados ainda podem gastar energia" },
      { cor: "green", icone: "folha", titulo: "Luz do <b>sol</b>", texto: "de dia, abra a janela" },
      { cor: "blue", icone: "reciclar", titulo: "Lâmpada <b>LED</b>", texto: "gasta menos energia" },
      { cor: "yellow", icone: "energia", titulo: "Energia da <b>natureza</b>", texto: "a energia de casa vem de fontes da natureza, como o sol, o vento e a água dos rios" }
    ]
  },
  natureza: {
    titulo: "Natureza",
    linhas: [
      { cor: "green", icone: "folha", titulo: "<b>Plantar</b> árvores", texto: "dão sombra, ar limpo e casa para os bichos" },
      { cor: "blue", icone: "agua", titulo: "Rios <b>limpos</b>", texto: "lixo no chão vai parar nos rios e no mar" },
      { cor: "brown", icone: "folha", titulo: "<b>Respeitar</b> os bichos", texto: "observe de longe e não alimente" },
      { cor: "yellow", icone: "reciclar", titulo: "<b>Economizar</b> papel", texto: "use os dois lados da folha" },
      { cor: "green", icone: "folha", titulo: "<b>Desmatamento</b>", texto: "cortar florestas deixa os animais sem casa e coloca mais gás carbônico no ar" },
      { cor: "green", icone: "folha", titulo: "<b>Parques</b> e praças", texto: "jogue o lixo na lixeira, não arranque flores e não escreva nas árvores" }
    ]
  }
};

const janela = document.getElementById("modal");
if (janela) {
  const caixa = janela.querySelector(".bin-list");
  const espacoVideo = janela.querySelector(".video-slot");
  const corpo = janela.querySelector(".modal-body");
  const dica = janela.querySelector(".scroll-hint");
  const titulo = janela.querySelector("h2");

  function abrirJanela(tema) {
    const dados = TEMAS[tema];
    titulo.textContent = dados.titulo;
    janela.querySelector(".learn-modal").setAttribute("aria-label", dados.titulo);
    // Monta uma linha para cada item do tema
    caixa.innerHTML = dados.linhas.map(function (linha) {
      const quadrado = linha.icone
        ? '<span class="bin-color icone clay ' + linha.cor + '">' + ICONES[linha.icone] + "</span>"
        : '<span class="bin-color clay ' + linha.cor + '"></span>';
      return '<div class="bin-row">' + quadrado + "<div><strong>" + linha.titulo +
        "</strong><small>" + linha.texto + "</small></div></div>";
    }).join("");
    // Vídeo do Tito: quando tiver o arquivo, escreva o caminho em "video" no TEMAS (ex.: "videos/agua.mp4")
    if (dados.video) {
      espacoVideo.innerHTML = '<video controls preload="metadata" src="' + dados.video + '"' +
        (dados.capa ? ' poster="' + dados.capa + '"' : "") + "></video>";
    } else {
      espacoVideo.innerHTML = '<div class="video-vazio"><span class="video-play">' +
        '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>' +
        "<strong>Vídeo do Tito</strong><small>em breve</small></div>";
    }
    janela.hidden = false;
    corpo.scrollTop = 0;
    atualizarDica();
  }
  // Mostra "Role para ver mais" enquanto ainda tem conteúdo embaixo
  function atualizarDica() {
    const temMais = corpo.scrollHeight - corpo.scrollTop - corpo.clientHeight > 6;
    dica.hidden = !temMais;
  }
  corpo.addEventListener("scroll", atualizarDica);
  window.addEventListener("resize", atualizarDica);
  function fecharJanela() { janela.hidden = true; }

  // Cada cartão tem data-tema="lixeira" (ou agua, energia, natureza)
  document.querySelectorAll("[data-tema]").forEach(function (cartao) {
    cartao.addEventListener("click", function () { abrirJanela(cartao.dataset.tema); });
  });
  janela.addEventListener("click", function (e) { if (e.target === janela) fecharJanela(); }); // clicar fora
  janela.querySelector(".modal-close").addEventListener("click", fecharJanela);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharJanela(); });
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
      elFeedback.textContent = "Quase! Veja a resposta certa em destaque."; trocarRosto(elTito, "timido");
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
        elDica.className = "errado"; elDica.textContent = "Era a lixeira de " + certa.toLowerCase() + "."; trocarRosto(elTitoLixeira, "timido");
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
    if (selecionada === null) { selecionada = posicao; desenhar(); return; }
    // segunda peça escolhida: troca as duas de lugar
    const temp = ordem[selecionada];
    ordem[selecionada] = ordem[posicao];
    ordem[posicao] = temp;
    selecionada = null;
    trocas++;
    if (desenhar() === total) {
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

  // Título, rostinho do Tito e frase de acordo com as estrelas
  const resultados = [
    { rosto: "triste",    titulo: "Vamos tentar de novo!", frase: "Não desanime, o Tito acredita em você." },
    { rosto: "timido",    titulo: "Pode melhorar!",        frase: "Você está aprendendo. Tente mais uma vez!" },
    { rosto: "confiante", titulo: "Pode melhorar!",        frase: "Foi bem! Com mais uma tentativa fica ainda melhor." },
    { rosto: "confiante", titulo: "Quase lá!",             frase: "Falta pouquinho para ficar perfeito." },
    { rosto: "feliz",     titulo: "Muito bem!",            frase: "Você mandou muito bem!" },
    { rosto: "empolgado", titulo: "Perfeito!",             frase: "Você é um super guardião da natureza!" }
  ];
  const r = resultados[estrelas];
  document.getElementById("resultado-titulo").textContent = r.titulo;
  trocarRosto(document.querySelector(".completion-content .mascot"), r.rosto);

  // Texto com o resultado de cada jogo (a e t são os dois números que o jogo mandou)
  const detalhes = {
    "quiz.html": function () { return "Você acertou " + a + " de " + t + " perguntas. "; },
    "lixeira.html": function () { return "Você acertou " + a + " de " + t + " itens. "; },
    "memoria.html": function () { return "Você achou os " + a + " pares em " + t + " tentativas. "; },
    "quebra-cabeca.html": function () { return "Você montou as " + a + " peças com " + t + " trocas. "; },
    "caca-palavras.html": function () { return t === 0 ? "Você achou as " + a + " palavras sem errar nenhuma vez! " : "Você achou as " + a + " palavras com " + t + (t === 1 ? " tentativa errada. " : " tentativas erradas. "); },
    "palavras-cruzadas.html": function () { return t === 0 ? "Você completou as palavras cruzadas sem usar dicas! " : "Você completou as palavras cruzadas usando " + t + (t === 1 ? " dica. " : " dicas. "); }
  };
  document.getElementById("resultado-frase").textContent = (params.has("a") && detalhes[jogo] ? detalhes[jogo]() : "") + r.frase;

  // 5 estrelas: as primeiras ficam amarelas, o resto fica vazio
  const caixaEstrelas = document.getElementById("estrelas");
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.className = "star-badge clay" + (i <= estrelas ? "" : " vazia");
    estrela.innerHTML = ICONES.estrela;
    estrela.setAttribute("aria-hidden", "true");
    caixaEstrelas.appendChild(estrela);
  }
  caixaEstrelas.setAttribute("role", "img");
  caixaEstrelas.setAttribute("aria-label", estrelas + " de 5 estrelas");
}
