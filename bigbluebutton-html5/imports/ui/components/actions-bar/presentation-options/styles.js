import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';

const PresentationButton = styled(Button)`
  ${({ $isDarkThemeEnabled, theme }) => $isDarkThemeEnabled && `
    & > span {
      color: ${theme.colorIcon};
    }
  `}
`;

export default {
  PresentationButton,
};
