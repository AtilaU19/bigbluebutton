import React from 'react';
import { useMutation } from '@apollo/client';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import {
  useCurrentVideoPageIndex,
  useExitVideo,
  useInfo,
  useIsUserLocked,
  useLockUser,
  useStopVideo,
  useVideoStreams,
} from './hooks';
import { CAMERA_BROADCAST_START } from './mutations';
import VideoProvider from './component';
import VideoService from './service';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import { VideoItem } from './types';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import { SETTINGS } from '/imports/ui/services/settings/enums';

interface VideoProviderContainerGraphqlProps {
  focusedId: string;
  swapLayout: boolean;
  isGridEnabled: boolean;
  cameraDock: Output['cameraDock'];
  handleVideoFocus:(id: string) => void;
}

const VideoProviderContainerGraphql: React.FC<VideoProviderContainerGraphqlProps> = (props) => {
  const {
    cameraDock,
    focusedId,
    handleVideoFocus,
    isGridEnabled,
    swapLayout,
  } = props;
  const [cameraBroadcastStart] = useMutation(CAMERA_BROADCAST_START);

  const sendUserShareWebcam = (cameraId: string) => {
    return cameraBroadcastStart({ variables: { cameraId } });
  };

  const playStart = (cameraId: string) => {
    if (VideoService.isLocalStream(cameraId)) {
      sendUserShareWebcam(cameraId).then(() => {
        VideoService.joinedVideo();
      });
    }
  };

  const { data: currentMeeting } = useMeeting((m) => ({
    usersPolicies: m.usersPolicies,
  }));

  const { data: currentUser } = useCurrentUser((user) => ({
    locked: user.locked,
    userId: user.userId,
  }));

  const currentUserId = currentUser?.userId ?? '';
  // @ts-ignore Untyped object
  const { paginationEnabled } = useSettings(SETTINGS.APPLICATION);
  // @ts-ignore Untyped object
  const { viewParticipantsWebcams } = useSettings(SETTINGS.DATA_SAVING);
  // TODO: Remove/Replace this
  const isMeteorConnected = true;

  const {
    streams,
    gridUsers,
    totalNumberOfStreams,
    users,
  } = useVideoStreams(isGridEnabled, paginationEnabled, viewParticipantsWebcams);

  let usersVideo: VideoItem[] = streams;

  if (gridUsers.length > 0 && isGridEnabled) {
    usersVideo = usersVideo.concat(gridUsers);
  }

  if (
    currentMeeting?.usersPolicies?.webcamsOnlyForModerator
    && currentUser?.locked
  ) {
    usersVideo = usersVideo.filter(
      (uv) => (uv.type !== 'connecting' && uv.isModerator) || uv.userId === currentUserId,
    );
  }

  const isUserLocked = useIsUserLocked();
  const currentVideoPageIndex = useCurrentVideoPageIndex();
  const exitVideo = useExitVideo();
  const lockUser = useLockUser();
  const stopVideo = useStopVideo();
  const info = useInfo();

  if (!usersVideo.length && !isGridEnabled) return null;

  return (
    <VideoProvider
      cameraDock={cameraDock}
      focusedId={focusedId}
      handleVideoFocus={handleVideoFocus}
      isGridEnabled={isGridEnabled}
      isMeteorConnected={isMeteorConnected}
      swapLayout={swapLayout}
      currentUserId={currentUserId}
      paginationEnabled={paginationEnabled}
      viewParticipantsWebcams={viewParticipantsWebcams}
      totalNumberOfStreams={totalNumberOfStreams}
      isUserLocked={isUserLocked}
      currentVideoPageIndex={currentVideoPageIndex}
      streams={usersVideo}
      users={users}
      info={info}
      playStart={playStart}
      exitVideo={exitVideo}
      lockUser={lockUser}
      stopVideo={stopVideo}
    />
  );
};

export default VideoProviderContainerGraphql;
