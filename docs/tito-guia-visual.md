# Tito — guia visual do mascote

Este guia define **como o Tito deve ser** em qualquer imagem nova, seja uma ilustração 3D renderizada ou um modelo 3D interativo, para que ele continue reconhecível. Ele também diz **quais arquivos o site espera**, para que a troca das imagens não quebre nada.

> Regra de ouro: o novo Tito é uma **evolução** do atual, não um personagem novo.
> Antes de trocar qualquer arquivo, compare a imagem nova lado a lado com `imagens/mascote-hero-anexo.png`.

---

## 1. Traços obrigatórios (checklist)

Use esta lista para aprovar ou recusar qualquer versão nova:

- [ ] **Cabeça grande e arredondada**, um pouco mais larga em cima (formato de "gota deitada"), ocupando cerca de 45% da altura total do corpo.
- [ ] **Duas folhinhas** no topo da cabeça, saindo de um único ponto, uma maior que a outra, inclinadas para lados opostos.
- [ ] **Olhos muito grandes** e brilhantes: íris verde-escura, pupila preta, dois pontos de brilho branco. Os olhos ficam na metade de baixo da cabeça e bem separados.
- [ ] **Sobrancelhas** curtas e grossas, em verde-escuro.
- [ ] **Boca aberta e sorridente**, com língua rosada (nas expressões felizes).
- [ ] **Manchas arredondadas** em verde mais escuro na cabeça, nos braços e nas pernas (são as "escamas" da tartaruga).
- [ ] **Casco = planeta Terra**: oceano azul com continentes verdes, nas costas e aparecendo dos lados.
- [ ] **Barriga amarelada** (plastrão), com placas suaves e a borda de baixo em "dentinhos".
- [ ] **Bandana verde-escura** no pescoço, em formato de triângulo, com uma **folha branca** desenhada.
- [ ] **Pés com "unhas" claras** em formato de meia-lua.
- [ ] Proporção de **bebê/filhote**: corpo curto, braços e pernas roliços, sem pescoço comprido.

## 2. Paleta de cores (aproximada, medida na imagem atual)

| Parte | Cor | Observação |
|---|---|---|
| Pele (meio-tom) | `#9cc84a` | verde-limão quente |
| Pele (luz) | `#c2d65b` | topo da cabeça e bochechas |
| Manchas | `#4d7b4c` a `#5f8f3e` | sempre mais escuras que a pele |
| Folhinhas | `#52822e` | verde-folha com nervura mais clara |
| Barriga | `#ddbe61` | amarelo-areia |
| Bandana | `#265b25` | com folha branca `#f5f2e9` |
| Casco: oceano | `#054d7d` a `#1f6fb5` | azul profundo |
| Casco: continentes | `#94c73a` | verde vivo |
| Boca/língua | `#da7b5d` | coral suave |

Essas cores conversam com a paleta do site (variáveis `--leaf`, `--lime` e `--card-blue` no `css/style.css`).

## 3. Estilo do acabamento 3D

- Aparência de **brinquedo de vinil ou massinha macia**, que combina com o estilo *claymorphism* do site. Nada de realismo de réptil (sem escamas detalhadas, sem textura de pele áspera).
- **Luz principal suave** vindo de cima e da esquerda, mais uma **luz de contorno** fraca atrás (separa o Tito do fundo).
- Material com leve **translucidez** (subsurface) na pele e brilho suave, nunca espelhado.
- **Sombras de contato** suaves só no modelo 3D. Nas imagens PNG, sem sombra no chão (o site desenha a sua).
- Contorno limpo, **sem halo** branco ou amarelado nas bordas. A imagem `tito-rodape.png` atual tem esse defeito e por isso saiu do site.

## 4. Arquivos que o site usa (manter os MESMOS nomes)

Trocar as imagens **sem mudar os nomes** evita qualquer mudança no código. Exporte sempre **PNG com fundo transparente** e, se puder, também uma cópia **.webp** com o mesmo nome. O site usa o WebP quando existe e o PNG como reserva.

| Uso no site | Arquivo | Tamanho para exportar | Enquadramento |
|---|---|---|---|
| Página inicial (grande) e página Sobre | `imagens/mascote-hero-anexo.png` (+ `.webp`) | **1052 × 1808 px** (o dobro do atual, mesma proporção) | corpo inteiro, acenando, pés tocando a borda de baixo |
| Expressões (jogos, títulos, tela final, EcoBot) | `imagens/tito/<expressão>.png` (+ `.webp`) | **600 × 650 px** em todas (proporção 12:13) | busto: cabeça e ombros |
| Faixa "Hora de jogar!" | usa `imagens/tito/empolgado.png` | — | — |
| Botão do EcoBot | usa `imagens/tito/feliz.png` (recortado em círculo pelo CSS) | — | — |

### Regras das 15 expressões (o mais importante para o Tito não "pular")

Todas as expressões precisam ter **o mesmo enquadramento**. Por isso, use um molde:

