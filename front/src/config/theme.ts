// Système de couleurs uniforme pour l'application CERS
export const COLORS = {
  // Couleurs principales
  primary: {
    50: '#F0F4F8',
    100: '#D9E2EC',
    200: '#BCCCDC',
    300: '#9FB3C8',
    400: '#829AB1',
    500: '#627D98', // Couleur principale
    600: '#486581',
    700: '#334E68',
    800: '#243B53',
    900: '#102A43',
  },
  
  // Couleurs CERS (basées sur les armoiries du Burkina Faso)
  cers: {
    primary: '#00213B',    // Bleu foncé principal
    secondary: '#2C224E',  // Violet foncé
    accent: '#1B384F',     // Bleu moyen
    light: '#EAECEF',      // Gris clair
    white: '#FFFFFF',
  },
  
  // États
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutres
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

// Classes CSS communes
export const COMMON_STYLES = {
  // Boutons
  button: {
    primary: `bg-[${COLORS.cers.primary}] hover:bg-[${COLORS.cers.accent}] text-white`,
    secondary: `bg-[${COLORS.cers.secondary}] hover:bg-[${COLORS.cers.primary}] text-white`,
    outline: `border-2 border-[${COLORS.cers.primary}] text-[${COLORS.cers.primary}] hover:bg-[${COLORS.cers.primary}] hover:text-white`,
  },
  
  // Cartes
  card: `bg-white rounded-lg shadow-sm border border-[${COLORS.gray[200]}]`,
  
  // Textes
  text: {
    primary: `text-[${COLORS.cers.primary}]`,
    secondary: `text-[${COLORS.cers.accent}]`,
    muted: `text-[${COLORS.gray[600]}]`,
  },
  
  // Layouts
  layout: {
    background: `bg-[${COLORS.cers.light}]`,
    sidebar: `bg-[${COLORS.cers.primary}]`,
    header: `bg-white border-b border-[${COLORS.gray[200]}]`,
  }
};
