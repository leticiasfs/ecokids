/* ============================================================
   EcoKids - Tito interativo
   Este arquivo só cuida do "jeito vivo" do Tito. Ele não muda nada nos jogos.

   MODO 1 - IMAGEM (o que funciona hoje, com os PNGs de imagens/tito/)
     - o Tito "respira" devagar;
     - inclina um pouquinho na direção do mouse;
     - dá um pulinho quando o mouse passa por cima;
     - nos Titos decorativos com data-reacao="rindo", a expressão muda enquanto o mouse está em cima.
     Os olhos NÃO seguem o mouse neste modo, porque nos PNGs os olhos fazem parte do desenho.

   MODO 2 - 3D (preparado e DESLIGADO até o modelo do Tito ser aprovado)
     - O arquivo esperado é modelos/tito.glb (requisitos em docs/tito-guia-visual.md).
     - Para ligar no site: escreva o caminho em MODELO_3D, logo abaixo.
     - Antes de ligar, teste o arquivo na página ferramentas/tito-3d.html (ela mostra o que está
       faltando no modelo e deixa comparar com o Tito atual).
     - A biblioteca Three.js vem da internet (CDN jsDelivr, gratuita) e SÓ é baixada quando há modelo.
     - Se algo der errado (sem internet, navegador sem WebGL, arquivo faltando), a imagem continua lá.

   Quem pediu "reduzir movimento" no sistema vê o Tito parado (só a imagem).
   ============================================================ */
