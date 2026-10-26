# Portal ADM UFRN — PDCA

Site oficial do curso de Administração da UFRN, mantido pelo Peter Drucker Centro Acadêmico (PDCA).
HTML + CSS + JS puro (sem build, sem framework). SPA: as seções alternam via `goPage()`.

## Rodar localmente
Opção A (VS Code): instale a extensão **Live Server** → clique direito em `index.html` → *Open with Live Server*.
Opção B (terminal): `npm run dev` → http://localhost:5500

## Estrutura
```
index.html          marcação das 12 páginas + navegação (sidebar e mobile)
css/
  base.css          tokens (:root), reset, REGRA: cantos quadrados
  layout.css        header, sidebar, hero, rodapé
  components.css    cabeçalho de seção, modal, Instagram
  pages.css         estilos específicos de cada página
  responsive.css    tudo que é mobile (≤900px e ≤400px)
js/
  navigation.js     goPage() — troca de seção
  shop.js           abas da Loja + modal de interesse
  legacy-forms.js   TEMPORÁRIO (mailto) — substituído na Fase 2
assets/img/         logo e fotos de produtos
```

## Regras do design system
Branco `#fff` · Azul profundo `#1a3688` · Azul corporativo `#3571cb` · Azul suave `#b4d3f4`
AdmConsult: `#0d7377` / `#14a085`. Títulos Anton/Barlow Condensed. **border-radius sempre 0.**

## Placeholders pendentes (buscar no código: `LINK_`)
LINK_ESTAGIOS · LINK_CALOUROS · LINK_FINANCAS · LINK_CONCURSOS · LINK_PESQUISA · LINK_EMPREEND

## Roteiro
- [x] Fase 1 — base: separação em arquivos, imagens fora do base64, cantos quadrados, CSS faltante
- [ ] Fase 2 — formulários (Ouvidoria e Duck Tank) via FormSubmit
- [ ] Fase 3 — página "O Curso" (ensino médio)
- [ ] Fase 4 — conteúdo real (links, Loja, talentos, notícias, datas)
- [ ] Fase 5 — rotas por hash, SEO, acessibilidade
- [ ] Fase 6 — publicação
