# 📱 Social Media Automation Rulebook - Sueste Creative

Este documento define as regras visuais e técnicas para a geração automática de posts para as redes sociais da Sueste.

## 📐 Dimensões e Formatos
*   **Imagens (Posts/Instagram/LinkedIn):** 1080px x 1350px (Proporção 4:5).
*   **Vídeos Estáticos (Reels/Stories):** 1080px x 1920px (Proporção 9:16).
*   **Ficheiros de Vídeo:** Identificados pela coluna `Asset Type` contendo "Video" ou "Reel".

## 🎨 Branding e Design
*   **Logo Sueste:** Sempre no topo esquerdo, com 100px de altura. Deve ter sombra leve para destaque.
*   **Link da Marca:** `sueste-creative.pt` em **lowercase** e com gradiente neon (azul/ciano).
*   **Tipografia:** Primária "Inter" ou similar sem serifa, pesos 900 para ganchos e 400-600 para legendas.
*   **Cores:** Estética escura (Dark Mode) com acentos em azul brilhante e prata.

## 🖼️ Imagens de Fundo
*   **Estilo:** Fotografias realistas de alta qualidade (escritórios premium, estúdios, tecnologia).
*   **Pessoas:** **Proibido** ter pessoas nas fotos. Apenas espaços e objetos.
*   **Atmosphere:** Moody, dark, cinematic lighting. Deve haver contraste suficiente com o texto em prata/branco.
*   **Continuidade (Carrosséis):** Cada slide de um carrossel deve ter uma imagem de fundo **única**.

## 🎠 Carrosséis (Slides 1-10)
*   **Indicador Visual:** Uma linha-seta prateada (`silver-white gradient`) no topo direito.
*   **Lógica da Seta:** Aparece em todos os slides de um carrossel, **exceto no último slide**.
*   **Conteúdo:** Mapeado automaticamente das colunas `Slide X Hook` e `Slide X Subtitle`.

## 📂 Organização de Ficheiros
*   **Captions:** Unificadas num único ficheiro `captions.txt` (PT primeiro, depois EN).
*   **Estrutura de Saída:** Pasta `outbox/` organizada por `[ISO-YEAR]-W[WEEK]/[Post_Prefix]_[Day]_[Platform]/`.

## ⚙️ Workflow Técnico
*   O script `social-media/automation.js` é o motor principal.
*   O Excel `SocialMedia.xlsx` é a fonte única de verdade.
*   **Aprovação:** Apenas posts com `Approval = Sim` e `Status = Approved` são exportados.
