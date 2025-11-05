import styled from 'styled-components';
import Styled from '/imports/ui/components/settings/submenus/styles';

const Title = styled(Styled.Title)``;

const Form = styled(Styled.Form)``;

const Label = styled(Styled.Label)``;

const Content = styled.div`
  padding: 16px;
`;

const Text = styled.p`
  margin: 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colorText};
`;

const Link = styled.a`
  color: ${({ theme }) => theme.colorLink};
`;

const TableButton = styled.button`
  color: ${({ theme }) => theme.colorLink};
  background-color: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  margin-top: 8px;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colorPrimary};
    outline-offset: 2px;
  }

  &:active {
    color: ${({ theme }) => theme.btnPrimaryHoverBg};
  }
`;

export default {
  Title,
  Form,
  Label,
  Text,
  Content,
  Link,
  TableButton,
};