(function () {
  "use strict";

  const MODELO_3D = "";            // ex.: "modelos/tito.glb"  (vazio = o site usa só as imagens)
  const VERSAO_THREE = "0.160.0";  // versão fixa da biblioteca 3D

  // Nomes que o código procura dentro do modelo (o artista pode usar português ou inglês)
  const NOMES = {
    cabeca: ["Cabeca", "Head"],
    olhoE: ["OlhoE", "Olho_E", "Eye_L", "EyeL"],
    olhoD: ["OlhoD", "Olho_D", "Eye_R", "EyeR"],
    piscar: ["piscar", "blink"],
    sorriso: ["sorriso", "smile"],
    surpreso: ["surpreso", "surprise"],
    animacao: ["parado", "idle"]
  };

  const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function limitar(n) { return Math.max(-1, Math.min(1, n)); }

  // Onde está o mouse (null = fora da janela). Usado pelos dois modos.
  let ponteiro = null;
  window.addEventListener("pointermove", function (e) { ponteiro = { x: e.clientX, y: e.clientY }; }, { passive: true });
  document.documentElement.addEventListener("pointerleave", function () { ponteiro = null; });

  // A página de teste (ferramentas/tito-3d.html) usa esta função para carregar um modelo.
  window.EcoKidsTito3D = { carregar: carregar3D, nomesEsperados: NOMES };

  /* ---------- MODO 1: IMAGEM ---------- */
  const titos = Array.prototype.filter.call(document.querySelectorAll(".mascot"), function (el) {
    return !el.classList.contains("ecobot-avatar");
  });

  if (!calmo && titos.length) {
    titos.forEach(function (el) {
      el.classList.add("tito-vivo");
      el.addEventListener("pointerenter", function () {
        el.classList.remove("tito-pula");
        void el.offsetWidth;            // reinicia a animação
        el.classList.add("tito-pula");
      });
      el.addEventListener("animationend", function (e) {
        if (e.animationName === "tito-pula") el.classList.remove("tito-pula");
      });
      // troca de expressão só nos Titos decorativos (os dos jogos são controlados pelo jogo)
      const reacao = el.dataset.reacao;
      if (reacao && typeof trocarRosto === "function") {
        const original = (el.className.match(/\brosto-[\w-]+/) || [""])[0].replace("rosto-", "");
        el.addEventListener("pointerenter", function () { trocarRosto(el, reacao); });
        el.addEventListener("pointerleave", function () { if (original) trocarRosto(el, original); });
      }
    });

    // Inclinação na direção do mouse: os valores mudam aos poucos (efeito suave)
    if (temMouse) {
      const estado = new Map();
      let rodando = false;
      const passo = function () {
        let mexendo = false;
        titos.forEach(function (el) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) return;   // fora da tela
          let alvoX = 0, alvoY = 0;
          if (ponteiro) {
            alvoX = limitar((ponteiro.x - (r.left + r.width / 2)) / 450);
            alvoY = limitar((ponteiro.y - (r.top + r.height * 0.35)) / 450);
          }
          const s = estado.get(el) || { x: 0, y: 0 };
          s.x += (alvoX - s.x) * 0.1;
          s.y += (alvoY - s.y) * 0.1;
          estado.set(el, s);
          el.style.setProperty("--tito-x", s.x.toFixed(3));
          el.style.setProperty("--tito-y", s.y.toFixed(3));
          if (Math.abs(alvoX - s.x) > 0.003 || Math.abs(alvoY - s.y) > 0.003) mexendo = true;
        });
        if (mexendo) requestAnimationFrame(passo); else rodando = false;
      };
      const acordar = function () { if (!rodando) { rodando = true; requestAnimationFrame(passo); } };
      window.addEventListener("pointermove", acordar, { passive: true });
      document.documentElement.addEventListener("pointerleave", acordar);
    }
  }

  /* ---------- MODO 2: 3D no site (só se MODELO_3D estiver preenchido) ---------- */
  const alvo3D = document.querySelector("[data-tito-3d]");
  if (MODELO_3D && alvo3D && !calmo) {
    carregar3D(alvo3D, MODELO_3D).catch(function (erro) {
      console.warn("Tito 3D não carregou; a imagem continua no lugar.", erro);
    });
  }

  function temWebGL() {
    try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; }
  }

  function acharPeca(raiz, nomes) {
    let achou = null;
    raiz.traverse(function (o) {
      if (!achou && nomes.some(function (n) { return o.name.toLowerCase() === n.toLowerCase(); })) achou = o;
    });
    return achou;
  }

  /* Carrega o modelo e coloca um <canvas> POR CIMA da imagem "img" (a imagem continua guardando o lugar).
     Devolve um relatório: o que foi encontrado no arquivo (usado pela página de teste). */
  async function carregar3D(img, caminho) {
    if (!temWebGL()) throw new Error("Este navegador não tem WebGL 2 (o 3D não funciona aqui).");
    const base = "https://cdn.jsdelivr.net/npm/three@" + VERSAO_THREE;
    const THREE = await import(base + "/+esm");
    const { GLTFLoader } = await import(base + "/examples/jsm/loaders/GLTFLoader.js/+esm");

    const resp = await fetch(caminho);
    if (!resp.ok) throw new Error("Arquivo do modelo não encontrado: " + caminho + " (HTTP " + resp.status + ")");
    const dados = await resp.arrayBuffer();
    const gltf = await new GLTFLoader().parseAsync(dados, "");

    const canvas = document.createElement("canvas");
    canvas.className = "tito-3d-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", img.alt || "Tito, a tartaruga do EcoKids");
    canvas.style.cssText = "position:absolute;opacity:0;transition:opacity .6s;pointer-events:none;";
    // (se a imagem estiver dentro de um <picture>, o canvas vai para o elemento de fora)
    const casa = img.parentElement.tagName === "PICTURE" ? img.parentElement.parentElement : img.parentElement;
    casa.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Luz suave de "massinha": luz geral + sol vindo de cima/esquerda + contraluz azulada
    const cena = new THREE.Scene();
    cena.add(new THREE.HemisphereLight(0xffffff, 0x6f9a4e, 1.3));
    const sol = new THREE.DirectionalLight(0xfff4dd, 2.2);
    sol.position.set(-2, 4, 5);
    cena.add(sol);
    const contraLuz = new THREE.DirectionalLight(0xcfe9f6, 1.0);
    contraLuz.position.set(3, 2, -4);
    cena.add(contraLuz);

    // Centraliza o modelo (altura 2) com os pés num "pivô" no chão; o pivô é quem "respira"
    const modelo = gltf.scene;
    const caixa = new THREE.Box3().setFromObject(modelo);
    const tamanho = caixa.getSize(new THREE.Vector3());
    modelo.scale.setScalar(2 / (tamanho.y || 1));
    caixa.setFromObject(modelo);
    const centro = caixa.getCenter(new THREE.Vector3());
    modelo.position.set(-centro.x, -caixa.min.y, -centro.z);
    const pivo = new THREE.Group();
    pivo.position.y = -1;
    pivo.add(modelo);
    cena.add(pivo);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.1, 1.15 / Math.tan(THREE.MathUtils.degToRad(14)));
    camera.lookAt(0, 0, 0);

    // Peças que se mexem
    const cabeca = acharPeca(modelo, NOMES.cabeca);
    const olhos = [acharPeca(modelo, NOMES.olhoE), acharPeca(modelo, NOMES.olhoD)].filter(Boolean);
    const giroCabeca = cabeca ? cabeca.rotation.clone() : null;
    const giroOlhos = olhos.map(function (o) { return o.rotation.clone(); });

    // Expressões e piscar: "morph targets" (shape keys) com os nomes combinados
    const morphs = { piscar: [], sorriso: [], surpreso: [] };
    const todosMorphs = new Set();
    let triangulos = 0;
    modelo.traverse(function (o) {
      if (o.isMesh && o.geometry) {
        const g = o.geometry;
        triangulos += (g.index ? g.index.count : g.attributes.position.count) / 3;
      }
      if (!o.morphTargetDictionary) return;
      Object.keys(o.morphTargetDictionary).forEach(function (nome) {
        todosMorphs.add(nome);
        Object.keys(morphs).forEach(function (chave) {
          if (NOMES[chave].some(function (n) { return n.toLowerCase() === nome.toLowerCase(); })) {
            morphs[chave].push({ malha: o, indice: o.morphTargetDictionary[nome] });
          }
        });
      });
    });
    function aplicarMorph(chave, valor) {
      morphs[chave].forEach(function (m) { m.malha.morphTargetInfluences[m.indice] = valor; });
    }

    // Animação "parado"/"idle" feita pelo artista, se existir
    let mixer = null, clipe = null;
    if (gltf.animations && gltf.animations.length) {
      clipe = NOMES.animacao.map(function (n) { return THREE.AnimationClip.findByName(gltf.animations, n); }).filter(Boolean)[0] || gltf.animations[0];
      mixer = new THREE.AnimationMixer(modelo);
      mixer.clipAction(clipe).play();
    }

    // Mantém o canvas exatamente em cima da imagem
    function encaixar() {
      const largura = img.offsetWidth, altura = img.offsetHeight;
      if (!largura || !altura) return;
      canvas.style.left = img.offsetLeft + "px";
      canvas.style.top = img.offsetTop + "px";
      canvas.style.width = largura + "px";
      canvas.style.height = altura + "px";
      renderer.setSize(largura, altura, false);
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
    }
    encaixar();
    new ResizeObserver(encaixar).observe(img);

    // Reações: sorriso enquanto o mouse está em cima; surpresa rápida ao clicar
    const expressao = { sorriso: 0, surpreso: 0 }, alvoExpr = { sorriso: 0, surpreso: 0 };
    let surpresaAte = 0;
    casa.addEventListener("pointerenter", function () { alvoExpr.sorriso = 1; });
    casa.addEventListener("pointerleave", function () { alvoExpr.sorriso = 0; });
    casa.addEventListener("click", function () { surpresaAte = performance.now() + 700; });

    // Só desenha quando o Tito está visível na tela e a aba está aberta
    let visivel = true;
    new IntersectionObserver(function (itens) { visivel = itens[0].isIntersecting; }).observe(canvas);

    const relogio = new THREE.Clock();
    const olhar = { x: 0, y: 0 }, cabecaVira = { x: 0, y: 0 };
    let proximaPiscada = 2 + Math.random() * 3, piscando = 0, tempo = 0;

    function quadro() {
      requestAnimationFrame(quadro);
      if (!visivel || document.hidden) { relogio.getDelta(); return; }
      const dt = Math.min(relogio.getDelta(), 0.1);
      tempo += dt;
      if (mixer) mixer.update(dt);
      else {
        // respiração simples quando o modelo não traz a animação "parado"
        const r = Math.sin(tempo * 1.9) * 0.5 + 0.5;
        pivo.scale.set(1 - r * 0.006, 1 + r * 0.014, 1 - r * 0.006);
      }

      // para onde olhar: o mouse (ou a frente, se o mouse saiu)
      let alvoX = 0, alvoY = 0;
      if (ponteiro) {
        const rc = canvas.getBoundingClientRect();
        alvoX = limitar((ponteiro.x - (rc.left + rc.width / 2)) / (rc.width * 1.5));
        alvoY = limitar((ponteiro.y - (rc.top + rc.height * 0.3)) / (rc.height * 1.5));
      }
      // os olhos chegam primeiro; a cabeça acompanha mais devagar (parece mais natural)
      olhar.x += (alvoX - olhar.x) * Math.min(1, dt * 9);
      olhar.y += (alvoY - olhar.y) * Math.min(1, dt * 9);
      cabecaVira.x += (alvoX - cabecaVira.x) * Math.min(1, dt * 3);
      cabecaVira.y += (alvoY - cabecaVira.y) * Math.min(1, dt * 3);
      if (cabeca) {
        cabeca.rotation.y = giroCabeca.y + cabecaVira.x * 0.4;
        cabeca.rotation.x = giroCabeca.x + cabecaVira.y * 0.22;
        cabeca.rotation.z = giroCabeca.z - cabecaVira.x * 0.07 + Math.sin(tempo * 0.9) * 0.015;   // inclinação leve
      }
      olhos.forEach(function (o, i) {
        o.rotation.y = giroOlhos[i].y + (olhar.x - cabecaVira.x * 0.6) * 0.45;
        o.rotation.x = giroOlhos[i].x + (olhar.y - cabecaVira.y * 0.6) * 0.3;
      });

      // expressões (mudam aos poucos)
      alvoExpr.surpreso = performance.now() < surpresaAte ? 1 : 0;
      ["sorriso", "surpreso"].forEach(function (k) {
        expressao[k] += (alvoExpr[k] - expressao[k]) * Math.min(1, dt * 6);
        aplicarMorph(k, expressao[k]);
      });

      // piscar de tempos em tempos (0,15 s fechando e abrindo); às vezes pisca duas vezes
      proximaPiscada -= dt;
      if (proximaPiscada <= 0) { piscando = 0.15; proximaPiscada = Math.random() < 0.2 ? 0.25 : 2.5 + Math.random() * 4; }
      if (piscando > 0) {
        piscando = Math.max(0, piscando - dt);
        aplicarMorph("piscar", 1 - Math.abs(piscando / 0.15 * 2 - 1));   // 0 -> 1 -> 0
      }

      renderer.render(cena, camera);
    }
    quadro();

    // troca suave: aparece o 3D e a imagem fica invisível (mas continua no lugar, guardando o espaço)
    requestAnimationFrame(function () {
      canvas.style.opacity = "1";
      img.style.visibility = "hidden";
    });

    // relatório para a página de teste
    return {
      tamanhoMB: dados.byteLength / 1048576,
      triangulos: Math.round(triangulos),
      cabeca: cabeca ? cabeca.name : null,
      olhos: olhos.map(function (o) { return o.name; }),
      piscar: morphs.piscar.length > 0,
      sorriso: morphs.sorriso.length > 0,
      surpreso: morphs.surpreso.length > 0,
      animacao: clipe ? clipe.name : null,
      morphsEncontrados: Array.from(todosMorphs),
      proporcao: (tamanho.x / tamanho.y).toFixed(2)
    };
  }
})();