1. Tela de **600 × 650 px**, fundo transparente.
2. A **ponta da folha mais alta** fica a cerca de **20 px do topo**.
3. O **queixo** fica a cerca de **62% da altura** (aprox. 400 px).
4. A cabeça fica **centralizada** na horizontal. Braços levantados (empolgado, animado) podem chegar perto das bordas, mas não podem ser cortados.
5. O busto termina em **degradê suave** até transparente nos últimos 40 px de baixo (sem corte reto).
6. Mesma câmera, mesma luz e mesma escala em todas: **só a expressão muda**.

Expressões que o site usa (nomes dos arquivos):

| Arquivo | Expressão | Onde aparece |
|---|---|---|
| `feliz` | sorriso aberto, olhando para a frente | títulos das páginas, EcoBot, tela final (4 estrelas) |
| `animado` | sorriso grande, olhos arregalados | memória, quiz e lixeira (acertou) |
| `empolgado` | braços para cima, boca aberta | faixa "Hora de jogar!", tela final (5 estrelas) |
| `rindo` | olhos fechados de rir | reação ao passar o mouse |
| `curioso` | olhar para cima, mão no queixo | lixeira certa |
| `pensativo` | olhar de lado, pensando | quiz e palavras cruzadas |
| `confiante` | sorriso de lado, piscando | tela final (2 ou 3 estrelas) |
| `timido` | sorriso sem graça | quiz e lixeira (errou), tela final (1 estrela) |
| `triste` | boca para baixo, olhos brilhando | tela final (0 estrela) |
| `surpreso`, `chateado`, `com-medo`, `bravo`, `vergonhoso`, `cansado` | — | já existem, para uso futuro |

## 4b. Diagnóstico das imagens atuais (medido em novembro de 2026)

Medi cada arquivo: resolução, bordas, halo (contorno claro que sobrou do fundo branco), cortes e **nitidez**.
A nitidez foi comparada com o próprio Tito grande (`mascote-hero-anexo.png`) reduzido ao mesmo tamanho.

| Arquivo | Resolução | Nitidez (referência = 18) | Problemas encontrados |
|---|---|---|---|
| `tito/*.png` (15 expressões) | 202–272 × 276–340 px | **7,5 a 10,8** | imagens **borradas na origem** (já vieram ampliadas); **halo claro** em 14–27% da borda, que aparece como contorno esbranquiçado no tema escuro; tamanhos e enquadramentos diferentes entre si; verde mais claro e "lavado" que o do Tito grande; busto cortado em linha quase reta nas laterais |
| `mascote-hero-anexo.png` | 526 × 904 px | 18,0 (quando reduzido) | **a melhor imagem do projeto**: nítida e com bordas limpas. Só fica pequena para telas muito nítidas (precisaria do dobro para a página Sobre e o início em telas 2×) |
| `tito-rodape.png` | 732 × 1016 px | 4,0 | resolução alta, mas **muito borrada** (foi ampliada artificialmente), com bordas serrilhadas e halo amarelado. **Já não é usada no site** |
| `mascote-site.png` | 1254 × 1254 px | — | folha de personagem com fundo manchado; os rostos nela são pequenos (cerca de 200 px). **Não serve como fonte** e não é usada no site |

**Conclusões:**
- O borrado das expressões **não vem do CSS nem do WebP**. No título das páginas, o Tito aparece com até 150 px de altura, e o arquivo tem cerca de 300 px. Ou seja, não há ampliação. O WebP também foi comparado com o PNG e é praticamente idêntico (diferença de ~40 dB, imperceptível). O problema está nos **arquivos de origem**.
- Por isso, aumentar o tamanho por CSS ou converter de novo **não resolve**. É preciso **gerar as expressões de novo**, a partir da mesma arte do Tito grande, seguindo o molde abaixo.
- Uma melhora que já é possível sem arte nova: um **recorte de busto feito a partir do Tito grande**, apenas reduzido, nunca ampliado. Ele é bem mais nítido e não tem halo, mas mostra o Tito acenando. Esse recorte **não foi colocado no site**: depende da sua aprovação.

### Arquivos novos que precisam ser produzidos (mesmos nomes, para não mexer no código)

| Arquivo | Tamanho | Observações |
|---|---|---|
| `imagens/tito/<expressão>.png` (as 15 da tabela abaixo) | **600 × 650 px** | mesmo molde, mesma luz e **mesmo verde do Tito grande**; fundo 100% transparente, **sem halo** (recorte feito sobre fundo transparente ou com "defringe"); exportar também `.webp` com o mesmo nome |
| `imagens/mascote-hero-anexo.png` | **1052 × 1808 px** | mesma pose e proporção do atual; exportar também `.webp` |

Ao gerar com uma ferramenta de imagem, peça **"fundo transparente"** de verdade. Não use "fundo branco removido depois", porque é isso que cria o halo.
Depois de trocar um PNG, gere o `.webp` de novo (ex.: squoosh.app) ou apague o `.webp` antigo. Senão, o site continua mostrando a imagem velha.

## 5. Interatividade: as duas opções

### Opção A: ilustração 3D em camadas (PNG + CSS/JavaScript)

