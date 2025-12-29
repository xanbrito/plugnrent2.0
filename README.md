# 🏠 Sistema Vibing

Plataforma completa de gestão de propriedades de hospedagem (tipo Airbnb).

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta Supabase (já configurada)
- Conta Mailtrap (já configurada)

### Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   
   O arquivo `.env.local` já está criado com as configurações necessárias. Se precisar recriar, use o template em `CONFIGURACOES-E-TOKENS.md`.

3. **Iniciar servidor de desenvolvimento:**
   
   **Windows:**
   ```bash
   start.bat
   ```
   
   **Linux/Mac:**
   ```bash
   npm run dev
   ```

4. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

## 📋 Funcionalidades

### Para Anfitriões (Hosts)
- ✅ Gestão completa de propriedades
- ✅ Sistema de reservas
- ✅ Calendários múltiplos (Airbnb, PMS, Amenitiz)
- ✅ Check-in automatizado
- ✅ Gestão de hóspedes
- ✅ Envio automático para condomínios

### Para Condomínios
- ✅ Dashboard de reservas
- ✅ Visualização de hóspedes
- ✅ Links públicos temporários
- ✅ Sistema de convites

### Para Hóspedes
- ✅ Check-in online
- ✅ Perfil completo
- ✅ Visualização de reservas
- ✅ Verificação de email

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14.2.5, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (via Supabase)
- **Autenticação:** Supabase Auth + Custom (hóspedes)
- **Integrações:** Airbnb Scraping, ViaCEP, Mailtrap

## 📁 Estrutura do Projeto

```
projeto/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Área do anfitrião
│   ├── condominio/        # Área do condomínio
│   ├── hospede/           # Área do hóspede
│   └── checkin/           # Check-in público
├── components/            # Componentes React
├── lib/                   # Utilitários e funções
├── types/                 # Tipos TypeScript
└── agents/                # Agentes de IA especializados
```

## 🔐 Autenticação

O sistema possui 3 tipos de autenticação:

1. **Hosts (Anfitriões):** Supabase Auth
2. **Condomínios:** Supabase Auth (mesma tabela)
3. **Hóspedes:** Sistema customizado (tabela `guests`)

## 📧 Emails

O sistema envia emails via Mailtrap para:
- Verificação de email (hóspedes)
- Reset de senha (hosts)
- Convites de reserva
- Convites de condomínio
- Notificações de reserva

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de produção
- `npm run lint` - Verificar código
- `npm test` - Executar testes

## 🤖 Agentes de IA

O projeto utiliza um sistema de agentes especializados para desenvolvimento:

- **Backend Specialist** - API Routes, Supabase, Database
- **Frontend Specialist** - React, Next.js, UI/UX
- **Database Specialist** - PostgreSQL, RLS, Migrations
- **Testing Specialist** - Jest, Test Coverage
- **TypeScript Specialist** - Type Safety, Refactoring
- **Performance Specialist** - Otimizações
- **Integration Specialist** - APIs Externas

Veja mais em `agents/README.md`.

## 📚 Documentação

- `ESPECIFICACAO-COMPLETA-PROJETO.md` - Especificação completa
- `CONFIGURACOES-E-TOKENS.md` - Configurações e tokens
- `AGENTES-IA-ESPECIALIZADOS.md` - Documentação dos agentes

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env.local` no Git
- As tabelas do Supabase já estão criadas
- Os tokens estão configurados no `.env.local`

## 🐛 Troubleshooting

### Erro: "Supabase connection failed"
- Verifique as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local`

### Erro: "Mailtrap API error"
- Verifique `MAILTRAP_API_TOKEN` no `.env.local`

### Erro ao instalar dependências
- Certifique-se de ter Node.js 18+ instalado
- Tente deletar `node_modules` e `package-lock.json` e reinstalar

## 📞 Suporte

Para problemas:
- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs
- **Mailtrap:** https://mailtrap.io/docs

---

**Desenvolvido com ❤️ para gestão de propriedades de hospedagem**




