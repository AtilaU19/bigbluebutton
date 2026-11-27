import React, { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import {
  useIsPresentationEnabled,
  useIsExternalVideoEnabled,
  useIsRaiseHandEnabled,
  useIsPollingEnabled,
} from '/imports/ui/services/features';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import useSetSpeechOptions from '/imports/ui/components/audio/audio-graphql/hooks/useSetSpeechOptions';
import {
  layoutSelect,
  layoutSelectInput,
  layoutDispatch,
} from '/imports/ui/components/layout/context';
import {
  DispatcherFunction, Input, Layout,
} from '/imports/ui/components/layout/layoutTypes';
import { handleIsNotificationEnabled } from '/imports/ui/components/plugins-engine/ui-commands/notification/handler';
import { SETTINGS } from '/imports/ui/services/settings/enums';
import { LAYOUT_TYPE } from '/imports/ui/components/layout/enums';
import App from '/imports/ui/components/app/component';
import { PluginConfigFromGraphql } from '/imports/ui/components/plugins-engine/types';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { User } from '/imports/ui/Types/user';

interface AppContainerProps {
  pluginConfig: PluginConfigFromGraphql[] | undefined;
}

type MeetingProjectionArg = Parameters<NonNullable<Parameters<typeof useMeeting>[0]>>[0];

const projectCurrentUserForApp = (u: Partial<User>) => ({
  userId: u.userId,
  presenter: u.presenter,
});

const projectMeetingForApp = (m: MeetingProjectionArg) => ({
  componentsFlags: m.componentsFlags
    ? {
      isSharedNotesPinned: m.componentsFlags.isSharedNotesPinned,
      hasExternalVideo: m.componentsFlags.hasExternalVideo,
      hasCameraAsContent: m.componentsFlags.hasCameraAsContent,
      hasScreenshare: m.componentsFlags.hasScreenshare,
      hasScreenshareAsContent: m.componentsFlags.hasScreenshareAsContent,
    }
    : m.componentsFlags,
  isBreakout: m.isBreakout,
  name: m.name,
  meetingId: m.meetingId,
});

const SpeechOptionsSyncComponent: React.FC = () => {
  const { partialUtterances, minUtteranceLength } = useSettings(SETTINGS.TRANSCRIPTION) as {
    partialUtterances: boolean;
    minUtteranceLength: number;
  };
  const setSpeechOptions = useSetSpeechOptions();

  useEffect(() => {
    setSpeechOptions(partialUtterances, minUtteranceLength);
  }, [partialUtterances, minUtteranceLength, setSpeechOptions]);

  return null;
};

const SpeechOptionsSync = React.memo(SpeechOptionsSyncComponent);

const AppContainer: React.FC<AppContainerProps> = ({ pluginConfig }) => {
  const { data: currentUser } = useCurrentUser(projectCurrentUserForApp);

  const { data: currentMeeting } = useMeeting(projectMeetingForApp);

  const { viewScreenshare } = useSettings(SETTINGS.DATA_SAVING) as { viewScreenshare: boolean };
  const {
    darkTheme,
    hideActionsBar: settingsHideActionsBar,
    hideControls,
    hideNotifications,
  } = useSettings(SETTINGS.APPLICATION) as {
    darkTheme: boolean;
    hideActionsBar: boolean;
    hideControls: boolean;
    hideNotifications: boolean;
  };

  const layoutContextDispatch: DispatcherFunction = layoutDispatch();
  const genericMainContentId = layoutSelectInput(
    (i: Input) => i.genericMainContent.genericContentId,
  );
  const layoutHideNotificationToasts = layoutSelectInput(
    (i: Input) => i.notificationsBar.hideNotificationToasts,
  );
  const presentationIsOpen = layoutSelectInput((i: Input) => i.presentation.isOpen);
  const selectedLayout = layoutSelect((i: Layout) => i.layoutType);
  const { isNotificationEnabled } = useReactiveVar(handleIsNotificationEnabled);

  const isPollingEnabled: boolean = useIsPollingEnabled();
  const isExternalVideoEnabled: boolean = useIsExternalVideoEnabled();
  const isPresentationEnabled: boolean = useIsPresentationEnabled();
  const isRaiseHandEnabled: boolean = useIsRaiseHandEnabled();

  const presentationRestoreOnUpdate = getFromUserSettings(
    'bbb_force_restore_presentation_on_new_events',
    window.meetingClientSettings.public.presentation.restoreOnUpdate,
  );

  const { presenter = false } = currentUser || {};
  const hideActionsBar = settingsHideActionsBar || hideControls;
  const hideNotificationToasts = layoutHideNotificationToasts || hideNotifications;

  const isNonMediaLayout: boolean = [
    LAYOUT_TYPE.CAMERAS_ONLY,
    LAYOUT_TYPE.PARTICIPANTS_AND_CHAT_ONLY,
  ].includes(selectedLayout);

  const isSharedNotesPinnedFromGraphql: boolean = currentMeeting
    ?.componentsFlags?.isSharedNotesPinned || false;
  const isSharedNotesPinned: boolean = isSharedNotesPinnedFromGraphql && presentationIsOpen;

  const {
    hasExternalVideo = false,
    hasCameraAsContent = false,
    hasScreenshare = false,
    hasScreenshareAsContent = false,
  } = currentMeeting?.componentsFlags || {};
  const showScreenshare = Boolean(hasScreenshareAsContent || hasCameraAsContent);
  const shouldShowExternalVideo = isExternalVideoEnabled && hasExternalVideo;
  const shouldShowScreenshare = (viewScreenshare || presenter)
    && (hasScreenshare || hasCameraAsContent) && showScreenshare;
  const shouldShowPresentation = !shouldShowScreenshare && !isSharedNotesPinned
    && !shouldShowExternalVideo && (presentationIsOpen || presentationRestoreOnUpdate)
    && isPresentationEnabled;

  const {
    isBreakout = false,
    name = '',
    meetingId = '',
  } = currentMeeting || {};

  return (
    <>
      <SpeechOptionsSync />
      {currentUser?.userId ? (
        <App
          hideActionsBar={hideActionsBar}
          isNonMediaLayout={isNonMediaLayout}
          presentationIsOpen={presentationIsOpen}
          shouldShowExternalVideo={shouldShowExternalVideo}
          shouldShowScreenshare={shouldShowScreenshare}
          isSharedNotesPinned={isSharedNotesPinned}
          shouldShowPresentation={shouldShowPresentation}
          isNotificationEnabled={isNotificationEnabled}
          isRaiseHandEnabled={isRaiseHandEnabled}
          layoutContextDispatch={layoutContextDispatch}
          isPollingEnabled={isPollingEnabled}
          genericMainContentId={genericMainContentId}
          hideNotificationToasts={hideNotificationToasts}
          darkTheme={darkTheme}
          selectedLayout={selectedLayout}
          isBreakout={isBreakout}
          meetingName={name}
          meetingId={meetingId}
          pluginConfig={pluginConfig}
        />
      ) : null}
    </>
  );
};

export default AppContainer;
