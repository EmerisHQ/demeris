module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: 'media', // or 'class'
  theme: {
    fontFamily: {
      sans: 'Inter var, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    fontSize: {
      '-2': [
        '.6875rem',
        {
          letterSpacing: '0.01em',
          lineHeight: '1.2727',
        },
      ],
      '-1': [
        '.8125rem',
        {
          letterSpacing: '0.01em',
          lineHeight: '1.3077',
        },
      ],
      0: [
        '1rem',
        {
          // letterSpacing: '0em',
          lineHeight: '1.3125',
        },
      ],
      1: [
        '1.3125rem',
        {
          letterSpacing: '-0.015em',
          lineHeight: '1.2857',
        },
      ],
      2: [
        '1.75rem',
        {
          letterSpacing: '-0.02em',
          lineHeight: '1.2857',
        },
      ],
      3: [
        '2.375rem',
        {
          letterSpacing: '-0.027em',
          lineHeight: '1.2631',
        },
      ],
      4: [
        '3.1875rem',
        {
          letterSpacing: '-0.04em',
          lineHeight: '1.2549',
        },
      ],
      5: [
        '4.1875rem',
        {
          letterSpacing: '-0.055em',
          lineHeight: '1.194',
        },
      ],
    },
    fontWeight: {
      normal: 300,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      title: 1.25,
      copy: 1.625,
    },
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
      button: '3px 9px 32px -4px rgba(0, 0, 0, 0.07)',
      DEFAULT: '16px 32px 128px -8px rgba(0, 0, 0, 0.05)',
      card: '16px 32px 128px -8px rgba(0, 0, 0, 0.05)',
      panel: '24px 48px 104px -8px rgba(0, 0, 0, 0.09)',
      dropdown: '24px 64px 128px -8px rgba(0, 0, 0, 0.14)',
      'sheet-b': '0px -8px 48px -8px rgba(0, 0, 0, 0.07)',
      inner: 'inset 0 3px 12px -2px rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
  },
  corePlugins: {
    gradientColorStops: false,
  },
  plugins: [],
};
