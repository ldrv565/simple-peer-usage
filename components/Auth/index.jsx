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

const Auth = () => {
  const [registerStatus, register] = useFetch({
    source: authySource.register,
    lazy: true
  });
  const [tokenStatus, token] = useFetch({
    source: authySource.sendToken,
    lazy: true
  });
  const router = useRouter();

  const handleRegisterSubmit = async data => {
    const {
      user: { id }
    } = await register({ ...data, countryCode: 7 });
    await token({ userId: id });
    // TODO костыль для того authy отправил смс токен на телефон клиент, нужно разобраться почему с первого запроса на генерацию токена клиенту ничего не приходит
    await token({ userId: id });

    await router.push(`/patient/auth/verify/${id}`);
  };

  return (
    <Form onSubmit={data => handleRegisterSubmit(data)}>
      {({ handleSubmit }) => (
        <FormStyled onSubmit={() => {}} noValidate>
          <FormTitle>Авторизация</FormTitle>
          <StyledField name="email" placeholder="Email" />
          <StyledField name="phone" placeholder="Укажите номер телефона" />
          <ButtonStyled type="submit" onClick={handleSubmit}>
            Войти
          </ButtonStyled>
        </FormStyled>
      )}
    </Form>
  );
};

export default Auth;
