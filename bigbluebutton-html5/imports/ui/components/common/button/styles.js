import styled from 'styled-components';
import Icon from '/imports/ui/components/common/icon/component';
import SvgIcon from '/imports/ui/components/common/icon-svg/component';

import {
  btnSpacing,
  borderRadius,
  borderSizeSmall,
  borderSize,
  borderSizeLarge,
  smPaddingY,
  smPaddingX,
  mdPaddingY,
  mdPaddingX,
  lgPaddingY,
  lgPaddingX,
  jumboPaddingY,
  jumboPaddingX,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  fontSizeSmall,
  fontSizeBase,
  fontSizeLarge,
  btnFontWeight,
} from '/imports/ui/stylesheets/styled-components/typography';
import BaseButton from './base/component';

const ButtonIcon = styled(Icon)`
  width: 1em;
  height: 1em;
  text-align: center;

  &:before {
    width: 1em;
    height: 1em;
  }

  .buttonWrapper & {
    font-size: 125%;
  }

  & + span {
    margin: 0 0 0 ${btnSpacing};

    [dir="rtl"] & {
      margin: 0 ${btnSpacing} 0 0;
    }
  }
`;

const ButtonSvgIcon = styled(SvgIcon)`
  width: 1em;
  height: 1em;
  text-align: center;
  background: red;

  &:before {
    width: 1em;
    height: 1em;
  }

  .buttonWrapper & {
    font-size: 125%;
  }

  & + span {
    margin: 0 0 0 ${btnSpacing};

    [dir="rtl"] & {
      margin: 0 ${btnSpacing} 0 0;
    }
  }
`;

const EmojiButtonSibling = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
`;

const ButtonLabel = styled.span`
  & + i,
  & + button {
    margin: 0 0 0 ${btnSpacing};

    [dir="rtl"] & {
      margin: 0 ${btnSpacing} 0 0;
    }
  }
  &:hover,
  .buttonWrapper:hover & {
    opacity: .5;
  }

  ${({ hideLabel }) => hideLabel && `
    font-size: 0;
    height: 0;
    width: 0;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    display: none !important;
  `}
