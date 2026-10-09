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
      ficha.classList.remove('troca');
      void ficha.offsetWidth;
      ficha.classList.add('troca');
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

  var iniciarMovimento = function () {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('mov');

    var hero = document.querySelector('body > section, main > section');
    var h1 = hero && hero.querySelector('h1');
    var heroTexto = h1 && h1.parentElement;
    var heroFigura = hero && hero.querySelector('figure');

    var marcar = function (el, ordem) {
      el.classList.add('revela');
      el.style.setProperty('--atraso', Math.min(ordem, 6) * 80 + 'ms');
    };

    if (heroTexto) {
      var entrada = Array.prototype.slice.call(heroTexto.children);
      if (heroFigura) entrada.push(heroFigura);
      entrada.forEach(marcar);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          entrada.forEach(function (el) { el.classList.add('visivel'); });
        });
      });
    }

    var alvos = [];
    document.querySelectorAll('section').forEach(function (secao) {
      if (secao === hero || secao.hidden) return;
      var h2 = secao.querySelector('h2');
      var cabecalho = h2 && h2.parentElement;
      if (cabecalho) alvos = alvos.concat(Array.prototype.slice.call(cabecalho.children));
      secao.querySelectorAll('[class*="auto-fit"]').forEach(function (grade) {
        Array.prototype.forEach.call(grade.children, function (filho) {
          if (filho !== cabecalho && !filho.contains(cabecalho)) alvos.push(filho);
        });
      });
      secao.querySelectorAll('figure').forEach(function (figura) { alvos.push(figura); });
    });

    alvos = alvos.filter(function (el, i) {
      return alvos.indexOf(el) === i && !alvos.some(function (outro) { return outro !== el && el.contains(outro); });
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    alvos.forEach(function (el) {
      var irmaos = alvos.filter(function (outro) { return outro.parentElement === el.parentElement; });
      marcar(el, irmaos.indexOf(el));
      observador.observe(el);
    });

    var camadas = document.querySelectorAll('#como figure .flex-1 > div');
    var secaoCamadas = camadas.length ? camadas[0].closest('section') : null;
    var pedido = false;

    var mover = function () {
      pedido = false;
      var y = window.scrollY;
      if (hero && y < hero.offsetHeight) {
        hero.style.backgroundPosition = '0 ' + (y * 0.4).toFixed(1) + 'px';
        if (heroTexto) heroTexto.style.translate = '0 ' + (y * 0.16).toFixed(1) + 'px';
        if (heroFigura) heroFigura.style.translate = '0 ' + (y * 0.06).toFixed(1) + 'px';
      }
      if (secaoCamadas) {
        var caixa = secaoCamadas.getBoundingClientRect();
        if (caixa.bottom > 0 && caixa.top < window.innerHeight) {
          var p = (caixa.top + caixa.height / 2 - window.innerHeight / 2) / window.innerHeight;
          camadas.forEach(function (camada, i) {
            camada.style.translate = '0 ' + (p * (camadas.length - 1 - i) * 18).toFixed(1) + 'px';
          });
        }
      }
    };

    window.addEventListener('scroll', function () {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(mover);
    }, { passive: true });
    mover();
  };

  iniciarNav();
  iniciarFicha();
  iniciarMovimento();

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
