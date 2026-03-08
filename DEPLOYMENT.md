# 🚀 Deployment no Vercel

## Pré-requisitos

1. **Conta Vercel** - https://vercel.com
2. **Git configurado** com este repositório
3. **Credenciais Meta Ads:**
   - `META_ACCESS_TOKEN`
   - `META_AD_ACCOUNT_ID` (já configurado)
   - `META_APP_ID` (já configurado)

## Passo 1: Configurar Variáveis de Ambiente no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `gestor-trafego-profissional`
3. Vá para **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

```
Name: META_ACCESS_TOKEN
Value: [seu_token_aqui]
Environments: Production, Preview, Development

Name: VITE_META_API_BASE_URL
Value: https://graph.instagram.com/v19.0
Environments: All

Name: VITE_META_APP_ID
Value: 929453256689189
Environments: All

Name: VITE_META_AD_ACCOUNT_ID
Value: 188938172932947
Environments: All

Name: VITE_API_BASE_URL
Value: https://seu-projeto.vercel.app
Environments: Production
(Deixar em branco para Preview/Development)
```

## Passo 2: Fazer Deploy

### Opção A: Git Push Automático

```bash
cd ~/Projetos/gestor-trafego-profissional
git add .
git commit -m "feat: integrate Meta Ads real data and Vercel deployment"
git push origin main
```

O Vercel fará o deploy automaticamente quando detectar push na branch `main`.

### Opção B: CLI do Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
cd ~/Projetos/gestor-trafego-profissional
vercel

# Ou ir direto para produção
vercel --prod
```

## Passo 3: Verificar Deployment

1. Acesse o dashboard do Vercel
2. Aguarde o build completar (normalmente 1-2 minutos)
3. Clique no link de deploy ou em "Visit"
4. Verifique os dados no dashboard

### Testes de Integração

```bash
# Testar API localmente
curl "http://localhost:5173/api/meta-ads?action=campaigns"

# Testar após deployment
curl "https://seu-projeto.vercel.app/api/meta-ads?action=campaigns"
```

## Estrutura de Arquivos

```
gestor-trafego-profissional/
├── api/
│   └── meta-ads.ts              # Serverless function (Vercel)
├── src/
│   ├── hooks/
│   │   ├── useMetaAds.ts        # Queries da Meta Ads
│   │   └── useDashboardData.ts  # Hook inteligente com fallback
│   ├── components/
│   │   └── dashboard/           # Componentes do dashboard
│   ├── pages/
│   │   └── Index.tsx            # Página principal
│   └── data/
│       └── mockData.ts          # Dados de fallback
├── .env.example                 # Template de env vars
├── .env.local                   # Env vars locais (não versionar)
├── vercel.json                  # Config do Vercel
├── package.json
└── vite.config.ts
```

## Variáveis de Ambiente Explicadas

| Variável | Descrição | Onde Usar |
|----------|-----------|-----------|
| `META_ACCESS_TOKEN` | Token de acesso Meta Ads | Backend (api/) |
| `VITE_META_API_BASE_URL` | URL da Meta Graph API | Frontend (opcional) |
| `VITE_META_APP_ID` | ID da aplicação Meta | Frontend (info) |
| `VITE_META_AD_ACCOUNT_ID` | ID da conta de anúncios | Frontend (info) |
| `VITE_API_BASE_URL` | URL da API do backend | Frontend (queries) |

## Monitoramento

### Logs em Produção

```bash
# Ver logs do Vercel
vercel logs [projeto]

# Monitoramento em tempo real
vercel logs [projeto] --follow
```

### Alertas

O Vercel alertará automaticamente sobre:
- Builds que falharam
- Erros em runtime
- Performance degradada

## Troubleshooting

### Erro: "META_ACCESS_TOKEN não encontrado"

- ✅ Verificar se foi adicionado em **Environment Variables** no Vercel
- ✅ Fazer redeploy após adicionar variáveis
- ✅ Verificar se a variável está no ambiente **Production**

### Erro: "Falha ao buscar dados da Meta Ads"

- ✅ Verificar se o token ainda é válido (não expirou)
- ✅ Gerar novo token se necessário
- ✅ Verificar se a conta de anúncios tem campanhas ativas

### Dashboard mostra "Mock Data"

- ✅ API não está retornando dados
- ✅ Verificar logs: `vercel logs [projeto]`
- ✅ Conferir se `META_ACCESS_TOKEN` está configurado

### Build falha com erro de tipos

```bash
# Verificar tipos localmente
npm run typecheck

# Corrigir tipos antes de fazer push
npm run lint
```

## Rollback

Se algo der errado, fazer rollback:

```bash
# No Vercel Dashboard: Deployments → Selecionar versão anterior → Promote
# Ou via CLI:
vercel rollback
```

## Performance

### Otimizações Já Implementadas

- ✅ React Query com caching (5 minutos)
- ✅ Lazy loading de componentes
- ✅ Otimização de re-renders
- ✅ Compressão automática no Vercel

### Próximas Melhorias

- [ ] Incrementalidade ISR (Incremental Static Regeneration)
- [ ] WebWorkers para cálculos pesados
- [ ] Compressão de imagens
- [ ] Service Workers para offline

## Suporte

Para dúvidas ou problemas:

1. Verificar logs: `vercel logs`
2. Testar localmente: `npm run dev`
3. Verificar status da Meta API: https://developers.meta.com/status

---

**Status:** ✅ Pronto para produção
**Última atualização:** 2026-03-08