`;

const ButtonWrapper = styled(BaseButton)`
  border: none;
  overflow: visible !important;
  display: inline-block;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
  }

  &:focus {
    outline-style: solid;
  }

  &:-moz-focusring {
    outline-color: transparent;
    outline-offset: ${borderRadius};
  }

  &:active {
    &:focus {
      span:first-of-type::before {
        border-radius: 50%;
        outline: transparent;
        outline-width: ${borderSize};
        outline-style: solid;
      }
    }
  }

  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background: none;
  padding: 0 !important;

  &[aria-disabled="true"] > span {
    cursor: not-allowed;
    opacity: .65;
    box-shadow: none;
  }

  & > span {
    display: block;
    text-align: center;
    white-space: nowrap;
    border: ${borderSizeSmall} solid transparent;
  }

  ${({ size }) => size === 'sm' && `
    font-size: calc(${fontSizeSmall} * .85);
    padding: ${smPaddingY} ${smPaddingX};

    & > span {
      border: ${borderSizeLarge} solid transparent;
    }

    & > label {
      display: inline-block;
      margin: 0 0 0 ${btnSpacing};

      [dir="rtl"] & {
        margin:0 ${btnSpacing} 0 0;
      }
    }
  `}

  ${({ size }) => size === 'md' && `
    font-size: calc(${fontSizeBase} * .85);
    padding: ${mdPaddingY} ${mdPaddingX};

    & > span {
      border: ${borderSizeLarge} solid transparent;
    }
  `}

  ${({ size }) => size === 'lg' && `
    font-size: ${fontSizeBase};
    padding: ${lgPaddingY} ${lgPaddingX};
  `}

  ${({ size }) => size === 'jumbo' && `
    font-size: 3rem;
    padding: ${jumboPaddingY} ${jumboPaddingX};
  `}

  ${({
    size, circle, color, theme,
  }) => size === 'lg' && circle && color === 'primary' && `
    &:focus:not([aria-disabled="true"]){
      & > span{
        color: ${theme.btnPrimaryColor};
        background-color: ${theme.btnPrimaryBg};
        background-clip: padding-box;
        box-shadow: 0 0 0 ${borderSize} ${theme.btnPrimaryBorder};
      }
    }

    &:hover{
      & > span{
        filter: brightness(90%);
        color: ${theme.btnPrimaryColor};
        background-color: ${theme.btnPrimaryHoverBg} !important;
      }
    }

    &:active:focus{
      & > span{
        filter: brightness(85%);
        color: ${theme.btnPrimaryColor};
        background-color: ${theme.btnPrimaryActiveBg};
      }
    }

    &:active{
      & > span{
        filter: brightness(85%);
        color: ${theme.btnPrimaryColor};
        background-color: ${theme.btnPrimaryActiveBg};
      }
    }
  `}

  ${({
    size, circle, ghost, color, theme,
  }) => size === 'lg' && circle && ghost && color === 'default' && `
    span {
      box-shadow: 0 0 1px 0px ${theme.btnDefaultGhostColor} inset, 0 0 1px 0px ${theme.btnDefaultGhostColor};
      background-color: transparent !important;
      border-color: ${theme.btnDefaultGhostColor} !important;
    }

    & > span{
      color: ${theme.btnDefaultGhostColor};
    }

    &:focus:not([aria-disabled="true"]){
      & > span{
        background-color: ${theme.btnDefaultGhostBg} !important;
        background-clip: padding-box;
        box-shadow: 0 0 0 ${borderSize} ${theme.btnDefaultGhostBorder};
        border-color: transparent !important;
      }
    }

    &:hover{
      & > span{
        filter: brightness(85%);
        background-color: ${theme.btnDefaultGhostBg} !important;
      }
    }

    &:active:focus{
      & > span{
        filter: brightness(85%);
        background-color: ${theme.btnDefaultGhostActiveBg} !important;
      }
    }

    &:active{
      & > span{
        filter: brightness(85%);
        background-color: ${theme.btnDefaultGhostActiveBg};
      }
    }
  `}

  ${({ ghost }) => ghost && `
    & > span{
      background-image: none;
      background-color: transparent;
    }
  `}
  ${({
    loading, animations, theme,
  }) => loading && animations && `
  &::before {
    position: relative;
    border: 5px solid transparent;
    border-radius: 50%;
    background-color: ${theme.colorPrimary};
    color: ${theme.colorWhite};
    font-size: 16px;
    text-align: center;
    line-height: 90px;
    cursor: pointer;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid ${theme.colorWhite};
    border-top-color: transparent;
    animation: spin 1.5s ease infinite;
  }

  @media screen and (max-width: 480px) {

    &::after {
      height: 50px;
      border-radius: 50%;
      position: absolute;
      line-height: 90px;
      text-align: center;
      bottom: 0;
      top: 0;
      left: -0.5px;
      right: 0;
      width: 49px;
    }
  }

  @keyframes spin {
    0% {
        opacity: 0;
    }
    33% {
        opacity: 1;
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  }
`}
`;

const ButtonSpan = styled.span`
  border: none;
  overflow: visible;
  display: inline-block;
  border-radius: ${borderSize};
  font-weight: ${btnFontWeight};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;

  &:-moz-focusring {
    outline: none;
  }

  &:hover,
  &:focus {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
    text-decoration: none;
    ${({ hoverColor }) => hoverColor
      && `background-color: ${hoverColor} !important;`}
  }

  &:active,
  &:focus {
    outline: transparent;
    outline-width: ${borderSize};
    outline-style: solid;
  }

  &:active {
    background-image: none;
  }

  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: .65;
    box-shadow: none;
  }

  &,
  &:active {
    &:focus {
      span:first-of-type::before {
        border-radius: ${borderSize};
      }
    }
  }

  ${({ size }) => size === 'sm' && `
    font-size: calc(${fontSizeSmall} * .85);
    padding: ${smPaddingY} ${smPaddingX};
  `}

  ${({ size }) => size === 'md' && `
    font-size: calc(${fontSizeBase} * .85);
    padding: ${mdPaddingY} ${mdPaddingX};
  `}

  ${({ size }) => size === 'lg' && `
    height: 3rem;
    width: 3rem;
    display: flex !important;
    align-items: center;
    justify-content: center;
  `}

  ${({ size }) => size === 'jumbo' && `
    font-size: 3rem;
    padding: ${jumboPaddingY} ${jumboPaddingX};
  `}

  ${({ size, color, theme }) => size === 'md' && color === 'light' && `
    color: ${theme.colorGray};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.colorGray};
      box-shadow: 0 0 0 1px ${theme.colorGrayLightest} !important;
      background-color: ${theme.colorBlueAux} !important;
    }

    &:hover {
      color: ${theme.colorGrayDark} !important;
      background-color: ${theme.colorBlueAux} !important;
    }

    &:active {
      color: ${theme.colorGrayDark} !important;
      background-color: ${theme.colorGrayLightest} !important;
    }

    &:focus:hover {
      color: ${theme.colorGrayDark} !important;
      box-shadow: 0 0 0 1px ${theme.colorGrayLightest} !important;
      background-color: ${theme.colorBlueAux} !important;
    }

    &:focus:active {
      color: ${theme.colorGrayDark} !important;
      box-shadow: 0 0 0 1px ${theme.colorGrayLightest} !important;
      background-color: ${theme.colorGrayLightest} !important;
    }
  `}

  ${({ size, color, theme }) => size === 'md' && color === 'dark' && `
    color: ${theme.colorWhite};
    background: none !important;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.colorWhite};
      box-shadow: 0 0 0 1px ${theme.btnDefaultGhostBorder} !important;
      background-color: ${theme.btnDefaultGhostBg} !important;
    }

    &:hover {
      color: ${theme.colorGrayLighter} !important;
      background-color: ${theme.btnDefaultGhostBg} !important;
    }

    &:active {
      color: ${theme.colorGrayLighter} !important;
      background-color: ${theme.btnDefaultGhostActiveBg} !important;
    }

    &:focus:hover {
      color: ${theme.colorGrayLighter} !important;
      box-shadow: 0 0 0 1px ${theme.btnDefaultGhostBorder} !important;
      background-color: ${theme.btnDefaultGhostBg} !important;
    }

    &:focus:active {
      color: ${theme.colorGrayLighter} !important;
      box-shadow: 0 0 0 1px ${theme.btnDefaultGhostBorder} !important;
      background-color: ${theme.btnDefaultGhostActiveBg} !important;
    }
  `}

  ${({ color, ghost, theme }) => color === 'default' && !ghost && `
    color: ${theme.btnDefaultColor};
    background-color: ${theme.btnDefaultBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnDefaultColor};
      background-color: ${theme.btnDefaultBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnPrimaryBg};
    }

    &:hover & {
      color: ${theme.btnDefaultBg};
    }
  `}

  ${({ color, theme }) => color === 'primary' && `
    color: ${theme.btnPrimaryColor};
    background-color: ${theme.btnPrimaryBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnPrimaryBg};
    }
    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnPrimaryColor};
    }

  `}

  ${({ color, theme }) => color === 'success' && `
    color: ${theme.btnSuccessColor};
    background-color: ${theme.btnSuccessBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnSuccessColor};
      background-color: ${theme.btnSuccessBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnSuccessBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnSuccessColor};
    }
  `}

  ${({ color, theme }) => color === 'warning' && `
    color: ${theme.btnWarningColor};
    background-color: ${theme.btnWarningBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnWarningColor};
      background-color: ${theme.btnWarningBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnWarningBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnWarningColor};
    }
  `}

  ${({ color, theme }) => color === 'danger' && `
    color: ${theme.btnDangerColor};
    background-color: ${theme.btnDangerBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnDangerColor};
      background-color: ${theme.btnDangerBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnDangerBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDangerColor};
      background-color: ${theme.btnDangerBgHover};
    }
  `}

  ${({ color, theme }) => color === 'dark' && `
    color: ${theme.btnDarkColor};
    background-color: ${theme.btnDarkBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus {
      color: ${theme.btnDarkColor};
      background-color: ${theme.btnDarkBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnDarkBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDarkColor};
    }
  `}

  ${({ color, theme }) => color === 'offline' && `
    color: ${theme.btnOfflineColor};
    background-color: ${theme.btnOfflineBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnOfflineColor};
      background-color: ${theme.btnOfflineBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnOfflineBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnOfflineColor};
    }
  `}

  ${({ color, theme }) => color === 'muted' && `
    color: ${theme.btnMutedColor};
    background-color: ${theme.btnMutedBg};
    border: ${borderSizeLarge} solid transparent;

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnMutedColor};
      background-color: ${theme.btnMutedBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnMutedBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnMutedColor};
    }
  `}

  ${({
    ghost, color, size, theme,
  }) => ghost && color === 'default' && size !== 'lg' && `
    color: ${theme.btnDefaultBg};
    background-image: none;
    background-color: transparent;
    border: ${borderSizeLarge} solid transparent;
    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDefaultBg};
      background-color: ${theme.btnDefaultColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDefaultBg} !important;
    }
    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDefaultBg};
      background-color: ${theme.btnDefaultColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'primary' && `
    color: ${theme.btnPrimaryBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnPrimaryBg};
      background-color: ${theme.btnPrimaryColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnPrimaryBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnPrimaryBg};
      background-color: ${theme.btnPrimaryColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'success' && `
    color: ${theme.btnSuccessBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnSuccessBg};
      background-color: ${theme.btnSuccessColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnSuccessBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnSuccessBg};
      background-color: ${theme.btnSuccessColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'warning' && `
    color: ${theme.btnWarningBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnWarningBg};
      background-color: ${theme.btnWarningColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnWarningBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnWarningBg};
      background-color: ${theme.btnWarningColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'danger' && `
    color: ${theme.btnDangerBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDangerBg};
      background-color: ${theme.btnDangerColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDangerBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDangerBg};
      background-color: ${theme.btnDangerColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'dark' && `
    color: ${theme.btnDarkBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDarkBg};
      background-color: ${theme.btnDarkColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDarkBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDarkBg};
      background-color: ${theme.btnDarkColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'offline' && `
    color: ${theme.btnOfflineBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnOfflineBg};
      background-color: ${theme.btnOfflineColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnOfflineBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnOfflineBg};
      background-color: ${theme.btnOfflineColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'muted' && `
    color: ${theme.btnMutedBg};

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnMutedBg};
      background-color: ${theme.btnMutedColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnMutedBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnMutedBg};
      background-color: ${theme.btnMutedColor};
    }
  `}

  ${({ circle }) => circle && `
    border-radius: 50%;
  `}

  ${({ circle, size }) => circle && size === 'sm' && `
    padding: calc(${smPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'md' && `
    padding: calc(${mdPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'lg' && `
    padding: calc(${lgPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'jumbo' && `
    padding: calc(${jumboPaddingX} / 2);
  `}

  ${({ block }) => block && `
    display: block;
    width: 100%;
  `}
`;

const Button = styled(BaseButton)`
  border: ${borderSizeLarge} solid transparent;
  border: none;
  overflow: visible;
  display: inline-block;
  border-radius: ${borderSize};
  font-weight: ${btnFontWeight};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;

  &:-moz-focusring {
    outline: none;
  }

  &:hover,
  &:focus {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
    text-decoration: none;
  }

  &:active,
  &:focus {
    outline: transparent;
    outline-width: ${borderSize};
    outline-style: solid;
  }

  &:active {
    background-image: none;
  }

  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: .65;
    box-shadow: none;
  }

  &,
  &:active {
    &:focus {
      span:first-of-type::before {
        border-radius: ${borderSize};
      }
    }
  }

  ${({ size }) => size === 'sm' && `
    font-size: calc(${fontSizeSmall} * .85);
    padding: ${smPaddingY} ${smPaddingX};
  `}

  ${({ size }) => size === 'md' && `
    font-size: calc(${fontSizeBase} * .85);
    padding: ${mdPaddingY} ${mdPaddingX};
  `}

  ${({ size }) => size === 'lg' && `
    font-size: calc(${fontSizeLarge} * .85);
    padding: ${lgPaddingY} ${lgPaddingX};
  `}

  ${({ size }) => size === 'jumbo' && `
    font-size: 3rem;
    padding: ${jumboPaddingY} ${jumboPaddingX};
  `}

  ${({ color, theme }) => color === 'default' && `
    color: ${theme.btnDefaultColor};
    background-color: ${theme.btnDefaultBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnDefaultColor};
      background-color: ${theme.btnDefaultBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnPrimaryBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDefaultColor};
    }
  `}

  ${({ color, theme }) => color === 'primary' && `
    color: ${theme.btnPrimaryColor};
    background-color: ${theme.btnPrimaryBg};
    border: ${borderSizeLarge} solid transparent !important;

    &:focus:not([aria-disabled="true"]){
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnPrimaryBorder};
    }

    &:hover{
      filter: brightness(90%);
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryHoverBg} !important;
    }

    &:active:focus{
      filter: brightness(85%);
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryActiveBg};
    }

    &:active{
      filter: brightness(85%);
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryActiveBg} !important;
    }
  `}

  ${({ color, theme }) => color === 'success' && `
    color: ${theme.btnSuccessColor};
    background-color: ${theme.btnSuccessBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnSuccessColor};
      background-color: ${theme.btnSuccessBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnSuccessBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnSuccessColor};
    }
  `}

  ${({ color, theme }) => color === 'warning' && `
    color: ${theme.btnWarningColor};
    background-color: ${theme.btnWarningBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnWarningColor};
      background-color: ${theme.btnWarningBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnWarningBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnWarningColor};
    }
  `}

  ${({ color, theme }) => color === 'danger' && `
    color: ${theme.btnDangerColor};
    background-color: ${theme.btnDangerBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnDangerColor};
      background-color: ${theme.btnDangerBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnDangerBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDangerColor};
    }
  `}

  ${({ color, theme }) => color === 'dark' && `
    color: ${theme.btnDarkColor};
    background-color: ${theme.btnDarkBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnDarkColor};
      background-color: ${theme.btnDarkBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnDarkBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDarkColor};
    }
  `}

  ${({ color, theme }) => color === 'offline' && `
    color: ${theme.btnOfflineColor};
    background-color: ${theme.btnOfflineBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnOfflineColor};
      background-color: ${theme.btnOfflineBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnOfflineBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnOfflineColor};
    }
  `}

  ${({ color, theme }) => color === 'muted' && `
    color: ${theme.btnMutedColor};
    background-color: ${theme.btnMutedBg};

    &:focus,
    .buttonWrapper:focus:not([aria-disabled="true"]) & {
      color: ${theme.btnMutedColor};
      background-color: ${theme.btnMutedBg};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSize} ${theme.btnMutedBorder};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnMutedColor};
    }
  `}

  ${({ color, theme }) => color === 'secondary' && `
    background: transparent;
    color: ${theme.colorGray};
    border: 3px solid transparent;
    border-radius: 4px;


    &:focus {
      background: ${theme.colorMutedBackground};
      box-shadow: 0 0 0 ${borderSize} ${theme.colorBlueLighter};
    }

    &:hover {
      background: ${theme.colorMutedBackground};
      color: ${theme.colorGrayDark};
    }

    &:active {
      background: ${theme.colorGrayLightest};
      color: ${theme.colorGrayDark};
    }

    &:hover {
      &:focus {
        background: ${theme.colorMutedBackground};
        color: ${theme.colorGrayDark};
        box-shadow: 0 0 0 ${borderSize} ${theme.colorBlueLighter};
      }
    }

    &:focus {
      &:active {
        background: ${theme.colorGrayLightest};
        color: ${theme.colorGrayDark};
        box-shadow: 0 0 0 ${borderSize} ${theme.colorBlueLighter};
      }
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'default' && `
    color: ${theme.btnDefaultBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDefaultBg};
      background-color: ${theme.btnDefaultColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDefaultBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDefaultBg};
      background-color: ${theme.btnDefaultColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'primary' && `
    color: ${theme.btnPrimaryBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnPrimaryBg};
      background-color: ${theme.btnPrimaryColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnPrimaryBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnPrimaryBg};
      background-color: ${theme.btnPrimaryColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'success' && `
    color: ${theme.btnSuccessBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnSuccessBg};
      background-color: ${theme.btnSuccessColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnSuccessBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnSuccessBg};
      background-color: ${theme.btnSuccessColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'warning' && `
    color: ${theme.btnWarningBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnWarningBg};
      background-color: ${theme.btnWarningColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnWarningBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnWarningBg};
      background-color: ${theme.btnWarningColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'danger' && `
    color: ${theme.btnDangerBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDangerBg};
      background-color: ${theme.btnDangerColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDangerBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDangerBg};
      background-color: ${theme.btnDangerColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'dark' && `
    color: ${theme.btnDarkBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnDarkBg};
      background-color: ${theme.btnDarkColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnDarkBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnDarkBg};
      background-color: ${theme.btnDarkColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'offline' && `
    color: ${theme.btnOfflineBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnOfflineBg};
      background-color: ${theme.btnOfflineColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnOfflineBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnOfflineBg};
      background-color: ${theme.btnOfflineColor};
    }
  `}

  ${({ ghost, color, theme }) => ghost && color === 'muted' && `
    color: ${theme.btnMutedBg};
    background-image: none;
    background-color: transparent;

    &:focus,
    .buttonWrapper:focus & {
      color: ${theme.btnMutedBg};
      background-color: ${theme.btnMutedColor};
      background-clip: padding-box;
      box-shadow: 0 0 0 ${borderSizeLarge} ${theme.btnMutedBg};
    }

    &:hover,
    .buttonWrapper:hover & {
      color: ${theme.btnMutedBg};
      background-color: ${theme.btnMutedColor};
    }
  `}

  ${({ circle }) => circle && `
    border-radius: 50%;
  `}

  ${({ circle, size }) => circle && size === 'sm' && `
    padding: calc(${smPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'md' && `
    padding: calc(${mdPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'lg' && `
    padding: calc(${lgPaddingX} / 2);
  `}

  ${({ circle, size }) => circle && size === 'jumbo' && `
    padding: calc(${jumboPaddingX} / 2);
  `}

  ${({ block }) => block && `
    display: block;
    width: 100%;
  `}

  ${({ iconRight }) => iconRight && `
    display: flex;
    flex-direction: row-reverse;
  `}
`;

export default {
  ButtonIcon,
  ButtonSvgIcon,
  EmojiButtonSibling,
  ButtonLabel,
  ButtonWrapper,
  ButtonSpan,
  Button,
};
