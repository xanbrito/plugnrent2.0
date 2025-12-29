# 📋 Especificação Completa do Projeto - Sistema Vibing

> **Documento para recriação completa do projeto do zero com melhores práticas**

## 🎯 Visão Geral do Projeto

**Sistema Vibing** é uma plataforma completa de gestão de propriedades de hospedagem (tipo Airbnb) que permite:

- Gestão completa de propriedades/espaços
- Sistema de check-in automatizado para hóspedes
- Gestão de reservas com múltiplos canais (Airbnb, Booking, etc.)
- Sistema de condomínios para gerenciar reservas
- Autenticação multi-tipo (Hosts, Condomínios, Hóspedes)
- Importação automática de dados do Airbnb
- Envio automático de reservas para condomínios
- Dicas locais para hóspedes
- Sistema de avaliações (planejado)
- Blacklist global de hóspedes (planejado)

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

**Frontend:**
- Next.js 14.2.5 (App Router)
- React 18.3.1
- TypeScript 5.5.4
- Tailwind CSS 3.4.7
- React Hook Form 7.52.1
- Zustand 4.5.2 (Estado global)
- Lucide React 0.424.0 (Ícones)
- date-fns 3.6.0 (Manipulação de datas)
- clsx 2.1.1 (Classes condicionais)

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL, Auth, Storage)
- Node.js 18+

**Integrações:**
- Airbnb Scraping (Cheerio 1.0.0-rc.12)
- ViaCEP API (Busca de endereços)
- Mailtrap (Envio de emails)

**Testes:**
- Jest 29.7.0
- React Testing Library 14.1.2
- Jest DOM 6.1.5

---

## 📁 Estrutura de Pastas

```
projeto/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── airbnb/
│   │   │   └── scrape/          # Scraping do Airbnb
│   │   ├── auth/                 # Autenticação
│   │   │   ├── reset-password/
│   │   │   ├── update-password-with-token/
│   │   │   └── validate-reset-token/
│   │   ├── cep/                  # Busca de CEP
│   │   ├── condominiums/         # Sistema de condomínios
│   │   │   ├── invites/          # Convites
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reservations/
│   │   │   ├── send-history/
│   │   │   ├── send-reservation/
│   │   │   └── settings/
│   │   ├── cpf/                  # Validação de CPF
│   │   ├── email/                # Envio de emails
│   │   ├── guests/               # Sistema de hóspedes
│   │   │   ├── login/
│   │   │   ├── profile/
│   │   │   ├── register/
│   │   │   ├── reservations/
│   │   │   └── verify-email/
│   │   ├── host/                  # Ações do host
│   │   │   └── guests/
│   │   └── reservations/          # Reservas
│   │       ├── public-link/
│   │       └── public-links/
│   ├── auth/                     # Páginas de autenticação
│   │   ├── confirm/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── checkin/                   # Check-in público
│   │   └── [token]/
│   ├── condominio/                # Área do condomínio
│   │   ├── cadastro/
│   │   ├── convite/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── reserva/
│   │   └── reservas/
│   ├── dashboard/                 # Área do host
│   │   ├── avaliacoes/
│   │   ├── blacklist/
│   │   ├── checkin/
│   │   ├── configuracoes/
│   │   ├── espacos/
│   │   └── reservas/
│   ├── hospede/                   # Área do hóspede
│   │   ├── cadastro/
│   │   ├── login/
│   │   ├── perfil/
│   │   ├── reservas/
│   │   └── verificar-email/
│   ├── layout.tsx                 # Layout raiz
│   ├── page.tsx                   # Página inicial
│   └── globals.css                # Estilos globais
│
├── components/                    # Componentes React
│   ├── auth/                      # Autenticação
│   │   ├── AuthProvider.tsx
│   │   └── LoginPage.tsx
│   ├── condominiums/              # Condomínios
│   │   └── CondominiumAuthProvider.tsx
│   ├── guests/                    # Hóspedes
│   │   ├── GuestAuthProvider.tsx
│   │   ├── GuestAuthWrapper.tsx
│   │   └── GuestNavbar.tsx
│   ├── layout/                    # Layouts
│   │   └── DashboardLayout.tsx
│   ├── properties/                # Propriedades
│   │   ├── PhotoGalleryModal.tsx
│   │   ├── PropertyForm.tsx
│   │   └── steps/                 # Passos do formulário
│   │       ├── Step1HostData.tsx
│   │       ├── Step2SpaceData.tsx
│   │       ├── Step3Location.tsx
│   │       ├── Step4Rules.tsx
│   │       ├── Step5PropertyItems.tsx
│   │       └── Step6LocalTips.tsx
│   └── reservations/              # Reservas
│       ├── AirbnbStyleCalendar.tsx
│       ├── AmenitizCalendar.tsx
│       ├── NewReservationCalendar.tsx
│       ├── PMSCalendar.tsx
│       ├── ReservationCalendar.tsx
│       ├── ReservationDetailsModal.tsx
│       └── UpcomingReservations.tsx
│
├── lib/                           # Bibliotecas e utilitários
│   ├── auth.ts                    # Autenticação de hosts
│   ├── condominium-auth.ts        # Autenticação de condomínios
│   ├── condominium-auto-send.ts   # Envio automático
│   ├── condominium-helpers.ts     # Helpers de condomínios
│   ├── cpf-validator.ts           # Validação de CPF
│   ├── database.types.ts          # Tipos do Supabase
│   ├── email-service.ts           # Serviço de emails
│   ├── guest-auth.ts              # Autenticação de hóspedes
│   ├── guest-validation.ts        # Validação de hóspedes
│   ├── mailtrap-service.ts        # Integração Mailtrap
│   ├── ota-icons.tsx              # Ícones de OTAs
│   ├── supabase-admin.ts          # Cliente admin Supabase
│   └── supabase.ts                # Cliente Supabase (PRECISA REFATORAR)
│
├── types/                         # Tipos TypeScript
│   └── index.ts                   # Todos os tipos
│
├── __tests__/                     # Testes
│   └── [arquivos de teste]
│
├── scripts/                       # Scripts utilitários
│
├── .env.local                     # Variáveis de ambiente (NÃO COMMITAR)
├── next.config.js                 # Configuração Next.js
├── tailwind.config.ts             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
├── package.json                    # Dependências
└── README.md                       # Documentação principal
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. `user_profiles`
Perfis de usuários (hosts)

```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT,
  cnpj TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `subscriptions`
