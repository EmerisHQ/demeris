module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: 'media', // or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      text: 'var(--text)',
      muted: 'var(--muted)',
      inactive: 'var(--inactive)',
      fg: 'var(--fg)',
      border: 'var(--border)',
      link: {
        DEFAULT: 'var(--link)',
        hover: 'var(--link-hover)',
      },
      positive: {
        DEFAULT: 'var(--positive)',
        text: 'var(--positive-text)',
      },
      negative: {
        DEFAULT: 'var(--negative)',
        text: 'var(--negative-text)',
      },
      warning: 'var(--warning)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      tertiary: 'var(--tertiary)',
      quaternary: 'var(--quaternary)',
      quinary: 'var(--quinary)',
    },
    backgroundImage: {
      grain: 'url(~@/assets/images/texture-grain.png)',
    },
    boxShadow: {
      button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '16px 32px 128px -8px rgba(0, 0, 0, 0.05)',
      card: '16px 32px 128px -8px rgba(0, 0, 0, 0.05)',
      panel: '24px 48px 104px -8px rgba(0, 0, 0, 0.09)',
      dropdown: '24px 64px 128px -8px rgba(0, 0, 0, 0.14)',
      'sheet-b': '0px -8px 48px -8px rgba(0, 0, 0, 0.07)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
  },
  corePlugins: {
    gradientColorStops: false,
  },
  plugins: [],
};
