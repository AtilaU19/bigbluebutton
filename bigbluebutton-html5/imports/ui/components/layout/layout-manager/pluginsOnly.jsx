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
  CAMERADOCK_POSITION,
} from '/imports/ui/components/layout/enums';
import { defaultsDeep } from '/imports/utils/array-utils';
import Session from '/imports/ui/services/storage/in-memory';

const PluginsOnlyLayout = (props) => {
  const { isMobile } = props;

  const deviceType = layoutSelect((i) => i.deviceType);
  const isRTL = layoutSelect((i) => i.isRTL);
  const fontSize = layoutSelect((i) => i.fontSize);

  const browserWidth = layoutSelectInput((i) => i.browser.width);
  const browserHeight = layoutSelectInput((i) => i.browser.height);
  const bannerBarHasBanner = layoutSelectInput((i) => i.bannerBar.hasBanner);
  const notificationsBarHasNotification = layoutSelectInput(
    (i) => i.notificationsBar.hasNotification,
  );
  const presentationIsOpen = layoutSelectInput((i) => i.presentation.isOpen);
  const sidebarNavigationIsOpen = layoutSelectInput((i) => i.sidebarNavigation.isOpen);
  const sidebarContentIsOpen = layoutSelectInput((i) => i.sidebarContent.isOpen);
  const cameraDockNumCameras = layoutSelectInput((i) => i.cameraDock.numCameras);
  const actionBarHasActionBar = layoutSelectInput((i) => i.actionBar.hasActionBar);
  const navBarHasNavBar = layoutSelectInput((i) => i.navBar.hasNavBar);
  const navBarHideTopRow = layoutSelectOutput((i) => i.navBar.hideTopRow);
  const layoutContextDispatch = layoutDispatch();

  const [initializedDeviceType, setInitializedDeviceType] = useState(null);

  const calculatesSidebarNavHeight = () => 0;

  const calculatesSidebarContentHeight = () => ({
    height: 0,
    minHeight: 0,
    maxHeight: 0,
  });

  const calculatesSidebarContentWidth = () => ({
    minWidth: 0,
    width: 0,
    maxWidth: 0,
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

  const calculatesMediaBounds = () => ({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  });

  const calculatesLayout = () => {
    const {
      calculatesNavbarBounds,
      calculatesActionbarBounds,
      calculatesSidebarNavWidth,
      calculatesSidebarNavBounds,
      calculatesSidebarContentBounds,
      isTablet,
    } = props;
    const { captionsMargin } = DEFAULT_VALUES;

    const sidebarNavWidth = calculatesSidebarNavWidth();
    const sidebarContentWidth = calculatesSidebarContentWidth();
    const sidebarNavBounds = calculatesSidebarNavBounds();
    const sidebarContentBounds = calculatesSidebarContentBounds(sidebarNavWidth.width);
    const mediaAreaBounds = {
      width: 0,
      height: 0,
      left: 0,
    };
    const navbarBounds = calculatesNavbarBounds(mediaAreaBounds);
    const actionbarBounds = calculatesActionbarBounds(mediaAreaBounds);
    const sidebarNavHeight = calculatesSidebarNavHeight();
    const sidebarSize = sidebarContentWidth.width + sidebarNavWidth.width;
    const mediaBounds = calculatesMediaBounds();
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
        maxWidth: mediaAreaBounds.width,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_OUTPUT,
      value: {
        display: false,
        minWidth: sidebarNavWidth.minWidth,
        width: sidebarNavWidth.width,
        maxWidth: sidebarNavWidth.maxWidth,
        height: sidebarNavHeight,
        top: navbarBounds.height,
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
        minWidth: sidebarContentWidth.minWidth,
        width: sidebarContentWidth.width,
        maxWidth: sidebarContentWidth.maxWidth,
        minHeight: sidebarContentHeight.minHeight,
        height: sidebarContentHeight.height,
        maxHeight: sidebarContentHeight.maxHeight,
        top: navbarBounds.height,
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
        bottom: cameraDockNumCameras > 0,
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
        display: false,
        width: 0,
        height: 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: isRTL ? mediaBounds.right : null,
        tabOrder: DEFAULT_VALUES.presentationTabOrder,
        isResizable: false,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SCREEN_SHARE_OUTPUT,
      value: {
        display: false,
        width: 0,
        height: 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_EXTERNAL_VIDEO_OUTPUT,
      value: {
        display: false,
        width: 0,
        height: 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_GENERIC_CONTENT_OUTPUT,
      value: {
        display: false,
        width: 0,
        height: 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SHARED_NOTES_OUTPUT,
      value: {
        display: false,
        width: presentationIsOpen ? mediaBounds.width : 0,
        height: presentationIsOpen ? mediaBounds.height : 0,
        top: mediaBounds.top,
        left: mediaBounds.left,
        right: mediaBounds.right,
      },
    });
  };

  const init = () => {
    const hasLayoutEngineLoadedOnce = Session.getItem('hasLayoutEngineLoadedOnce');
    layoutContextDispatch({
      type: ACTIONS.SET_LAYOUT_INPUT,
      value: (prevInput) => {
        const { presentation } = prevInput;
        return defaultsDeep(
          {
            sidebarNavigation: {
              isOpen: prevInput.sidebarContent.isOpen,
            },
            sidebarContent: {
              isOpen: false,
              sidebarContentPanel: prevInput.sidebarContent.sidebarContentPanel,
            },
            presentation: {
              isOpen: false,
              slidesLength: presentation.slidesLength,
              currentSlide: {
                ...presentation.currentSlide,
              },
              width: 0,
              height: 0,
            },
            cameraDock: {
              position: CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM,
              numCameras: prevInput.cameraDock.numCameras,
            },
            externalVideo: {
              hasExternalVideo: false,
              width: 0,
              height: 0,
            },
            genericMainContent: {
              genericContentId: undefined,
              width: 0,
              height: 0,
            },
            screenShare: {
              hasScreenShare: false,
              width: 0,
              height: 0,
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
    browserWidth,
    browserHeight,
    bannerBarHasBanner,
    notificationsBarHasNotification,
    navBarHasNavBar,
    navBarHideTopRow,
    actionBarHasActionBar,
    sidebarNavigationIsOpen,
    sidebarContentIsOpen,
    presentationIsOpen,
    cameraDockNumCameras,
  ]);

  return null;
};

export default React.memo(PluginsOnlyLayout);
