# 🔐 Configurações e Tokens - Sistema Vibing

> **Documento com todas as configurações, tokens, variáveis de ambiente e credenciais necessárias para o projeto**

## ⚠️ IMPORTANTE - SEGURANÇA

**NUNCA commite este arquivo ou arquivos `.env.local` no Git!**

Este documento contém informações sensíveis. Mantenha-o seguro e:
- Não compartilhe em repositórios públicos
- Use variáveis de ambiente em produção
- Rotacione tokens regularmente
- Use diferentes credenciais para dev/staging/prod

---

## 🌐 Supabase

### URL do Projeto
```
https://fdlglyqbfonmintvzhvm.supabase.co
```

### Credenciais

#### Anon Key (Pública - pode ser usada no cliente)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDY3NjIsImV4cCI6MjA4MTk4Mjc2Mn0.cjcG5oDDIouFFJOVu9D9dFrlf8Lwq_r1JIxYN5rNuno
```

#### Service Role Key (⚠️ CONFIDENCIAL - apenas servidor)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQwNjc2MiwiZXhwIjoyMDgxOTgyNzYyfQ.KYE-O-ETSWsW5dtub3jjBEU5irzju662GDoCKciosdU
```

#### Publishable Key (Nova API)
```
sb_publishable_jXQtrb479r-BKpaXtePWAA_fycspsag
```

#### Secret Key (Nova API)
```
sb_secret_3NoiM44iNi1T6Kir7oEp6A_xey0-Rze
```

### Configuração no .env.local

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDY3NjIsImV4cCI6MjA4MTk4Mjc2Mn0.cjcG5oDDIouFFJOVu9D9dFrlf8Lwq_r1JIxYN5rNuno

# Supabase Admin (para reset de senha e operações administrativas)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQwNjc2MiwiZXhwIjoyMDgxOTgyNzYyfQ.KYE-O-ETSWsW5dtub3jjBEU5irzju662GDoCKciosdU

# Clerk Authentication (substitui Supabase Auth)
# ✅ Configurado - Chaves adicionadas ao .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Notas sobre Supabase

- **Anon Key:** Pode ser usada no cliente (browser)
- **Service Role Key:** ⚠️ NUNCA exponha no cliente! Use apenas em API routes do servidor
- **RLS:** Todas as tabelas têm Row Level Security habilitado
- **Database:** PostgreSQL
- **Storage:** Disponível para upload de fotos/documentos

---

## 📧 Mailtrap

### API Token
```
4b125b5b72581617724cb6ed15e2c618
```

### Email Remetente
```
comercial@plugnrent.com.br
```

### Configuração no .env.local

```env
# Mailtrap Configuration
MAILTRAP_API_TOKEN=4b125b5b72581617724cb6ed15e2c618
MAILTRAP_FROM_EMAIL=comercial@plugnrent.com.br
```

### Endpoint da API

```
https://sandbox.api.mailtrap.io/api/send
```

### Headers Necessários

```json
{
  "Authorization": "Bearer {MAILTRAP_API_TOKEN}",
  "Content-Type": "application/json"
}
```

### Tipos de Email Enviados

1. **Verificação de Email** (hóspedes)
   - Categoria: `email-verification`
   - Template: `lib/email-service.ts` → `sendVerificationEmail()`

2. **Reset de Senha** (hosts)
   - Categoria: `password-reset`
   - Template: `lib/email-service.ts` → `sendPasswordResetEmail()`

3. **Convite de Reserva** (hóspedes)
   - Categoria: `reservation-invite`
   - Template: `lib/email-service.ts` → `sendReservationInviteEmail()`

4. **Convite de Condomínio**
   - Categoria: `condominium-invite`
   - Template: `lib/email-service.ts` → `sendCondominiumInviteEmail()`

5. **Notificação de Reserva** (condomínios)
   - Categoria: `condominium-reservation`
   - Template: `lib/email-service.ts` → `sendCondominiumReservationEmail()`

6. **Link Público de Reserva** (condomínios)
   - Categoria: `public-reservation-link`
   - Template: `lib/email-service.ts` → `sendPublicReservationLinkEmail()`

