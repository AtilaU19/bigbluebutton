import { createTheme } from '@mui/material/styles';
// --- LIGHT THEME ---
const COLOR_WHITE = '#FFF';
const COLOR_BLACK = '#000000';
const COLOR_GRAY = '#4E5A66';
const COLOR_GRAY_DARK = '#06172A';
const COLOR_GRAY_LIGHT = '#8B9AA8';
const COLOR_GRAY_LIGHTER = '#A7B3BD';
const COLOR_GRAY_LIGHTEST = '#D4D9DF';
const COLOR_PRIMARY = '#0F70D7';
const COLOR_SUCCESS = '#008081';
const COLOR_DANGER = '#DF2721';
const COLOR_WARNING = '#800080';
const COLOR_MUTED = 'var(--color-muted, #586571)';
const COLOR_MUTED_BACKGROUND = 'var(--color-muted-background, #F3F6F9)';
const COLOR_BLUE_AUX = 'var(--color-blue-aux, #E5EFFB)';
const COLOR_BLUE_LIGHTER = 'var(--color-blue-lighter, #92BCEA)';

const light = {
  colorWhite: COLOR_WHITE,
  colorOffWhite: '#e9f1f9', //
  colorBlack: COLOR_BLACK,
  colorGray: COLOR_GRAY,
  colorGrayDark: COLOR_GRAY_DARK,
  colorGrayLight: COLOR_GRAY_LIGHT,
  colorGrayLighter: COLOR_GRAY_LIGHTER,
  colorGrayLightest: COLOR_GRAY_LIGHTEST,
  colorGrayIcons: 'var(--color-gray-icons, #a8a097)', //
  colorNavigationIcons: 'var(--color-white, #FFF)',
  colorGrayUserListToolbar: 'var(--color-gray-user-list-toolbar, #F4F6FA)',
  colorBorder: 'var(--color-border, #0088ffff)',
  colorBlueLight: 'var(--color-blue-light, #54a1f3)',
  colorBlueLighter: COLOR_BLUE_LIGHTER,
  colorBlueLightest: 'var(--color-blue-lightest, #E4ECF2)',
  colorBlueAux: COLOR_BLUE_AUX,
  colorBlueLightestChannel: '228 236 242',
  colorBlueLighterChannel: '146 188 234',
  colorTransparent: 'var(--color-transparent, #ff000000)',
  colorUserModerator: 'var(--color-user-moderator, #7B209F)',
  colorUserYou: 'var(--color-user-you, #19237C)',
  colorUserViewer: 'var(--color-user-viewer, #2296C9)',
  colorPrimary: COLOR_PRIMARY,
  colorDanger: COLOR_DANGER,
  colorDangerDark: 'var(--color-danger-dark, #AE1010)',
  colorSuccess: COLOR_SUCCESS,
  colorWarning: COLOR_WARNING,
  colorOffline: `var(--color-offline, ${COLOR_GRAY_LIGHT})`,
  colorMuted: COLOR_MUTED,
  colorMutedBackground: COLOR_MUTED_BACKGROUND,
  colorBackgroundLayout: 'var(--color-background-light-mode, #102133)', //
  colorBackgroundComponent: 'var(--color-background-components-light-mode, #FFF)', //
  colorIcon: 'var(--color-icon-light-mode, #8B9AA8)', //
  colorSeparator: 'var(--color-border, #8B9AA8)', //
  colorOverlay: 'var(--color-overlay, rgba(6, 23, 42, 0.75))',
  userListBg: 'var(--user-list-bg, #e9f1f9)',
  userListText: `var(--user-list-text, ${COLOR_GRAY})`,
  unreadMessagesBg: `${COLOR_DANGER}`,
  colorGrayLabel: `${COLOR_GRAY}`,
  colorText: `${COLOR_GRAY}`,
  colorTextBlack: `${COLOR_BLACK}`,
  colorMessageBackground: '#e9f1f9',
  colorLink: `${COLOR_PRIMARY}`,
  listItemBgHover: `${COLOR_BLUE_AUX}`,
  colorTipBg: '#333333',
  itemFocusBorder: `${COLOR_BLUE_LIGHTER}`,
  btnDefaultColor: `${COLOR_GRAY}`,
  btnDefaultBg: `${COLOR_WHITE}`,
  btnDefaultBorder: `${COLOR_WHITE}`,
  btnDefaultGhostColor: `${COLOR_WHITE}`,
  btnDefaultGhostBg: 'var(--btn-default-bg, rgba(255, 255, 255, 0.1))',
  btnDefaultGhostBorder: 'var(--btn-default-border, rgba(255, 255, 255, 0.5))',
  btnDefaultGhostActiveBg: 'var(--btn-default-active-bg, rgba(255, 255, 255, 0.2))',
  btnPrimaryBorder: 'var(--btn-primary-border, rgba(15, 112, 215, 0.5))',
  btnPrimaryColor: `${COLOR_WHITE}`,
  btnPrimaryBg: `${COLOR_PRIMARY}`,
  btnPrimaryHoverBg: '#0C57A7',
  btnPrimaryActiveBg: 'var(--btn-primary-active-bg, #0A4B8F)',
  btnSuccessBorder: `var(--btn-success-border, ${COLOR_SUCCESS})`,
  btnSuccessColor: `var(--btn-success-color, ${COLOR_WHITE})`,
  btnSuccessBg: `var(--btn-success-bg, ${COLOR_SUCCESS})`,
  btnWarningBorder: `var(--btn-warning-border, ${COLOR_WARNING})`,
  btnWarningColor: `var(--btn-warning-color, ${COLOR_WHITE})`,
  btnWarningBg: `var(--btn-warning-bg, ${COLOR_WARNING})`,
  btnDangerBorder: `var(--btn-danger-border, ${COLOR_DANGER})`,
  btnDangerColor: `var(--btn-danger-color, ${COLOR_WHITE})`,
  btnDangerBg: `var(--btn-danger-bg, ${COLOR_DANGER})`,
  btnDangerBgHover: 'var(--btn-danger-bg-hover, #C61C1C)',
  btnDarkBorder: `var(--btn-dark-border, ${COLOR_DANGER})`,
  btnDarkColor: `var(--btn-dark-color, ${COLOR_WHITE})`,
  btnDarkBg: `var(--btn-dark-bg, ${COLOR_GRAY_DARK})`,
  btnOfflineBorder: `var(--btn-offline-border, ${COLOR_GRAY_LIGHT})`,
  btnOfflineColor: `var(--btn-offline-color, ${COLOR_WHITE})`,
  btnOfflineBg: `var(--btn-offline-bg, ${COLOR_GRAY_LIGHT})`,
  btnMutedBorder: `var(--btn-muted-border, ${COLOR_MUTED_BACKGROUND})`,
  btnMutedColor: `var(--btn-muted-color, ${COLOR_MUTED})`,
  btnMutedBg: `var(--btn-muted-bg, ${COLOR_MUTED_BACKGROUND})`,
  toolbarButtonColor: `var(--toolbar-button-color, ${COLOR_GRAY})`,
  toolbarButtonColorDisabled: `var(--toolbar-button-color, ${COLOR_GRAY_LIGHT})`,
  userThumbnailBorder: `var(--user-thumbnail-border, ${COLOR_GRAY_LIGHT})`,
  loaderBg: `var(--loader-bg, ${COLOR_GRAY_DARK})`,
  loaderBullet: `var(--loader-bullet, ${COLOR_WHITE})`,
  systemMessageBackgroundColor: 'var(--system-message-background-color, #F9FBFC)',
  systemMessageBorderColor: 'var(--system-message-border-color, #C5CDD4)',
  systemMessageFontColor: `var(--system-message-font-color, ${COLOR_GRAY_DARK})`,
  highlightedMessageBackgroundColor: 'var(--system-message-background-color, #fef9f1)',
  highlightedMessageBorderColor: 'var(--system-message-border-color, #B5D3F7)',
  emphasizedMessageBackgroundColor: 'var(--emphasized-message-background-color, #E9F1F9)',
  colorHeading: `var(--color-heading, ${COLOR_GRAY_DARK})`,
  palettePlaceholderText: 'var(--palette-placeholder-text, #787675)',
  pollAnnotationGray: 'var(--poll-annotation-gray, #333333)',
  appsGalleryOutlineColor: 'var(--apps-gallery-outline, #DCE4EC)',
  unpinnedAppIconColor: 'var(--apps-unpinned-icon-color, #A5B2C7)',
  appsPanelTextColor: 'var(--apps-panel-text-color, #393C48)',
  settingsModalTabSelected: 'var(--settings-modal-tab-selected, #eaf4fc)',
  toolbarButtonBorderColor: `var(--toolbar-button-border-color, ${COLOR_GRAY_LIGHTER})`,
  toolbarListColor: `var(--toolbar-list-color, ${COLOR_GRAY})`,
  toolbarButtonBg: `var(--toolbar-button-bg, ${COLOR_WHITE})`,
  toolbarListBg: 'var(--toolbar-list-bg, #DDD)',
  toolbarListBgFocus: 'var(--toolbar-list-bg-focus, #C6C6C6)',
  colorContentBackground: 'var(--color-content-background, #1B2A3A)',
  dropdownBg: `var(--dropdown-bg, ${COLOR_WHITE})`,
  pollStatsBorderColor: 'var(--poll-stats-border-color, #D4D9DF)',
  pollBlue: `var(--poll-blue, ${COLOR_PRIMARY})`,
  toastDefaultColor: `var(--toast-default-color, ${COLOR_WHITE})`,
  toastDefaultBg: `var(--toast-default-bg, ${COLOR_GRAY})`,
  toastInfoColor: `var(--toast-info-color, ${COLOR_WHITE})`,
  toastInfoBg: `var(--toast-info-bg, ${COLOR_PRIMARY})`,
  toastSuccessColor: `var(--toast-success-color, ${COLOR_WHITE})`,
  toastSuccessBg: `var(--toast-success-bg, ${COLOR_SUCCESS})`,
  toastErrorColor: `var(--toast-error-color, ${COLOR_WHITE})`,
  toastErrorBg: `var(--toast-error-bg, ${COLOR_DANGER})`,
  webcamBackgroundColor: 'var(--webcam-background-color, #001428FF)',
  webcamPlaceholderBorder: 'var(--webcam-placeholder-border, rgba(255, 255, 255, 0.5))',
  toastWarningColor: `var(--toast-warning-color, ${COLOR_WHITE})`,
  toastWarningBg: `var(--toast-warning-bg, ${COLOR_WARNING})`,
  defaultBorder: 'var(--default-border, #B0BDC9)',
  colorBackgroundDarkTheme: 'var(--color-background-dark-theme, #181A23)',
  colorOverlaysDarkTheme: 'var(--color-overlays-dark-theme, #2D2F38)',
  colorPrimaryDarkTheme: `var(--color-primary-dark-theme, ${COLOR_PRIMARY})`,
  SegmentedButtonRingOffsetShadow: 'var(--ring-offset-shadow, 0 0 #0000)',
  SegmentedButtonRingShadow: 'var(--ring-shadow, 0 0 #0000)',
  SegmentedButtonBoxShadowSm: 'var(--shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
  slate900: 'var(--slate-900, #111827)',
  darkCyanLime: 'var(--dark-cyan-lime, #16A34A)',
  colorHoverBgDark: 'var(--color-hover-bg-dark, #393C48)',
  colorToggleBgDisabledDarkTheme: 'var(--toggle-bg-disabled-dark-theme, #909CAF)',
  colorInfoBoxQuizText: 'var(--color-info-box-quiz-text, #15803D)',
  colorInfoBoxQuizBg: 'var(--color-info-box-quiz-bg, #F0FDF4)',
  colorInfoBoxQuizBorder: 'var(--color-info-box-quiz-border, #BBF7D0)',
  colorSelectedCorrectAnswerText: 'var(--color-selected-correct-answer-text, #A16207)',
  colorSelectedCorrectAnswerBg: 'var(--color-selected-correct-answer-bg, #FEF9C3)',
  colorSelectedCorrectAnswerTextActive: 'var(--color-selected-correct-answer-text-active, #15803D)',
  colorSelectedCorrectAnswerBgActive: 'var(--color-selected-correct-answer-bg-active, #DCFCE7)',
  colorGreen600: 'var(--color-green-600, #16A34A)',
  colorGreen100: 'var(--color-green-100, #DCFCE7)',
};

