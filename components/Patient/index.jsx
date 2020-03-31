import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, TextField } from '@material-ui/core';

const Patient = () => {
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState(username);

  const handleUsernameChange = event => setInputValue(event.target.value);

  const handleSubmit = () => {
    setUsername(inputValue);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Введите имя</Title>

      <TextFieldStyled
        required
        value={inputValue}
        onChange={handleUsernameChange}
      />

      <ButtonStyled type="submit" variant="contained" color="primary">
        Принять
      </ButtonStyled>
    </Form>
  );
};

export default Patient;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ButtonStyled = styled(Button)`
  margin-top: 24px;
`;

const TextFieldStyled = styled(TextField)`
  input {
    text-align: center;
  }
`;
