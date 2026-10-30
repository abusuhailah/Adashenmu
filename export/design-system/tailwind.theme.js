/** Adashenmu Tailwind theme extension */
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: '#0B3D2E',
        textMuted: '#4F5F57',
        faint: '#8A968F',
        primary: '#0F8A5F',
        primaryPressed: '#0B6E4B',
        primarySoft: '#E3F4EC',
        onDark: '#2FBF85',
        forestDeep: '#072A20',
        accent: '#F2B33D',
        accentDeep: '#C98A12',
        accentSoft: '#FFF4DB',
        clay: '#C8643B',
        claySoft: '#F6E4DA',
        surface: '#FFFFFF',
        background: '#FAF7F0',
        line: '#E3DDCF',
        lineSoft: '#EFEAE0',
        blue: '#1D4ED8',
        blueSoft: '#E6EEFF',
        red: '#B42318',
        redSoft: '#FDECEA',
        greySoft: '#EEF0EE',
      },
      fontFamily: { heading: ['Manrope','sans-serif'], body: ['Inter','sans-serif'] },
      borderRadius: { input: '10px', chip: '8px', tile: '12px', button: '14px', card: '16px', sheet: '20px' },
      boxShadow: { card: '0 2px 8px rgba(10,61,46,0.06)', sheet: '0 -6px 24px rgba(10,61,46,0.14)' },
    },
  },
};
