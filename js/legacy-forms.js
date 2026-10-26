/* TEMPORÁRIO (Fase 2): mailto antigo. Será substituído por js/forms.js */
// Duck Tank form
function enviarDuckTank() {
  const nome        = document.getElementById('dt-nome').value.trim();
  const email       = document.getElementById('dt-email').value.trim();
  const periodo     = document.getElementById('dt-periodo').value;
  const integrantes = document.getElementById('dt-integrantes').value;
  const projeto     = document.getElementById('dt-projeto').value.trim();
  const area        = document.getElementById('dt-area').value;
  const desc        = document.getElementById('dt-desc').value.trim();
  const estagio     = document.getElementById('dt-estagio').value;

  if (!nome || !email || !periodo || !integrantes || !projeto || !area || !desc) {
    alert('Por favor, preencha todos os campos obrigatórios (*).');
    return;
  }

  const subject = '[Duck Tank PDCA] Cadastro: ' + projeto;
  let body = 'CADASTRO DUCK TANK — ADM UFRN\n';
  body += '='.repeat(40) + '\n\n';
  body += 'Nome: ' + nome + '\n';
  body += 'E-mail: ' + email + '\n';
  body += 'Período: ' + periodo + '\n';
  body += 'Integrantes: ' + integrantes + '\n\n';
  body += 'Projeto: ' + projeto + '\n';
  body += 'Área: ' + area + '\n';
  if (estagio) body += 'Estágio atual: ' + estagio + '\n';
  body += '\nDescrição da ideia:\n' + desc;

  document.getElementById('dt-feedback').style.display = 'inline';
  setTimeout(() => { document.getElementById('dt-feedback').style.display = 'none'; }, 3000);
  window.location.href = 'mailto:ca.peterdrucker@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

// Ouvidoria name field toggle
document.addEventListener('DOMContentLoaded', function() {
  const ouvId = document.getElementById('ouv-id');
  if (ouvId) {
    ouvId.addEventListener('change', function() {
      const row = document.getElementById('ouv-nome-row');
      if (row) row.style.display = this.value === 'Identificado' ? 'block' : 'none';
    });
  }
});
// Ouvidoria
document.getElementById('ouv-id') && document.getElementById('ouv-id').addEventListener('change', function() {
  document.getElementById('ouv-nome-row').style.display = this.value === 'Identificado' ? 'block' : 'none';
});
function enviarOuvidoria() {
  const tipo    = document.getElementById('ouv-tipo').value;
  const idMode  = document.getElementById('ouv-id').value;
  const nome    = document.getElementById('ouv-nome') ? document.getElementById('ouv-nome').value.trim() : '';
  const periodo = document.getElementById('ouv-periodo').value.trim();
  const msg     = document.getElementById('ouv-msg').value.trim();
  if (!tipo || !msg) { alert('Por favor, selecione o tipo e escreva sua mensagem.'); return; }

  const subject = '[Ouvidoria PDCA] ' + tipo;
  let body = 'Tipo: ' + tipo + '\n';
  body += 'Identificação: ' + idMode + '\n';
  if (idMode === 'Identificado' && nome) body += 'Nome: ' + nome + '\n';
  if (periodo) body += 'Período: ' + periodo + '\n';
  body += '\nMensagem:\n' + msg;

  document.getElementById('ouv-feedback').style.display = 'inline';
  setTimeout(() => { document.getElementById('ouv-feedback').style.display = 'none'; }, 3000);
  window.location.href = 'mailto:ca.peterdrucker@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}
