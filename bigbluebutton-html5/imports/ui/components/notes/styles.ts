import styled from 'styled-components';
import { colorWhite, colorGrayLighter } from '/imports/ui/stylesheets/styled-components/palette';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import CommonHeader from '/imports/ui/components/common/control-header/component';

const Notes = styled.div<{ isChrome: boolean }>`
  background-color: ${colorWhite};
  padding: 16px;
  display: flex;
  border-radius: 16px;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  height: 85%;

  ${({ isChrome }) => isChrome && `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
    &.no-padding {
      padding: 0;
    }
  }
`;

const Header = styled(CommonHeader)`
  padding-bottom: .2rem;
`;

const Separator = styled.hr`
  margin: 1rem auto;
  width: 100%;
  border: 0;
  border-top: 1px solid ${colorGrayLighter};
`;

export default {
  Notes,
  Header,
  Separator
};
