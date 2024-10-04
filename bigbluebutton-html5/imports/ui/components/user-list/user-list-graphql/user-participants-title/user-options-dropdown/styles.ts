import styled from 'styled-components';

import Button from '/imports/ui/components/common/button/component';
import { fontSizeBase, fontSizeXXL } from '/imports/ui/stylesheets/styled-components/typography';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - as button comes from JS, we can't provide its props
const OptionsButton = styled(Button)`
  border-radius: 50%;
  display: block;
  padding: 0;
  margin: 0 0.25rem;
   width: ${(props) => (props.sidebarNavigationWidth < 115 ? '60px' : 'auto')};
  height: ${(props) => (props.sidebarNavigationWidth < 115 ? '60px' : 'auto')}; 
  font-size: ${(props) => (props.sidebarNavigationWidth < 115 ? fontSizeXXL : 'inherit')};

  span {
    padding: inherit;
  }

  i {
    font-size: ${fontSizeBase} !important;
  }
`;

export default {
  OptionsButton,
};
