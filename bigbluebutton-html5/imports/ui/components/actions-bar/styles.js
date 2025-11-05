import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { smPaddingX, smPaddingY, barsPadding } from '/imports/ui/stylesheets/styled-components/general';
import Button from '/imports/ui/components/common/button/component';

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const ActionsBarWrapper = styled.section`
  flex: 1;
  padding: ${barsPadding};
  background-color: ${({ theme }) => theme.colorBackgroundLayout};
  position: relative;
  order: 3;
`;

const ItemsGroup = `
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
  gap: ${smPaddingX};
`;

const Left = styled.div`
  ${ItemsGroup}
  flex-basis: 0;
  justify-content: flex-start;
  > *:not(span) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
  @media ${smallOnly} {
    bottom: ${smPaddingX};
    left: ${smPaddingX};
    right: auto;
    [dir="rtl"] & {
      left: auto;
      right: ${smPaddingX};
    }
  }
`;

const Center = styled.div`
  ${ItemsGroup}
  justify-content: center;
`;

const Right = styled.div`
  ${ItemsGroup}
  flex-basis: 0;
  justify-content: flex-end;
  position: relative;
  [dir="rtl"] & {
    right: auto;
    left: ${smPaddingX};
  }
  @media ${smallOnly} {
    right: 0;
    left: 0;
    display: contents;
  }
  > *:not(span) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
  height: 100%;
`;

const PresentationButtonsWrapper = styled.div`
  color: ${({ theme }) => theme.btnDefaultColor};
  background-color: ${({ theme }) => theme.btnDefaultBg};
  border-radius: 3rem;
  display: flex;
  gap: .2rem;
  align-items: center;
  height: 100%;
`;

const Divider = styled.div`
  border: .5px solid ${({ theme }) => theme.defaultBorder};
  height: 50%;
`;

const RaiseHandButton = styled(Button)`
  ${({ ghost, theme }) => ghost && `
    & > span {
      box-shadow: none;
      background-color: transparent !important;
      border-color: ${theme.colorWhite} !important;
    }
  `}
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  > * {
    margin: 8px;
  }
`;

const ReactionsDropdown = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  overflow: hidden;
  margin: 0.2em 0.2em 0.2em 0.2em;
  text-align: center;
  max-height: 270px;
  width: 270px;
  em-emoji {
    cursor: pointer;
  }
`;

const Separator = styled.div`
  height: 2.5rem;
  width: 0;
  border: 1px solid ${({ theme }) => theme.colorSeparator};
  align-self: center;
  opacity: .75;
`;

const Gap = styled.div`
  display: flex;
  gap: .5rem;
`;

export default {
  ActionsBar,
  Left,
  Center,
  Right,
  PresentationButtonsWrapper,
  Divider,
  RaiseHandButton,
  ButtonContainer,
  ReactionsDropdown,
  Wrapper,
  ActionsBarWrapper,
  Gap,
  Separator,
};
