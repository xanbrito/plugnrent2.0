# 🎯 Sistema de Roteamento de Agentes

Este arquivo documenta como o sistema de roteamento automático de agentes funciona no Cursor IDE.

## 📋 Como Funciona

O arquivo `.cursorrules` na raiz do projeto contém as regras de roteamento que instruem o assistente do Cursor a:

1. **Detectar automaticamente** o contexto da tarefa
2. **Identificar o agente apropriado** baseado em palavras-chave e contexto
3. **Aplicar o prompt do agente** automaticamente
4. **Executar a tarefa** como o agente especializado

## 🔍 Detecção Automática

O sistema detecta automaticamente qual agente usar baseado em:

### Palavras-chave e Contexto

| Agente | Palavras-chave | Contexto |
|--------|---------------|----------|
| **Backend Specialist** | API, endpoint, rota, backend, supabase query, autenticação, RLS | Arquivos em `app/api/`, queries Supabase, lógica servidor |
| **Frontend Specialist** | componente, página, UI, UX, formulário, interface, renderização | Arquivos em `components/`, `app/` (páginas), React |
| **Database Specialist** | migration, schema, tabela, RLS policy, segurança, índice | Migrations SQL, schema de banco, RLS policies |
| **Testing Specialist** | teste, test, Jest, cobertura, bug, QA | Arquivos em `__tests__/`, testes |
| **TypeScript Specialist** | TypeScript, tipo, type, refatorar, refactor, qualidade | Erros TypeScript, tipos, refatoração |
| **Performance Specialist** | performance, otimizar, lento, velocidade, cache, bundle | Otimizações, performance, Core Web Vitals |
| **Integration Specialist** | integração, API externa, Airbnb, ViaCEP, email, webhook | Integrações externas, APIs de terceiros |

## 💡 Exemplos de Uso

### Exemplo 1: Tarefa de Backend
```
Usuário: "Corrigir erro 500 na rota /api/reservations quando crio uma reserva"

Sistema detecta:
- Palavra-chave: "rota /api/"
- Contexto: API route, erro 500
→ Roteia para: Backend Specialist Agent
→ Aplica prompt de: agents/backend-specialist-agent.md
→ Executa como especialista em backend
```

### Exemplo 2: Tarefa de Frontend
```
Usuário: "O layout do formulário está quebrado no mobile"

Sistema detecta:
- Palavra-chave: "formulário", "layout", "mobile"
- Contexto: UI/UX, componente React
→ Roteia para: Frontend Specialist Agent
→ Aplica prompt de: agents/frontend-specialist-agent.md
→ Executa como especialista em frontend
```

### Exemplo 3: Tarefa de Database
```
Usuário: "Criar migration para adicionar coluna status na tabela reservations"

Sistema detecta:
- Palavra-chave: "migration", "tabela"
- Contexto: Schema de banco, SQL
→ Roteia para: Database & Security Specialist Agent
→ Aplica prompt de: agents/database-security-specialist-agent.md
→ Executa como especialista em database
```

## 🎯 Múltiplos Agentes

Se uma tarefa requer múltiplos agentes, o sistema pode:

1. **Usar agentes em sequência**: Um agente completa sua parte, depois outro continua
2. **Colaboração**: Agentes trabalham juntos (ex: Frontend + Backend para uma feature completa)

### Exemplo de Colaboração
```
Usuário: "Criar nova feature de avaliações com API e componente React"

Sistema detecta:
- Backend: Precisa criar API route
- Frontend: Precisa criar componente React
→ Usa ambos os agentes em colaboração
```

## 📝 Como Usar

### Método 1: Detecção Automática (Recomendado)
Simplesmente descreva sua tarefa normalmente. O sistema detectará automaticamente qual agente usar:

```
"Corrigir erro no componente de calendário"
→ Automaticamente usa Frontend Specialist

"Otimizar query do Supabase que está lenta"
→ Automaticamente usa Backend Specialist
```

### Método 2: Especificação Explícita
Você pode especificar explicitamente qual agente usar:

```
"Como Backend Specialist: corrigir erro na API de reservas"
→ Força uso do Backend Specialist Agent

"Como Frontend Specialist: melhorar UI do formulário"
→ Força uso do Frontend Specialist Agent
```

## 🔧 Configuração

O sistema está configurado no arquivo `.cursorrules` na raiz do projeto. Você pode:

1. **Adicionar novas palavras-chave** para melhor detecção
2. **Ajustar mapeamentos** de contexto para agentes
3. **Criar novos agentes** adicionando arquivos em `agents/`

## 📚 Arquivos Relacionados

- `.cursorrules` - Regras de roteamento (raiz do projeto)
- `agents/*.md` - Prompts individuais de cada agente
- `agents/README.md` - Documentação geral dos agentes

---

**O sistema está ativo e funcionando automaticamente no Cursor IDE!**