O Tito continua sendo imagem, mas dividido em **camadas**: um arquivo com o corpo **sem as pupilas** e um arquivo só com as **pupilas**. Assim, o JavaScript move as pupilas atrás do mouse e desenha as pálpebras para piscar.

- **Visual:** o mesmo das ilustrações, só com os olhos e a cabeça se mexendo.
- **Desempenho:** excelente (poucos KB e nenhuma biblioteca).
- **Arquivos necessários:** `tito-corpo-sem-pupilas.png`, `tito-pupila.png` e `tito-palpebra.png`, todos alinhados no mesmo molde.
- **Limite:** o corpo não gira de verdade, só "inclina".

### Opção B: modelo 3D interativo (GLB + Three.js) ⭐ preferida

Um modelo 3D de verdade, que vira a cabeça, mexe os olhos e pisca.

- **Visual:** o mais natural e o mais "animação 3D".
- **Desempenho:** bom, se o arquivo for leve (veja abaixo). A biblioteca Three.js (cerca de 700 KB) **só é baixada na página inicial e só quando o modelo existe**.
- **Já está pronto no código:** `js/tito.js` (parte "MODO 2"). Ele faz:
  - os **olhos** seguirem o mouse rapidamente e a **cabeça** acompanhar mais devagar (movimentos independentes);
  - **piscadas** em intervalos aleatórios, às vezes duas seguidas;
  - **respiração** (a do arquivo, se existir; senão, uma respiração simples feita pelo código);
  - **sorriso** enquanto o mouse está em cima e **surpresa** rápida ao clicar (se o modelo tiver essas expressões).
- **Testado** com um modelo geométrico de teste (não é o Tito e não foi colocado no projeto): carrega, aparece no lugar da imagem, encontra cabeça, olhos e expressões.
- **Página para aprovar o modelo:** `ferramentas/tito-3d.html`. Escolha o arquivo `.glb` e ela mostra o Tito atual ao lado e uma lista do que está certo ou faltando.

**O que já funciona hoje, sem arquivo novo:** o Tito "respira", inclina levemente na direção do mouse e dá um pulinho quando o mouse passa por cima. Nos títulos das páginas, ele ri. Os olhos ainda **não** seguem o mouse, porque nos PNGs atuais os olhos fazem parte do desenho.

## 6. Requisitos do arquivo 3D (`modelos/tito.glb`)

Entregue isto para quem for modelar (ou confira ao gerar o modelo):

- **Formato:** `.glb` (glTF binário), **sem** compressão Draco ou Meshopt.
- **Peso:** ideal **até 2 MB**, máximo 5 MB.
- **Polígonos:** até cerca de **30 mil triângulos**.
- **Texturas:** até **1024 × 1024 px** (no máximo 2048), materiais PBR (*metallic/roughness*).
- **Orientação:** eixo Y para cima, Tito **de frente para +Z** (olhando para a câmera), pés no chão (origem nos pés).
- **Peças com estes nomes exatos** (o código procura por eles):
  - `Cabeca` (ou `Head`): objeto ou osso da cabeça, com o ponto de giro no pescoço.
  - `OlhoE` e `OlhoD` (ou `Eye_L` e `Eye_R`): os olhos **separados**, com o ponto de giro no **centro do globo ocular**.
- **Piscar:** um *shape key / morph target* chamado **`piscar`** (ou `blink`), que fecha as pálpebras (0 = aberto, 1 = fechado).
- **Opcional (recomendado):** *shape keys* **`sorriso`** (ou `smile`) e **`surpreso`** (ou `surprise`), para as reações ao mouse.
- **Opcional:** uma animação chamada **`parado`** (ou `idle`), com respiração e um leve balanço em loop. Se existir, ela toca sozinha; se não existir, o código faz uma respiração simples.
- **Aparência:** tudo o que está nas seções 1 a 3 deste guia: folhas, manchas, olhos grandes, bandana com folha e casco-planeta. Use `imagens/mascote-hero-anexo.png` como referência de frente.

### Como produzir o modelo (opções gratuitas)
- **Blender** (gratuito): modelar a partir da imagem de referência, ou ajustar um modelo gerado por ferramenta de "imagem para 3D". Modelos gerados automaticamente **quase sempre** precisam de ajuste: separar os olhos, criar as *shape keys* e dar os nomes certos às peças.
- Na exportação (File → Export → glTF 2.0): formato **glTF Binary (.glb)**, marcar *Shape Keys* e *Animations*, e **não** marcar a compressão Draco.

### Como ligar o Tito 3D depois de ter o arquivo

0. Teste antes em `ferramentas/tito-3d.html` ("Escolher um arquivo .glb") e só continue se a lista estiver toda certa e o Tito estiver parecido com o atual.
1. Crie a pasta `modelos/` e coloque o arquivo como `modelos/tito.glb`.
2. Abra `js/tito.js` e troque a linha `const MODELO_3D = "";` por `const MODELO_3D = "modelos/tito.glb";`.
3. Abra a página inicial. Se algo der errado, a imagem continua no lugar e aparece um aviso no console (F12).

> O Tito atual **não foi removido**: as imagens continuam sendo usadas até a nova versão ser aprovada.
