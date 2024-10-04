import styled from 'styled-components';

import { colorGrayLighter } from '/imports/ui/stylesheets/styled-components/palette';
import { lineHeightComputed } from '/imports/ui/stylesheets/styled-components/typography';
import { smPaddingX } from '/imports/ui/stylesheets/styled-components/general';

const Branding = styled.div`
  width: 100%;
  & > img {
    max-height: 3rem;
    max-width: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default {
  Branding,
}
