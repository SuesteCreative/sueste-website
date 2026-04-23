---
title: "Checklist SEO Técnico para Sites em Portugal (2026)"
description: "O checklist definitivo de SEO técnico para websites portugueses em 2026. Velocidade, indexação, dados estruturados, hreflang e mais — tudo o que o Google avalia antes de posicionar o seu site."
pubDate: 2026-05-08
author: "Sueste Creative"
image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1600"
imageAlt: "Ecrã de laptop com código HTML e inspetor de elementos do browser aberto"
tags: ["seo", "seo técnico", "portugal", "checklist"]
readingTime: 9
lang: "pt"
translationSlug: "technical-seo-checklist-for-portuguese-websites-2026"
---

SEO técnico é o alicerce. Sem ele, nenhum conteúdo por melhor que seja vai ranquear de forma consistente. Em 2026, com as atualizações recentes do Google e a pressão da pesquisa generativa, os fundamentos voltaram a ser decisivos.

Este checklist é o que usamos em todos os projetos que entregamos. Se o seu site falhar em metade dos pontos, está a perder tráfego orgânico mensal, certamente.

## 1. Indexação e Crawlability

Antes de falar de ranking, o Google tem de conseguir ler o site.

- **`robots.txt`** presente, acessível em `/robots.txt` e sem bloqueios acidentais a pastas importantes (`/_astro/`, `/assets/`, etc.)
- **Sitemap XML** submetido no Google Search Console e referenciado no `robots.txt`
- **Canonical tags** em todas as páginas, apontando para a versão preferida (com ou sem `www`, com ou sem trailing slash — escolha um padrão e mantenha)
- **Sem URLs duplicados** causados por parâmetros de query, versões PT/EN ou paginação sem rel="next"/"prev"
- **Meta `noindex`** apenas onde faz sentido (áreas privadas, staging, páginas de obrigado)
- **404s** a devolverem status HTTP 404 real, não 200 com página "não encontrado" (soft 404)

## 2. Performance — Core Web Vitals

O Google usa Core Web Vitals como fator de ranking desde 2021. Em 2026 os thresholds continuam:

- **LCP (Largest Contentful Paint):** < 2,5 segundos
- **INP (Interaction to Next Paint):** < 200 ms
- **CLS (Cumulative Layout Shift):** < 0,1

