import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { USER_AGGREGATE_COUNT_SUBSCRIPTION } from '/imports/ui/core/graphql/queries/users';
import UserTitleOptionsContainer from './user-options-dropdown/component';
import Styled from './styles';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { USER_WITH_AUDIO_AGGREGATE_COUNT_SUBSCRIPTION } from './queries';

interface UserTitleProps {
  count: number;
  countWithAudio: number;
  sidebarNavigationWidth: number;
}

const messages = defineMessages({
  usersTitle: {
    id: 'app.userList.usersTitle',
    description: 'Title for the Header',
  },
});

const UserTitle: React.FC<UserTitleProps> = ({
  count,
  countWithAudio,
  sidebarNavigationWidth,
}) => {
  const intl = useIntl();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.6rem',
    marginTop: '.75rem',
    justifyContent: sidebarNavigationWidth < 115 ? 'center' : 'flex-start',
  };

  return (
    <div style={containerStyle} >
      {sidebarNavigationWidth >= 115 && (
        <Styled.SmallTitle>
          {intl.formatMessage(messages.usersTitle)}
          <span
            data-test-users-count={count}
            data-test-users-with-audio-count={countWithAudio}
          >
            {` (${count.toLocaleString('en-US', { notation: 'standard' })})`}
          </span>
        </Styled.SmallTitle>
      )}
      <UserTitleOptionsContainer />
    </div>
  );
};

const UserTitleContainer: React.FC<{ sidebarNavigationWidth: number }> = ({ sidebarNavigationWidth }) => {
  const getCountData = () => {
    const { data: countData } = useDeduplicatedSubscription(USER_AGGREGATE_COUNT_SUBSCRIPTION);
    const count = countData?.user_aggregate?.aggregate?.count || 0;
    return count;
  };

  const {
    data: audioUsersCountData,
  } = useDeduplicatedSubscription(USER_WITH_AUDIO_AGGREGATE_COUNT_SUBSCRIPTION);

  const countWithAudio = audioUsersCountData?.user_aggregate?.aggregate?.count || 0;
  return (
    <UserTitle
      count={getCountData() as number}
      countWithAudio={countWithAudio}
      sidebarNavigationWidth={sidebarNavigationWidth}
    />
  );
};

export default UserTitleContainer;
