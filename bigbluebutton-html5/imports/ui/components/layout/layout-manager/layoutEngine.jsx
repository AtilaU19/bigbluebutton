import React, { useEffect, useMemo } from 'react';
import { layoutSelect, layoutSelectInput, layoutSelectOutput } from '/imports/ui/components/layout/context';
import DEFAULT_VALUES, {
  SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH,
  SIDEBAR_NAVIGATION_PANEL_WIDTH,
  SIDEBAR_NAVIGATION_MARGIN_PERCENTAGE_WIDTH,
} from '/imports/ui/components/layout/defaultValues';
import { LAYOUT_TYPE, DEVICE_TYPE } from '/imports/ui/components/layout/enums';

import UnifiedLayout from '/imports/ui/components/layout/layout-manager/unifiedLayout';
import CamerasOnlyLayout from '/imports/ui/components/layout/layout-manager/camerasOnly';
import PresentationOnlyLayout from '/imports/ui/components/layout/layout-manager/presentationOnlyLayout';
import ParticipantsAndChatOnlyLayout from '/imports/ui/components/layout/layout-manager/participantsAndChatOnlyLayout';
import PluginsOnlyLayout from '/imports/ui/components/layout/layout-manager/pluginsOnly';
import { useIsPresentationEnabled } from '/imports/ui/services/features';
import Session from '/imports/ui/services/storage/in-memory';
import MediaOnlyLayout from './mediaOnlyLayout';
import { usePrevious } from '../../whiteboard/utils';
import { getWaitLayout } from '../utils';

const windowWidth = () => window.document.documentElement.clientWidth;
const windowHeight = () => window.document.documentElement.clientHeight;
const min = (value1, value2) => (value1 <= value2 ? value1 : value2);
const max = (value1, value2) => (value1 >= value2 ? value1 : value2);

