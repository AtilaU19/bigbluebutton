import styled from 'styled-components';
import ReactModal from 'react-modal';

const ScrollboxVertical = styled.div`
  overflow-y: auto;
  background: ${({ theme }) => `
    linear-gradient(${theme.colorWhite} 30%, rgba(${theme.colorWhite}, 0)),
    linear-gradient(rgba(${theme.colorWhite}, 0), ${theme.colorWhite} 70%) 0 100%,
    /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(${theme.colorBlack}, .2), rgba(${theme.colorBlack}, 0)),
    radial-gradient(farthest-side at 50% 100%, rgba(${theme.colorBlack}, .2), rgba(${theme.colorBlack}, 0)) 0 100%
  `};

  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  // Fancy scroll
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`};
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => `rgba(${theme.colorBlack}, .5)`}; }
  &::-webkit-scrollbar-thumb:active { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`};
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-track:hover { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-track:active { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-corner { background: 0 0; }
`;

const ModalScrollboxVertical = styled(ReactModal)`
  overflow-y: auto;
  background: ${({ theme }) => `
    linear-gradient(${theme.colorWhite} 30%, rgba(${theme.colorWhite}, 0)),
    linear-gradient(rgba(${theme.colorWhite}, 0), ${theme.colorWhite} 70%) 0 100%,
    /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(${theme.colorBlack}, .2), rgba(${theme.colorBlack}, 0)),
    radial-gradient(farthest-side at 50% 100%, rgba(${theme.colorBlack}, .2), rgba(${theme.colorBlack}, 0)) 0 100%
  `};

  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  // Fancy scroll
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`};
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => `rgba(${theme.colorBlack}, .5)`}; }
  &::-webkit-scrollbar-thumb:active { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`};
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-track:hover { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-track:active { background: ${({ theme }) => `rgba(${theme.colorBlack}, .25)`}; }
  &::-webkit-scrollbar-corner { background: 0 0; }
`;

export {
  ScrollboxVertical,
  ModalScrollboxVertical,
};
