import styled from 'styled-components';
import { borderSize } from '/imports/ui/stylesheets/styled-components/general';

const BadgeCircle = styled.div`
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  bottom: ${borderSize};
  background-color: ${({ theme }) => theme.colorDanger};
  border: ${borderSize} solid ${({ theme }) => theme.colorGrayDark};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .7rem;
  color: ${({ theme }) => theme.colorWhite};
`;

export default { BadgeCircle };
