---
title: "Core Web Vitals na Prática: 5 Fixes Que Aumentam a Conversão"
description: "Cinco intervenções concretas em Core Web Vitals que reduzem a taxa de rejeição e aumentam a conversão do seu site. Com exemplos reais e impacto medido em conversão."
pubDate: 2026-05-29
author: "Sueste Creative"
image: "https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1600"
imageAlt: "Ecrã de monitor a mostrar relatório do Google Lighthouse com métricas de performance"
tags: ["core web vitals", "performance", "conversão", "seo"]
readingTime: 7
lang: "pt"
translationSlug: "core-web-vitals-in-practice-5-fixes-conversion"
---

Core Web Vitals não são uma métrica académica. São a diferença entre um visitante que espera 3 segundos e sai, e um visitante que vê o conteúdo em 1 segundo e converte. No nosso trabalho com clientes em Portugal, medimos regularmente ganhos de 15-40% em taxa de conversão apenas com intervenções de performance.

Para contexto teórico sobre as métricas em si, leia primeiro o artigo [Core Web Vitals: o que são e porque importam](/blog/core-web-vitals-o-que-sao-e-porque-importam). Este guia é focado em ação.

Abaixo, cinco fixes técnicos com impacto desproporcional — implementáveis em 1 a 5 horas cada.

## Fix 1: Converter Imagens Para WebP ou AVIF

### O Problema

Imagens JPEG/PNG representam 60-70% do peso de um site típico. Num site com hero image + galeria + thumbnails de blog, é fácil ultrapassar 5 MB por página. Em 4G móvel, isso é 8+ segundos de carregamento.

### O Fix

Converter todas as imagens para **WebP** (suportado em 97% dos browsers em 2026) ou **AVIF** (ainda melhor compressão, 90% de suporte).

Ferramentas:

