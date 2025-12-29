# 🤖 Agentes de IA Especializados - Sistema Vibing

Este diretório contém os prompts e definições de cada agente especializado do Sistema Vibing.

## 📋 Lista de Agentes

### 1. 🗄️ Backend Specialist Agent
**Arquivo:** `backend-specialist-agent.md`
**Foco:** API Routes, Supabase, Database, RLS Policies, Server Logic

### 2. 🎨 Frontend Specialist Agent
**Arquivo:** `frontend-specialist-agent.md`
**Foco:** React Components, Next.js Pages, UI/UX, Tailwind CSS, Formulários

### 3. 🔒 Database & Security Specialist Agent
**Arquivo:** `database-security-specialist-agent.md`
**Foco:** PostgreSQL, Supabase, RLS Policies, Migrations, Data Integrity

### 4. 🧪 Testing & QA Specialist Agent
**Arquivo:** `testing-qa-specialist-agent.md`
**Foco:** Jest, Test Coverage, E2E Tests, Integration Tests, Bug Detection

### 5. 📝 TypeScript & Code Quality Specialist Agent
**Arquivo:** `typescript-code-quality-specialist-agent.md`
**Foco:** Type Safety, Code Refactoring, Best Practices, Linting

### 6. ⚡ Performance & Optimization Specialist Agent
**Arquivo:** `performance-optimization-specialist-agent.md`
**Foco:** Performance, Bundle Size, Caching, Database Queries, API Optimization

### 7. 🔌 Integration Specialist Agent
**Arquivo:** `integration-specialist-agent.md`
**Foco:** External APIs (Airbnb, ViaCEP, Email, WhatsApp), Webhooks, Third-party Services

## 🎯 Como Usar os Agentes

### Workflow Recomendado

1. **Identifique o Problema**
   - Qual área está com problema? (Frontend, Backend, Database, etc.)

2. **Escolha o Agente Apropriado**
   - Use o agente especializado na área do problema

3. **Forneça Contexto**
   - Descreva o problema claramente
   - Mencione arquivos relevantes
   - Inclua erros ou logs se disponíveis

4. **Colabore com o Agente**
   - O agente analisará e proporá soluções
   - Revise e aprove as mudanças
   - Teste as correções

5. **Valide com Testing Agent** (opcional)
   - Após correções, execute testes
   - Valide que não quebrou nada

### Exemplo de Uso

```
Usuário: "Estou tendo erro 500 na rota /api/reservations quando tento criar uma reserva"

→ Use: Backend Specialist Agent

O agente irá:
1. Analisar app/api/reservations/route.ts
2. Identificar o problema
3. Corrigir o erro
4. Validar autenticação/autorização
5. Garantir tratamento de erros adequado
```

## 📝 Notas Finais

- **Cada agente é especializado** em sua área
- **Agentes podem colaborar** quando necessário
- **Sempre teste** após mudanças
- **Documente** mudanças significativas
- **Priorize segurança** e estabilidade

---

**Sistema de Agentes criado para otimizar desenvolvimento e manutenção do Sistema Vibing.**




