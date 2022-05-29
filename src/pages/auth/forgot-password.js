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
import { PasswordField } from 'src/@core/components/forms/password-field';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import themeConfig from 'src/configs/themeConfig';
import { CardCenterLayout } from 'src/@core/layouts/CardCenterLayout';
import { usePostApi } from 'src/utils/api';
import {
  registerField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AuthRoute } from 'src/middleware/auth-route';

const schema = yup
  .object({
    email: yup.string(),
  })
  .required();

const renderEmailInput = (form) => {
  return (
    <>
      <CustomTextField label='Email' {...registerField(form, 'email')} />
    </>
  );
};

const renderOtpInput = (form) => {
  return (
    <>
      <CustomTextField label='6-digits OTP' {...registerField(form, 'otp')} />
    </>
  );
};

const renderPasswordInput = (form) => {
  return (
    <>
      <PasswordField label='Password' {...registerField(form, 'newPassword')} />
      <PasswordField
        label='Password Confirmation'
        {...registerField(form, 'newPasswordConfirmation')}
      />
    </>
  );
};

const ForgotPassword = () => {
  const form = useReactHookForm(schema);
  const router = useRouter();
  const [stage, setStage] = useState('email');
  const [savedData, setSavedData] = useState({});
  const stages = {
    email: 'auth/forgot-password',
    otp: 'auth/forgot-password/verify-otp',
    password: 'auth/reset-password',
  };

  const onSubmit = async (input) => {
    console.log(input, stage, savedData[stage]);

    const { data, error } = await usePostApi(
      stages[stage],
      Object.assign(input, savedData[stage] ?? {})
    );

    console.log(data, error);

    if (error) {
      setFormErrorFromApi(form, data);

      return;
    }

    if (stage === 'email') {
      setSavedData({ ...savedData, otp: { email: input['email'] } });
    }

    if (stage === 'otp') {
      setSavedData({ ...savedData, password: { token: data['token'] } });
    }

    if (stage === 'password') {
      router.replace('/auth/login');
      return;
    }

    const stageKeys = Object.keys(stages);
    setStage(stageKeys[stageKeys.indexOf(stage) + 1]);
    form.reset();
  };

  const renderingCondition = () => {
    if (stage === 'email') {
      return renderEmailInput(form);
    }

    if (stage === 'otp') {
      return renderOtpInput(form);
    }

    return renderPasswordInput(form);
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
        {renderingCondition()}

        <Button
          fullWidth
          type='submit'
          size='large'
          variant='contained'
          sx={{ marginBottom: 7 }}
        >
          Reset
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

export const getServerSideProps = AuthRoute();