Assinaturas dos usuários

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('trial', 'paid')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  conversations_count INTEGER DEFAULT 0,
  conversations_limit INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `properties`
Propriedades/espaços

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  host_full_name TEXT NOT NULL,
  host_cpf TEXT,
  host_cnpj TEXT,
  host_email TEXT NOT NULL,
  host_phone TEXT,
  host_is_company BOOLEAN DEFAULT FALSE,
  space_name TEXT NOT NULL,
  address TEXT NOT NULL,
  how_to_enter TEXT,
  google_maps_link TEXT,
  waze_link TEXT,
  type TEXT NOT NULL CHECK (type IN ('quarto', 'espaco-inteiro')),
  description TEXT NOT NULL,
  rules JSONB DEFAULT '[]'::jsonb,
  pricing_monday NUMERIC,
  pricing_tuesday NUMERIC,
  pricing_wednesday NUMERIC,
  pricing_thursday NUMERIC,
  pricing_friday NUMERIC,
  pricing_saturday NUMERIC,
  pricing_sunday NUMERIC,
  airbnb_link TEXT,
  budget_via_site BOOLEAN DEFAULT FALSE,
  pet_friendly_allowed BOOLEAN DEFAULT FALSE,
  pet_friendly_size TEXT CHECK (pet_friendly_size IN ('pequeno', 'grande', 'ambos')),
  pet_friendly_start_date DATE,
  pet_friendly_end_date DATE,
  pet_friendly_rules TEXT,
  pet_friendly_cost_type TEXT CHECK (pet_friendly_cost_type IN ('fixed', 'percentage')),
  pet_friendly_cost_value NUMERIC,
  whats_included_not_included TEXT[],
  whats_included_kitchen_materials TEXT[],
  whats_included_cleaning_materials TEXT[],
  whats_included_bed_linen BOOLEAN DEFAULT FALSE,
  whats_included_amenities TEXT[],
  property_items JSONB DEFAULT '{}'::jsonb,
  local_tips JSONB DEFAULT '[]'::jsonb,
  check_in_time TEXT,
  check_out_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `photos`
Fotos das propriedades

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `reservations`
Reservas

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  checkin_link_token TEXT NOT NULL UNIQUE,
  checkin_data JSONB NOT NULL,
  guests JSONB DEFAULT '[]'::jsonb,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `guests`
Hóspedes

