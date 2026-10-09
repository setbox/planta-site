(function () {
  var formatar = function (valor, casas) {
    return valor.toFixed(casas).replace('.', ',');
  };

  var preencher = function (raiz, chave, texto) {
    raiz.querySelectorAll('[data-' + chave + ']').forEach(function (el) {
      el.textContent = texto[el.getAttribute('data-' + chave)];
    });
  };

  var limitar = function (valor) {
    return Math.min(Math.max(valor, 0), 1);
  };

  var iniciarNav = function () {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    var menu = document.getElementById('nav-menu');
    var botao = document.getElementById('nav-toggle');
    var hero = nav.hasAttribute('data-nav-sobre-hero') ? document.querySelector('[data-nav-hero]') : null;
    var faixa = 160;
    var claro = [232, 235, 230];
    var escuro = [31, 36, 48];

    var atualizar = function () {
      var p = 1;
      if (hero) {
        var fim = hero.offsetHeight - nav.offsetHeight;
        p = limitar((window.scrollY - (fim - faixa)) / faixa);
      }
      if (!menu.hidden) p = 1;
      var t = limitar((p - 0.4) / 0.2);
      var cor = claro.map(function (c, i) {
        return Math.round(c + (escuro[i] - c) * t);
      });
      nav.style.setProperty('--nav-p', p.toFixed(3));
      nav.style.setProperty('--nav-t', t.toFixed(3));
      nav.style.setProperty('--nav-fg', 'rgb(' + cor.join(', ') + ')');
    };

    var abrirMenu = function (aberto) {
      menu.hidden = !aberto;
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      atualizar();
    };

    botao.addEventListener('click', function () {
      abrirMenu(menu.hidden);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        abrirMenu(false);
      });
    });

    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && !menu.hidden) abrirMenu(false);
      atualizar();
    });
    atualizar();
  };

  var ramos = {
    geral: { doc: 'PEDIDO', num: '004812', status: 'Em expedição', qtdRot: 'Quantidade', qtd: '120 un', localRot: 'Destino', local: 'Cliente', etapas: ['Pedido', 'Separação', 'Expedição', 'Entrega'], atual: 2 },
    concreteira: { doc: 'ROMANEIO', num: '004812', status: 'Descarga na obra', qtdRot: 'Volume', qtd: '8,0 m³', localRot: 'Destino', local: 'Obra', etapas: ['Programado', 'Dosado', 'Saída', 'Descarga'], atual: 3 },
    serraria: { doc: 'ROMANEIO DE TORA', num: '000651', status: 'Em desdobro', qtdRot: 'Cubagem', qtd: '42,6 m³', localRot: 'Pátio', local: 'Pilha 14', etapas: ['Recebido', 'No pátio', 'Desdobro', 'Secagem'], atual: 2 }
  };

  var iniciarFicha = function () {
    var ficha = document.querySelector('[data-ficha-ramo]');
    if (!ficha) return;
    var abas = document.querySelectorAll('[data-aba-ramo]');
    var etapas = ficha.querySelectorAll('[data-etapa]');

    var mostrar = function (chave) {
      var ramo = ramos[chave];
      preencher(ficha, 'ficha', ramo);
      etapas.forEach(function (el, i) {
        el.textContent = ramo.etapas[i];
        el.classList.toggle('feita', i < ramo.atual);
        el.classList.toggle('atual', i === ramo.atual);
      });
      abas.forEach(function (aba) {
        aba.setAttribute('aria-pressed', aba.getAttribute('data-aba-ramo') === chave ? 'true' : 'false');
      });
    };

    abas.forEach(function (aba) {
      aba.addEventListener('click', function () {
        mostrar(aba.getAttribute('data-aba-ramo'));
      });
    });
  };

  var iniciarCalculo = function (id, calcular) {
    var controle = document.getElementById(id);
    if (!controle) return;
    var raiz = controle.closest('.calc');

    var atualizar = function () {
      preencher(raiz, 'calc', calcular(parseFloat(controle.value)));
    };

    controle.addEventListener('input', atualizar);
    atualizar();
  };

  iniciarNav();
  iniciarFicha();

  iniciarCalculo('umidade', function (umidade) {
    var aguaLivre = 820 * umidade / 100;
    return {
      umidade: formatar(umidade, 1),
      areia: formatar(820 + aguaLivre, 0),
      agua: formatar(185 - aguaLivre, 0),
      livre: formatar(aguaLivre, 0)
    };
  });

  iniciarCalculo('serrado', function (serrado) {
    return {
      serrado: formatar(serrado, 1),
      resto: formatar(45 - serrado, 1),
      rendimento: formatar(serrado / 45 * 100, 1),
      rendimentoErrado: formatar(serrado / 50 * 100, 1)
    };
  });
})();
