import React from 'react';
import { useIntl } from 'react-intl';
import useUserStatusNotifications from '../hooks/useUserStatusNotifications';

interface UserStatusNotificationsObserverProps {
  meetingId: string;
}

const UserStatusNotificationsObserver: React.FC<UserStatusNotificationsObserverProps> = ({
  meetingId,
}) => {
  const intl = useIntl();

  useUserStatusNotifications(meetingId, intl);

  return null;
};

export default React.memo(UserStatusNotificationsObserver);
