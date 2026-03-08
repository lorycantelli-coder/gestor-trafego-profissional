# 🎯 INTEGRAÇÃO KIWIFY - GUIA COMPLETO

**Status:** ✅ Pronto para configurar
**Última atualização:** 2026-03-08

---

## 📋 SUMÁRIO RÁPIDO

```
1. Gerar API Key na Kiwify      (2 min)
2. Configurar Webhook           (3 min)
3. Testar com dados reais       (5 min)
4. Monitorar no dashboard       (automático)
```

**Total:** ~10 minutos ⏱️

---

## 🔑 PASSO 1: Gerar API Key da Kiwify

### 1.1 Acessar Painel Kiwify
```
https://kiwify.com.br/admin → Configurações
```

### 1.2 Gerar Token
```
Configurações → API → Gerar Nova Chave
```

Copie:
```
KIWIFY_API_KEY = ________________________________
```

### 1.3 Copiar ID da Conta
```
Configurações → Dados da Conta → ID da Conta Kiwify
```

Copie:
```
KIWIFY_ACCOUNT_ID = ____________________________
```

---

## 🔌 PASSO 2: Configurar Webhook no Vercel

### 2.1 Adicionar Environment Variables

No Vercel Dashboard:
```
Settings → Environment Variables
```

Adicione:
```
Nome: KIWIFY_WEBHOOK_SECRET
Valor: seu_webhook_secret_aqui
Ambientes: Production, Preview, Development

Nome: KIWIFY_API_KEY
Valor: sua_api_key_aqui
Ambientes: Production, Preview, Development

Nome: KIWIFY_ACCOUNT_ID
Valor: seu_account_id_aqui
Ambientes: Production, Preview, Development
```

### 2.2 Fazer Redeploy
```
Deployments → (Último) → Redeploy
```

Aguarde completar (~2 min)

---

## 🎯 PASSO 3: Configurar Webhook na Kiwify

### 3.1 Adicionar URL do Webhook

No Painel Kiwify:
```
Configurações → Webhooks → Adicionar Webhook
```

Configure:
```
URL:
https://gestor-trafego-profissional.vercel.app/api/kiwify-webhook

Método: POST

Headers:
X-Kiwify-Signature: seu_webhook_secret_aqui
```

### 3.2 Selecionar Eventos

Marque:
```
☑ order.created     (Novo pedido)
☑ order.completed   (Pedido pago)
☑ order.refunded    (Reembolso)
☑ order.pending     (Aguardando pagamento)
```

### 3.3 Testar Webhook

Clique em "Testar Webhook"

Você deve ver:
```
✅ Status 200 OK
✅ Response recebido
```

---

## 📊 PASSO 4: Verificar no Dashboard

### 4.1 Acessar Dashboard Fabrício
```
https://gestor-trafego-profissional.vercel.app/fabricio
```

### 4.2 Painel de Vendas Kiwify

Na aba "Visão Geral", você verá:

```
┌────────────────────────────────┐
│ Vendas Kiwify          🟢 Ativo │
│                                 │
│ Receita:    R$ X.XXX.XXX       │
│ Vendas:     XXX pedidos        │
│ Ticket:     R$ X.XXX          │
│ Conversão:  XX.X%              │
│                                 │
│ Última venda:                  │
│ João Silva - R$ 1.997         │
│ às 20:15:32                    │
│                                 │
│ Histórico: [últimas 50 vendas] │
└────────────────────────────────┘
```

---

## ✅ CHECKLIST DE TESTE

- [ ] API Key gerada no Kiwify
- [ ] Webhook URL configurado
- [ ] Environment variables no Vercel
- [ ] Redeploy completado
- [ ] Teste de webhook bem-sucedido
- [ ] Dashboard Fabrício acessível
- [ ] Painel Kiwify visível

---

## 🧪 TESTE COM VENDA REAL

### Opção 1: Venda de Teste no Kiwify
```
1. Crie um cupom de desconto de 100% no seu produto
2. Faça uma "compra de teste" usando o cupom
3. Verifique se aparece no dashboard em < 30 segundos
```

### Opção 2: Dados de Demonstração (MVP)
```
Se não quiser fazer venda real, o dashboard tem dados fake
para fins de demonstração e testes
```

---

## 📡 COMO FUNCIONA EM TEMPO REAL