- [Squoosh](https://squoosh.app/) — converter individual, grátis, no browser
- [Sharp](https://sharp.pixelplumbing.com/) — Node.js, automatizável em build
- [Cloudinary](https://cloudinary.com/) — CDN com conversão automática on-demand
- Next.js `next/image` ou Astro `<Image>` — conversão integrada no build

### Impacto Típico

- Peso médio de imagem: 450 KB → 80 KB (80% de redução)
- LCP: 4.2s → 1.8s em sites testados internamente
- Taxa de rejeição móvel: queda de 12-25%

### Fallback

Use `<picture>` com fallback JPEG para browsers antigos:

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Descrição da imagem" loading="lazy">
</picture>
```

## Fix 2: Preload da Hero Image + Defer de Tudo o Resto

### O Problema

Uma hero image grande demora a descarregar. O browser só descobre que ela existe depois de ler o CSS, calcular o layout, e chegar à tag `<img>`. Entretanto, LCP sobe.

### O Fix

Preload da imagem crítica diretamente no `<head>`:

```html
<link rel="preload" as="image" href="/hero.avif" type="image/avif" fetchpriority="high">
```

E garantir que tudo abaixo da fold tem `loading="lazy"` e `decoding="async"`:

```html
<img src="galeria-1.webp" loading="lazy" decoding="async" alt="...">
```

### Impacto Típico

- LCP reduzido em 300-800ms
- Utilizadores em 3G/4G veem conteúdo quase instantaneamente

### Nota

Preload só de **uma** imagem — a principal acima da fold. Preload de mais está a competir pela banda com outros recursos críticos e pode piorar LCP.

## Fix 3: Reservar Espaço Para Evitar Layout Shifts (CLS)

### O Problema

A página carrega texto. Depois chega uma imagem que faz o texto saltar para baixo. O utilizador clica num botão que, no exato momento do clique, é empurrado e afinal clica noutra coisa. CLS alto. Utilizador frustrado.

### O Fix

**Toda** a imagem, vídeo, iframe ou elemento com dimensão dinâmica deve ter espaço reservado:

1. **Imagens** — sempre com `width` e `height` (em HTML attributes, não CSS):

```html
<img src="foto.webp" width="800" height="600" alt="...">
```

O browser calcula o aspect ratio e reserva o espaço antes da imagem chegar.

2. **Embeds** (YouTube, Twitter) — wrap em container com aspect-ratio CSS:

```css
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

3. **Anúncios/banners** — container com altura mínima reservada:

```css
.ad-slot {
  min-height: 250px;
}
```

4. **Web fonts** — usar `font-display: swap` e `size-adjust` para minimizar shift entre fallback e web font.

### Impacto Típico

- CLS: 0.25 → 0.02 em sites testados
- Melhor experiência percebida de "qualidade" — intangível mas real

## Fix 4: Eliminar JavaScript Bloqueante

### O Problema

Scripts de terceiros (Google Tag Manager, Facebook Pixel, hotjar, chat widgets, cookies banners) carregados síncronamente no `<head>` bloqueiam o render. A página fica em branco até cada script descarregar e executar. INP e LCP sofrem.

### O Fix

Carregar scripts em modo **async** ou **defer**:

```html
<!-- Executa logo que descarrega, sem bloquear parsing -->
<script async src="..."></script>

<!-- Aguarda parsing da página, executa no final -->
<script defer src="..."></script>
```

Para scripts de terceiros que não são críticos para render inicial:

- **Cookie consent** — carregar após evento `load`
- **Chat widgets** — atrasar com `setTimeout` ou carregar só em interação
- **Analytics** — `async` + queue de eventos
- **Facebook Pixel, TikTok Pixel** — usar [Partytown](https://partytown.builder.io/) para executar em web worker

### Framework Astro

O Astro tem native `client:idle`, `client:visible`, `client:media` — carrega JavaScript apenas quando necessário.

### Impacto Típico

- INP: 450ms → 80ms em sites com vários trackers
- First Input Delay reduzido drasticamente no mobile

## Fix 5: Cache Agressivo + CDN

### O Problema

Mesmo com todos os outros fixes, se a primeira request tem de ir ao servidor em Lisboa e o utilizador está em Munique, adicionam-se 150ms só em latência de rede.

### O Fix

1. **CDN global** — Cloudflare (grátis), Fastly, AWS CloudFront. Distribui o site em POPs em toda a Europa e serve do mais próximo do utilizador.

2. **Cache headers agressivos** em assets imutáveis:

```
Cache-Control: public, max-age=31536000, immutable
```

Para CSS/JS versionados por hash (`style.a3f9c2.css`).

3. **Cache headers moderados** em HTML:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

4. **Service Worker** para sites que beneficiam de funcionalidade offline ou revisita frequente.

### Impacto Típico

- TTFB: 800ms → 120ms em pontos geograficamente distantes
- Revisitas: quase instantâneas (conteúdo em cache local)

## Como Medir o Impacto

Antes e depois de cada fix, meça:

1. **PageSpeed Insights** — [pagespeed.web.dev](https://pagespeed.web.dev/) — dados sintéticos + campo
2. **Search Console → Core Web Vitals** — dados reais dos últimos 28 dias
3. **Google Analytics 4 — Site Speed** — tempos reais por dispositivo
4. **A/B test** se possível — metade do tráfego vê a versão otimizada, metade a antiga. Comparação limpa de conversão.

Em projetos nossos, medimos:

- Aumento médio de **17% em conversão** após os 5 fixes aplicados em sequência
- Redução de **30-45% em bounce rate** mobile
- Ganho de **8-15 posições** em ranking orgânico para keywords competitivas ao fim de 6-8 semanas

## Ordem de Implementação Recomendada

Se vai aplicar tudo num projeto, esta é a ordem que minimiza risco e maximiza ganhos rápidos:

1. **Imagens WebP/AVIF** (Fix 1) — maior impacto em LCP, risco muito baixo
2. **Reservar espaço para evitar CLS** (Fix 3) — quase sem risco de regressão
3. **Preload da hero + lazy no resto** (Fix 2) — precisa de teste cuidadoso
4. **Defer/async dos scripts** (Fix 4) — cuidado com race conditions em analytics
5. **CDN + cache headers** (Fix 5) — requer acesso a infraestrutura

---

## Conclusão

Core Web Vitals são acionáveis. Não precisa de refazer o site do zero — cinco intervenções cirúrgicas resolvem a maior parte dos problemas reais.

Na Sueste Creative fazemos este tipo de otimização em projetos de clientes existentes e em todos os novos sites que entregamos. Se quer uma [auditoria técnica](/servicos#web) ao seu site atual com relatório dos ganhos potenciais, [fale connosco](/contacto). A primeira análise é gratuita.

*Para contexto sobre outras áreas técnicas, veja o nosso [checklist SEO técnico completo](/blog/checklist-seo-tecnico-sites-portugal-2026).*
