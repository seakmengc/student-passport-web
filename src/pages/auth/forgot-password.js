import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import { AlertError } from 'src/@core/components/alerts/error';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import themeConfig from 'src/configs/themeConfig';
import { CardCenterLayout } from 'src/@core/layouts/CardCenterLayout';
import { usePostApi } from 'src/utils/api';
import { registerField, useReactHookForm } from 'src/utils/form';
import * as yup from 'yup';

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required();

const ForgotPassword = () => {
  const form = useReactHookForm(schema);

  const onSubmit = async (input) => {
    console.log(input);

    const { data, error } = await usePostApi('auth/forgot-password', input);

    console.log(data, error);

    if (error) {
      form.setError('form', { type: 'api', message: data.message });

      for (const key in data.errors) {
        form.setError(key, { type: 'api', message: data.errors[key][0] });
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            ml: 3,
            lineHeight: 1,
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '1.5rem !important',
          }}
        >
          {themeConfig.templateName}
        </Typography>
      </Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
          Welcome to {themeConfig.templateName}! 👋🏻
        </Typography>
        <Typography variant='body2'>
          Please sign-in to your account and start the adventure
        </Typography>
      </Box>
      <FormWrapper form={form} onSubmit={onSubmit}>
        <CustomTextField label='Email' {...registerField(form, 'email')} />

        <Button
          fullWidth
          type='submit'
          size='large'
          variant='contained'
          sx={{ marginBottom: 7 }}
        >
          Send reset otp
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Typography variant='body2'>
            <Link href='/auth/login'>Back to login page</Link>
          </Typography>
        </Box>
      </FormWrapper>
    </>
  );
};

ForgotPassword.getLayout = (page) => (
  <CardCenterLayout>{page}</CardCenterLayout>
);

export default ForgotPassword;
