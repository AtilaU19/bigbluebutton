import React, { useEffect, useRef, useState } from 'react';
import {
  layoutSelect, layoutSelectInput, layoutSelectOutput, layoutDispatch,
} from '/imports/ui/components/layout/context';
import DEFAULT_VALUES, {
  SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH,
  SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT,
} from '/imports/ui/components/layout/defaultValues';
import { INITIAL_INPUT_STATE } from '/imports/ui/components/layout/initState';
import {
  ACTIONS, CAMERADOCK_POSITION, LAYOUT_TYPE, PANELS,
} from '../enums';
import Storage from '/imports/ui/services/storage/session';
import { defaultsDeep } from '/imports/utils/array-utils';
import { isPhoneLandscape } from '../utils';
import Session from '/imports/ui/services/storage/in-memory';
import getFromUserSettings from '/imports/ui/services/users-settings';

const windowWidth = () => window.document.documentElement.clientWidth;
const windowHeight = () => window.document.documentElement.clientHeight;
const min = (value1, value2) => (value1 <= value2 ? value1 : value2);
const max = (value1, value2) => (value1 >= value2 ? value1 : value2);

const UnifiedLayout = (props) => {
  const {
    bannerAreaHeight, calculatesActionbarHeight, calculatesNavbarHeight, isMobile,
    prevLayout, isPresentationEnabled,
  } = props;

  const deviceType = layoutSelect((i) => i.deviceType);
  const isRTL = layoutSelect((i) => i.isRTL);
  const fullscreenElement = layoutSelect((i) => i.fullscreen.element);
  const fullscreenGroup = layoutSelect((i) => i.fullscreen.group);
  const fontSize = layoutSelect((i) => i.fontSize);

  const browserWidth = layoutSelectInput((i) => i.browser.width);
  const browserHeight = layoutSelectInput((i) => i.browser.height);
  const bannerBarHasBanner = layoutSelectInput((i) => i.bannerBar.hasBanner);
  const notificationsBarHasNotification = layoutSelectInput(
    (i) => i.notificationsBar.hasNotification,
  );

  const presentationIsOpen = layoutSelectInput((i) => i.presentation.isOpen);
  const presentationSlidesLength = layoutSelectInput((i) => i.presentation.slidesLength);
  const externalVideoHasExternalVideo = layoutSelectInput(
    (i) => i.externalVideo.hasExternalVideo,
  );
  const genericContentId = layoutSelectInput((i) => i.genericMainContent.genericContentId);
  const screenShareHasScreenShare = layoutSelectInput((i) => i.screenShare.hasScreenShare);
  const sharedNotesIsPinned = layoutSelectInput((i) => i.sharedNotes.isPinned);

  const sidebarNavigationIsOpen = layoutSelectInput((i) => i.sidebarNavigation.isOpen);
  const sidebarContentIsOpen = layoutSelectInput((i) => i.sidebarContent.isOpen);
  const sidebarContentWidthInput = layoutSelectInput((i) => i.sidebarContent.width);
  const sidebarContentAuxiliaryIsOpen = layoutSelectInput(
    (i) => i.sidebarContentAuxiliary.isOpen,
  );
  const sidebarContentAuxiliaryWidthInput = layoutSelectInput(
    (i) => i.sidebarContentAuxiliary.width,
  );
  const cameraDockNumCameras = layoutSelectInput((i) => i.cameraDock.numCameras);
  const cameraDockPosition = layoutSelectInput((i) => i.cameraDock.position);
  const cameraDockIsDragging = layoutSelectInput((i) => i.cameraDock.isDragging);
  const cameraDockIsResizing = layoutSelectInput((i) => i.cameraDock.isResizing);
  const cameraDockWidth = layoutSelectInput((i) => i.cameraDock.width);
  const cameraDockHeight = layoutSelectInput((i) => i.cameraDock.height);
  const actionBarHasActionBar = layoutSelectInput((i) => i.actionBar.hasActionBar);
  const navBarHasNavBar = layoutSelectInput((i) => i.navBar.hasNavBar);
  const navBarHideTopRow = layoutSelectOutput((i) => i.navBar.hideTopRow);
  const layoutContextDispatch = layoutDispatch();

  const [initializedDeviceType, setInitializedDeviceType] = useState(null);
  const prevIsResizingRef = useRef(false);

  const calculatesDropAreas = (sidebarNavWidth, sidebarContentWidth, cameraDockBounds) => {
    const isMultiFunctionalModeActive = sidebarContentAuxiliaryIsOpen;
    const { height: actionBarHeight } = calculatesActionbarHeight();
    const mediaAreaHeight = windowHeight() - (DEFAULT_VALUES.navBarHeight + actionBarHeight);
    const sidebarContentMarginToMedia = windowWidth()
      * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
    const mediaAreaWidth = windowWidth()
      - (sidebarNavWidth + sidebarContentWidth) - sidebarContentMarginToMedia;
    const DROP_ZONE_DEFAUL_SIZE = 100;
    const dropZones = {};
    const sidebarSize = sidebarNavWidth + sidebarContentWidth;

    dropZones[CAMERADOCK_POSITION.CONTENT_TOP] = {
      top: DEFAULT_VALUES.navBarHeight,
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      width: mediaAreaWidth,
      height: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_RIGHT] = {
      top: DEFAULT_VALUES.navBarHeight + DROP_ZONE_DEFAUL_SIZE,
      left: isRTL
        ? sidebarContentMarginToMedia
        : windowWidth() - DROP_ZONE_DEFAUL_SIZE - sidebarContentMarginToMedia,
      height: mediaAreaHeight - 2 * DROP_ZONE_DEFAUL_SIZE,
      width: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_BOTTOM] = {
      top: DEFAULT_VALUES.navBarHeight + mediaAreaHeight - DROP_ZONE_DEFAUL_SIZE,
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      width: mediaAreaWidth,
      height: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_LEFT] = {
      top: DEFAULT_VALUES.navBarHeight + DROP_ZONE_DEFAUL_SIZE,
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      height: mediaAreaHeight - 2 * DROP_ZONE_DEFAUL_SIZE,
      width: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    if (!isMultiFunctionalModeActive) {
      dropZones[CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM] = {
        top: windowHeight() - DROP_ZONE_DEFAUL_SIZE,
        left: !isRTL ? sidebarNavWidth : null,
        right: isRTL ? sidebarNavWidth : null,
        width: sidebarContentWidth ? sidebarContentWidth - sidebarContentMarginToMedia : 0,
        height: DROP_ZONE_DEFAUL_SIZE,
        zIndex: cameraDockBounds.zIndex,
      };
    }

    return dropZones;
  };

  const init = () => {
    const hasLayoutEngineLoadedOnce = Session.getItem('hasLayoutEngineLoadedOnce');
    if (isMobile) {
      layoutContextDispatch({
        type: ACTIONS.SET_LAYOUT_INPUT,
        value: (prevInput) => {
          const {
            sidebarNavigation, sidebarContent, presentation, cameraDock,
            externalVideo, genericMainContent, screenShare, sharedNotes,
          } = prevInput;
          const { sidebarContentPanel } = sidebarContent;
          const overrideOpenSidebarPanel = !getFromUserSettings('bbb_hide_sidebar_navigation', false)
            && sidebarContentPanel !== PANELS.NONE;
          const overrideOpenSidebarNavigation = !getFromUserSettings('bbb_hide_sidebar_navigation', false)
            && (sidebarNavigation.isOpen || sidebarContentPanel !== PANELS.NONE || false);
          const { registeredApps, pinnedApps } = sidebarNavigation;
          return defaultsDeep(
            {
              sidebarNavigation: {
                isOpen: overrideOpenSidebarNavigation,
                registeredApps,
                pinnedApps,
              },
              sidebarContent: {
                isOpen: overrideOpenSidebarPanel,
                sidebarContentPanel: sidebarContent.sidebarContentPanel,
              },
              sidebarContentAuxiliary: {
                isOpen: false,
                sidebarContentPanel: PANELS.NONE,
              },
              presentation: {
                isOpen: presentation.isOpen,
                slidesLength: presentation.slidesLength,
                currentSlide: {
                  ...presentation.currentSlide,
                },
              },
              cameraDock: {
                position: cameraDock.position || DEFAULT_VALUES.cameraPosition,
                numCameras: cameraDock.numCameras,
              },
              externalVideo: {
                hasExternalVideo: externalVideo.hasExternalVideo,
              },
              genericMainContent: {
                genericContentId: genericMainContent.genericContentId,
              },
              screenShare: {
                hasScreenShare: screenShare.hasScreenShare,
                width: screenShare.width,
                height: screenShare.height,
              },
              sharedNotes: {
                isPinned: sharedNotes.isPinned,
              },
            },
            hasLayoutEngineLoadedOnce ? prevInput : INITIAL_INPUT_STATE,
          );
        },
      });
    } else {
      layoutContextDispatch({
        type: ACTIONS.SET_LAYOUT_INPUT,
        value: (prevInput) => {
          const {
            sidebarNavigation, sidebarContent, presentation, cameraDock,
            externalVideo, genericMainContent, screenShare, sharedNotes,
          } = prevInput;
          const { sidebarContentPanel } = sidebarContent;
          let sidebarContentPanelOverride = sidebarContentPanel;
          let overrideOpenSidebarPanel = sidebarContentPanel !== PANELS.NONE;
          let overrideOpenSidebarNavigation = sidebarNavigation.isOpen
            || sidebarContentPanel !== PANELS.NONE || false;
          if (prevLayout === LAYOUT_TYPE.CAMERAS_ONLY
            || prevLayout === LAYOUT_TYPE.PRESENTATION_ONLY
            || prevLayout === LAYOUT_TYPE.MEDIA_ONLY) {
            overrideOpenSidebarNavigation = true;
            overrideOpenSidebarPanel = true;
            sidebarContentPanelOverride = PANELS.CHAT;
          }
          return defaultsDeep(
            {
              sidebarNavigation: {
                isOpen: overrideOpenSidebarNavigation,
              },
              sidebarContent: {
                isOpen: overrideOpenSidebarPanel,
                sidebarContentPanel: sidebarContentPanelOverride,
              },
              sidebarContentAuxiliary: {
                isOpen: false,
                sidebarContentPanel: PANELS.NONE,
              },
              presentation: {
                isOpen: presentation.isOpen,
                slidesLength: presentation.slidesLength,
                currentSlide: {
                  ...presentation.currentSlide,
                },
              },
              cameraDock: {
                position: cameraDock.position || DEFAULT_VALUES.cameraPosition,
                numCameras: cameraDock.numCameras,
              },
              externalVideo: {
                hasExternalVideo: externalVideo.hasExternalVideo,
              },
              genericMainContent: {
                genericContentId: genericMainContent.genericContentId,
              },
              screenShare: {
                hasScreenShare: screenShare.hasScreenShare,
                width: screenShare.width,
                height: screenShare.height,
              },
              sharedNotes: {
                isPinned: sharedNotes.isPinned,
              },
            },
            hasLayoutEngineLoadedOnce ? prevInput : INITIAL_INPUT_STATE,
          );
        },
      });
    }
    Session.setItem('layoutReady', true);
  };

  const isMediaContentOff = () => {
    const hasPresentation = isPresentationEnabled && presentationSlidesLength !== 0;

    return !hasPresentation && !externalVideoHasExternalVideo
      && !screenShareHasScreenShare && !sharedNotesIsPinned && !genericContentId;
  };

  const isSideBySideCamerasEnforced = () => isPhoneLandscape({
    width: browserWidth,
    height: browserHeight,
  })
    && cameraDockNumCameras > 0
    && presentationIsOpen
    && !isMediaContentOff();

  // CONTENT_RIGHT mirrors under RTL, as every other camera position does.
  const getCameraDockPosition = () => (isSideBySideCamerasEnforced()
    ? CAMERADOCK_POSITION.CONTENT_RIGHT
    : cameraDockPosition);

  const calculatesSidebarContentHeight = (dockHeight) => {
    const {
      sidebarContentMinHeight,
    } = DEFAULT_VALUES;

    let sidebarContentHeight = 0;
    if (sidebarContentIsOpen) {
      if (isMobile) {
        sidebarContentHeight = windowHeight() - DEFAULT_VALUES.navBarHeight;
      } else if (
        cameraDockNumCameras > 0
        && getCameraDockPosition() === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM
        && presentationIsOpen
        && !isMediaContentOff()
      ) {
        sidebarContentHeight = windowHeight() - dockHeight;
      } else {
        sidebarContentHeight = windowHeight();
      }
      sidebarContentHeight -= bannerAreaHeight();
    }
    return {
      height: sidebarContentHeight,
      minHeight: sidebarContentMinHeight,
      maxHeight: sidebarContentHeight,
    };
  };

  const calculatesCameraDockBounds = (
    sidebarNavWidth,
    calculatedSidebarContentWidth,
    mediaAreaBounds,
  ) => {
    const stoppedResizing = prevIsResizingRef.current && !cameraDockIsResizing;
    prevIsResizingRef.current = cameraDockIsResizing;

    const { baseCameraDockBounds } = props;
    const sidebarSize = sidebarNavWidth + calculatedSidebarContentWidth;

    const baseBounds = baseCameraDockBounds(mediaAreaBounds, sidebarSize);

    // do not proceed if using values from LayoutEngine
    if (Object.keys(baseBounds).length > 0) {
      return baseBounds;
    }

    const {
      camerasMargin,
      cameraDockMinHeight,
      cameraDockMinWidth,
      phoneLandscapeCameraWidthPercentage,
      presentationToolbarMinWidth,
      sidebarContentMinHeight,
    } = DEFAULT_VALUES;

    const navBarHeight = calculatesNavbarHeight();

    const cameraDockBounds = {};

    let dockHeight = 0;
    let dockWidth = 0;

    const lastSize = Storage.getItem('webcamSize') || { width: 0, height: 0 };
    let { width: lastWidth, height: lastHeight } = lastSize;

    if (cameraDockIsDragging) cameraDockBounds.zIndex = 99;
    else cameraDockBounds.zIndex = 1;

    const cameraPosition = getCameraDockPosition();
    const isEnforcedSideBySide = isSideBySideCamerasEnforced();

    const isCameraTop = cameraPosition === CAMERADOCK_POSITION.CONTENT_TOP;
    const isCameraBottom = cameraPosition === CAMERADOCK_POSITION.CONTENT_BOTTOM;
    const isCameraLeft = cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT;
    const isCameraRight = cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT;
    const isCameraSidebar = cameraPosition === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM;

    if (stoppedResizing) {
      const isCameraTopOrBottom = isCameraTop || isCameraBottom;

      Storage.setItem('webcamSize', {
        width: (isCameraTopOrBottom || isCameraSidebar)
          ? lastWidth
          : cameraDockWidth,
        height: isCameraTopOrBottom || isCameraSidebar ? cameraDockHeight : lastHeight,
      });

      const updatedLastSize = Storage.getItem('webcamSize');
      lastWidth = updatedLastSize.width;
      lastHeight = updatedLastSize.height;
    }

    if (isCameraTop || isCameraBottom) {
      if ((lastHeight === 0 && !cameraDockIsResizing) || (isCameraTop && isMobile)) {
        dockHeight = min(
          max(mediaAreaBounds.height * 0.2, cameraDockMinHeight),
          mediaAreaBounds.height - cameraDockMinHeight,
        );
      } else {
        const height = cameraDockIsResizing ? cameraDockHeight : lastHeight;
        dockHeight = min(
          max(height, cameraDockMinHeight),
          mediaAreaBounds.height - cameraDockMinHeight,
        );
      }

      cameraDockBounds.top = navBarHeight + bannerAreaHeight();
      cameraDockBounds.left = mediaAreaBounds.left;
      cameraDockBounds.right = isRTL ? sidebarSize : null;
      cameraDockBounds.minWidth = mediaAreaBounds.width;
      cameraDockBounds.width = mediaAreaBounds.width;
      cameraDockBounds.maxWidth = mediaAreaBounds.width;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = dockHeight;
      cameraDockBounds.maxHeight = mediaAreaBounds.height * 0.8;

      if (isCameraBottom) {
        cameraDockBounds.top += mediaAreaBounds.height - dockHeight;
      }

      return cameraDockBounds;
    }

    if (isCameraLeft || isCameraRight) {
      if (isEnforcedSideBySide) {
        // max() on the upper bound too: it inverts below twice cameraDockMinWidth.
        dockWidth = min(
          max(
            mediaAreaBounds.width * phoneLandscapeCameraWidthPercentage,
            cameraDockMinWidth,
          ),
          max(mediaAreaBounds.width - cameraDockMinWidth, cameraDockMinWidth),
        );
      } else if (lastWidth === 0 && !cameraDockIsResizing) {
        dockWidth = min(
          max(mediaAreaBounds.width * 0.2, cameraDockMinWidth),
          mediaAreaBounds.width - cameraDockMinWidth,
        );
      } else {
        const width = cameraDockIsResizing ? cameraDockWidth : lastWidth;
        dockWidth = min(
          max(width, cameraDockMinWidth),
          mediaAreaBounds.width - cameraDockMinWidth,
        );
      }

      cameraDockBounds.top = navBarHeight + bannerAreaHeight();
      cameraDockBounds.minWidth = isEnforcedSideBySide ? dockWidth : cameraDockMinWidth;
      cameraDockBounds.width = dockWidth;
      cameraDockBounds.maxWidth = isEnforcedSideBySide
        ? dockWidth
        : mediaAreaBounds.width * 0.8;
      cameraDockBounds.presenterMaxWidth = isEnforcedSideBySide
        ? dockWidth
        : mediaAreaBounds.width - presentationToolbarMinWidth - camerasMargin;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = mediaAreaBounds.height;
      cameraDockBounds.maxHeight = mediaAreaBounds.height;
      // button size in vertical position
      cameraDockBounds.height -= 20;

      if (isCameraRight) {
        const sizeValue = mediaAreaBounds.left + mediaAreaBounds.width - dockWidth;
        cameraDockBounds.left = isRTL ? 0 : sizeValue;
        cameraDockBounds.right = isRTL ? sizeValue + sidebarSize : null;
      } else if (isCameraLeft) {
        cameraDockBounds.left = mediaAreaBounds.left;
        cameraDockBounds.right = isRTL ? sidebarSize : null;
      }

      return cameraDockBounds;
    }

    if (isCameraSidebar) {
      if (lastHeight === 0 && !cameraDockIsResizing) {
        dockHeight = min(
          max(windowHeight() * 0.2, cameraDockMinHeight),
          windowHeight() - cameraDockMinHeight,
        );
      } else {
        const height = cameraDockIsResizing ? cameraDockHeight : lastHeight;
        dockHeight = min(
          max(height, cameraDockMinHeight),
          windowHeight() - cameraDockMinHeight,
        );
      }
      const sidebarContentVerticalMargin = windowHeight()
        * SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT;
      const sidebarContentMarginToMedia = windowWidth()
        * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;

      cameraDockBounds.top = windowHeight() - dockHeight
        - bannerAreaHeight() - sidebarContentVerticalMargin + sidebarContentMarginToMedia;
      cameraDockBounds.left = !isRTL ? sidebarNavWidth : 0;
      cameraDockBounds.right = isRTL ? sidebarNavWidth : 0;
      cameraDockBounds.minWidth = calculatedSidebarContentWidth;
      cameraDockBounds.width = calculatedSidebarContentWidth;
      cameraDockBounds.maxWidth = calculatedSidebarContentWidth;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = dockHeight;
      cameraDockBounds.maxHeight = windowHeight() - bannerAreaHeight() - sidebarContentMinHeight;
    }
    return cameraDockBounds;
  };

  const calculatesMediaBounds = (
    sidebarNavWidth,
    calculatedSidebarContentWidth,
    cameraDockBounds,
  ) => {
    const { height: actionBarHeight } = calculatesActionbarHeight();
    const navBarHeight = calculatesNavbarHeight();
    const mediaAreaHeight = windowHeight()
      - (navBarHeight + actionBarHeight + bannerAreaHeight());
    const sidebarContentMarginToMedia = windowWidth()
      * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
    const mediaAreaWidth = windowWidth()
      - (sidebarNavWidth + calculatedSidebarContentWidth)
      - (isMobile ? 0 : sidebarContentMarginToMedia);
    const mediaBounds = {};
    const { camerasMargin } = DEFAULT_VALUES;

    const hasPresentation = (isPresentationEnabled && presentationSlidesLength !== 0)
      || presentationIsOpen;
    const isGeneralMediaOff = !hasPresentation && !externalVideoHasExternalVideo
      && !screenShareHasScreenShare && !sharedNotesIsPinned && !genericContentId;

    if (!presentationIsOpen || isGeneralMediaOff) {
      mediaBounds.width = 0;
      mediaBounds.height = 0;
      mediaBounds.top = 0;
      mediaBounds.left = !isRTL ? 0 : null;
      mediaBounds.right = isRTL ? 0 : null;
      mediaBounds.zIndex = 0;
      return mediaBounds;
    }

    if (
      fullscreenElement === 'Presentation'
      || fullscreenElement === 'Screenshare'
      || fullscreenElement === 'ExternalVideo'
      || fullscreenElement === 'GenericContent'
    ) {
      mediaBounds.width = windowWidth();
      mediaBounds.height = windowHeight();
      mediaBounds.top = 0;
      mediaBounds.left = !isRTL ? 0 : null;
      mediaBounds.right = isRTL ? 0 : null;
      mediaBounds.zIndex = 99;
      return mediaBounds;
    }

    const sidebarSize = sidebarNavWidth + calculatedSidebarContentWidth;

    if (cameraDockNumCameras > 0 && !cameraDockIsDragging) {
      switch (getCameraDockPosition()) {
        case CAMERADOCK_POSITION.CONTENT_TOP: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight - cameraDockBounds.height - camerasMargin;
          mediaBounds.top = navBarHeight + cameraDockBounds.height
            + camerasMargin + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_RIGHT: {
          // Clamped: a negative width reads as open to the `width === 0` guards.
          mediaBounds.width = max(mediaAreaWidth - cameraDockBounds.width - camerasMargin * 2, 0);
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize - camerasMargin * 2 : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_BOTTOM: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight - cameraDockBounds.height - camerasMargin;
          mediaBounds.top = navBarHeight - camerasMargin + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_LEFT: {
          mediaBounds.width = max(mediaAreaWidth - cameraDockBounds.width - camerasMargin * 2, 0);
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          const sizeValue = sidebarNavWidth + calculatedSidebarContentWidth
            + mediaAreaWidth - mediaBounds.width;
          mediaBounds.left = !isRTL ? sizeValue : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        default: {
          console.log('presentation - camera default');
        }
      }
      mediaBounds.zIndex = 1;
    } else {
      mediaBounds.width = mediaAreaWidth;
      mediaBounds.height = mediaAreaHeight;
      mediaBounds.top = navBarHeight + bannerAreaHeight();
      mediaBounds.left = !isRTL ? sidebarSize : null;
      mediaBounds.right = isRTL ? sidebarSize : null;
    }

    return mediaBounds;
  };

  const calculatesLayout = () => {
    const {
      calculatesNavbarBounds,
      calculatesActionbarBounds,
      calculatesSidebarNavWidth,
      calculatesSidebarNavHeight,
      calculatesSidebarNavBounds,
      calculatesSidebarContentWidth,
      calculatesSidebarContentBounds,
      calculatesMediaAreaBounds,
      isTablet,
    } = props;
    const cameraPosition = getCameraDockPosition();
    const isCameraDockLocked = isSideBySideCamerasEnforced();
    const { camerasMargin, captionsMargin } = DEFAULT_VALUES;

    const sidebarNavWidth = calculatesSidebarNavWidth();
    const sidebarNavHeight = calculatesSidebarNavHeight();
    const calculatedSidebarContentWidth = calculatesSidebarContentWidth();
    const sidebarContentAuxiliaryWidth = calculatesSidebarContentWidth(true);
    const sidebarNavBounds = calculatesSidebarNavBounds();
    const sidebarContentBounds = calculatesSidebarContentBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
    );
    const mediaAreaBounds = calculatesMediaAreaBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      calculatedSidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
    );
    const navbarBounds = calculatesNavbarBounds(mediaAreaBounds);
    const actionbarBounds = calculatesActionbarBounds(mediaAreaBounds);
    const cameraDockBounds = calculatesCameraDockBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      calculatedSidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      mediaAreaBounds,
    );
    const dropZoneAreas = calculatesDropAreas(
      sidebarNavWidth.horizontalSpaceOccupied,
      calculatedSidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      cameraDockBounds,
    );
    const {
      height: sidebarContentHeight,
      minHeight: sidebarContentMinHeight,
      maxHeight: sidebarContentMaxHeight,
    } = calculatesSidebarContentHeight(cameraDockBounds.height);
    const mediaBounds = calculatesMediaBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      calculatedSidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      cameraDockBounds,
    );
    const sidebarSize = calculatedSidebarContentWidth.width
      + sidebarContentAuxiliaryWidth.width + sidebarNavWidth.width;

    let horizontalCameraDiff = 0;

    if (cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT) {
      horizontalCameraDiff = cameraDockBounds.width + camerasMargin * 2;
    }

    if (cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT) {
      horizontalCameraDiff = camerasMargin * 2;
    }

    layoutContextDispatch({
      type: ACTIONS.SET_NAVBAR_OUTPUT,
      value: {
        display: navBarHasNavBar,
        width: navbarBounds.width,
        height: navbarBounds.height,
        top: navbarBounds.top,
        left: navbarBounds.left,
        tabOrder: DEFAULT_VALUES.navBarTabOrder,
        zIndex: navbarBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_ACTIONBAR_OUTPUT,
      value: {
        display: actionBarHasActionBar,
        width: actionbarBounds.width,
        height: actionbarBounds.height,
        innerHeight: actionbarBounds.innerHeight,
        top: actionbarBounds.top,
        left: actionbarBounds.left,
        padding: actionbarBounds.padding,
        tabOrder: DEFAULT_VALUES.actionBarTabOrder,
        zIndex: actionbarBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_CAPTIONS_OUTPUT,
      value: {
        left: !isRTL ? sidebarSize + captionsMargin : null,
        right: isRTL ? sidebarSize + captionsMargin : null,
        maxWidth: mediaAreaBounds.width - captionsMargin * 2,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_OUTPUT,
      value: {
        display: sidebarNavigationIsOpen,
        minWidth: sidebarNavWidth.minWidth,
        width: sidebarNavWidth.width,
        maxWidth: sidebarNavWidth.maxWidth,
        height: sidebarNavHeight,
        top: sidebarNavBounds.top,
        left: sidebarNavBounds.left,
        right: sidebarNavBounds.right,
        tabOrder: DEFAULT_VALUES.sidebarNavTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarNavBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_OUTPUT,
      value: {
        display: sidebarContentIsOpen,
        minWidth: calculatedSidebarContentWidth.minWidth,
        width: calculatedSidebarContentWidth.width,
        maxWidth: calculatedSidebarContentWidth.maxWidth,
        height: sidebarContentHeight,
        minHeight: sidebarContentMinHeight,
        maxHeight: sidebarContentMaxHeight,
        top: sidebarContentBounds.top,
        left: sidebarContentBounds.left,
        right: sidebarContentBounds.right,
        tabOrder: DEFAULT_VALUES.sidebarContentTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarContentBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_AUXILIARY_OUTPUT,
      value: {
        display: sidebarContentAuxiliaryIsOpen,
        minWidth: sidebarContentAuxiliaryWidth.minWidth,
        width: sidebarContentAuxiliaryWidth.width,
        maxWidth: sidebarContentAuxiliaryWidth.maxWidth,
        height: sidebarContentHeight,
        minHeight: sidebarContentMinHeight,
        maxHeight: sidebarContentMaxHeight,
        top: sidebarContentBounds.top,
        left: !isRTL ? sidebarContentBounds.left
          + calculatedSidebarContentWidth.width : null,
        right: isRTL ? sidebarContentBounds.right
          + calculatedSidebarContentWidth.width : null,
        tabOrder: DEFAULT_VALUES.sidebarContentTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarContentBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_RESIZABLE_EDGE,
      value: {
        top: false,
        right: !isRTL,
        bottom: false,
        left: isRTL,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_AUXILIARY_RESIZABLE_EDGE,
      value: {
        top: false,
        right: !isRTL,
        bottom: false,
        left: isRTL,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_MEDIA_AREA_SIZE,
      value: {
        width: mediaAreaBounds.width,
        height: mediaAreaBounds.height,
      },
    });

    const isMediaOpen = mediaBounds?.width > 0 && mediaBounds?.height > 0;
    const canResizeCameraDock = isMediaOpen && !isCameraDockLocked;

    layoutContextDispatch({
      type: ACTIONS.SET_CAMERA_DOCK_OUTPUT,
      value: {
        display: cameraDockNumCameras > 0 || !presentationIsOpen,
        position: cameraPosition,
        minWidth: cameraDockBounds.minWidth,
        width: cameraDockBounds.width,
        maxWidth: cameraDockBounds.maxWidth,
        presenterMaxWidth: cameraDockBounds.presenterMaxWidth,
        minHeight: cameraDockBounds.minHeight,
        height: cameraDockBounds.height,
        maxHeight: cameraDockBounds.maxHeight,
        top: cameraDockBounds.top,
        left: cameraDockBounds.left,
        right: cameraDockBounds.right,
        tabOrder: 4,
        isDraggable: !isMobile && !isTablet && !isCameraDockLocked && isMediaOpen,
        resizableEdge: {
          top:
          canResizeCameraDock
            && (cameraDockPosition === CAMERADOCK_POSITION.CONTENT_BOTTOM
            || (cameraDockPosition === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM
            && sidebarContentIsOpen)),
          right:
            canResizeCameraDock
            && ((!isRTL && cameraDockPosition === CAMERADOCK_POSITION.CONTENT_LEFT)
            || (isRTL && cameraDockPosition === CAMERADOCK_POSITION.CONTENT_RIGHT)),
          bottom: canResizeCameraDock
            && cameraDockPosition === CAMERADOCK_POSITION.CONTENT_TOP,
          left:
          canResizeCameraDock
            && ((!isRTL && cameraDockPosition === CAMERADOCK_POSITION.CONTENT_RIGHT)
            || (isRTL && cameraDockPosition === CAMERADOCK_POSITION.CONTENT_LEFT)),
        },
        zIndex: cameraDockBounds.zIndex,
        isLocalOnly: isPhoneLandscape({ width: browserWidth, height: browserHeight }),
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_DROP_AREAS,
      value: dropZoneAreas,
    });

    layoutContextDispatch({
      type: ACTIONS.SET_PRESENTATION_OUTPUT,
      value: {
        display: presentationIsOpen,
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right + horizontalCameraDiff : null,
        tabOrder: DEFAULT_VALUES.presentationTabOrder,
        isResizable: false,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SCREEN_SHARE_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right + horizontalCameraDiff : null,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_EXTERNAL_VIDEO_OUTPUT,
      value: {
        display: externalVideoHasExternalVideo,
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right + horizontalCameraDiff : null,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_GENERIC_CONTENT_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right + horizontalCameraDiff : null,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SHARED_NOTES_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right + horizontalCameraDiff : null,
      },
    });
  };

  useEffect(() => {
    if (deviceType === null) return;
    if (deviceType !== initializedDeviceType) {
      init();
      setInitializedDeviceType(deviceType);
    }
  }, [deviceType, initializedDeviceType]);

  useEffect(() => {
    if (deviceType === null || initializedDeviceType !== deviceType) return;
    calculatesLayout();
  }, [
    initializedDeviceType,
    deviceType,
    isRTL,
    fontSize,
    isPresentationEnabled,
    fullscreenElement,
    fullscreenGroup,
    browserWidth,
    browserHeight,
    bannerBarHasBanner,
    notificationsBarHasNotification,
    navBarHasNavBar,
    navBarHideTopRow,
    actionBarHasActionBar,
    sidebarNavigationIsOpen,
    sidebarContentIsOpen,
    sidebarContentWidthInput,
    sidebarContentAuxiliaryIsOpen,
    sidebarContentAuxiliaryWidthInput,
    presentationIsOpen,
    presentationSlidesLength,
    externalVideoHasExternalVideo,
    genericContentId,
    screenShareHasScreenShare,
    sharedNotesIsPinned,
    cameraDockNumCameras,
    cameraDockPosition,
    cameraDockIsDragging,
    cameraDockIsResizing,
    cameraDockWidth,
    cameraDockHeight,
  ]);

  return null;
};

export default React.memo(UnifiedLayout);