const LayoutEngine = () => {
  const hasBanner = layoutSelectInput((i) => i.bannerBar.hasBanner);
  const hasNotification = layoutSelectInput((i) => i.notificationsBar.hasNotification);
  const numCameras = layoutSelectInput((i) => i.cameraDock.numCameras);
  const presentationIsOpen = layoutSelectInput((i) => i.presentation.isOpen);
  const slidesLength = layoutSelectInput((i) => i.presentation.slidesLength);
  const hasActionBar = layoutSelectInput((i) => i.actionBar.hasActionBar);
  const hasNavBar = layoutSelectInput((i) => i.navBar.hasNavBar);
  const navBarHideTopRow = layoutSelectOutput((i) => i.navBar.hideTopRow);
  const sidebarNavigationIsOpen = layoutSelectInput((i) => i.sidebarNavigation.isOpen);
  const sidebarContentIsOpen = layoutSelectInput((i) => i.sidebarContent.isOpen);
  const sidebarContentWidthInput = layoutSelectInput((i) => i.sidebarContent.width);
  const sidebarContentAuxiliaryIsOpen = layoutSelectInput(
    (i) => i.sidebarContentAuxiliary.isOpen,
  );
  const sidebarContentAuxiliaryWidthInput = layoutSelectInput(
    (i) => i.sidebarContentAuxiliary.width,
  );
  const hasExternalVideo = layoutSelectInput((i) => i.externalVideo.hasExternalVideo);
  const genericContentId = layoutSelectInput((i) => i.genericMainContent.genericContentId);
  const hasScreenShare = layoutSelectInput((i) => i.screenShare.hasScreenShare);
  const isSharedNotesPinned = layoutSelectInput((i) => i.sharedNotes.isPinned);

  const shouldWaitForLayout = getWaitLayout();
  const layoutLoading = layoutSelect((i) => i.layoutLoading);
  const skipLayoutEngineRender = shouldWaitForLayout && layoutLoading;

  const isWebcamsFullscreen = layoutSelect((i) => i.fullscreen.group === 'webcams');
  const isRTL = layoutSelect((i) => i.isRTL);
  const fontSize = layoutSelect((i) => i.fontSize);
  const deviceType = layoutSelect((i) => i.deviceType);
  const selectedLayout = layoutSelect((i) => i.layoutType);
  const isPresentationEnabled = useIsPresentationEnabled();
  const prevLayout = usePrevious(selectedLayout);

  const isMobile = deviceType === DEVICE_TYPE.MOBILE;
  const isTablet = deviceType === DEVICE_TYPE.TABLET;

  useEffect(() => {
    // If it has build one time, then set the flag to true
    // This will prevent layout-engine to initiate the enforced layout with the
    // default configurations.
    const hasLayoutEngineLoadedOnce = Session.getItem('hasLayoutEngineLoadedOnce');
    if (!hasLayoutEngineLoadedOnce) {
      Session.setItem('hasLayoutEngineLoadedOnce', true);
    }
  }, []);

  const common = useMemo(() => {
    const bannerAreaHeight = () => {
      const bannerHeight = hasBanner ? DEFAULT_VALUES.bannerHeight : 0;
      const notificationHeight = hasNotification ? DEFAULT_VALUES.bannerHeight : 0;

      return bannerHeight + notificationHeight;
    };

    const baseCameraDockBounds = (mediaAreaBounds, sidebarSize) => {
      const cameraDockBounds = {};

      const hasPresentation = isPresentationEnabled && slidesLength !== 0;

      const isGeneralMediaOff = !hasPresentation
        && !hasExternalVideo && !hasScreenShare
        && !isSharedNotesPinned && !genericContentId;

      const isUnifiedLayout = selectedLayout === LAYOUT_TYPE.UNIFIED_LAYOUT;

      if (numCameras === 0 && !isUnifiedLayout) {
        cameraDockBounds.width = 0;
        cameraDockBounds.height = 0;

        return cameraDockBounds;
      }

      if (isUnifiedLayout && numCameras === 0 && hasPresentation && presentationIsOpen) {
        cameraDockBounds.width = 0;
        cameraDockBounds.height = 0;

        return cameraDockBounds;
      }

      if (!presentationIsOpen || isGeneralMediaOff) {
        cameraDockBounds.width = mediaAreaBounds.width;
        cameraDockBounds.maxWidth = mediaAreaBounds.width;
        cameraDockBounds.height = mediaAreaBounds.height;
        cameraDockBounds.maxHeight = mediaAreaBounds.height;
        cameraDockBounds.top = mediaAreaBounds.top;
        cameraDockBounds.left = !isRTL ? mediaAreaBounds.left : 0;
        cameraDockBounds.right = isRTL ? sidebarSize : null;
      }

      if (isWebcamsFullscreen) {
        cameraDockBounds.width = windowWidth();
        cameraDockBounds.minWidth = windowWidth();
        cameraDockBounds.maxWidth = windowWidth();
        cameraDockBounds.height = windowHeight();
        cameraDockBounds.minHeight = windowHeight();
        cameraDockBounds.maxHeight = windowHeight();
        cameraDockBounds.top = 0;
        cameraDockBounds.left = 0;
        cameraDockBounds.right = 0;
        cameraDockBounds.zIndex = 99;

        return cameraDockBounds;
      }

      return cameraDockBounds;
    };

    const calculatesNavbarHeight = () => {
      const { navBarHeight } = DEFAULT_VALUES;

      const finalHeight = navBarHideTopRow ? navBarHeight / 2 : navBarHeight;

      return hasNavBar ? finalHeight : 0;
    };

    const calculatesNavbarBounds = (mediaAreaBounds) => {
      const { navBarTop } = DEFAULT_VALUES;

      const navBarHeight = calculatesNavbarHeight();

      if (!hasNavBar) {
        return {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          zIndex: 0,
        };
      }

      return {
        width: mediaAreaBounds.width,
        height: navBarHeight,
        top: navBarTop + bannerAreaHeight(),
        left: !isRTL ? mediaAreaBounds.left : 0,
        zIndex: 1,
      };
    };

    const calculatesActionbarHeight = () => {
      if (!hasActionBar) {
        return {
          height: 0,
          innerHeight: 0,
          padding: 0,
        };
      }

      const { actionBarHeight, actionBarPadding } = DEFAULT_VALUES;

      const BASE_FONT_SIZE = 14; // 90% font size
      const height = ((actionBarHeight / BASE_FONT_SIZE) * fontSize);

      return {
        height: height + (actionBarPadding * 2),
        innerHeight: height,
        padding: actionBarPadding,
      };
    };

    const calculatesActionbarBounds = (mediaAreaBounds) => {
      const actionBarHeight = calculatesActionbarHeight();

      return {
        display: hasActionBar,
        width: mediaAreaBounds.width,
        height: actionBarHeight.height,
        innerHeight: actionBarHeight.innerHeight,
        padding: actionBarHeight.padding,
        top: windowHeight() - actionBarHeight.height,
        left: !isRTL ? mediaAreaBounds.left : 0,
        zIndex: 1,
      };
    };

    const calculatesSidebarNavWidth = () => {
      const {
        sidebarNavWidthMobile,
      } = DEFAULT_VALUES;

      let width = 0;
      let horizontalSpaceOccupied = 0;
      if (sidebarNavigationIsOpen) {
        if (isMobile) {
          width = sidebarNavWidthMobile;
          // The navigation sidebar is a floating window on mobile. We say it does not
          // occupy any space, so that its width is not taken into account when calculating the
          // position of other layout elements.
          horizontalSpaceOccupied = 0;
        } else {
          const margin = windowWidth() * SIDEBAR_NAVIGATION_MARGIN_PERCENTAGE_WIDTH;
          width = SIDEBAR_NAVIGATION_PANEL_WIDTH + (2 * margin);
          horizontalSpaceOccupied = width;
        }
      }
      return {
        width,
        horizontalSpaceOccupied,
      };
    };

    const calculatesSidebarNavHeight = () => {
      const {
        sidebarNavHeightPercentage,
      } = DEFAULT_VALUES;
      const sidebarBottomPadding = 20; // px
      const actionsBarHeight = calculatesActionbarHeight().height;

      let sidebarNavigationHeight = 0;
      let availableHeight = windowHeight();
      if (sidebarNavigationIsOpen) {
        if (isMobile) {
          // The navigation sidebar is a floating tile on mobile.
          const spaceToActionsBar = (0.02 * availableHeight);
          sidebarNavigationHeight = availableHeight - actionsBarHeight
            - sidebarBottomPadding - spaceToActionsBar;
        } else {
          availableHeight -= bannerAreaHeight();
          sidebarNavigationHeight = availableHeight * sidebarNavHeightPercentage;
        }
      }
      return sidebarNavigationHeight;
    };

    const calculatesSidebarNavBounds = () => {
      const {
        navBarTop,
        sidebarNavMarginToTheEdgeMobile,
      } = DEFAULT_VALUES;

      let left = null;
      let right = null;
      if (isRTL) {
        right = isMobile ? sidebarNavMarginToTheEdgeMobile : 0;
      } else {
        left = isMobile ? sidebarNavMarginToTheEdgeMobile : 0;
      }
      const navBarPadding = 0.8 * fontSize;

      return {
        top: isMobile
          ? navBarTop + bannerAreaHeight() + navBarPadding
          : bannerAreaHeight(),
        left,
        right,
        zIndex: isMobile ? 12 : 2,
      };
    };

    const calculatesSidebarContentWidth = (auxiliary = false) => {
      const {
        sidebarContentMinWidth,
        sidebarContentMaxWidth,
      } = DEFAULT_VALUES;

      const isOpen = auxiliary ? sidebarContentAuxiliaryIsOpen : sidebarContentIsOpen;
      const sidebarContentWidth = auxiliary
        ? sidebarContentAuxiliaryWidthInput
        : sidebarContentWidthInput;

      let minWidth = 0;
      let width = 0;
      let maxWidth = 0;

      if (isOpen) {
        if (isMobile) {
          minWidth = windowWidth();
          width = windowWidth();
          maxWidth = windowWidth();
        } else {
          const effectiveMinWidth = sidebarContentMinWidth;
          if (sidebarContentWidth === 0) {
            width = min(
              max((windowWidth() * 0.2), effectiveMinWidth), sidebarContentMaxWidth,
            );
          } else {
            width = min(max(sidebarContentWidth, effectiveMinWidth),
              sidebarContentMaxWidth);
          }
          minWidth = effectiveMinWidth;
          maxWidth = sidebarContentMaxWidth;
        }
      }
      return {
        minWidth,
        width,
        maxWidth,
      };
    };

    const calculatesSidebarContentBounds = (sidebarNavWidth) => {
      const { navBarHeight } = DEFAULT_VALUES;

      let top = bannerAreaHeight();

      if (isMobile) top = navBarHeight + bannerAreaHeight();

      let left = isMobile ? 0 : sidebarNavWidth;
      let right = isMobile ? 0 : sidebarNavWidth;
      left = !isRTL ? left : null;
      right = isRTL ? right : null;

      const zIndex = isMobile ? 11 : 2;

      return {
        top,
        left,
        right,
        zIndex,
      };
    };

    const calculatesMediaAreaBounds = (
      sidebarNavWidth,
      contentWidth,
      margin = 0,
    ) => {
      const { height: actionBarHeight } = calculatesActionbarHeight();
      const navBarHeight = calculatesNavbarHeight();
      const sidebarContentMarginToMedia = windowWidth()
        * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;

      let left = 0;
      let width = 0;
      if (isMobile) {
        width = windowWidth();
      } else {
        left = !isRTL ? sidebarNavWidth + contentWidth : 0;
        const marginToMedia = margin || selectedLayout === LAYOUT_TYPE.CAMERAS_ONLY
          ? 0
          : sidebarContentMarginToMedia;
        width = windowWidth() - sidebarNavWidth - contentWidth - marginToMedia;
      }

      return {
        width: width - (2 * margin),
        height: windowHeight()
          - (navBarHeight + actionBarHeight + bannerAreaHeight() + (2 * margin)),
        top: navBarHeight + bannerAreaHeight() + margin,
        left: left + margin,
      };
    };

    return {
      bannerAreaHeight,
      baseCameraDockBounds,
      calculatesNavbarHeight,
      calculatesNavbarBounds,
      calculatesActionbarHeight,
      calculatesActionbarBounds,
      calculatesSidebarNavWidth,
      calculatesSidebarNavHeight,
      calculatesSidebarNavBounds,
      calculatesSidebarContentWidth,
      calculatesSidebarContentBounds,
      calculatesMediaAreaBounds,
      isMobile,
      isTablet,
      prevLayout,
    };
  }, [
    hasBanner,
    hasNotification,
    numCameras,
    presentationIsOpen,
    slidesLength,
    hasActionBar,
    hasNavBar,
    navBarHideTopRow,
    sidebarNavigationIsOpen,
    sidebarContentIsOpen,
    sidebarContentWidthInput,
    sidebarContentAuxiliaryIsOpen,
    sidebarContentAuxiliaryWidthInput,
    hasExternalVideo,
    genericContentId,
    hasScreenShare,
    isSharedNotesPinned,
    isWebcamsFullscreen,
    isRTL,
    fontSize,
    isMobile,
    isTablet,
    selectedLayout,
    isPresentationEnabled,
    prevLayout,
  ]);

  const layout = document.getElementById('layout');
  if (skipLayoutEngineRender) return null;
  switch (selectedLayout) {
    case LAYOUT_TYPE.UNIFIED_LAYOUT:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.UNIFIED_LAYOUT);
      return <UnifiedLayout {...common} isPresentationEnabled={isPresentationEnabled} />;
    case LAYOUT_TYPE.CAMERAS_ONLY:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.CAMERAS_ONLY);
      return <CamerasOnlyLayout {...common} isPresentationEnabled={isPresentationEnabled} />;
    case LAYOUT_TYPE.PRESENTATION_ONLY:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.PRESENTATION_ONLY);
      return <PresentationOnlyLayout {...common} />;
    case LAYOUT_TYPE.PARTICIPANTS_AND_CHAT_ONLY:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.PARTICIPANTS_AND_CHAT_ONLY);
      return <ParticipantsAndChatOnlyLayout {...common} />;
    case LAYOUT_TYPE.MEDIA_ONLY:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.MEDIA_ONLY);
      return <MediaOnlyLayout {...common} isPresentationEnabled={isPresentationEnabled} />;
    case LAYOUT_TYPE.PLUGINS_ONLY:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.PLUGINS_ONLY);
      return <PluginsOnlyLayout {...common} isPresentationEnabled={isPresentationEnabled} />;
    default:
      layout?.setAttribute('data-layout', LAYOUT_TYPE.UNIFIED_LAYOUT);
      return <UnifiedLayout {...common} isPresentationEnabled={isPresentationEnabled} />;
  }
};

export default React.memo(LayoutEngine);
