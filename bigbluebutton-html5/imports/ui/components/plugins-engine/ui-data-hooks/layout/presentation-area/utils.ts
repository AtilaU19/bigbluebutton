import { useEffect, useRef } from 'react';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { LayoutPresentationAreaUiDataNames, UiLayouts } from 'bigbluebutton-html-plugin-sdk';
import { LayoutPresentationAreaUiDataPayloads } from 'bigbluebutton-html-plugin-sdk/dist/cjs/ui-data/domain/layout/presentation-area/types';
import { UI_DATA_LISTENER_SUBSCRIBED } from 'bigbluebutton-html-plugin-sdk/dist/cjs/ui-data/hooks/consts';
import { PRESENTATION_AREA } from '/imports/ui/components/layout/enums';

type PresentationAreaContentPayload = LayoutPresentationAreaUiDataPayloads[
  LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT
];

const generateNewContentInfo = (
  presentationAreaContentPile: Layout['presentationAreaContentActions'],
): PresentationAreaContentPayload => presentationAreaContentPile.map((p) => {
  let currentElement;
  let genericContentId;
  switch (p.value.content) {
    case PRESENTATION_AREA.PINNED_NOTES:
      currentElement = UiLayouts.PINNED_SHARED_NOTES;
      break;
    case PRESENTATION_AREA.EXTERNAL_VIDEO:
      currentElement = UiLayouts.EXTERNAL_VIDEO;
      break;
    case PRESENTATION_AREA.GENERIC_CONTENT:
      currentElement = UiLayouts.GENERIC_CONTENT;
      genericContentId = p.value.genericContentId;
      break;
    case PRESENTATION_AREA.SCREEN_SHARE:
      currentElement = UiLayouts.SCREEN_SHARE;
      break;
    default:
      currentElement = UiLayouts.WHITEBOARD;
      break;
  }
  return {
    isOpen: p.value.open,
    currentElement,
    genericContentId,
  };
});

const isSamePresentationAreaContent = (
  prev: PresentationAreaContentPayload | null,
  next: PresentationAreaContentPayload,
): boolean => {
  if (!prev || prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i += 1) {
    if (
      prev[i].isOpen !== next[i].isOpen
      || prev[i].currentElement !== next[i].currentElement
      || prev[i].genericContentId !== next[i].genericContentId
    ) {
      return false;
    }
  }
  return true;
};

const useUpdatePresentationAreaContentForPluginForPlugin = (layoutContextState: Layout) => {
  const { presentationAreaContentActions: presentationAreaContentPile } = layoutContextState;
  const latestContentRef = useRef<PresentationAreaContentPayload | null>(null);
  const latestPileRef = useRef(presentationAreaContentPile);
  latestPileRef.current = presentationAreaContentPile;

  useEffect(() => {
    const nextContent = generateNewContentInfo(presentationAreaContentPile);
    if (isSamePresentationAreaContent(latestContentRef.current, nextContent)) return;
    latestContentRef.current = nextContent;
    window.dispatchEvent(new CustomEvent(LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT, {
      detail: nextContent,
    }));
  }, [presentationAreaContentPile]);

  useEffect(() => {
    const handleSubscribed = () => {
      const content = latestContentRef.current
        ?? generateNewContentInfo(latestPileRef.current);
      window.dispatchEvent(new CustomEvent(LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT, {
        detail: content,
      }));
    };

    window.addEventListener(
      `${UI_DATA_LISTENER_SUBSCRIBED}-${LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT}`,
      handleSubscribed,
    );

    return () => {
      window.removeEventListener(
        `${UI_DATA_LISTENER_SUBSCRIBED}-${LayoutPresentationAreaUiDataNames.CURRENT_ELEMENT}`,
        handleSubscribed,
      );
    };
  }, []);
};

export default useUpdatePresentationAreaContentForPluginForPlugin;
