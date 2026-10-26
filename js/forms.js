/* ══════════════════════════════════════════════════════════════
   forms.js — Envio dos formulários (Ouvidoria e Duck Tank)
   Serviço: FormSubmit (https://formsubmit.co) — sem backend.
   Para trocar o e-mail de destino, edite SÓ a linha "email" abaixo.
   ══════════════════════════════════════════════════════════════ */
const FORMS_CONFIG = {
    email: 'ca.peterdrucker@gmail.com',
    endpoint: 'https://formsubmit.co/ajax/',
    minFillMs: 5000, // anti-robô: ninguém preenche o formulário em menos de 5s
    timeoutMs: 45000, // o FormSubmit pode demorar para responder; espera até 45s
};
const PAGE_LOADED_AT = Date.now();

const byId = (id) => document.getElementById(id);
const val = (id) => (byId(id) ? byId(id).value.trim() : '');
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const semEmoji = (s) => s.replace(/^[^\p{L}]+/u, '').trim();

/* ── Mensagem de status ao lado do botão ── */
function feedback(id, msg, ok) {
    const el = byId(id);
    if (!el) return;
    if (el.dataset.okColor === undefined) el.dataset.okColor = el.style.color || '';
    el.textContent = msg;
    el.style.color = ok ? el.dataset.okColor : '#dc2626';
    el.style.display = 'inline';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
}

/* ── Campo-isca invisível (robôs preenchem, pessoas não) ── */
function honeypot(btn) {
    let hp = btn.parentElement.querySelector('input[name="website"]');
    if (!hp) {
        hp = document.createElement('input');
        hp.type = 'text';
        hp.name = 'website';
        hp.tabIndex = -1;
        hp.autocomplete = 'off';
        hp.setAttribute('aria-hidden', 'true');
        hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
        btn.parentElement.appendChild(hp);
    }
    return hp;
}

/* ── Envio ao FormSubmit ── */
async function sendForm(fields, subject) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FORMS_CONFIG.timeoutMs);
    try {
        const res = await fetch(FORMS_CONFIG.endpoint + FORMS_CONFIG.email, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...fields, _subject: subject, _template: 'table', _captcha: 'false' }),
            signal: ctrl.signal,
        });
        const texto = await res.text().catch(() => '');
        let data = {};
        try { data = JSON.parse(texto); } catch (_) { /* resposta não-JSON */ }
        console.info('[FormSubmit] resposta: HTTP', res.status, texto.slice(0, 300));
        // Sucesso = HTTP 2xx e o serviço não disse explicitamente "false"
        const recusado = data.success === false || data.success === 'false';
        if (!res.ok || recusado) {
            console.warn('[FormSubmit] resposta recusada. HTTP', res.status, data);
            throw new Error(data.message || 'HTTP ' + res.status);
        }
    } catch (e) {
        if (e.name === 'AbortError') console.error('[FormSubmit] sem resposta após ' + FORMS_CONFIG.timeoutMs / 1000 + 's (rede, bloqueio ou serviço fora do ar)');
        else console.error('[FormSubmit] falha:', e);
        throw e;
    } finally {
        clearTimeout(timer);
    }
}

/* ── Fluxo comum: valida → envia → mostra resultado ── */
async function runForm({ btnSelector, feedbackId, validate, build, reset }) {
    const btn = document.querySelector(btnSelector);
    const erro = validate();
    if (erro) return feedback(feedbackId, erro, false);

    const hp = btn ? honeypot(btn) : null;
    const robo = (hp && hp.value) || Date.now() - PAGE_LOADED_AT < FORMS_CONFIG.minFillMs;
    if (robo) {
        // finge sucesso para não ensinar o robô
        feedback(feedbackId, '✓ Enviado com sucesso!', true);
        return;
    }

    const { fields, subject } = build();
    if (btn) { btn.disabled = true; btn.style.opacity = '.6'; btn.style.cursor = 'wait'; }
    feedback(feedbackId, 'Enviando...', true);
    try {
        await sendForm(fields, subject);
        feedback(feedbackId, '✓ Enviado com sucesso! Recebemos sua mensagem.', true);
        reset();
    } catch (e) {
        const demorou = e && e.name === 'AbortError';
        feedback(
            feedbackId,
            demorou
                ? 'O servidor demorou a responder. Sua mensagem pode ter sido enviada: confirme com o C.A. antes de reenviar (' + FORMS_CONFIG.email + ').'
                : 'Não foi possível enviar agora. Tente de novo em instantes ou escreva para ' + FORMS_CONFIG.email + '.',
            false
        );
    } finally {
        if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
    }
}

