tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        titulo: ['"Exo 2"', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        verde: { DEFAULT: '#3FA110', tinta: '#2A6E0B', claro: '#6ECB3B', btn: '#2E7A0C' },
        grafite: '#1F2430',
        superficie: '#F5F7F4',
        divisor: '#E2E6E0',
        contorno: '#87908A',
        secundario: '#5B6472',
        noite: { DEFAULT: '#12161C', rodape: '#0E1116', sup: '#171C24', div: '#2A313B', cont: '#69737F', tinta: '#E8EBE6', sec: '#9BA3AE', lead: '#B7BEC7' },
        ok: { fundo: '#E7F3EC', tinta: '#145F3B', ponto: '#16794A' },
        atencao: { fundo: '#FDF3D7', tinta: '#7A5400', ponto: '#F5B301' },
        erro: { fundo: '#FBEAE8', tinta: '#8E2820', ponto: '#B4332A' },
        info: { fundo: '#E8EEF5', tinta: '#164E86', ponto: '#1B62A8' },
        neutro: { fundo: '#F0F1F3', tinta: '#474F5B', ponto: '#5B6472' }
      },
      maxWidth: { site: '1200px' }
    }
  }
};
