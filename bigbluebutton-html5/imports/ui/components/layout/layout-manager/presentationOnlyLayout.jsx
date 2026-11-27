import React, { useEffect, useState } from 'react';
import {
  layoutDispatch,
  layoutSelect,
  layoutSelectInput,
  layoutSelectOutput,
} from '/imports/ui/components/layout/context';
import DEFAULT_VALUES from '/imports/ui/components/layout/defaultValues';
import { INITIAL_INPUT_STATE } from '/imports/ui/components/layout/initState';
import {
  ACTIONS,
  PANELS,
  CAMERADOCK_POSITION,
} from '/imports/ui/components/layout/enums';
import { defaultsDeep } from '/imports/utils/array-utils';
import Session from '/imports/ui/services/storage/in-memory';

const windowWidth = () => window.document.documentElement.clientWidth;
const windowHeight = () => window.document.documentElement.clientHeight;

const PresentationOnlyLayout = (props) => {
  const { bannerAreaHeight, calculatesNavbarHeight, isMobile } = props;

  const deviceType = layoutSelect((i) => i.deviceType);
  const isRTL = layoutSelect((i) => i.isRTL);
  const fullscreenElement = layoutSelect((i) => i.fullscreen.element);
  const fontSize = layoutSelect((i) => i.fontSize);

  const browserWidth = layoutSelectInput((i) => i.browser.width);
  const browserHeight = layoutSelectInput((i) => i.browser.height);
  const bannerBarHasBanner = layoutSelectInput((i) => i.bannerBar.hasBanner);
  const notificationsBarHasNotification = layoutSelectInput(
    (i) => i.notificationsBar.hasNotification,
  );
  const presentationIsOpen = layoutSelectInput((i) => i.presentation.isOpen);
  const externalVideoHasExternalVideo = layoutSelectInput(
    (i) => i.externalVideo.hasExternalVideo,
  );
  const sidebarNavigationIsOpen = layoutSelectInput((i) => i.sidebarNavigation.isOpen);
  const sidebarContentIsOpen = layoutSelectInput((i) => i.sidebarContent.isOpen);
  const sidebarContentWidthInput = layoutSelectInput((i) => i.sidebarContent.width);
  const actionBarHasActionBar = layoutSelectInput((i) => i.actionBar.hasActionBar);
  const navBarHasNavBar = layoutSelectInput((i) => i.navBar.hasNavBar);
  const navBarHideTopRow = layoutSelectOutput((i) => i.navBar.hideTopRow);
  const layoutContextDispatch = layoutDispatch();

  const [initializedDeviceType, setInitializedDeviceType] = useState(null);

  const calculatesMediaBounds = (mediaAreaBounds, sidebarSize) => {
    const mediaBounds = {};

    const navBarHeight = calculatesNavbarHeight();

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

    mediaBounds.height = mediaAreaBounds.height;
    mediaBounds.width = mediaAreaBounds.width;
    mediaBounds.top = navBarHeight + bannerAreaHeight();
    mediaBounds.left = !isRTL ? mediaAreaBounds.left : null;
    mediaBounds.right = isRTL ? sidebarSize : null;
    mediaBounds.zIndex = 1;

    return mediaBounds;
  };

  const calculatesSidebarContentHeight = () => ({
    height: 0,
    minHeight: 0,
    maxHeight: 0,
  });

  const calculatesCameraDockBounds = () => {
    const cameraDockBounds = {};

    cameraDockBounds.top = 0;
    cameraDockBounds.left = 0;
    cameraDockBounds.right = 0;
    cameraDockBounds.minWidth = 0;
    cameraDockBounds.width = 0;
    cameraDockBounds.maxWidth = 0;
    cameraDockBounds.minHeight = 0;
    cameraDockBounds.height = 0;
    cameraDockBounds.maxHeight = 0;

    return cameraDockBounds;
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
    const { captionsMargin } = DEFAULT_VALUES;

    const sidebarNavWidth = calculatesSidebarNavWidth();
    const sidebarNavHeight = calculatesSidebarNavHeight();
    const sidebarContentWidth = calculatesSidebarContentWidth();
    const sidebarNavBounds = calculatesSidebarNavBounds();
    const sidebarContentBounds = calculatesSidebarContentBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
    );
    const mediaAreaBounds = calculatesMediaAreaBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      sidebarContentWidth.width,
    );
    const navbarBounds = calculatesNavbarBounds(mediaAreaBounds);
    const actionbarBounds = calculatesActionbarBounds(mediaAreaBounds);
    const sidebarSize = sidebarContentWidth.width + sidebarNavWidth.horizontalSpaceOccupied;
    const mediaBounds = calculatesMediaBounds(mediaAreaBounds, sidebarSize);
    const sidebarContentHeight = calculatesSidebarContentHeight();
    const cameraDockBounds = calculatesCameraDockBounds();

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
        display: false,
        minWidth: 0,
        width: 0,
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
        display: false,
        minWidth: 0,
        width: 0,
        maxWidth: sidebarContentWidth.maxWidth,
        minHeight: sidebarContentHeight.minHeight,
        height: sidebarContentHeight.height,
        maxHeight: sidebarContentHeight.maxHeight,
        top: sidebarContentBounds.top,
        left: sidebarContentBounds.left,
        right: sidebarContentBounds.right,
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
      type: ACTIONS.SET_MEDIA_AREA_SIZE,
      value: {
        width: mediaAreaBounds.width,
        height: mediaAreaBounds.height,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_CAMERA_DOCK_OUTPUT,
      value: {
        display: false,
        position: CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM,
        minWidth: cameraDockBounds.minWidth,
        width: cameraDockBounds.width,
        maxWidth: cameraDockBounds.maxWidth,
        minHeight: cameraDockBounds.minHeight,
        height: cameraDockBounds.height,
        maxHeight: cameraDockBounds.maxHeight,
        top: cameraDockBounds.top,
        left: cameraDockBounds.left,
        right: cameraDockBounds.right,
        tabOrder: 4,
        isDraggable: false,
        resizableEdge: {
          top: false,
          right: false,
          bottom: false,
          left: false,
        },
        zIndex: cameraDockBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_PRESENTATION_OUTPUT,
      value: {
        display: true,
        width: windowWidth(),
        height: windowHeight(),
        top: 0,
        left: 0,
        right: 0,
        tabOrder: DEFAULT_VALUES.presentationTabOrder,
        isResizable: false,
        zIndex: 99,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SCREEN_SHARE_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: presentationIsOpen ? mediaBounds.height : 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_EXTERNAL_VIDEO_OUTPUT,
      value: {
        display: externalVideoHasExternalVideo,
        width: presentationIsOpen ? mediaBounds.width : 0,
        height: presentationIsOpen ? mediaBounds.height : 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_GENERIC_CONTENT_OUTPUT,
      value: {
        width: presentationIsOpen ? mediaBounds.width : 0,
        height: presentationIsOpen ? mediaBounds.height : 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SHARED_NOTES_OUTPUT,
      value: {
        width: presentationIsOpen ? mediaBounds.width : 0,
        height: presentationIsOpen ? mediaBounds.height : 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
      value: false,
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
      value: false,
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: PANELS.NONE,
    });
  };

  const init = () => {
    const hasLayoutEngineLoadedOnce = Session.getItem('hasLayoutEngineLoadedOnce');
    layoutContextDispatch({
      type: ACTIONS.SET_LAYOUT_INPUT,
      value: (prevInput) => {
        const {
          presentation, externalVideo, genericMainContent, screenShare,
        } = prevInput;
        return defaultsDeep(
          {
            sidebarNavigation: {
              isOpen: false,
              width: 0,
              height: 0,
            },
            sidebarContent: {
              isOpen: false,
              width: 0,
              height: 0,
            },
            presentation: {
              isOpen: true,
              slidesLength: presentation.slidesLength,
              currentSlide: {
                ...presentation.currentSlide,
              },
            },
            cameraDock: {
              numCameras: prevInput.cameraDock.numCameras,
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
          },
          hasLayoutEngineLoadedOnce ? prevInput : INITIAL_INPUT_STATE,
        );
      },
    });
    Session.setItem('layoutReady', true);
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
    fullscreenElement,
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
    presentationIsOpen,
    externalVideoHasExternalVideo,
  ]);

  return null;
};

export default React.memo(PresentationOnlyLayout);
