import React, { useEffect, useRef } from 'react';
import { layoutDispatch, layoutSelect, layoutSelectInput } from './context';
import {
  ACTIONS, DEVICE_TYPE, PANELS,
} from './enums';
import {
  getDeviceType,
  getInitialSidebarContentPanel,
  resolveMeetingLayoutType,
} from './utils';
import { getSettingsSingletonInstance } from '/imports/ui/services/settings';
import { getInitialFontSize } from '/imports/ui/components/settings/service';
import { Input, Layout } from './layoutTypes';
import { throttle } from '/imports/utils/throttle';
import { SETTINGS } from '/imports/ui/services/settings/enums';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import getFromUserSettings from '/imports/ui/services/users-settings';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import MediaService from '/imports/ui/components/media/service';
import { useVideoStreamsCount } from '/imports/ui/components/video-provider/hooks';
import { useIsChatEnabled, useIsPresentationEnabled, useIsScreenSharingEnabled } from '/imports/ui/services/features';
import useUserChangedLocalSettings from '/imports/ui/services/settings/hooks/useUserChangedLocalSettings';
import Session from '/imports/ui/services/storage/in-memory';
import { STORAGES, useStorageKey } from '/imports/ui/services/storage/hooks';
import deviceInfo from '/imports/utils/deviceInfo';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import {
  CURRENT_PRESENTATION_PAGE_SUBSCRIPTION,
  CurrentPresentationPageSubscriptionResponse,
} from '/imports/ui/components/whiteboard/queries';

const ORIENTATION_MEDIA = '(orientation: portrait)';
const ORIENTATION_SETTLE_DELAY = 250;

type MeetingProjectionArg = Parameters<NonNullable<Parameters<typeof useMeeting>[0]>>[0];

const projectMeetingForObserver = (m: MeetingProjectionArg) => ({
  layout: m.layout ? { currentLayoutType: m.layout.currentLayoutType } : m.layout,
  componentsFlags: m.componentsFlags
    ? { hasExternalVideo: m.componentsFlags.hasExternalVideo }
    : m.componentsFlags,
  isBreakout: m.isBreakout,
});