```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT,
  birth_date DATE,
  rg TEXT,
  email TEXT NOT NULL,
  selfie_document_url TEXT,
  document_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_titular BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  oauth_provider TEXT,
  oauth_id TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  address_proof_url TEXT,
  validation_status TEXT CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMPTZ,
  validation_notes TEXT,
  profile_complete BOOLEAN DEFAULT FALSE,
  is_temporary BOOLEAN DEFAULT FALSE,
  created_by_guest_id UUID REFERENCES guests(id),
  urgencia BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `guest_reservations`
Relacionamento many-to-many entre hóspedes e reservas

```sql
CREATE TABLE guest_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  is_titular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id, reservation_id)
);
```

#### 8. `condominiums`
Condomínios

```sql
CREATE TABLE condominiums (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT,
  cpf TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  CONSTRAINT condominium_identifier_check CHECK (
    (cnpj IS NOT NULL AND cnpj != '') OR 
    (cpf IS NOT NULL AND cpf != '')
  )
);
```

#### 9. `condominium_properties`
Vinculação condomínio-propriedade

```sql
CREATE TABLE condominium_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominium_id UUID NOT NULL REFERENCES condominiums(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(property_id)
);
```

#### 10. `condominium_invites`
Convites para condomínios

```sql
CREATE TABLE condominium_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condominium_id UUID REFERENCES condominiums(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);
```

#### 11. `reservation_public_links`
Links públicos temporários para condomínios

```sql
CREATE TABLE reservation_public_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ
);
```

#### 12. `password_reset_tokens`
Tokens para reset de senha

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Índices

```sql
-- Índices principais
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_token ON reservations(checkin_link_token);
CREATE INDEX idx_guests_reservation_id ON guests(reservation_id);
CREATE INDEX idx_photos_property_id ON photos(property_id);
CREATE INDEX idx_condominiums_email ON condominiums(email);
CREATE INDEX idx_condominium_properties_condominium ON condominium_properties(condominium_id);
CREATE INDEX idx_condominium_properties_property ON condominium_properties(property_id);
CREATE INDEX idx_condominium_invites_token ON condominium_invites(token);
CREATE INDEX idx_reservation_public_links_token ON reservation_public_links(token);
```

### Row Level Security (RLS)

Todas as tabelas devem ter RLS habilitado com políticas apropriadas. Ver arquivos SQL para políticas completas.

---

## 🔐 Sistema de Autenticação

### 1. Autenticação de Hosts (Usuários Principais)

- **Método:** Supabase Auth
- **Provider:** `components/auth/AuthProvider.tsx`
- **Funções:** `lib/auth.ts`
- **Rotas:**
  - Login: `/dashboard` (redireciona se não autenticado)
  - Registro: Via Supabase Auth
  - Reset de senha: `/auth/forgot-password` → `/auth/reset-password`

### 2. Autenticação de Condomínios

- **Método:** Supabase Auth (mesma tabela `auth.users`)
- **Provider:** `components/condominiums/CondominiumAuthProvider.tsx`
- **Funções:** `lib/condominium-auth.ts`
- **Rotas:**
  - Login: `/condominio/login`
  - Cadastro: `/condominio/cadastro`
  - Aceitar convite: `/condominio/convite/[token]`

### 3. Autenticação de Hóspedes

- **Método:** Custom (tabela `guests` com `password_hash`)
- **Provider:** `components/guests/GuestAuthProvider.tsx`
- **Funções:** `lib/guest-auth.ts`
- **Rotas:**
  - Login: `/hospede/login`
  - Cadastro: `/hospede/cadastro`
  - Verificar email: `/hospede/verificar-email`

---

## 📱 Funcionalidades Principais

### 1. Gestão de Propriedades

**Formulário em 6 Passos:**

1. **Dados do Anfitrião** (`Step1HostData.tsx`)
   - Nome completo
   - CPF/CNPJ
   - Email
   - Telefone
   - É empresa?

2. **Dados do Espaço** (`Step2SpaceData.tsx`)
   - Nome do espaço
   - Tipo (quarto/espaço inteiro)
   - Descrição
   - Link do Airbnb (com scraping)
   - Importação automática de dados

3. **Localização** (`Step3Location.tsx`)
   - Endereço completo
   - Busca por CEP (ViaCEP)
   - Como entrar
   - Links Google Maps e Waze
   - Opções de entrada (portaria, fechadura digital, chaves físicas)
   - WiFi (nome e senha)

4. **Regras** (`Step4Rules.tsx`)
   - Lista de regras
   - Ícones personalizados (emoji, imagem, padrão)
   - Título e descrição

5. **O que tem no imóvel** (`Step5PropertyItems.tsx`)
   - Café da manhã (fornecido, descrição, taxa extra)
   - Cozinha (itens customizáveis)
   - Quarto (itens customizáveis)
   - Banheiro (itens customizáveis)
   - Lavanderia (itens customizáveis)
   - Outros (itens customizáveis)

6. **Dicas Locais** (`Step6LocalTips.tsx`)
   - Restaurantes
   - Atrações
   - Serviços
   - Experiências
   - Com foto de capa, links, telefone, WhatsApp, etc.

**Componente Principal:** `components/properties/PropertyForm.tsx`

### 2. Sistema de Reservas

**Calendários Disponíveis:**
- `ReservationCalendar.tsx` - Calendário principal
- `AirbnbStyleCalendar.tsx` - Estilo Airbnb
- `PMSCalendar.tsx` - Estilo PMS
- `AmenitizCalendar.tsx` - Estilo Amenitiz
- `NewReservationCalendar.tsx` - Novo calendário

**Funcionalidades:**
- Criar reserva manualmente
- Visualizar reservas por propriedade
- Editar reservas
- Cancelar reservas
- Gerar link público de check-in
- Enviar reserva para condomínio

**Rotas:**
- `/dashboard/reservas` - Lista de reservas
- `/dashboard/reservas/novo` - Nova reserva
- `/dashboard/reservas/editar/[id]` - Editar reserva
- `/dashboard/reservas/pms` - Visualização PMS

### 3. Sistema de Check-in

**Fluxo:**
1. Host cria reserva
2. Sistema gera token único (`checkin_link_token`)
3. Link público: `/checkin/[token]`
4. Hóspede acessa link
5. Hóspede faz cadastro/login
6. Hóspede preenche dados (CPF, RG, foto, selfie)
7. Host aprova hóspede
8. Check-in completo

**Componentes:**
- Página pública: `app/checkin/[token]/page.tsx`
- Área do hóspede: `app/hospede/reservas/[id]/page.tsx`

### 4. Sistema de Condomínios

**Funcionalidades:**
- Cadastro de condomínio
- Convites para condomínios
- Envio automático de reservas
- Dashboard de reservas
- Visualização de hóspedes
- Links públicos temporários

**Fluxo de Envio Automático:**
1. Host vincula propriedade a condomínio
2. Ao criar reserva, sistema envia automaticamente para condomínio
3. Se condomínio não cadastrado, envia convite
4. Condomínio recebe email com link
5. Condomínio visualiza reserva no dashboard

**Rotas:**
- `/condominio/cadastro` - Cadastro
- `/condominio/login` - Login
- `/condominio/dashboard` - Dashboard
- `/condominio/convite/[token]` - Aceitar convite
- `/condominio/reservas/[id]` - Detalhes da reserva
- `/condominio/reserva/[token]` - Link público de reserva

### 5. Sistema de Hóspedes

**Funcionalidades:**
- Cadastro com verificação de email
- Login
- Perfil completo
- Visualização de reservas
- Aceitar convites de reserva
- Criar contas temporárias para outros hóspedes

**Rotas:**
- `/hospede/cadastro` - Cadastro
- `/hospede/login` - Login
- `/hospede/perfil` - Perfil
- `/hospede/perfil/completar` - Completar perfil
- `/hospede/reservas` - Lista de reservas
- `/hospede/reservas/[id]` - Detalhes da reserva
- `/hospede/verificar-email` - Verificar email

### 6. Integrações

#### Airbnb Scraping
- **Rota:** `/api/airbnb/scrape`
- **Método:** POST
- **Body:** `{ url: string }`
- **Retorna:** Dados da propriedade (nome, descrição, fotos, regras, amenidades, etc.)

#### ViaCEP
- **Rota:** `/api/cep?cep=12345678`
- **Método:** GET
- **Retorna:** Dados do endereço

#### Mailtrap
- **Serviço:** `lib/mailtrap-service.ts`
- **Funções:** `lib/email-service.ts`
- **Emails enviados:**
  - Verificação de email (hóspedes)
  - Reset de senha (hosts)
  - Convites de reserva
  - Convites de condomínio
  - Notificações de reserva
  - Contas temporárias

---

## 🎨 Design System

### Cores

```typescript
primary: {
  blue: '#1e30f3'
}
accent: {
  pink: '#e21e80'
}
text: {
  gray: '#6c757d'
}
dark: {
  gray: '#343a40'
}
light: {
  gray: '#f8f9fa'
}
```

### Gradiente Principal

```css
linear-gradient(135deg, #1e30f3 0%, #e21e80 100%)
```

### Tipografia

- Font: Plus Jakarta Sans (variável)
- Fallback: sans-serif

### Componentes Principais

- **Botões:** Gradiente principal, bordas arredondadas
- **Inputs:** Bordas arredondadas, focus com cor primária
- **Cards:** Sombra suave, bordas arredondadas
- **Modais:** Overlay escuro, conteúdo centralizado

---

## 🔄 Fluxos Principais

### Fluxo 1: Criar Propriedade

1. Host acessa `/dashboard/espacos/novo`
2. Preenche formulário em 6 passos
3. Pode importar dados do Airbnb (opcional)
4. Salva propriedade
5. Propriedade aparece em `/dashboard/espacos`

### Fluxo 2: Criar Reserva

1. Host acessa `/dashboard/reservas/novo`
2. Seleciona propriedade
3. Seleciona datas no calendário
4. Preenche dados da reserva (canal, hóspedes, etc.)
5. Sistema gera token único
6. Reserva criada
7. Link de check-in gerado automaticamente

### Fluxo 3: Check-in do Hóspede

1. Host envia link de check-in para hóspede
2. Hóspede acessa `/checkin/[token]`
3. Se não tem conta, faz cadastro
4. Se tem conta, faz login
5. Preenche dados (CPF, RG, foto, selfie)
6. Host recebe notificação
7. Host aprova hóspede
8. Check-in completo

### Fluxo 4: Envio para Condomínio

1. Host vincula propriedade a condomínio
2. Host cria reserva
3. Sistema detecta condomínio vinculado
4. Se condomínio cadastrado:
   - Envia email com link para dashboard
   - Reserva aparece no dashboard do condomínio
5. Se condomínio não cadastrado:
   - Envia convite por email
   - Condomínio aceita convite
   - Cria conta
   - Recebe acesso à reserva

---

## 🛠️ Melhores Práticas a Implementar

### 1. Refatoração de Código

- **lib/supabase.ts** (2440 linhas) → Quebrar em módulos:
  - `lib/supabase/client.ts` - Cliente base
  - `lib/supabase/properties.ts` - Funções de propriedades
  - `lib/supabase/reservations.ts` - Funções de reservas
  - `lib/supabase/guests.ts` - Funções de hóspedes
  - `lib/supabase/photos.ts` - Funções de fotos
  - `lib/supabase/users.ts` - Funções de usuários

### 2. Type Safety

- Garantir tipos completos em todas as funções
- Usar tipos do Supabase gerados
- Validar inputs com Zod ou similar
- Tipos de API responses consistentes

### 3. Error Handling

- Try-catch em todas as operações assíncronas
- Mensagens de erro amigáveis
- Logging adequado
- Fallbacks quando apropriado

### 4. Performance

- Lazy loading de componentes pesados
- Code splitting por rota
- Otimização de imagens
- Caching de queries frequentes
- Paginação em listas grandes

### 5. Segurança

- Validação de inputs no servidor
- Sanitização de dados
- RLS policies bem definidas
- Tokens seguros e com expiração
- Rate limiting em APIs públicas

### 6. Testes

- Testes unitários para funções críticas
- Testes de integração para APIs
- Testes E2E para fluxos principais
- Cobertura mínima de 70%

### 7. Acessibilidade

- ARIA labels
- Navegação por teclado
- Contraste adequado
- Textos alternativos em imagens

---

## 📝 Scripts NPM

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## 🚀 Próximos Passos para Recriação

1. **Setup Inicial**
   - Criar projeto Next.js
   - Instalar dependências
   - Configurar TypeScript
   - Configurar Tailwind
   - Configurar ESLint

2. **Banco de Dados**
   - Criar projeto Supabase
   - Executar migrations
   - Configurar RLS
   - Gerar tipos TypeScript

3. **Autenticação**
   - Implementar AuthProvider de hosts
   - Implementar CondominiumAuthProvider
   - Implementar GuestAuthProvider
   - Criar páginas de login/registro

4. **Estrutura Base**
   - Criar estrutura de pastas
   - Configurar rotas
   - Criar layouts
   - Configurar providers

5. **Funcionalidades Core**
   - Gestão de propriedades
   - Sistema de reservas
   - Sistema de check-in
   - Sistema de condomínios
   - Sistema de hóspedes

6. **Integrações**
   - Airbnb scraping
   - ViaCEP
   - Mailtrap

7. **Testes**
   - Configurar Jest
   - Criar testes unitários
   - Criar testes de integração

8. **Otimizações**
   - Performance
   - SEO
   - Acessibilidade

---

**Este documento deve ser usado como referência completa para recriar o projeto do zero com todas as melhores práticas.**

