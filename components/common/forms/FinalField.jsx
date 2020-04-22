import React from 'react';
import { Field } from 'react-final-form';
import { TextField } from '@material-ui/core';

const FinalField = ({ name, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => <TextField {...input} {...meta} {...rest} />}
    />
  );
};

export default FinalField;
