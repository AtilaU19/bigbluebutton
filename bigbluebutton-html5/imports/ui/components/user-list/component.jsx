import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Styled from './styles';
import CustomLogo from './custom-logo/component';
import { PANELS, ACTIONS } from '../layout/enums';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UserContentContainer from './user-list-content/container';

const propTypes = {
  compact: PropTypes.bool,
  CustomLogoUrl: PropTypes.string,
  CustomDarkLogoUrl: PropTypes.string,
  DarkModeIsEnabled: PropTypes.bool,
  showBranding: PropTypes.bool.isRequired,
  sidebarNavigation: PropTypes.object.isRequired,
  sidebarContent: PropTypes.object.isRequired,
  layoutContextDispatch: PropTypes.func.isRequired,
};

const defaultProps = {
  compact: false,
  CustomLogoUrl: null,
  CustomDarkLogoUrl: null,
};

class UserList extends PureComponent {
  handleToggleUserList = () => {
    const {
      sidebarNavigation,
      sidebarContent,
      layoutContextDispatch,
    } = this.props;

    if (sidebarNavigation.isOpen) {
      if (sidebarContent.isOpen) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: false,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.NONE,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: '',
        });
      }

      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: false,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.NONE,
      });
    } else {
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: true,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.USERLIST,
      });
    }
  };

  render() {
    const {
      compact,
      CustomLogoUrl,
      CustomDarkLogoUrl,
      DarkModeIsEnabled,
      showBranding,
      sidebarNavigation,
      sidebarNavigationWidth
    } = this.props;
    const logoUrl = DarkModeIsEnabled ? CustomDarkLogoUrl : CustomLogoUrl;
    const isAlreadyClosed = (!sidebarNavigation.isOpen || sidebarNavigationWidth <= 115);

    return (
      <Styled.UserList data-test="userList">
        <Styled.Header>
          <IconButton onClick={this.handleToggleUserList}>
            {isAlreadyClosed ? <ArrowForwardIcon fontSize='35px' /> : <ArrowForwardBackIcon fontSize='35px'/>}
          </IconButton>
          {
            showBranding
            && !compact
            && logoUrl
              ? <CustomLogo CustomLogoUrl={logoUrl} /> : null
          }
        </Styled.Header>
        <UserContentContainer compact={compact}  sidebarNavigationWidth={sidebarNavigationWidth}/>
      </Styled.UserList>
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;

export default injectWbResizeEvent(UserList);
