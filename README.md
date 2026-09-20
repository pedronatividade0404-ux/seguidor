# Nexa Campaigns

Sistema Next.js de campanhas com comprovação manual.

## Recursos

- Perfil TikTok + seleção 20/50/100/500
- Etapa de instruções
- Temporizador de 3 minutos
- Upload de imagem
- Armazenamento em Vercel Blob
- `campaigns.json` persistido como objeto JSON no Blob
- Embed no Discord
- Botões Aprovar e Apagar
- Validação de assinatura das interações do Discord
- Interface preta/branca futurista

## 1. Instalação

```bash
npm install
npm run dev
```

## 2. Variáveis

Copie `.env.example` para `.env.local` e preencha:

- `CAMPAIGN_URL`
- `DISCORD_WEBHOOK_URL`
- `DISCORD_PUBLIC_KEY`
- `BLOB_READ_WRITE_TOKEN`

## 3. Vercel Blob

No projeto da Vercel, crie um Blob Store e vincule-o ao projeto. A Vercel fornecerá `BLOB_READ_WRITE_TOKEN`.

O JSON fica armazenado como `data/campaigns.json` no Blob. Isso evita depender do filesystem efêmero das funções da Vercel.

## 4. Discord

Crie uma aplicação no Discord Developer Portal, crie um webhook no canal e copie:

- URL do webhook para `DISCORD_WEBHOOK_URL`
- Public Key da aplicação para `DISCORD_PUBLIC_KEY`

Configure a URL pública de interações da aplicação para:

`https://SEU-DOMINIO.vercel.app/api/discord/interactions`

O endpoint responde ao Ping do Discord e valida `x-signature-ed25519` / `x-signature-timestamp`.

## 5. Deploy

Suba o projeto para GitHub e importe no Vercel.

Ou:

```bash
npm install -g vercel
vercel
```

Depois configure as variáveis de ambiente no painel da Vercel e faça redeploy.

## Observação

O arquivo `data/campaigns.json` local é apenas fallback para desenvolvimento/self-hosting. Na Vercel, use o Blob para persistência.
