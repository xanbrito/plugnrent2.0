# 🧪 Executar Testes Completos - Sistema Vibing

## 📋 Como Executar

### Opção 1: Script Batch (Windows)
```bash
executar-testes.bat
```

### Opção 2: Comando Direto
```bash
npx jest
```

### Opção 3: Com Cobertura
```bash
npm run test:coverage
```

## 🔍 Testes Disponíveis

### Testes Unitários
- ✅ `__tests__/lib/cpf-validator.test.ts` - Validação de CPF
- ⚠️ `__tests__/lib/auth.test.ts` - Autenticação (requer mocks)

### Testes de API
- ✅ `__tests__/api/cep.test.ts` - API CEP
- ✅ `__tests__/api/cpf.test.ts` - API CPF

### Testes de Banco de Dados
- ✅ `__tests__/database/crud.test.ts` - Operações CRUD

## ⚠️ Problemas Conhecidos

1. **Jest não encontra testes:**
   - Verificar se está no diretório correto
   - Verificar jest.config.js

2. **Erros de importação:**
   - Verificar paths no tsconfig.json
   - Verificar moduleNameMapper no jest.config.js

3. **Mocks não funcionam:**
   - Verificar __tests__/setup.ts
   - Verificar se mocks estão corretos

## 📊 Resultados Esperados

Após executar os testes, você deve ver:
- Total de testes executados
- Testes passando/falhando
- Cobertura de código (se usar --coverage)

---

**Execute os testes e verifique o RELATORIO-ERROS.md para erros encontrados!**




