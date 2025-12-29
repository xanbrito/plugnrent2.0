# 🚀 Guia: Iniciar e Testar o Sistema Vibing

## 📋 Visão Geral

Este guia explica como iniciar o projeto localmente e executar testes para validar o sistema.

## 🎯 Script Principal

### `iniciar-e-testar.bat`

Script interativo completo que oferece múltiplas opções:

1. **Iniciar servidor de desenvolvimento**
2. **Executar testes**
3. **Iniciar servidor E executar testes**
4. **Verificar ambiente** (Node.js, npm, arquivos)
5. **Instalar/Atualizar dependências**
6. **Criar arquivo .env.local**

## 🚀 Como Usar

### Opção 1: Script Interativo (Recomendado)

```bash
iniciar-e-testar.bat
```

O script abrirá um menu interativo onde você pode escolher a ação desejada.

### Opção 2: Script Simples (Apenas Iniciar)

```bash
start.bat
```

Inicia o servidor de desenvolvimento diretamente.

### Opção 3: Comandos Manuais

#### Iniciar Servidor
```bash
npm run dev
```

#### Executar Testes
```bash
npm test
```

#### Executar Testes com Cobertura
```bash
npm run test:coverage
```

#### Executar Testes em Modo Watch
```bash
npm run test:watch
```

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter:

- ✅ **Node.js 18+** instalado
- ✅ **npm** instalado (vem com Node.js)
- ✅ Arquivo **.env.local** criado (o script pode criar automaticamente)

## 🔍 Verificação do Ambiente

Execute a opção 4 do menu para verificar:

- Versão do Node.js
- Versão do npm
- Arquivos do projeto (package.json, node_modules, .env.local)
- Estrutura de diretórios (app/, lib/, components/)

## 🧪 Testes Disponíveis

O projeto possui testes para:

### Testes Unitários
- ✅ `__tests__/lib/cpf-validator.test.ts` - Validação de CPF
- ✅ `__tests__/lib/auth.test.ts` - Autenticação

### Testes de API
- ✅ `__tests__/api/cep.test.ts` - API de CEP
- ✅ `__tests__/api/cpf.test.ts` - API de CPF

### Testes de Banco de Dados
- ✅ `__tests__/database/crud.test.ts` - Operações CRUD

## 🌐 Acessar o Sistema

Após iniciar o servidor, acesse:

- **Home:** http://localhost:3000
- **Login Host:** http://localhost:3000/auth/login
- **Login Condomínio:** http://localhost:3000/condominio/login
- **Login Hóspede:** http://localhost:3000/hospede/login
- **Dashboard:** http://localhost:3000/dashboard

## 🐛 Troubleshooting

### Erro: "Node.js não encontrado"
- Instale Node.js 18+ de https://nodejs.org
- Reinicie o terminal após instalar

### Erro: "package.json não encontrado"
- Certifique-se de estar na raiz do projeto
- O script deve mudar automaticamente para o diretório correto

### Erro: "Dependências não instaladas"
- Execute a opção 5 do menu ou `npm install`

### Erro: ".env.local não encontrado"
- Execute a opção 6 do menu ou crie manualmente
- Veja `CONFIGURACOES-E-TOKENS.md` para referência

### Porta 3000 já em uso
- Feche outros processos usando a porta 3000
- Ou altere a porta no `package.json` (script dev)

### Testes falhando
- Verifique se o `.env.local` está configurado corretamente
- Alguns testes requerem mocks do Supabase
- Veja `ERROS-TESTES.md` para erros conhecidos

## 📊 Fluxo Recomendado

1. **Primeira vez:**
   ```
   iniciar-e-testar.bat → Opção 4 (Verificar ambiente)
   iniciar-e-testar.bat → Opção 5 (Instalar dependências)
   iniciar-e-testar.bat → Opção 6 (Criar .env.local)
   ```

2. **Desenvolvimento:**
   ```
   iniciar-e-testar.bat → Opção 1 (Iniciar servidor)
   ```

3. **Antes de commitar:**
   ```
   iniciar-e-testar.bat → Opção 2 (Executar testes)
   ```

4. **Teste completo:**
   ```
   iniciar-e-testar.bat → Opção 3 (Iniciar e testar)
   ```

## 📝 Notas Importantes

- O servidor inicia automaticamente em **http://localhost:3000**
- O navegador será aberto automaticamente após 3 segundos
- Pressione **Ctrl+C** para parar o servidor
- Os testes podem levar alguns minutos para executar
- Alguns testes requerem conexão com Supabase (configurado no .env.local)

## 🔗 Links Úteis

- **Documentação Completa:** `ESPECIFICACAO-COMPLETA-PROJETO.md`
- **Configurações:** `CONFIGURACOES-E-TOKENS.md`
- **Guia de Testes:** `GUIA-EXECUCAO-TESTES.md`
- **Próximos Passos:** `PROXIMOS-PASSOS.md`

---

**Criado para facilitar o desenvolvimento e testes do Sistema Vibing** 🚀




