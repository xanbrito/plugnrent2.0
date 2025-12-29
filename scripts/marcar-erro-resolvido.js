/**
 * Script para marcar um erro como resolvido no documento ERROS-TESTES.md
 * 
 * Uso:
 * node scripts/marcar-erro-resolvido.js ERRO-TESTE-001 "O que foi feito para corrigir" "arquivo1.ts,arquivo2.ts"
 */

const fs = require('fs');
const path = require('path');

const ERROS_FILE = path.join(__dirname, '..', 'ERROS-TESTES.md');

function marcarErroResolvido(numeroErro, oQueFoiFeito, arquivosModificados, notas = '') {
  // Ler o arquivo atual
  let conteudo = fs.readFileSync(ERROS_FILE, 'utf-8');
  
  // Verificar se o erro existe
  const erroPattern = new RegExp(`### ERRO-TESTE-${String(numeroErro).padStart(3, '0')}:`, 'g');
  if (!erroPattern.test(conteudo)) {
    console.error(`❌ Erro ERRO-TESTE-${String(numeroErro).padStart(3, '0')} não encontrado!`);
    process.exit(1);
  }
  
  // Atualizar status - encontrar a seção do erro e substituir
  const numeroFormatado = String(numeroErro).padStart(3, '0');
  conteudo = conteudo.replace(
    new RegExp(`(### ERRO-TESTE-${numeroFormatado}: [^\\n]+\\n(?:[^#]|### ERRO-TESTE-\\d+:)*?)(- \\*\\*Status:\\*\\* ⚠️ Pendente)`, 's'),
    `$1- **Status:** ✅ Resolvido`
  );
  
  // Atualizar correção aplicada
  const numeroFormatado = String(numeroErro).padStart(3, '0');
  const dataAtual = new Date().toISOString().split('T')[0];
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  const oQueFoiFeitoLinhas = oQueFoiFeito.split('\n').filter(l => l.trim()).map(linha => `    - ${linha.trim()}`).join('\n');
  const arquivosLinhas = arquivosModificados.split(',').map(arquivo => `    - \`${arquivo.trim()}\``).join('\n');
  
  const correcaoTexto = `- **Correção Aplicada:**
  - [x] Corrigido em: ${dataAtual} ${horaAtual}
  - **O que foi feito:**
${oQueFoiFeitoLinhas}
  - **Arquivos Modificados:**
${arquivosLinhas}
  - **Validação:**
    - [ ] Teste ainda falha
    - [x] Teste passa após correção`;
  
  // Substituir a seção de correção aplicada
  const correcaoRegex = new RegExp(
    `(### ERRO-TESTE-${numeroFormatado}: [^\\n]+\\n(?:[^#]|### ERRO-TESTE-\\d+:)*?)(- \\*\\*Correção Aplicada:\\*\\*[^#]+?)(?=---|### ERRO-TESTE|$)`,
    's'
  );
  
  if (correcaoRegex.test(conteudo)) {
    conteudo = conteudo.replace(correcaoRegex, `$1${correcaoTexto}\n`);
  } else {
    // Se não encontrar, inserir antes do próximo erro ou no final
    const erroRegex = new RegExp(`(### ERRO-TESTE-${numeroFormatado}: [^\\n]+\\n(?:[^#]|### ERRO-TESTE-\\d+:)*?)(---|### ERRO-TESTE|$)`, 's');
    conteudo = conteudo.replace(erroRegex, `$1${correcaoTexto}\n\n$2`);
  }
  
  // Adicionar ou atualizar notas se fornecidas
  if (notas) {
    const numeroFormatado = String(numeroErro).padStart(3, '0');
    const notasRegex = new RegExp(
      `(### ERRO-TESTE-${numeroFormatado}: [^\\n]+\\n(?:[^#]|### ERRO-TESTE-\\d+:)*?)(- \\*\\*Notas:\\*\\*[^#]+?)(?=---|### ERRO-TESTE|$)`,
      's'
    );
    
    if (notasRegex.test(conteudo)) {
      conteudo = conteudo.replace(notasRegex, `$1- **Notas:**\n  - ${notas}\n`);
    } else {
      // Inserir notas antes do próximo erro ou no final
      const erroRegex = new RegExp(`(### ERRO-TESTE-${numeroFormatado}: [^\\n]+\\n(?:[^#]|### ERRO-TESTE-\\d+:)*?)(---|### ERRO-TESTE|$)`, 's');
      conteudo = conteudo.replace(erroRegex, `$1- **Notas:**\n  - ${notas}\n\n$2`);
    }
  }
  
  // Atualizar resumo
  const resumoPendentesMatch = conteudo.match(/\| \*\*Pendentes\*\* \| (\d+) \|/);
  const resumoResolvidosMatch = conteudo.match(/\| \*\*Resolvidos\*\* \| (\d+) \|/);
  
  if (resumoPendentesMatch && resumoResolvidosMatch) {
    const pendentesAtual = parseInt(resumoPendentesMatch[1]);
    const resolvidosAtual = parseInt(resumoResolvidosMatch[1]);
    
    conteudo = conteudo.replace(
      /\| \*\*Pendentes\*\* \| \d+ \|/,
      `| **Pendentes** | ${Math.max(0, pendentesAtual - 1)} |`
    );
    
    conteudo = conteudo.replace(
      /\| \*\*Resolvidos\*\* \| \d+ \|/,
      `| **Resolvidos** | ${resolvidosAtual + 1} |`
    );
  }
  
  // Atualizar última atualização
  const agora = new Date();
  const dataFormatada = agora.toISOString().split('T')[0];
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  conteudo = conteudo.replace(
    /\*\*Última Atualização:\*\* \d{4}-\d{2}-\d{2}(.*)?/,
    `**Última Atualização:** ${dataFormatada} ${horaFormatada}`
  );
  
  // Escrever arquivo
  fs.writeFileSync(ERROS_FILE, conteudo, 'utf-8');
  
  console.log(`✅ Erro ERRO-TESTE-${numeroErro} marcado como resolvido!`);
}

// Executar se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Uso: node scripts/marcar-erro-resolvido.js ERRO-TESTE-001 "O que foi feito" "arquivo1.ts,arquivo2.ts" [notas]');
    process.exit(1);
  }
  
  const [numeroErro, oQueFoiFeito, arquivosModificados, notas] = args;
  // Extrair número do erro (pode ser ERRO-TESTE-001 ou 001 ou 1)
  let numero = numeroErro.replace('ERRO-TESTE-', '').trim();
  if (!numero) {
    numero = numeroErro.trim();
  }
  // Remover zeros à esquerda mas manter pelo menos 1 dígito
  numero = numero.replace(/^0+/, '') || '1';
  marcarErroResolvido(parseInt(numero), oQueFoiFeito, arquivosModificados, notas || '');
}

module.exports = { marcarErroResolvido };

