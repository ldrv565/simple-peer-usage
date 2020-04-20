import React from 'react';
import { Form } from 'react-final-form';
import { useRouter } from 'next/router';

import { useFetch } from 'hooks';
import authySource from 'sources/authy';

import {
  ButtonStyled,
  Form as FormStyled,
  FormTitle,
  StyledField
} from './styled';

const Verify = () => {
  const { query, push } = useRouter();
  console.log(query);
  const [verifyStatus, verify] = useFetch({
    source: authySource.verify,
    lazy: true
  });

  const handleVerifySubmit = async data => {
    try {
      const res = await verify({ ...data, userId: query.id });
      if (res.success) {
        let date = new Date(Date.now() + 86400e3);
        date = date.toUTCString();
        document.cookie = `token=${query.id}; expires=${date}`;

        await push('/patient');
      }
    } catch (e) {
      console.log('handleVerifySubmit', e.message);
    }
  };

  return (
    <Form onSubmit={data => handleVerifySubmit(data)}>
      {({ handleSubmit }) => (
        <FormStyled onSubmit={() => {}} noValidate>
          <FormTitle>Авторизация</FormTitle>
          <StyledField name="token" placeholder="Код подтверждения" />
          <ButtonStyled type="submit" onClick={handleSubmit}>
            Войти
          </ButtonStyled>
        </FormStyled>
      )}
    </Form>
  );
};

export default Verify;
