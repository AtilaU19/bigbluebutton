import data from '@emoji-mart/data';
import { init } from 'emoji-mart';
import useMeeting from '../../core/hooks/useMeeting';
import Storage from '/imports/ui/services/storage/session';

const CUSTOM_LOGO_URL_KEY = 'CustomLogoUrl';

const CUSTOM_DARK_LOGO_URL_KEY = 'CustomDarkLogoUrl';

const equalURLs = () => (
  Storage.getItem(CUSTOM_LOGO_URL_KEY) === Storage.getItem(CUSTOM_DARK_LOGO_URL_KEY)
);

export function useMeetingIsBreakout() {
  const { data: meeting } = useMeeting((m) => ({
    isBreakout: m.isBreakout,
  }));

  return meeting && meeting.isBreakout;
}

export const isDarkThemeEnabled = () => window.meetingClientSettings.public.app.darkTheme.enabled;

export const initializeEmojiData = () => {
  const DISABLE_EMOJIS = window.meetingClientSettings.public.chat.disableEmojis;
  const emojis = Object.values(data.emojis);
  const allowedEmojis = {};

  // We manually filter it here because there's a bug in the Picker component.
  // See: https://github.com/missive/emoji-mart/issues/810
  const filteredEmojis = emojis.filter((e) => !DISABLE_EMOJIS.includes(e.id));

  filteredEmojis.forEach((e) => {
    allowedEmojis[e.id] = e;
  });

  const filteredData = {
    ...data,
    emojis: allowedEmojis,
  };

  init({ data: filteredData });
};

export default {
  isDarkThemeEnabled,
  useMeetingIsBreakout,
  initializeEmojiData,
};