// --- DARK THEME ---
const D_COLOR_WHITE = '#222425';
const D_COLOR_BLACK = '#0E1114';
const D_COLOR_OFF_BLACK = '#161A1E';
const D_COLOR_GRAY = '#B8C0CA';
const D_COLOR_GRAY_DARK = '#E2E8EF';
const D_COLOR_GRAY_LIGHT = '#8E98A3';
const D_COLOR_GRAY_LIGHTER = '#6E7681';
const D_COLOR_GRAY_LIGHTEST = '#4B525A';

const D_COLOR_PRIMARY = '#0F70D7';
const D_COLOR_SUCCESS = '#008081';
const D_COLOR_DANGER = '#DF2721';
const D_COLOR_WARNING = '#E3C466';
const D_COLOR_MUTED = '#9BA5AF';
const D_COLOR_MUTED_BACKGROUND = '#1D2126';
const D_COLOR_BLUE_AUX = '#1B2A3A';
const D_COLOR_BLUE_LIGHTER = '#5E9DE3';

const dark = {
  colorWhite: D_COLOR_WHITE,
  colorOffWhite: '#2a2c2d', //
  colorBlack: D_COLOR_WHITE,
  colorGray: D_COLOR_GRAY,
  colorGrayDark: D_COLOR_GRAY_DARK,
  colorGrayLight: D_COLOR_GRAY_LIGHT,
  colorGrayLighter: D_COLOR_GRAY_LIGHTER,
  colorGrayLightest: D_COLOR_GRAY_LIGHTEST,
  colorGrayIcons: 'var(--color-white, #FFF)', //
  colorNavigationIcons: 'var(--color-white, #FFF)',
  colorGrayUserListToolbar: '##27292a', //
  colorBorder: '#f5f6f8ff',
  colorBlueLight: '#6CAFFF',
  colorBlueLighter: D_COLOR_BLUE_LIGHTER,
  colorBlueLightest: '#233142',
  colorBlueAux: D_COLOR_BLUE_AUX,
  colorBlueLightestChannel: '35 49 66',
  colorBlueLighterChannel: '94 157 227',
  colorTransparent: '#00000000',
  colorUserModerator: '#C07BFC',
  colorUserYou: '#7C8CFF',
  colorUserViewer: '#6CC5F3',
  colorPrimary: D_COLOR_PRIMARY,
  colorDanger: D_COLOR_DANGER,
  colorDangerDark: '#D34A47',
  colorSuccess: D_COLOR_SUCCESS,
  colorWarning: D_COLOR_WARNING,
  colorOffline: D_COLOR_GRAY_LIGHTEST,
  colorMuted: D_COLOR_MUTED,
  colorMutedBackground: D_COLOR_MUTED_BACKGROUND,
  colorBackgroundLayout: 'var(--color-background-dark-mode, #181a23)', //
  colorBackgroundComponent: 'var(--color-background-components-dark-mode, #2d2f38)', //
  colorIcon: 'var(--color-icon-dark-mode, #FFFFFF))', //
  colorSeparator: 'var(--color-border, #808080)', //
  colorOverlay: 'rgba(0,0,0,0.7)',
  userListBg: D_COLOR_OFF_BLACK,
  userListText: D_COLOR_GRAY,
  unreadMessagesBg: D_COLOR_DANGER,
  colorGrayLabel: D_COLOR_GRAY,
  colorText: '#FFFFFF', //
  colorTextBlack: `var(--color-text, ${COLOR_WHITE})`, //
  colorMessageBackground: 'var(--emphasized-message-background-color, #2a2c2d)', //
  colorLink: '#86C2FF',
  listItemBgHover: '#1E2C3C',
  colorTipBg: '#20252B',
  itemFocusBorder: '#5E9DE3',
  btnDefaultColor: `${D_COLOR_GRAY}`,
  btnDefaultBg: '#2A2F35',
  btnDefaultBorder: '#2A2F35',
  btnDefaultGhostColor: D_COLOR_WHITE,
  btnDefaultGhostBg: 'rgba(255, 255, 255, 0.1)',
  btnDefaultGhostBorder: 'rgba(255, 255, 255, 0.3)',
  btnDefaultGhostActiveBg: 'rgba(255, 255, 255, 0.2)',
  btnPrimaryBorder: D_COLOR_PRIMARY,
  btnPrimaryColor: '#0d0d0d',
  btnPrimaryBg: D_COLOR_PRIMARY,
  btnPrimaryHoverBg: '#589AE2',
  btnPrimaryActiveBg: '#4786C8',
  btnSuccessBorder: D_COLOR_SUCCESS,
  btnSuccessColor: D_COLOR_WHITE,
  btnSuccessBg: D_COLOR_SUCCESS,
  btnWarningBorder: D_COLOR_WARNING,
  btnWarningColor: D_COLOR_BLACK,
  btnWarningBg: D_COLOR_WARNING,
  btnDangerBorder: D_COLOR_DANGER,
  btnDangerColor: D_COLOR_WHITE,
  btnDangerBg: D_COLOR_DANGER,
  btnDangerBgHover: '#E35653',
  btnDarkBorder: '#3C4045',
  btnDarkColor: D_COLOR_WHITE,
  btnDarkBg: '#1D2024',
  btnOfflineBorder: D_COLOR_GRAY_LIGHTEST,
  btnOfflineColor: D_COLOR_WHITE,
  btnOfflineBg: D_COLOR_GRAY_LIGHTEST,
  btnMutedBorder: D_COLOR_MUTED_BACKGROUND,
  btnMutedColor: D_COLOR_MUTED,
  btnMutedBg: D_COLOR_MUTED_BACKGROUND,
  toolbarButtonColor: '#2a2c2d',
  toolbarButtonColorDisabled: D_COLOR_GRAY_LIGHT,
  userThumbnailBorder: D_COLOR_GRAY_LIGHT,
  loaderBg: '#181A1E',
  loaderBullet: D_COLOR_WHITE,
  systemMessageBackgroundColor: '#1E2228',
  systemMessageBorderColor: '#31363D',
  systemMessageFontColor: '#2a2c2d',
  highlightedMessageBackgroundColor: '#293038',
  highlightedMessageBorderColor: '#40474E',
  emphasizedMessageBackgroundColor: '#1C2D3E',
  colorHeading: D_COLOR_WHITE,
  palettePlaceholderText: '#8E98A3',
  pollAnnotationGray: '#B8C0CA',
  appsGalleryOutlineColor: '#334252',
  unpinnedAppIconColor: '#8A929D',
  appsPanelTextColor: '#2a2c2d',
  settingsModalTabSelected: '#1C2C3E',
  toolbarButtonBorderColor: D_COLOR_GRAY_LIGHTER,
  toolbarListColor: D_COLOR_GRAY,
  toolbarButtonBg: D_COLOR_OFF_BLACK,
  toolbarListBg: '#2A2E34',
  toolbarListBgFocus: '#3A3F45',
  colorContentBackground: '#101316',
  dropdownBg: D_COLOR_OFF_BLACK,
  pollStatsBorderColor: '#2E3339',
  pollBlue: D_COLOR_PRIMARY,
  toastDefaultColor: D_COLOR_WHITE,
  toastDefaultBg: '#2A2F35',
  toastInfoColor: D_COLOR_WHITE,
  toastInfoBg: '#569DE6',
  toastSuccessColor: D_COLOR_WHITE,
  toastSuccessBg: '#4BC6A7',
  toastErrorColor: D_COLOR_WHITE,
  toastErrorBg: '#E35653',
  webcamBackgroundColor: '#0E1115',
  webcamPlaceholderBorder: 'rgba(255, 255, 255, 0.3)',
  toastWarningColor: D_COLOR_BLACK,
  toastWarningBg: D_COLOR_WARNING,
  defaultBorder: '#2C3137',
  colorBackgroundDarkTheme: '#121417',
  colorOverlaysDarkTheme: '#1B1F24',
  colorTextDarkTheme: D_COLOR_WHITE,
  colorPrimaryDarkTheme: D_COLOR_PRIMARY,
  SegmentedButtonRingOffsetShadow: '0 0 #0000',
  SegmentedButtonRingShadow: '0 0 #0000',
  SegmentedButtonBoxShadowSm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  slate900: '#E2E8EF',
  darkCyanLime: '#3FD985',
  colorHoverBgDark: '#2C3137',
  colorToggleBgDisabledDarkTheme: '#6E7681',
  colorInfoBoxQuizText: '#6EE7B7',
  colorInfoBoxQuizBg: '#0F2B1F',
  colorInfoBoxQuizBorder: '#0E3E30',
  colorSelectedCorrectAnswerText: '#F9E68C',
  colorSelectedCorrectAnswerBg: '#3E3A12',
  colorSelectedCorrectAnswerTextActive: '#BBF18E',
  colorSelectedCorrectAnswerBgActive: '#2E4220',
  colorGreen600: '#47C97D',
  colorGreen100: '#DCFCE7',
};

export const themes = {
  light,
  dark,
};

export const palette = {
  ...light,
  dark,
};

/**
 * Gera um tema do Material-UI (light ou dark) com base
 * nas variáveis dos temas 'light' e 'dark' acima.
 * @param {boolean} isDark - Se o tema deve ser escuro.
 * @returns {import('@mui/material/styles').Theme} O objeto de tema do MUI.
 */
export const generateMuiTheme = (isDark) => {
  const scTheme = isDark ? dark : light;

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: scTheme.colorPrimary,
      },
      success: {
        main: scTheme.colorSuccess,
      },
      error: {
        main: scTheme.colorDanger,
      },
      warning: {
        main: scTheme.colorWarning,
      },
      background: {
        default: scTheme.colorBackgroundLayout,
        paper: scTheme.colorBackgroundComponent,
      },
      text: {
        primary: scTheme.colorText,
        secondary: scTheme.colorGray,
      },
      divider: scTheme.colorSeparator,
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
          },
          icon: {
            color: scTheme.colorIcon,
          },
        },
      },
    },
  });
};
