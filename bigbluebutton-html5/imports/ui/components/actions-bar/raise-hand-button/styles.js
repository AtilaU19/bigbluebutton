import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';

const RaiseHandButton = styled(Button)`
${({ theme, ghost }) => ghost && `
  & > span {
    box-shadow: none;
    background-color: transparent !important;
    border-color: ${theme.colorText} !important;
  }
   `}

   & span i {
    left: -.05rem;
   }
`;

export default {
  RaiseHandButton,
};