7. **Conta Temporária** (hóspedes)
   - Categoria: `temporary-account`
   - Template: `lib/email-service.ts` → `sendTemporaryAccountEmail()`

8. **Boas-vindas Condomínio**
   - Categoria: `condominium-welcome`
   - Template: `lib/email-service.ts` → `sendCondominiumWelcomeEmail()`

---

## 🌍 URLs e Domínios

### App URL (Desenvolvimento)
```
http://localhost:3000
```

### Configuração no .env.local

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### URLs de Produção

⚠️ **Configurar quando for para produção:**
```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

---

## 🔌 APIs Externas

### ViaCEP API

**Endpoint:**
```
https://viacep.com.br/ws/{cep}/json/
```

**Método:** GET

**Exemplo:**
```
GET https://viacep.com.br/ws/01310100/json/
```

**Resposta:**
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

**Uso no Projeto:**
- Rota: `/api/cep?cep=12345678`
- Arquivo: `app/api/cep/route.ts`

### Airbnb Scraping

**Endpoint Interno:**
```
POST /api/airbnb/scrape
```

**Body:**
```json
{
  "url": "https://www.airbnb.com/rooms/12345678"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "spaceName": "Nome da Propriedade",
    "description": "Descrição...",
    "address": "Endereço...",
    "photos": ["url1", "url2"],
    "rules": ["regra1", "regra2"],
    "amenities": ["amenidade1", "amenidade2"],
    "type": "espaco-inteiro"
  },
  "airbnbLink": "https://www.airbnb.com/rooms/12345678"
}
```

**Uso no Projeto:**
- Arquivo: `app/api/airbnb/scrape/route.ts`
- Biblioteca: Cheerio para parsing HTML

---

## 🗄️ Configuração do Banco de Dados

### Connection String (PostgreSQL)

⚠️ **Não usar diretamente no código!** Use Supabase client.

```
postgresql://postgres:[PASSWORD]@db.fdlglyqbfonmintvzhvm.supabase.co:5432/postgres
```

### Schema Principal

```
public
```

### Tabelas Principais

1. `user_profiles` - Perfis de usuários
2. `subscriptions` - Assinaturas
3. `properties` - Propriedades
4. `photos` - Fotos das propriedades
5. `reservations` - Reservas
6. `guests` - Hóspedes
7. `guest_reservations` - Relacionamento hóspedes-reservas
8. `condominiums` - Condomínios
9. `condominium_properties` - Vinculação condomínio-propriedade
10. `condominium_invites` - Convites para condomínios
11. `reservation_public_links` - Links públicos temporários
12. `password_reset_tokens` - Tokens de reset de senha

### Migrations

⚠️ **Executar no Supabase SQL Editor na ordem:**

1. Tabelas base (user_profiles, subscriptions, properties, photos, reservations, guests)
2. Tabelas de relacionamento (guest_reservations)
3. Tabelas de condomínios (condominiums, condominium_properties, condominium_invites, reservation_public_links)
4. Tabelas auxiliares (password_reset_tokens)
5. Índices
6. RLS Policies
7. Triggers e Functions

**Arquivos SQL disponíveis no projeto:**
- `criar-tabelas-condominios-completo.sql`
- `criar-tabela-guest-reservations-completo.sql`
- `criar-tabela-password-reset-tokens.sql`
- E vários arquivos `fix-*.sql` para correções

---

## 🔑 Tokens e Segredos

### Geração de Tokens

#### Check-in Link Token
```typescript
import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');
```

#### Reset Password Token
```typescript
import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');
// Armazenar em password_reset_tokens com expires_at
```

#### Condomínio Invite Token
```typescript
import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');
// Armazenar em condominium_invites com expires_at
```

#### Public Reservation Link Token
```typescript
import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');
// Armazenar em reservation_public_links com expires_at
```

### Expiração de Tokens

- **Reset Password:** 1 hora
- **Email Verification:** 24 horas
- **Condomínio Invite:** 7 dias
- **Public Reservation Link:** Até data de check-out

---

## 📦 Dependências do Projeto

### package.json Completo

```json
{
  "name": "sistema-vibing",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "setup": "node setup-env.js",
    "test:supabase": "node test-supabase.js",
    "test:connection": "node test-connection.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.3",
    "cheerio": "^1.0.0-rc.12",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.424.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@types/bcryptjs": "^2.4.6",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "bcryptjs": "^2.4.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-html-reporters": "^3.1.7",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4"
  }
}
```

---

## ⚙️ Configurações de Build

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.airbnb.com',
      },
      {
        protocol: 'https',
        hostname: '**.airbnb.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
}

module.exports = nextConfig
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1e30f3',
        },
        accent: {
          pink: '#e21e80',
        },
        text: {
          gray: '#6c757d',
        },
        dark: {
          gray: '#343a40',
        },
        light: {
          gray: '#f8f9fa',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e30f3 0%, #e21e80 100%)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 🔒 Variáveis de Ambiente Completas

### .env.local (Template)

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDY3NjIsImV4cCI6MjA4MTk4Mjc2Mn0.cjcG5oDDIouFFJOVu9D9dFrlf8Lwq_r1JIxYN5rNuno
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQwNjc2MiwiZXhwIjoyMDgxOTgyNzYyfQ.KYE-O-ETSWsW5dtub3jjBEU5irzju662GDoCKciosdU

# ============================================
# MAILTRAP CONFIGURATION
# ============================================
MAILTRAP_API_TOKEN=4b125b5b72581617724cb6ed15e2c618
MAILTRAP_FROM_EMAIL=comercial@plugnrent.com.br

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# PRODUCTION (Configurar quando necessário)
# ============================================
# NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

---

## 🧪 Configuração de Testes

### jest.config.js

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js

```javascript
import '@testing-library/jest-dom'
```

---

## 📝 Checklist de Configuração

### Setup Inicial

- [ ] Criar projeto Next.js
- [ ] Instalar dependências (`npm install`)
- [ ] Criar arquivo `.env.local` com todas as variáveis
- [ ] Configurar Supabase (criar projeto, executar migrations)
- [ ] Testar conexão com Supabase (`npm run test:supabase`)
- [ ] Configurar Mailtrap
- [ ] Testar envio de email

### Banco de Dados

- [ ] Executar migrations na ordem correta
- [ ] Configurar RLS policies
- [ ] Criar triggers necessários
- [ ] Gerar tipos TypeScript do Supabase
- [ ] Validar todas as tabelas criadas

### Desenvolvimento

- [ ] Configurar ESLint
- [ ] Configurar Prettier (se usar)
- [ ] Configurar Git hooks (se usar)
- [ ] Testar build (`npm run build`)
- [ ] Testar servidor de produção (`npm start`)

### Produção

- [ ] Configurar variáveis de ambiente no servidor
- [ ] Configurar domínio
- [ ] Configurar SSL/HTTPS
- [ ] Configurar CDN (se usar)
- [ ] Configurar monitoramento
- [ ] Configurar backups do banco

---

## 🚨 Troubleshooting

### Erro: "Supabase connection failed"
- Verificar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verificar se projeto Supabase está ativo
- Verificar firewall/proxy

### Erro: "Mailtrap API error"
- Verificar `MAILTRAP_API_TOKEN`
- Verificar se token não expirou
- Verificar limites da conta Mailtrap

### Erro: "RLS policy violation"
- Verificar políticas RLS no Supabase
- Verificar se usuário está autenticado
- Verificar se usuário tem permissão

### Erro: "Token expired"
- Verificar expiração de tokens
- Implementar refresh de tokens
- Verificar timezone do servidor

---

## 📞 Suporte

Para problemas com:
- **Supabase:** https://supabase.com/docs
- **Mailtrap:** https://mailtrap.io/docs
- **Next.js:** https://nextjs.org/docs

---

**Última Atualização:** Dezembro 2024

**⚠️ LEMBRE-SE:** Nunca commite este arquivo ou `.env.local` no Git!

