import {
  CameraDockPropagationState, MeetingCameraDock, Output,
} from '../layoutTypes';

const equalDouble = (n1: number, n2: number) => {
  const precision = 0.005;

  return Math.abs(n1 - n2) < precision;
};

const calculatePresentationVideoRate = (cameraDockOutput: Output['cameraDock']) => {
  const {
    position,
    height,
    width,
  } = cameraDockOutput;
  const horizontalPosition = position === 'contentLeft' || position === 'contentRight';
  let presentationVideoRate;
  if (horizontalPosition) {
    presentationVideoRate = width / window.innerWidth;
  } else {
    presentationVideoRate = height / window.innerHeight;
  }
  const rate = parseFloat(presentationVideoRate.toFixed(2));
  return Number.isFinite(rate) ? Math.min(1, Math.max(0, rate)) : 0;
};

// No position fallback while suppressed: a changed position notifies everyone.
const getPropagatedCameraDock = ({
  isSuppressed,
  cameraPosition,
  presentationVideoRate,
  meetingCameraDock,
}: {
  isSuppressed: boolean;
  cameraPosition: string;
  presentationVideoRate: number;
  meetingCameraDock: MeetingCameraDock;
}) => (isSuppressed
  ? {
    isResizing: false,
    cameraPosition: meetingCameraDock.position ?? '',
    presentationVideoRate: meetingCameraDock.videoRate,
  }
  : {
    isResizing: false,
    cameraPosition: cameraPosition || 'contentTop',
    presentationVideoRate,
  });

const hasCameraDockChanged = (
  curr: CameraDockPropagationState,
  prev: Partial<CameraDockPropagationState>,
) => {
  if (curr.isCameraDockPropagationSuppressed) return false;

  const suppressionLifted = prev.isCameraDockPropagationSuppressed === true;
  if (suppressionLifted || curr.cameraPosition !== prev.cameraPosition) {
    return true;
  }

  if (curr.cameraIsResizing) return false;

  return prev.presentationVideoRate === undefined
    || !equalDouble(curr.presentationVideoRate, prev.presentationVideoRate);
};

export {
  calculatePresentationVideoRate,
  equalDouble,
  getPropagatedCameraDock,
  hasCameraDockChanged,
};

export default {
  calculatePresentationVideoRate,
  equalDouble,
  getPropagatedCameraDock,
  hasCameraDockChanged,
};
