import styled from 'styled-components';

import {
  smPaddingY,
  lgPadding,
  $3xlPadding,
  xlPadding,
  mdPadding,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  fontSizeSmall,
  fontSizeSmaller,
} from '/imports/ui/stylesheets/styled-components/typography';
import { ChatTime as ChatTimeBase } from './message-header/styles';
import UserAvatar from '/imports/ui/components/user-avatar/component';

interface ChatWrapperProps {
  sameSender: boolean;
  isSystemSender: boolean;
  isPresentationUpload?: boolean;
  isCustomPluginMessage: boolean;
}

interface ChatContentProps {
  sameSender: boolean;
  isCustomPluginMessage: boolean;
  $isSystemSender: boolean;
  $editing: boolean;
  $highlight: boolean;
  $reactionPopoverIsOpen: boolean;
  $keyboardFocused: boolean;
  $emphasizedMessage: boolean;
}

export const FlexColumn = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${smPaddingY};
`;

export const ChatWrapper = styled.div<ChatWrapperProps>`
  pointer-events: auto;
  display: flex;
  flex-flow: column;
  gap: ${smPaddingY};
  position: relative;
  font-size: ${fontSizeSmall};
  position: relative;

  [dir='rtl'] & {
    direction: rtl;
  }

  ${({ isPresentationUpload, theme }) => isPresentationUpload && `
      border: 1px solid ${theme.systemMessageBorderColor};
      border-radius: 8px;
      background-color: ${theme.colorWhite};
    `}
  ${({ isSystemSender, theme }) => isSystemSender && `
    background-color: ${theme.highlightedMessageBackgroundColor};
    border-left: 2px solid ${theme.highlightedMessageBorderColor};
    border-radius: 0px 3px 3px 0px;
    padding: 8px 2px;
  `}
  ${({ isCustomPluginMessage }) => isCustomPluginMessage && `
    margin: 0;
    padding: 0;
  `}
`;

export const ChatContent = styled.div<ChatContentProps>`
  display: flex;
  flex-flow: column;
  width: 100%;
  border-radius: 0.5rem;
  position: relative;
  border: 1px solid transparent;

  ${({ $isSystemSender, theme }) => !$isSystemSender && `
    background-color: ${theme.colorGrayUserListToolbar};
  `}

  ${({ $highlight, theme }) => $highlight && `
    &:hover {
      border: 1px solid ${theme.highlightedMessageBorderColor};
    }
  `}

  ${({
    $editing, $reactionPopoverIsOpen, $keyboardFocused, theme,
  }) => ($reactionPopoverIsOpen || $editing || $keyboardFocused)
    && `
    background-color: ${theme.colorBlueLightest} !important;
  `}

  .chat-message-container:focus & {
    background-color: ${({ theme }) => theme.colorBlueLightest} !important;
  }

  ${({ $emphasizedMessage, theme }) => $emphasizedMessage && `
    background-color: ${theme.colorMessageBackground};

    &:hover {
      border: 1px solid ${theme.highlightedMessageBorderColor};
    }
  `}
`;

export const ChatContentFooter = styled.div`
  justify-content: flex-end;
  gap: 0.25rem;
  position: absolute;
  bottom: 0.25rem;
  line-height: 1;
  font-size: 95%;
  display: none;
  background-color: inherit;
  border-radius: 0.5rem;

  [dir="rtl"] & {
    left: 0.25rem;
  }

  [dir="ltr"] & {
    right: 0.25rem;
  }

  .chat-message-wrapper-focused &,
  .chat-message-wrapper-keyboard-focused &,
  .chat-message-content:focus &,
  .chat-message-content:hover & {
    display: flex;
  }
`;

export const ChatAvatar = styled(UserAvatar)`
  flex: 0 0 2.25rem;
  margin: 0px calc(0.5rem) 0px 0px;
  box-flex: 0;
  position: relative;
  text-align: center;
  font-size: .85rem;
  border: 2px solid transparent;
  user-select: none;
`;

export const Container = styled.div<{ $sequence: number }>`
  display: flex;
  flex-direction: column;
  user-select: text;
  outline: none;

  &:not(:first-of-type) {
    margin-top: calc((${fontSizeSmaller} + ${lgPadding} * 2) / 2);
  }

  &[data-focusable="false"] {
    pointer-events: none;
  }
`;

export const MessageItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: calc(${lgPadding} + 2px) ${$3xlPadding};
`;

export const DeleteMessage = styled.span`
  color: ${({ theme }) => theme.colorGrayLight};
  padding: ${mdPadding} ${xlPadding};
  border: 1px solid ${({ theme }) => theme.colorGrayLightest};
  border-radius: 0.375rem;
`;

export const ChatHeading = styled.div`
  display: flex;
`;

export const EditLabel = styled.span`
  color: ${({ theme }) => theme.colorGrayLight};
  font-style: italic;
  font-size: 75%;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  line-height: 1;
`;

export const ChatTime = styled(ChatTimeBase)`
  font-style: italic;
  color: ${({ theme }) => theme.colorGrayDark};
  display: none;

  .chat-message-container:focus &,
  .chat-message-container-keyboard-focused &,
  .chat-message-content:hover & {
    display: flex;
  }
`;
