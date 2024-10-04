import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { USER_AGGREGATE_COUNT_SUBSCRIPTION } from '/imports/ui/core/graphql/queries/users';
import UserTitleOptionsContainer from './user-options-dropdown/component';
import Styled from './styles';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import GroupIcon from '@mui/icons-material/GroupRounded';
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
    padding: '0.6rem 0px 0.6rem 0.6rem',
    margin: '2px 0px 2px 2px',
    justifyContent: sidebarNavigationWidth < 115 ? 'center' : 'flex-start',
  };

  return (
    <div style={{ display: 'flex', margin: '0px 0px 1px 0.45rem', }}>
      <div style={containerStyle}>
        {sidebarNavigationWidth >= 115 && (
          <>
            <GroupIcon fontSize="large" style={{ marginRight: '0.3rem' }} />
            <Styled.SmallTitle style={{ flex: '0 1 auto', maxWidth: '120px', fontSize: '0.8rem' }}>
              {intl.formatMessage(messages.usersTitle)}
              <span
                data-test-users-count={count}
                data-test-users-with-audio-count={countWithAudio}
                style={{ marginLeft: '0.2rem' }}
              >
                {` (${count.toLocaleString('en-US', { notation: 'standard' })})`}
              </span>
            </Styled.SmallTitle>
          </>
        )}
        <UserTitleOptionsContainer 
        />
      </div>
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
