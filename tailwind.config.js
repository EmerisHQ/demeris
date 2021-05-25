module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    /**
     * Spacing scale proportional to base font size = `10px`, where one space is equal to its double.
     * Eg: `w-5` = `width: 10px`
     *     `w-12` = `width: 24px`
     * Read more: https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
     */
    spacing: {
      0: '0px',
      1: '0.2rem',
      2: '0.4rem',
      3: '0.6rem',
      4: '0.8rem',
      5: '1rem', // 10px
      6: '1.2rem',
      7: '1.4rem',
      8: '1.6rem',
      9: '1.8rem',
      10: '2rem', // 20px
      11: '2.2rem',
      12: '2.4rem',
      13: '2.6rem',
      14: '2.8rem',
      15: '3rem',
      16: '3.2rem',
      17: '3.4rem',
      18: '3.6rem',
      19: '3.8rem',
      20: '4rem',
      25: '5rem',
      30: '6rem',
      35: '7rem',
      40: '8rem',
      45: '9rem',
      50: '10rem', // 100px
      55: '11rem',
      60: '12rem',
      65: '13rem',
      70: '14rem',
      75: '15rem',
      80: '16rem',
      85: '17rem',
      90: '18rem',
      95: '19rem',
      100: '20rem',
      105: '21rem',
      110: '22rem',
      115: '23rem',
      120: '24rem',
      125: '25rem', // 250px
      // px/2 -> px/10
    },
    fontSize: {
      sm: ['1.2rem', { lineHeight: '1.6rem', letterSpacing: '0.0005rem' }],
      base: ['1.6rem', { lineHeight: '2.1rem', letterSpacing: '0' }],
      lg: ['2.1rem', { lineHeight: '2.7rem', letterSpacing: '-0.007rem' }],
      xl: ['2.8rem', { lineHeight: '3.6rem', letterSpacing: '-0.016rem' }],
      '2xl': ['6.7rem', { lineHeight: '7.9rem', letterSpacing: '-0.055rem' }],
    },
    lineHeight: {
      normal: '2.1rem',
      relaxed: '2.7rem',
      loose: '3.3rem',
    },
    boxShadow: {
      DEFAULT: '0px 8px 24px rgba(0, 0, 0, 0.08)',
      lg: '0px 16px 40px rgba(0, 0, 0, 0.06)',
      xl: '32px 48px 96px -8px rgba(0, 0, 0, 0.12)',
      none: 'none',
    },
    extend: {
      borderRadius: {
        xs: '0.6rem',
        sm: '0.8rem',
        DEFAULT: '1rem',
        md: '1.2rem',
        lg: '1.4rem',
        xl: '1.6rem',
        '2xl': '2rem',
        '3xl': '2.4rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
