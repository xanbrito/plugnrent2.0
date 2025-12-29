/**
 * Script para adicionar erros encontrados nos testes ao documento ERROS-TESTES.md
 * 
 * Uso:
 * node scripts/adicionar-erro-teste.js "Nome do Erro" "arquivo.test.ts" "crítico|alto|médio|baixo" "Descrição do erro" "Mensagem de erro"
 */

const fs = require('fs');
const path = require('path');

const ERROS_FILE = path.join(__dirname, '..', 'ERROS-TESTES.md');

function adicionarErro(nome, arquivo, severidade, descricao, mensagemErro, stackTrace = '') {
  // Ler o arquivo atual
  let conteudo = fs.readFileSync(ERROS_FILE, 'utf-8');
  
  // Encontrar o próximo número de erro
  const matches = conteudo.match(/ERRO-TESTE-(\d+):/g);
  let ultimoNumero = 0;
  if (matches && matches.length > 0) {
    ultimoNumero = Math.max(...matches.map(m => {
      const numMatch = m.match(/\d+/);
      return numMatch ? parseInt(numMatch[0]) : 0;
    }));
  }
  const proximoNumero = ultimoNumero + 1;
  
  // Mapear severidade para emoji
  const severidadeEmoji = {
    'crítico': '🔴',
    'alto': '🟠',
    'médio': '🟡',
    'baixo': '🟢'
  };
  
  const emoji = severidadeEmoji[severidade.toLowerCase()] || '🟡';
  const dataAtual = new Date().toISOString().split('T')[0];
  const horaAtual = new Date().toLocaleTimeString('pt-BR');
  
  // Criar entrada do erro
  const novaEntrada = `
### ERRO-TESTE-${String(proximoNumero).padStart(3, '0')}: ${nome}
- **Data de Descoberta:** ${dataAtual} ${horaAtual}
- **Arquivo/Teste:** \`${arquivo}\`
- **Severidade:** ${emoji} ${severidade.charAt(0).toUpperCase() + severidade.slice(1)}
- **Status:** ⚠️ Pendente
- **Descrição:**
  \`\`\`
  ${descricao}
  \`\`\`
- **Mensagem de Erro:**
  \`\`\`
  ${mensagemErro}
  \`\`\`
${stackTrace ? `- **Stack Trace:**
  \`\`\`
  ${stackTrace}
  \`\`\`` : ''}
- **Causa Identificada:**
  - [A ser identificada]
- **Correção Aplicada:**
  - [ ] Ainda não corrigido
  - **O que foi feito:**
    - [A ser preenchido quando corrigido]
  - **Arquivos Modificados:**
    - [A ser preenchido quando corrigido]
  - **Validação:**
    - [ ] Teste ainda falha
    - [ ] Teste passa após correção
- **Notas:**
  - [Observações adicionais]

---
`;
  
  // Inserir antes do template ou no final da seção de erros
  const templateIndex = conteudo.indexOf('## 📝 Template para Novos Erros');
  const errosIndex = conteudo.indexOf('## 🔍 Erros Encontrados');
  
  if (templateIndex !== -1) {
    // Inserir antes do template
    conteudo = conteudo.slice(0, templateIndex) + novaEntrada + conteudo.slice(templateIndex);
  } else if (errosIndex !== -1) {
    // Encontrar o final da seção de erros (próxima seção ##)
    const proximaSecao = conteudo.indexOf('##', errosIndex + 1);
    if (proximaSecao !== -1) {
      conteudo = conteudo.slice(0, proximaSecao) + novaEntrada + conteudo.slice(proximaSecao);
    } else {
      // Se não houver próxima seção, adicionar antes do final do arquivo
      conteudo += novaEntrada;
    }
  } else {
    // Se não encontrar a seção de erros, adicionar no final
    conteudo += novaEntrada;
  }
  
  // Remover mensagem "Nenhum erro encontrado ainda" se existir
  conteudo = conteudo.replace(/\*Nenhum erro encontrado ainda\. Execute os testes para identificar erros\.\*/g, '');
  
  // Atualizar resumo
  const resumoMatch = conteudo.match(/\| \*\*Pendentes\*\* \| (\d+) \|/);
  if (resumoMatch) {
    const pendentesAtual = parseInt(resumoMatch[1]);
    conteudo = conteudo.replace(
      /\| \*\*Pendentes\*\* \| \d+ \|/,
      `| **Pendentes** | ${pendentesAtual + 1} |`
    );
    
    // Atualizar total
    const totalMatch = conteudo.match(/\| \*\*Total\*\* \| (\d+) \|/);
    if (totalMatch) {
      const totalAtual = parseInt(totalMatch[1]);
      conteudo = conteudo.replace(
        /\| \*\*Total\*\* \| \d+ \|/,
        `| **Total** | ${totalAtual + 1} |`
      );
    }
    
    // Atualizar severidade no resumo (coluna específica)
    const severidadeColuna = {
      'crítico': 2,
      'alto': 3,
      'médio': 4,
      'baixo': 5
    };
    const coluna = severidadeColuna[severidade.toLowerCase()] || 4;
    
    // Atualizar linha de Pendentes com a severidade específica
    const linhas = conteudo.split('\n');
    for (let i = 0; i < linhas.length; i++) {
      if (linhas[i].includes('**Pendentes**')) {
        const partes = linhas[i].split('|').map(p => p.trim());
        if (partes[coluna]) {
          const valorAtual = parseInt(partes[coluna]) || 0;
          partes[coluna] = ` ${valorAtual + 1} `;
          linhas[i] = '|' + partes.join('|') + '|';
          break;
        }
      }
    }
    conteudo = linhas.join('\n');
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
  
  console.log(`✅ Erro ERRO-TESTE-${String(proximoNumero).padStart(3, '0')} adicionado ao documento ERROS-TESTES.md`);
}

// Executar se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 5) {
    console.error('Uso: node scripts/adicionar-erro-teste.js "Nome do Erro" "arquivo.test.ts" "severidade" "Descrição" "Mensagem de erro" [stackTrace]');
    process.exit(1);
  }
  
  const [nome, arquivo, severidade, descricao, mensagemErro, stackTrace] = args;
  adicionarErro(nome, arquivo, severidade, descricao, mensagemErro, stackTrace || '');
}

module.exports = { adicionarErro };