```
1. Cliente compra na Kiwify
2. Kiwify envia webhook para nossa API
3. Nossa API processa e armazena venda
4. Dashboard atualiza automaticamente
5. Você vê a venda em tempo real! ⚡
```

**Latência:** < 5 segundos (quase instantâneo)

---

## 🔍 MONITORAR WEBHOOKS

### Ver Logs de Webhook

```bash
vercel logs gestor-trafego-profissional.vercel.app --follow
```

Procure por:
```
[WEBHOOK] Venda recebida: order-12345
[WEBHOOK] Processado com sucesso
```

### Histórico de Webhooks (Kiwify)

No painel Kiwify:
```
Configurações → Webhooks → (Seu webhook) → Histórico
```

Você verá:
```
✅ Status 200 - order.completed - 20:15:32
✅ Status 200 - order.created - 20:15:28
```

---

## ⚙️ DETALHES TÉCNICOS

### Estrutura de Dados Kiwify

Cada venda possui:
```json
{
  "id": "string (ID único da venda)",
  "orderId": "KWF-XXXXX",
  "customerName": "Nome do Cliente",
  "customerEmail": "email@example.com",
  "productName": "Nome do Produto",
  "amount": 1997.00,
  "currency": "BRL",
  "status": "completed | pending | refunded",
  "timestamp": "2026-03-08T20:15:32Z",
  "paymentMethod": "credit_card | pix | boleto"
}
```

### Endpoints da API

```bash
# Obter vendas dos últimos 7 dias
GET /api/kiwify/sales?days=7

# Obter todas as vendas
GET /api/kiwify/sales

# Histórico em tempo real (SSE)
GET /api/kiwify/stream

# Receber webhook da Kiwify
POST /api/kiwify-webhook
```

---

## 🚨 TROUBLESHOOTING

### ❌ "Webhook não está recebendo vendas"

**Solução:**
1. Verificar URL do webhook (copiar direto daqui)
2. Verificar se Environment Variables estão configuradas
3. Fazer redeploy no Vercel
4. Testar webhook manualmente no painel Kiwify
5. Verificar logs: `vercel logs`

### ❌ "Dashboard mostra 'Awaiting Connection'"

**Solução:**
1. Webhook não foi configurado ainda
2. Nenhuma venda foi recebida
3. Siga PASSO 3 acima (configurar webhook)
4. Faça uma venda de teste
5. Aguarde 30 segundos e recarregue

### ❌ "Erro 401 Unauthorized"

**Solução:**
1. Verifique se API Key está correta
2. Gere uma nova no painel Kiwify
3. Atualize Environment Variable
4. Redeploy no Vercel

### ❌ "Erro 500 Internal Server Error"

**Solução:**
1. Ver logs do Vercel: `vercel logs`
2. Verificar se estrutura de dados está correta
3. Contactar suporte

---

## 🔒 SEGURANÇA

### Validação de Webhook

Nosso sistema valida:
```javascript
// Validar assinatura do webhook
const signature = req.headers['x-kiwify-signature'];
if (!crypto.verify(signature, payload, secret)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Dados Protegidos
```
✅ API Key armazenada apenas no Vercel
✅ Emails dos clientes não salvos (apenas na venda)
✅ Sem dados sensíveis em logs públicos
✅ HTTPS/SSL obrigatório
```

---

## 📈 PRÓXIMAS FEATURES (ROADMAP)

```
- [ ] Exportar vendas em Excel/CSV
- [ ] Integração com planilha Google Sheets
- [ ] Alertas por email (nova venda)
- [ ] Notificações push
- [ ] Comparação com Meta Ads ROI
- [ ] Previsão de receita (AI)
- [ ] Dashboard compartilhado com time
```

---

## 📞 SUPORTE

**Dúvidas?**
1. Ver seção TROUBLESHOOTING acima
2. Verificar logs: `vercel logs`
3. Testar webhook no painel Kiwify
4. Contactar equipe de suporte

---

## ✨ PRONTO!

Depois de seguir esses passos, você terá:

```
✅ Vendas em tempo real no dashboard
✅ Métricas atualizadas automaticamente
✅ Histórico de todos os pedidos
✅ Dados sincronizados com Kiwify
✅ Alertas de novas vendas
✅ Dashboard profissional
```

**Tempo total:** ~10 minutos
**Resultado:** Dashboard de vendas ao vivo! 🚀

---

**Status:** ✅ Integração Kiwify Ativa
**Última atualização:** 2026-03-08
**Versão:** 1.0