Ferramentas para auditar: [PageSpeed Insights](https://pagespeed.web.dev/), Chrome DevTools Lighthouse, e o relatório Core Web Vitals do Search Console (dados de campo reais).

Os fixes mais comuns:

- Imagens em formato moderno (WebP ou AVIF) com `loading="lazy"` em tudo abaixo da fold
- Fontes com `font-display: swap` e preload das críticas
- Sem JavaScript bloqueante acima da fold
- CSS crítico inline, restante em chunk separado
- Eliminação de layout shifts: dimensões fixas em imagens/embeds, reserva de espaço para banners

## 3. Estrutura e Semântica HTML

O Google lê HTML. Se o HTML estiver confuso, o entendimento também fica.

- **Uma única `<h1>`** por página, com a palavra-chave principal
- **Hierarquia lógica** H2 → H3 → H4 sem saltar níveis
- **Tags semânticas**: `<article>`, `<nav>`, `<main>`, `<aside>`, `<footer>` em vez de `<div>` para tudo
- **Alt text** em todas as imagens (descritivo, não keyword stuffing)
- **Links internos** com anchor text descritivo (evitar "clica aqui")
- **`<button>` vs `<a>`** usados corretamente (button = ação, link = navegação)

## 4. Dados Estruturados (Schema.org)

Schema em JSON-LD no `<head>` ou imediatamente antes do `</body>`. Dá ao Google contexto explícito sobre o conteúdo e habilita rich results.

Para um negócio em Portugal, os tipos mais úteis:

- **`LocalBusiness`** (ou variantes como `Restaurant`, `MedicalBusiness`, `Store`) — obrigatório para SEO local
- **`Organization`** no rodapé do site inteiro
- **`BreadcrumbList`** em cada página interior
- **`Article`** em todos os posts de blog
- **`FAQPage`** onde houver secções de perguntas frequentes
- **`Product`** + `AggregateRating` para e-commerce

Validador oficial: [Schema Markup Validator](https://validator.schema.org/).

## 5. Internacionalização (hreflang)

Se o site tem versões PT e EN, o hreflang diz ao Google qual servir a cada utilizador.

```html
<link rel="alternate" hreflang="pt-PT" href="https://sueste-creative.pt/servicos" />
<link rel="alternate" hreflang="en" href="https://sueste-creative.pt/en/services" />
<link rel="alternate" hreflang="x-default" href="https://sueste-creative.pt/servicos" />
```

Regras que se esquecem frequentemente:

- Cada URL tem de referenciar **todas as versões**, incluindo ele próprio
- `x-default` aponta para a versão a servir quando nenhum idioma encaixa
- Os URLs têm de ser **absolutos**, não relativos
- Se a versão PT apontar para EN, a versão EN **tem** de apontar de volta

## 6. Mobile-First

Desde 2019 o Google indexa a versão mobile do site primeiro. Em 2026 isto não é negociável.

- **Viewport** meta tag correto: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Touch targets** ≥ 48×48 pixels com espaçamento suficiente
- **Texto legível** sem necessidade de zoom (mínimo 16px em body)
- **Sem scroll horizontal** em qualquer breakpoint
- **Imagens responsivas** com `srcset` para servir o tamanho certo a cada device

Teste rápido: abra o site num telemóvel real, não simulado. Se houver qualquer fricção, há trabalho a fazer.

## 7. HTTPS e Segurança

- **HTTPS obrigatório**, com redirect automático de HTTP → HTTPS
- **HSTS** header ativado (`Strict-Transport-Security`)
- **Certificado SSL** válido e auto-renovável (Cloudflare, Let's Encrypt)
- **Mixed content zero**: nada no site carregado via HTTP quando a página é HTTPS
- **Cookies** com flags `Secure` e `HttpOnly` onde apropriado

## 8. URLs Limpos e Estáveis

- **URLs curtos, legíveis e em minúsculas** (`/servicos/web-design` não `/Servicos/WEB_DESIGN_123`)
- **Hífens**, não underscores, como separadores
- **Sem parâmetros desnecessários** na versão canónica (UTM é OK, mas a URL canónica não deve tê-los)
- **Estrutura hierárquica consistente**: `/blog/<slug>` e não `/post?id=123`
- **Redirects 301**, nunca 302, para URLs antigos movidos

## 9. Logs e Monitorização

Um site sem monitorização é um site onde os problemas se descobrem quando o tráfego já caiu.

- **Google Search Console** configurado e a receber dados
- **Google Analytics 4** (ou alternativa respeitadora de privacidade como Plausible)
- **Alertas** no Search Console para queda de cobertura ou aumento de erros 404
- **Auditoria Lighthouse mensal** (idealmente automatizada em CI/CD)
- **Monitorização de uptime** (UptimeRobot, Better Uptime)

## 10. Conteúdo Técnico Adjacente

- **Página "Sobre"** com informação real sobre a empresa, NIF, morada, equipa
- **Página de contactos** com formulário, email, telefone e morada estruturada em schema
- **Política de privacidade** e **termos de uso** — obrigatórios em Portugal (RGPD)
- **Política de cookies** com consentimento explícito antes de carregar trackers
- **Links externos de qualidade** com `rel="noopener noreferrer"` quando abrem em nova tab

---

## Como Auditar o Seu Site

Se quiser fazer a auditoria agora:

1. Corra o [PageSpeed Insights](https://pagespeed.web.dev/) para mobile e desktop
2. Valide o schema em [Schema Markup Validator](https://validator.schema.org/)
3. Verifique indexação no [Google Search Console](https://search.google.com/search-console)
4. Confirme que o hreflang está correto com a extensão [hreflang Tags Checker](https://chrome.google.com/webstore/)

Se preferir que fazemos isso por si, pedimos os acessos e entregamos um relatório completo em até 48 horas. [Peça um orçamento](/orcamento) ou [fale connosco](/contacto) para saber mais.

---

## Conclusão

SEO técnico não é magia. É uma lista de verificação que o Google publica, e que qualquer agência séria segue. A diferença entre um site que ranqueia e outro que não ranqueia está, na maior parte das vezes, nesta lista.

Se o seu site falha em metade destes pontos, a boa notícia é que as correções são quase sempre mais rápidas do que parece. O tráfego orgânico aparece algumas semanas depois.

*Quer uma auditoria técnica ao seu site? [Fale connosco](/contacto). Os primeiros 30 minutos são gratuitos.*
