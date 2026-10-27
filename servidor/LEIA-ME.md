# Mini servidor do EcoBot

Este servidor fica entre o site e a IA do Google (Gemini). O site manda a conversa para ele, ele usa a **chave guardada em segredo** e devolve só o texto. A chave nunca fica no GitHub nem no navegador.

Escrito por Claude (Anthropic) a pedido de Leticia Emanuelle e Ana Forte.

## Onde ele fica e quanto custa
Fica na **Cloudflare Workers**. O plano gratuito permite **100 mil pedidos por dia**, sem cartão de crédito, o que sobra para um trabalho de faculdade. A IA (Gemini) também tem um plano gratuito no Google AI Studio, com limite de uso por minuto e por dia. Se o limite acabar, o EcoBot pede para tentar de novo mais tarde.

## Passo a passo (pelo navegador, sem instalar nada)
1. Crie uma conta grátis em https://dash.cloudflare.com/sign-up
2. Menu **Workers & Pages** → **Create** → **Create Worker** → nome `ecobot` → **Deploy**.
3. Clique em **Edit code**, apague tudo e cole o conteúdo de `servidor/worker.js`. Clique em **Deploy**.
4. Vá em **Settings → Variables and Secrets → Add**: tipo **Secret**, nome `GEMINI_API_KEY`, valor = sua chave do Google AI Studio. Salve e faça **Deploy** de novo.
5. Copie o endereço do Worker (algo como `https://ecobot.SEU-USUARIO.workers.dev`).
6. No site, abra `js/script.js`, procure `const ECOBOT_URL = "";` e cole o endereço entre as aspas. Salve, faça commit e push.

Depois disso o EcoBot funciona também no site publicado (leticiasfs.github.io/ecokids) e você pode apagar `js/config.js`.

> Dica de segurança: como a chave já foi colada em uma conversa, gere uma chave nova no Google AI Studio para usar no passo 4.

## Proteções que já estão no servidor
- Só aceita pedidos vindos de `leticiasfs.github.io` e do Live Server (`localhost:5500/5501`). Para outro endereço, edite `ORIGENS_PERMITIDAS` no começo de `worker.js`.
- Limite de 15 mensagens por minuto por pessoa; mensagens da criança com até 300 caracteres.
- Bloqueia telefone, e-mail e CPF digitados no chat (nem chegam na IA).
- Filtros de segurança do Google no nível mais rígido.
- A personalidade e as regras ficam no servidor, então ninguém consegue mudá-las mexendo no site.

## Como "treinar" o EcoBot
Não precisa treinar a IA do zero: o Gemini já conversa sobre muita coisa. O que dá a ele o jeito EcoKids são três partes, todas no começo de `worker.js`:

1. **`PERSONALIDADE`**: quem ele é, como fala, **os 3 assuntos permitidos (meio ambiente, natureza e amizade)**, o que fazer fora desses assuntos e as regras de segurança com crianças (dados pessoais, tristeza, bullying, Disque 100 e CVV 188).
2. **`CONHECIMENTO`**: fatos que ele deve usar, como as cores das lixeiras, dicas de água e energia, biomas, animais e dicas de amizade. Quanto mais fatos certos você colocar, melhores as respostas. Pode copiar o texto dos cards do Aprenda.
3. **Exemplos** (no fim de `CONHECIMENTO`): pares "Criança / EcoBot" que mostram o tom. Acrescente exemplos de perguntas reais que o bot errou.

Para melhorar: teste o bot, anote respostas ruins, corrija a instrução ou o conhecimento, publique de novo (Edit code → colar → Deploy). Isso é ajustar o *prompt*, que é o jeito recomendado; treinar um modelo de verdade (*fine-tuning*) é caro e desnecessário aqui.

## Teste rápido
Com o Worker publicado, abra o site, clique em **EcoBot** e pergunte "Por que reciclar?". Depois teste fora do tema ("quem ganhou o jogo?"): ele deve voltar para a natureza com gentileza.
