import styled from 'styled-components';

const ToolbarContainer = styled.div`
  border-radius: 1.5rem;
  background-color: ${({ theme }) => theme.colorOffWhite};;
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  align-items: center;
`;

const ToolbarItem = styled.div<{ disabled?: boolean }>`
  cursor: pointer;
  color: ${({ theme }) => theme.colorGrayIcons};

  ${({ disabled }) => disabled && `
    cursor: not-allowed;
  `}
`;

const MoreItems = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colorGrayIcons};
`;

const Pipe = styled.span`
  color: ${({ theme }) => theme.colorGrayIcons};
`;

export default {
  ToolbarContainer,
  ToolbarItem,
  MoreItems,
  Pipe,
};
