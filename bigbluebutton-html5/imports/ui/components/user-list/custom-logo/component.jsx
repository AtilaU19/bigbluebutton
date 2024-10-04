import React from 'react';
import Styled from './styles';

const CustomLogo = props => (
    <Styled.Branding data-test="brandingArea">
      <img src={props.CustomLogoUrl} alt="custom branding logo" />
    </Styled.Branding>
);

export default CustomLogo;
