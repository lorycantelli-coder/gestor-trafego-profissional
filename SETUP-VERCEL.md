# 🚀 Setup Vercel - Passo a Passo

## Status Atual

✅ **Código no GitHub**: https://github.com/lorycantelli-coder/gestor-trafego-profissional
✅ **Build testado**: npm run build passando
✅ **API criada**: `/api/meta-ads.ts` pronto para Vercel Functions

Agora basta conectar no Vercel!

---

## 3 Passos para Deploy

### ✅ Passo 1: Criar Projeto no Vercel (2 minutos)

1. Acesse: https://vercel.com/new
2. Clique em "Continue with GitHub"
3. Encontre: `gestor-trafego-profissional`
4. Clique em "Import"

### ✅ Passo 2: Configurar Variáveis de Ambiente (3 minutos)

Na tela de import, você verá a seção **Environment Variables**:

```
META_ACCESS_TOKEN = EAANNVTMzRiUBQsMPIb8K21NHWOJYv2UOaBIoGeNmCxKPdf8xQJClsMvhzv9jBDiSOt7W3peh7LbHhtianGaNEm2Fd2RIpnZCGJZCLwGYOHWL0uXPSsKoMhcZAIS0KmakXeQOZAbplDGzfUCe7bq3ec0HVsKZBxBPTKrQYihINvyp3wLIZCBL1unTMmbgynfSoJ0QZDZD

VITE_META_API_BASE_URL = https://graph.instagram.com/v19.0

VITE_META_APP_ID = 929453256689189

VITE_META_AD_ACCOUNT_ID = 188938172932947

VITE_API_BASE_URL = (deixar em branco - será preenchido após deploy)
```

**Onde adicionar:**
- Clique em "Add Environment Variable"
- Coloque cada chave e valor acima
- Certifique-se de que estão configuradas para **Production**

### ✅ Passo 3: Deploy! (5 minutos)

1. Clique em **"Deploy"** (botão azul no final)
2. Aguarde o build completar (normalmente 2-3 minutos)
3. Quando acabar, você verá ✅ **"Congratulations! Your project has been deployed"**
4. Clique em **"Visit"** para acessar seu dashboard!

---

## URL do Seu Projeto

Depois do deploy, você terá uma URL assim:

```
https://gestor-trafego-profissional.vercel.app
```

(Ou o Vercel pode gerar uma aleatória se houver conflito de nome)

---

## ✅ Após o Deploy

### 1. Atualizar VITE_API_BASE_URL

Após o deploy, você precisa adicionar uma última variável:

1. Vá para: **Settings** → **Environment Variables** (no Vercel Dashboard)
2. Adicione:
   ```
   VITE_API_BASE_URL = https://seu-url-aqui.vercel.app
   ```
   (Substitua pelo URL que o Vercel deu no step 3)
3. Clique em **"Save"**
4. Vá para **Deployments** → Clique no último → **Redeploy** (botão de 3 pontinhos)

### 2. Verificar Integração

Acesse seu dashboard e verifique:

- [ ] Dashboard carrega sem erros
- [ ] Os gráficos aparecem (ou dados mock)
- [ ] Nenhuma mensagem de erro no console (F12)
- [ ] API está respondendo: https://seu-url/api/meta-ads?action=campaigns

### 3. Domínio Customizado (Opcional)

Se quiser um domínio customizado como `meudash.com.br`:

1. Vá para **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Siga as instruções (adicionar registros DNS)

---

## 🔍 Monitoramento

### Ver logs em tempo real

```bash
vercel logs [seu-projeto]
```

### Status do deployment

Dashboard Vercel → Deployments → Ver status de cada deploy

### Alertas automáticos

Vercel alertará por email sobre:
- ❌ Builds que falharam
- ⚠️ Erros em runtime
- 📊 Performance degradada

---

## 🆘 Se Algo Não Funcionar

### ❌ "Cannot find module 'api/meta-ads.ts'"

- Vercel Function não foi reconhecida
- **Solução**: Redeploy (Settings → Redeploy)

### ❌ "META_ACCESS_TOKEN is undefined"

- Variável de ambiente não foi carregada
- **Solução**: Verificar se está em **Production** nas Environment Variables
- Redeploy necessário

### ❌ "Failed to fetch data"

- API respondendo com erro
- **Solução**: Conferir logs `vercel logs [projeto]`
- Verificar se o token Meta Ads é válido

### ❌ Dashboard mostra "Mock Data"

- API não retornando dados reais
- **Solução**: Verificar logs e tokens
- Tentar adicionar mais detalhes nos logs da função

### Testar Localmente Antes de Fazer Deploy

```bash
cd ~/Projetos/gestor-trafego-profissional
npm run dev

# Em outro terminal:
curl "http://localhost:5173/api/meta-ads?action=campaigns"
```

---

## 📋 Checklist Final

- [ ] Código pusheado no GitHub
- [ ] Projeto criado no Vercel
- [ ] `META_ACCESS_TOKEN` configurado
- [ ] Outras env vars configuradas (`VITE_META_*`)
- [ ] Deploy completo (✅ no Vercel Dashboard)
- [ ] URL do projeto anotada
- [ ] Dashboard acessa em: `https://seu-url/`
- [ ] API responde em: `https://seu-url/api/meta-ads?action=campaigns`
- [ ] VITE_API_BASE_URL atualizada com URL final
- [ ] Redeploy após atualizar VITE_API_BASE_URL

---

## 🎁 Bônus: Auto-Deploy no Git Push

Depois que conectar ao GitHub, **qualquer push na branch `main`** fará o Vercel fazer deploy automático!

```bash
# Você só precisa fazer:
git add .
git commit -m "feat: melhorias no dashboard"
git push origin main

# E Vercel faz tudo sozinho! 🚀
```

---

**Pronto!** Você tem tudo para fazer o deploy. Qualquer dúvida, veja [DEPLOYMENT.md](./DEPLOYMENT.md) para mais detalhes. 🎉
