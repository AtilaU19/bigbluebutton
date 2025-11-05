import styled from 'styled-components';
import {
  borderSize,
  navbarHeight,
  smPaddingX,
  contentSidebarBorderRadius,
  contentSidebarPadding,
  contentSidebarMarginToMedia,
  contentSidebarVerticalMargin,
} from '/imports/ui/stylesheets/styled-components/general';
import { smallOnly, mediumUp } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { SidebarContentPanelProps } from './types';
import Header from '../common/control-header/component';
import { textFontWeight } from '../../stylesheets/styled-components/typography';

const SidebarContentBackdrop = styled.div<{isRTL: boolean, isMobile: boolean}>`
  position: absolute;
  background-color: ${({ theme }) => theme.colorBackgroundLayout};
  ${({ isMobile, isRTL }) => !isMobile && `
    padding: ${isRTL
    ? `
      ${contentSidebarVerticalMargin} 0px ${contentSidebarVerticalMargin} ${contentSidebarMarginToMedia}
    ` : `
      ${contentSidebarVerticalMargin} ${contentSidebarMarginToMedia} ${contentSidebarVerticalMargin} 0px
    `};
  `}
`;

const Poll = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  overflow-x: hidden;
  outline: transparent;
  outline-width: ${borderSize};
  outline-style: solid;
  order: 2;
  height: 100%;
  background-color: ${({ theme }) => theme.colorWhite};
  min-width: 20em;
  padding: ${smPaddingX};

  @media ${smallOnly} {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    height: auto;
    top: ${navbarHeight};
    overflow: auto;
     &.no-padding {
      padding: 0;
    }
  }

  @media ${mediumUp} {
    position: relative;
    order: 1;
  }
`;

export const SidebarContentPanel = styled.div<SidebarContentPanelProps>`
  background-color: ${({ theme }) => theme.colorBackgroundComponent};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  border-radius: ${contentSidebarBorderRadius};
  user-select: none;

  a {
    color: ${({ theme }) => theme.colorPrimary};
    text-decoration: none;

    &:focus {
      color: ${({ theme }) => theme.colorPrimary};
      text-decoration: underline;
    }
    &:hover {
      filter: brightness(90%);
      text-decoration: underline;
    }
    &:active {
      filter: brightness(85%);
      text-decoration: underline;
    }
    &:hover:focus {
      filter: brightness(90%);
      text-decoration: underline;
    }
    &:focus:active {
      filter: brightness(85%);
      text-decoration: underline;
    }
  }
  u {
    text-decoration-line: none;
  }

  ${({ isChrome }) => isChrome && `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
  }
`;

export const HeaderContainer = styled(Header)`
  padding: ${contentSidebarPadding};
  padding-bottom: 0;
`;

export const Separator = styled.hr`
  width: 100%;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colorSeparator};
`;

export const PanelContent = styled.div`
  height: 100%;
  color: ${({ theme }) => theme.appsPanelTextColor};
  font-weight: ${textFontWeight};
  line-height: normal;
`;

export default {
  SidebarContentBackdrop,
  Poll,
  SidebarContentPanel,
  HeaderContainer,
  Separator,
  PanelContent,
};
