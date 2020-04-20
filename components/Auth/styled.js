import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { FinalField } from '../common/forms';

const Form = styled.form`
  .MuiFormHelperText-root {
    position: absolute;
    top: 100%;
  }
`;

const FormTitle = styled.h3`
  margin: 0 0 36px;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 29px;
  text-align: center;
`;

const StyledField = styled(FinalField)`
  width: 100%;
  margin-bottom: 34px !important;
`;

const LoaderWrapper = styled.div(`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`);

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  height: 40px;
  background: linear-gradient(9.79deg, #0057c2 9.55%, #0095ff 100%);
  border-radius: 8px;
  span {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }
`;

export { LoaderWrapper, Form, StyledField, ButtonStyled, FormTitle, Title };
