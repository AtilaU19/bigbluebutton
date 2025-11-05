import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';

const ReactionsButton = styled(Button)`
${({ ghost, theme }) => ghost && `
  & > span {
    box-shadow: none;
    background-color: transparent !important;
    border-color: ${theme.colorWhite} !important;
  }
   `}
`;

const ReactionsDropdown = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  border: 1px solid transparent;
  cursor: pointer;
  height: 2.5rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin: 0 .5rem;

  &:focus {
    background-color: ${({ theme }) => theme.colorGrayDark};
  }

  & > button {
    cursor: pointer;
    flex: auto;
  }

  & > * > span {
    padding: 4px;
    color: ${({ theme }) => theme.colorGrayDark} !important;
    border-color: transparent !important;
  }

  & i {
    width: 1.3rem;
  }

  ${({ active, theme }) => active && `
    color: ${theme.btnPrimaryColor};
    background-color: ${theme.btnPrimaryActiveBg};

    &:hover{
      filter: brightness(90%);
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryActiveBg} !important;
    }
  `}
`;

const ReactionsButtonWrapper = styled(ButtonWrapper)`
  width: 2.5rem;
  border-radius: 1.7rem;


  ${({ isMobile, theme }) => !isMobile && `
    border: 1px solid ${theme.colorGrayLightest};
    padding: 1rem 0.5rem;
    width: auto;
  `}

  ${({ active, theme }) => active && `
    color: ${theme.btnPrimaryColor};
    background-color: ${theme.btnPrimaryActiveBg};

    &:hover{
      filter: brightness(90%);
      color: ${theme.btnPrimaryColor};
      background-color: ${theme.btnPrimaryActiveBg} !important;
    }
  `}
`;

const ToggleButtonWrapper = styled(ButtonWrapper)`
  width: auto;
  padding: 1rem 0.5rem;
  cursor: inherit;
  & > div {
    margin-right: 0.5rem;
    filter: grayscale(100%);
  }
  &:hover {
    background-color: transparent !important;
  }
`;

export default {
  ReactionsButton,
  ReactionsDropdown,
  ButtonWrapper,
  ReactionsButtonWrapper,
  ToggleButtonWrapper,
};
