# planta-site

Site institucional do [Planta](https://useplanta.com.br). Estático, sem build,
sem dependência de runtime: três páginas, uma folha de estilo, um script e as
imagens. Publicado pelo GitHub Pages no domínio `useplanta.com.br` (`CNAME`).

## Rodar

Servir por HTTP, não abrir o arquivo direto:

```sh
python3 -m http.server 8080
# http://localhost:8080
```

## Estrutura

```
index.html              a home: base comum pronta mais a parte feita para o ramo
concreteiras.html       ciclo da carga, cálculo de umidade, agenda por caminhão
serrarias.html          caminho da madeira, cálculo de rendimento, pátio por pilha
sitemap.xml             as três páginas
robots.txt              libera tudo e aponta o sitemap
assets/css/site.css     fontes e estilos além do Tailwind
assets/js/              navegação e interações
assets/                 logos, favicons, fontes e a imagem de OG
```

Todos os caminhos são relativos. O site morou em
`setbox.com.br/produtos/planta-erp/` até 09/10/2026; lá ficaram páginas que
redirecionam para cá.

As decisões de conteúdo e de discurso ficam na base de conhecimento do Planta
(`comercial/site.md`), não neste repositório.
