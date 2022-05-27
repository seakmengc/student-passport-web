// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

// ** Icons Imports
import Close from 'mdi-material-ui/Close';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { registerField, useReactHookForm } from 'src/utils/form';
import { useRecoilState } from 'recoil';
import { authState } from 'src/states/auth';
import * as yup from 'yup';
import { usePatchApi } from 'src/utils/api';
import { showSnackbar } from 'src/utils/snackbar';
import { useSnackbar } from 'notistack';

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
  })
  .required();

const TabAccount = () => {
  const [authStore, setAuthStore] = useRecoilState(authState);
  const form = useReactHookForm(schema, {
    firstName: authStore.firstName,
    lastName: authStore.lastName,
    email: authStore.email,
  });
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (input) => {
    const { data, error } = await usePatchApi('user/me', input);

    showSnackbar(data, error, enqueueSnackbar);

    setAuthStore(data);
  };

  return (
    <CardContent>
      <FormWrapper form={form} onSubmit={onSubmit}>
        <CustomTextField
          label='First Name'
          {...registerField(form, 'firstName')}
        ></CustomTextField>

        <CustomTextField
          label='Last Name'
          {...registerField(form, 'lastName')}
        ></CustomTextField>

        <CustomTextField
          label='Email'
          {...registerField(form, 'email')}
        ></CustomTextField>

        <Button
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          sx={{ marginBottom: 7 }}
        >
          Save
        </Button>
      </FormWrapper>
    </CardContent>
  );
};

export default TabAccount;
