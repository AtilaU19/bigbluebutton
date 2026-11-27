import { MutationFunction, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { SET_LAYOUT_PROPS, SET_SYNC_WITH_PRESENTER_LAYOUT } from './mutations';
import {
  Layout,
} from '../layoutTypes';
import { getPropagatedCameraDock } from './service';
import { SETTINGS } from '/imports/ui/services/settings/enums';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import { layoutDispatch, layoutSelect } from '../context';
import logger from '/imports/startup/client/logger';
import { isLayoutSupported } from '../utils';
import { LAYOUT_TYPE } from '../defaultValues';
import { ACTIONS } from '../enums';
import { updateSettings } from '../../settings/service';

const usePushLayoutUpdater = () => {
  const [setSyncWithPresenterLayout] = useMutation(SET_SYNC_WITH_PRESENTER_LAYOUT);

  const setPushLayout = useCallback((pushLayout: boolean) => {
    setSyncWithPresenterLayout({
      variables: {
        syncWithPresenterLayout: pushLayout,
      },
    }).catch((error) => {
      logger.error({
        logCode: 'set_sync_with_presenter_layout_failed',
        extraInfo: { error: error?.message },
      }, 'Failed to set sync with presenter layout.');
    });
  }, [setSyncWithPresenterLayout]);

  return setPushLayout;
};

const useMeetingLayoutUpdater = ({
  selectedLayout,
  presentationIsOpen,
  focusedCamera,
  cameraPosition,
  presentationVideoRate,
  isCameraDockPropagationSuppressed,
  meetingLayoutCameraPosition,
  meetingLayoutVideoRate,
}: {
  selectedLayout: string;
  presentationIsOpen: boolean;
  focusedCamera: string;
  cameraPosition: string;
  presentationVideoRate: number;
  isCameraDockPropagationSuppressed: boolean;
  meetingLayoutCameraPosition?: string;
  meetingLayoutVideoRate: number;
}) => {
  const [setMeetingLayoutProps] = useMutation(SET_LAYOUT_PROPS);

  const setMeetingLayout = useCallback((pushLayout: boolean) => {
    const cameraDock = getPropagatedCameraDock({
      isSuppressed: isCameraDockPropagationSuppressed,
      cameraPosition,
      presentationVideoRate,
      meetingCameraDock: {
        position: meetingLayoutCameraPosition,
        videoRate: meetingLayoutVideoRate,
      },
    });

    setMeetingLayoutProps({
      variables: {
        layout: selectedLayout,
        syncWithPresenterLayout: pushLayout,
        presentationIsOpen: Boolean(presentationIsOpen),
        focusedCamera: focusedCamera || 'none',
        ...cameraDock,
      },
    }).catch((error) => {
      logger.error({
        logCode: 'set_meeting_layout_props_failed',
        extraInfo: { error: error?.message },
      }, 'Failed to set meeting layout properties.');
    });
  }, [
    isCameraDockPropagationSuppressed,
    cameraPosition,
    presentationVideoRate,
    meetingLayoutCameraPosition,
    meetingLayoutVideoRate,
    selectedLayout,
    presentationIsOpen,
    focusedCamera,
    setMeetingLayoutProps,
  ]);

  return setMeetingLayout;
};

const useLayoutUpdater = () => {
  const layoutContextDispatch = layoutDispatch();
  const deviceType = layoutSelect((i: Layout) => i.deviceType);
  const layoutTypeFromContext = layoutSelect((i: Layout) => i.layoutType);
  const layoutFromSettings = useSettings(SETTINGS.LAYOUT) as {
    selectedLayout: typeof LAYOUT_TYPE[keyof typeof LAYOUT_TYPE],
  };
  const { selectedLayout: layoutTypeFromSettings } = layoutFromSettings;

  const applyLayoutOnly = useCallback((
    targetLayout: typeof LAYOUT_TYPE[keyof typeof LAYOUT_TYPE],
    settingsMutation: MutationFunction,
    message: string | null = null,
  ): typeof LAYOUT_TYPE[keyof typeof LAYOUT_TYPE] => {
    if (!deviceType) {
      logger.info({
        logCode: 'layout_invalid_device_type',
        extraInfo: { deviceType },
      }, `Trying to set layout type but device type is invalid: ${deviceType}. Skipping.`);
      return layoutTypeFromSettings;
    }

    const layoutSupported = isLayoutSupported(deviceType, targetLayout);
    const layoutToBeApplied = layoutSupported ? targetLayout : LAYOUT_TYPE.UNIFIED_LAYOUT;

    if (!layoutSupported) {
      logger.info({
        logCode: 'layout_type_not_supported_fallback',
        extraInfo: { deviceType, targetLayout, fallback: LAYOUT_TYPE.UNIFIED_LAYOUT },
      }, `Layout type ${targetLayout} is not supported on ${deviceType}.`
      + `Falling back to ${LAYOUT_TYPE.UNIFIED_LAYOUT}.`);
    }

    if (layoutTypeFromSettings === layoutTypeFromContext && layoutTypeFromSettings === layoutToBeApplied) {
      logger.debug({
        logCode: 'layout_type_no_change_needed',
        extraInfo: { layout: layoutToBeApplied },
      }, `Target layout ${layoutToBeApplied} is already active. No change needed.`);
      return layoutTypeFromSettings;
    }

    logger.debug({
      logCode: 'layout_type_applying',
      extraInfo: { layout: layoutToBeApplied },
    }, `Applying layout: ${layoutToBeApplied}`);

    layoutContextDispatch({ type: ACTIONS.SET_LAYOUT_TYPE, value: layoutToBeApplied });

    updateSettings({
      layout: {
        ...layoutFromSettings,
        selectedLayout: layoutToBeApplied,
      },
    }, message, settingsMutation);

    return layoutToBeApplied;
  }, [
    layoutContextDispatch,
    deviceType,
    layoutTypeFromContext,
    layoutTypeFromSettings,
    layoutFromSettings,
  ]);

  return applyLayoutOnly;
};

export {
  useMeetingLayoutUpdater,
  usePushLayoutUpdater,
  useLayoutUpdater,
};