function limpar(ids) {
    ids.forEach((id) => {
        const el = byId(id);
        if (el) el.value = el.tagName === 'SELECT' ? (el.options[0] ? el.options[0].value : '') : '';
    });
}

/* ══════════════ OUVIDORIA ══════════════ */
const ouvId = byId('ouv-id');
if (ouvId) {
    ouvId.addEventListener('change', function () {
        const row = byId('ouv-nome-row');
        if (row) row.style.display = this.value === 'Identificado' ? 'block' : 'none';
    });
}

function enviarOuvidoria() {
    runForm({
        btnSelector: 'button[onclick="enviarOuvidoria()"]',
        feedbackId: 'ouv-feedback',
        validate: () => {
            if (!val('ouv-tipo')) return 'Selecione o tipo de manifestação.';
            if (val('ouv-msg').length < 10) return 'Escreva sua mensagem (mínimo de 10 caracteres).';
            if (val('ouv-msg').length > 5000) return 'Mensagem muito longa (máximo de 5000 caracteres).';
            if (val('ouv-id') === 'Identificado' && !val('ouv-nome')) return 'Informe seu nome ou escolha "Anônimo".';
            return '';
        },
        build: () => {
            const identificado = val('ouv-id') === 'Identificado';
            const tipo = semEmoji(val('ouv-tipo'));
            // Anônimo: o nome NUNCA é enviado
            const fields = { Tipo: tipo, Identificação: identificado ? 'Identificado' : 'Anônimo' };
            if (identificado) fields.Nome = val('ouv-nome');
            if (val('ouv-periodo')) fields['Período / Turma'] = val('ouv-periodo');
            fields.Mensagem = val('ouv-msg');
            return { fields, subject: '[Ouvidoria PDCA] ' + tipo + (identificado ? '' : ' (anônima)') };
        },
        reset: () => {
            limpar(['ouv-tipo', 'ouv-id', 'ouv-nome', 'ouv-periodo', 'ouv-msg']);
            const row = byId('ouv-nome-row');
            if (row) row.style.display = 'none';
        },
    });
}

/* ══════════════ DUCK TANK ══════════════ */
function enviarDuckTank() {
    runForm({
        btnSelector: 'button[onclick="enviarDuckTank()"]',
        feedbackId: 'dt-feedback',
        validate: () => {
            const obrig = ['dt-nome', 'dt-email', 'dt-periodo', 'dt-integrantes', 'dt-projeto', 'dt-area', 'dt-desc'];
            if (obrig.some((id) => !val(id))) return 'Preencha todos os campos obrigatórios (*).';
            if (!isEmail(val('dt-email'))) return 'Informe um e-mail válido.';
            if (val('dt-desc').length < 30) return 'Descreva melhor sua ideia (mínimo de 30 caracteres).';
            if (val('dt-desc').length > 5000) return 'Descrição muito longa (máximo de 5000 caracteres).';
            return '';
        },
        build: () => {
            const fields = {
                Nome: val('dt-nome'),
                email: val('dt-email'), // o FormSubmit usa "email" como Reply-To
                'Período': val('dt-periodo'),
                Integrantes: val('dt-integrantes'),
                Projeto: val('dt-projeto'),
                'Área': val('dt-area'),
            };
            if (val('dt-estagio')) fields['Estágio atual'] = val('dt-estagio');
            fields['Descrição da ideia'] = val('dt-desc');
            return { fields, subject: '[Duck Tank PDCA] Cadastro: ' + val('dt-projeto') };
        },
        reset: () => limpar(['dt-nome', 'dt-email', 'dt-periodo', 'dt-integrantes', 'dt-projeto', 'dt-area', 'dt-desc', 'dt-estagio']),
    });
}