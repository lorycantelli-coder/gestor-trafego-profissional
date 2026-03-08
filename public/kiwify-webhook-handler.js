// Arquivo de documentação para configurar webhook no Vercel
// Este é um guia de como configurar o webhook da Kiwify

/*
CONFIGURAÇÃO DO WEBHOOK KIWIFY
==============================

1. Acesse seu painel Kiwify:
   https://kiwify.com.br/admin

2. Vá para: Configurações → Webhooks → Adicionar Webhook

3. Configure:
   URL: https://gestor-trafego-profissional.vercel.app/api/kiwify-webhook

   Eventos a rastrear:
   ☑ order.completed (Quando uma venda é completa)
   ☑ order.refunded (Quando uma venda é reembolsada)
   ☑ order.created (Quando um pedido é criado)

4. Teste o webhook:
   - Faça uma venda de teste na Kiwify
   - Verifique se chegou no nosso sistema
   - Dashboard deve atualizar em tempo real

5. Estrutura do Webhook Kiwify:
   {
     "event": "order.completed",
     "data": {
       "order": {
         "id": "12345",
         "customer": {
           "name": "Cliente Nome",
           "email": "cliente@email.com"
         },
         "product": {
           "id": "prod-123",
           "name": "Nome do Produto"
         },
         "amount": 1997.00,
         "currency": "BRL",
         "status": "completed",
         "payment_method": "credit_card",
         "created_at": "2026-03-08T20:00:00Z"
       }
     }
   }

6. Token de Segurança:
   - Gere um token no Kiwify
   - Adicione em Environment Variables do Vercel:
     KIWIFY_WEBHOOK_SECRET=seu_token_aqui

   - Nosso servidor validará usando o header:
     X-Kiwify-Signature

7. Monitorar:
   - Logs em tempo real: vercel logs [projeto]
   - Dashboard atualiza a cada venda
   - Histórico completo em /api/kiwify/sales
*/

console.log("Webhook configuration documented");
