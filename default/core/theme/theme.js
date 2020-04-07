import { darken, lighten, rgba } from 'polished';
import { createMuiTheme } from '@material-ui/core/styles';

const defaultPalette = {
  primary: '#156DF1',
  secondary: '#E5F0FF',
  tertiary: '#191D3A',
  body: '#F6F9F9',
  card: '#FFFFFF',
  gray: '#94A4b7'
};

const statuses = {
  error: '#F24646',
  warning: '#FF9152',
  success: '#00B54E'
};

const { primary, secondary, tertiary, body, card, gray } = defaultPalette;
const { error, warning, success } = statuses;

export const theme = {
  palette: {
    gray: {
      light: lighten(0.32, gray),
      main: gray,
      dark: darken(0.135, gray)
    },

    // Основные цвета элементов
    primary: {
      light: lighten(0.15, primary),
      main: primary,
      dark: darken(0.12, primary),
      contrastText: '#fff'
    },
    secondary: {
      light: darken(0.06, secondary),
      main: secondary,
      dark: darken(0.12, secondary),
      contrastText: primary
    },
    default: {
      light: secondary,
      main: card,
      dark: body,
      contrastText: gray
    },
    disabled: {
      main: rgba(secondary, 0.2),
      contrastText: rgba(secondary, 0.15)
    },
    // Статусы
    error: {
      light: lighten(0.1, error),
      main: error,
      dark: darken(0.1, error),
      contrastText: '#fff'
    },
    warning: {
      light: lighten(0.3, warning),
      main: warning,
      dark: darken(0.1, warning),
      contrastText: '#fff'
    },
    success: {
      light: lighten(0.1, success),
      main: success,
      dark: darken(0.1, success),
      contrastText: '#fff'
    },
    // Текст
    text: {
      primary: tertiary,
      secondary: gray
    },
    // разделитель
    divider: lighten(0.3, gray),
    // Ссылки
    link: {
      main: darken(0.2, primary),
      hover: darken(0.3, primary),
      active: primary
    },
    // Фон
    background: {
      primary: body,
      secondary: card
    }
  },
  options: {
    card: {
      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)'
    },
    gradient: 'linear-gradient(48.81deg, #0095FF 9.55%, #0057C2 100%)'
  }
};

export default createMuiTheme(theme);