const LayoutObserver: React.FC = () => {
  const layoutType = useRef<string | null>(null);
  const checkedUserSettings = useRef(false);
  const layoutContextDispatch = layoutDispatch();
  const deviceType = layoutSelect((i: Layout) => i.deviceType);
  const hasCameras = layoutSelectInput((i: Input) => (i.cameraDock.numCameras ?? 0) > 0);
  const sidebarContentIsOpen = layoutSelectInput((i: Input) => i.sidebarContent.isOpen);
  const presentationIsOpen = layoutSelectInput((i: Input) => i.presentation.isOpen);
  const isSharedNotesPinned = layoutSelectInput((i: Input) => i.sharedNotes.isPinned);

  const layoutReady = useStorageKey('layoutReady', STORAGES.IN_MEMORY) === true;
  const layoutSettings = useSettings(SETTINGS.LAYOUT) as { selectedLayout: string };
  const { selectedLayout } = layoutSettings;
  const {
    data: currentMeeting,
    loading: loadingMeeting,
  } = useMeeting(projectMeetingForObserver);

  const {
    data: presentationPageData,
    loading: loadingPresentationPageData,
  } = useDeduplicatedSubscription<CurrentPresentationPageSubscriptionResponse>(
    CURRENT_PRESENTATION_PAGE_SUBSCRIPTION,
  );

  const presentationPageArray = presentationPageData?.pres_page_curr ?? [];
  const currentPresentationPage = presentationPageArray[0];
  const currentPageId = currentPresentationPage?.pageId;
  const LAYOUT_CONFIG = window.meetingClientSettings.public.layout;
  const hidePresentationOnJoin = getFromUserSettings(
    'bbb_hide_presentation_on_join',
    LAYOUT_CONFIG.hidePresentationOnJoin,
  );

  // Track whether the presentation was closed by this effect (no page available),
  // so it can be re-opened when a page becomes available again (e.g. after a
  // pre-uploaded presentation finishes converting on slow CI machines).
  const closedDueToAbsentPresentation = useRef(false);

  useEffect(() => {
    if (hidePresentationOnJoin) return;
    // close presentation if there isn't any
    // case when the presentation has been manually removed in the media area drop up
    // or when defaultUploadedPresentation is null in bigbluebutton.properties
    if (loadingPresentationPageData || loadingMeeting) return;
    // presentationLastState is what the presentation-area pile restores to when a
    // screen share or external video ends; keep it in step with the automatic
    // close/reopen so that ending a share does not reopen an empty media area.
    if (!currentPageId && !currentMeeting?.isBreakout) {
      closedDueToAbsentPresentation.current = true;
      Session.setItem('presentationLastState', false);
      layoutContextDispatch({
        type: ACTIONS.SET_PRESENTATION_IS_OPEN,
        value: false,
      });
    } else if (currentPageId && closedDueToAbsentPresentation.current) {
      // restore presentation when a page becomes available after having been absent
      // (e.g. preUploadedPresentationOverrideDefault=true on a slow server)
      closedDueToAbsentPresentation.current = false;
      Session.setItem('presentationLastState', true);
      layoutContextDispatch({
        type: ACTIONS.SET_PRESENTATION_IS_OPEN,
        value: true,
      });
    }
  }, [currentPageId, loadingPresentationPageData, loadingMeeting, currentMeeting?.isBreakout]);

  const isThereWebcam = useVideoStreamsCount() > 0;
  const isScreenSharingEnabled = useIsScreenSharingEnabled();
  const isPresentationEnabled = useIsPresentationEnabled();
  const isChatEnabled = useIsChatEnabled();
  const initialSidebarContentPanel = getInitialSidebarContentPanel(isChatEnabled);
  // On phones the sidebar content covers the whole screen, so no panel is opened
  // automatically on join. Tablets keep the regular behavior.
  const shouldOpenChatPanel = initialSidebarContentPanel === PANELS.CHAT && !deviceInfo.isPhone;
  const shouldOpenUserListPanel = initialSidebarContentPanel === PANELS.USERLIST && !deviceInfo.isPhone;

  const setLocalSettings = useUserChangedLocalSettings();

  const { currentLayoutType } = currentMeeting?.layout || {};
  const meetingLayout = resolveMeetingLayoutType(currentLayoutType);
  const isSharingVideo = currentMeeting?.componentsFlags?.hasExternalVideo;

  // Not compared to `deviceType`: the resize listener captures it on mount, and the
  // reducer already bails out when the value has not changed.
  const setDeviceType = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_DEVICE_TYPE,
      value: getDeviceType(),
    });
  };

  // Single source of truth for ACTIONS.SET_BROWSER_SIZE across resize and orientation resamples.
  const setBrowserSize = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_BROWSER_SIZE,
      value: {
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight,
      },
    });
  };

  useEffect(() => {
    layoutContextDispatch({
      type: ACTIONS.SET_IS_RTL,
      value: document.documentElement.getAttribute('dir') === 'rtl',
    });

    const fontSize = getInitialFontSize();
    document.getElementsByTagName('html')[0].style.fontSize = fontSize;

    layoutContextDispatch({
      type: ACTIONS.SET_FONT_SIZE,
      value: parseInt(fontSize.slice(0, -2), 10),
    });

    layoutContextDispatch({
      type: ACTIONS.SET_HAS_ACTIONBAR,
      value: !(getFromUserSettings('bbb_hide_actions_bar', false)
        || getFromUserSettings('bbb_hide_controls', false)),
    });

    layoutContextDispatch({
      type: ACTIONS.SET_HIDE_NAVBAR_TOP_ROW,
      value: getFromUserSettings('bbb_hide_controls', false),
    });

    layoutContextDispatch({
      type: ACTIONS.SET_HAS_NAVBAR,
      value: !getFromUserSettings('bbb_hide_nav_bar', false),
    });

    layoutContextDispatch({
      type: ACTIONS.SET_HIDE_NOTIFICATION_TOASTS,
      value: getFromUserSettings('bbb_hide_notifications', false),
    });

    const syncWindowSize = () => {
      setDeviceType();
      setBrowserSize();
    };

    const handleWindowResize = throttle(
      syncWindowSize,
      50,
      { leading: true, trailing: true },
    );

    let orientationRafId: number | undefined;
    let orientationSettleTimeout: ReturnType<typeof setTimeout> | undefined;

    const handleOrientationChange = () => {
      syncWindowSize();
      if (orientationRafId !== undefined) window.cancelAnimationFrame(orientationRafId);
      orientationRafId = window.requestAnimationFrame(syncWindowSize);
      clearTimeout(orientationSettleTimeout);
      orientationSettleTimeout = setTimeout(syncWindowSize, ORIENTATION_SETTLE_DELAY);
    };

    const orientationQuery = window.matchMedia(ORIENTATION_MEDIA);
    // Unsupported on the very engines the deprecated event below covers, and a throw
    // here would take that fallback and the cleanup down with it.
    const supportsQueryListener = typeof orientationQuery.addEventListener === 'function';

    syncWindowSize();
    window.addEventListener('resize', handleWindowResize, false);
    window.addEventListener('orientationchange', handleOrientationChange, false);
    if (supportsQueryListener) {
      orientationQuery.addEventListener('change', handleOrientationChange);
    }

    return () => {
      handleWindowResize.cancel();
      if (orientationRafId !== undefined) window.cancelAnimationFrame(orientationRafId);
      clearTimeout(orientationSettleTimeout);
      window.removeEventListener('resize', handleWindowResize, false);
      window.removeEventListener('orientationchange', handleOrientationChange, false);
      if (supportsQueryListener) {
        orientationQuery.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  useEffect(() => {
    const CHAT_CONFIG = window.meetingClientSettings.public.chat;
    const PUBLIC_GROUP_CHAT_ID = CHAT_CONFIG.public_group_id;

    if (
      selectedLayout?.toLowerCase?.()?.includes?.('focus')
      && !sidebarContentIsOpen
      && deviceType !== DEVICE_TYPE.MOBILE && deviceType !== DEVICE_TYPE.TABLET_LANDSCAPE
      && hasCameras
      && presentationIsOpen
      && !getFromUserSettings('bbb_hide_sidebar_navigation', false)
    ) {
      setTimeout(() => {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: true,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: PUBLIC_GROUP_CHAT_ID,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.CHAT,
        });
      }, 0);
    }
  }, [selectedLayout]);

  useEffect(() => {
    if (
      layoutContextDispatch
      && (typeof meetingLayout !== 'undefined')
      && (layoutType.current !== meetingLayout)
      && isSharedNotesPinned
    ) {
      layoutType.current = meetingLayout;
      layoutContextDispatch({
        type: ACTIONS.SET_PRESENTATION_IS_OPEN,
        value: true,
      });
    }
  }, [meetingLayout, layoutContextDispatch, isSharedNotesPinned]);

  useEffect(() => {
    MediaService.buildLayoutWhenPresentationAreaIsDisabled(
      layoutContextDispatch,
      isSharingVideo,
      isSharedNotesPinned,
      isThereWebcam,
      isScreenSharingEnabled,
      isPresentationEnabled,
    );
  }, [
    layoutContextDispatch,
    isSharingVideo,
    isSharedNotesPinned,
    isThereWebcam,
    isScreenSharingEnabled,
    isPresentationEnabled,
    presentationIsOpen,
  ]);

  useEffect(() => {
    if (layoutReady && !checkedUserSettings.current) {
      const Settings = getSettingsSingletonInstance();
      Settings.save(setLocalSettings);

      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: true,
      });

      if (shouldOpenUserListPanel) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: true,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.USERLIST,
        });
      }

      if (shouldOpenChatPanel) {
        const PUBLIC_GROUP_CHAT_ID = window.meetingClientSettings.public.chat.public_group_id;

        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: true,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.CHAT,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: PUBLIC_GROUP_CHAT_ID,
        });
      }

      if (getFromUserSettings('bbb_hide_sidebar_navigation', false)) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
          value: false,
        });
      }

      checkedUserSettings.current = true;
    }
  }, [
    layoutReady,
    shouldOpenUserListPanel,
    shouldOpenChatPanel,
    layoutContextDispatch,
    setLocalSettings,
  ]);

  useEffect(() => {
    if (layoutReady) {
      if (shouldOpenChatPanel) {
        const PUBLIC_CHAT_ID = window.meetingClientSettings.public.chat.public_group_id;
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: true,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.CHAT,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: PUBLIC_CHAT_ID,
        });
      } else if (!shouldOpenUserListPanel) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: false,
        });
      }
    }
  }, [
    initialSidebarContentPanel,
    layoutReady,
    shouldOpenChatPanel,
    shouldOpenUserListPanel,
    layoutContextDispatch,
  ]);

  return null;
};

export default React.memo(LayoutObserver);
