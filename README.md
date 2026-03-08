# 📊 Gestor de Tráfego Meta Ads

Dashboard profissional em tempo real para gerenciamento de campanhas de publicidade no Meta Ads (Facebook/Instagram).

## 🎯 Visão Geral

Este projeto integra dados reais da **Meta Ads API** com um dashboard moderno e responsivo. Visualize métricas de campanhas, ROI, conversões e tráfego em tempo real.

### Características

✅ **Dados em Tempo Real** - Integração com Meta Ads API
✅ **Dashboard Responsivo** - Funciona em desktop, tablet e mobile
✅ **4 Abas Principais**:
- 📈 Visão Geral (métricas principais)
- 📢 Campanhas & Criativos
- 💰 Financeiro (revenue, ROI, projeções)
- 🚗 Tráfego & Funil (leads, conversões)

✅ **Gráficos Interativos** - Recharts com dados atualizados
✅ **Dark/Light Mode** - Tema automático
✅ **Serverless API** - Funções Vercel para segurança

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Credenciais Meta Ads

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/lorycantelli-coder/gestor-trafego-profissional.git
cd gestor-trafego-profissional

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o dev server
npm run dev

# Acesse http://localhost:8080
```

### Build para Produção

```bash
npm run build
npm run preview
```

## 📦 Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Gráficos**: Recharts
- **State Management**: React Query (TanStack)
- **Routing**: React Router v6
- **Backend**: Vercel Functions (Serverless)
- **Deployment**: Vercel

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Meta Ads API
VITE_META_API_BASE_URL=https://graph.instagram.com/v19.0
VITE_META_APP_ID=929453256689189
VITE_META_AD_ACCOUNT_ID=188938172932947

# API Backend
VITE_API_BASE_URL=http://localhost:5173

# Credencial (apenas backend - NUNCA versionar!)
META_ACCESS_TOKEN=seu_token_aqui
```

## 📋 Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/           # Componentes do dashboard
│   │   ├── DashboardHeader.tsx
│   │   ├── KPICard.tsx
│   │   ├── Charts.tsx
│   │   ├── CampaignTable.tsx
│   │   └── ...
│   └── ui/                 # Componentes shadcn/ui
├── hooks/
│   ├── useMetaAds.ts       # React Query hooks
│   └── useDashboardData.ts # Hook inteligente com fallback
├── pages/
│   └── Index.tsx           # Página principal
├── data/
│   └── mockData.ts         # Dados de fallback (mock)
└── lib/

api/
└── meta-ads.ts             # Serverless function (Vercel)
```

## 🌐 Deployment

### Deploy no Vercel

1. Faça um fork do repositório
2. Crie um novo projeto no [Vercel](https://vercel.com)
3. Conecte seu repositório GitHub
4. Adicione variáveis de ambiente no Vercel Dashboard
5. Faça push e Vercel fará o deploy automaticamente

**Ver mais**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 Segurança

- Token da Meta Ads armazenado **apenas no servidor** (Vercel Environment Variables)
- CORS configurado corretamente
- Sem exposição de credenciais no frontend
- HTTPS em produção

## 📊 Métricas Rastreadas

- **Faturamento** (Revenue total, bruto e líquido)
- **Vendas** (Quantidade, ticket médio)
- **Tráfego** (Impressões, cliques, leads)
- **ROI** (ROAS, CPA, CPL, CPC)
- **Conversão** (Taxa de conversão, funil)
- **Campanhas** (Performance por canal)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Watch mode
npm run test:watch

# Lint
npm run lint
```

## 📱 Mobile

O dashboard é totalmente responsivo e funciona em:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md)

## 📄 Licença

Este projeto está sob a licença MIT. Ver [LICENSE](./LICENSE)

## 👥 Autor

- **Lory Cantelli** - [@lorycantelli-coder](https://github.com/lorycantelli-coder)

## 🆘 Suporte

Para dúvidas ou problemas:

1. Abra uma [Issue](https://github.com/lorycantelli-coder/gestor-trafego-profissional/issues)
2. Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para troubleshooting
3. Verificar status da Meta API: https://developers.meta.com/status

---

**Status**: 🟢 Em Produção
**Última atualização**: 2026-03-08
**Ambiente**: https://gestor-trafego-profissional.vercel.app
