import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import themeConfig from 'src/configs/themeConfig';
import { CardCenterLayout } from 'src/@core/layouts/CardCenterLayout';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import {
  arrToIdData,
  registerField,
  registerSelectField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import * as yup from 'yup';
import { PasswordField } from 'src/@core/components/forms/password-field';
import { usePostApi } from 'src/utils/api';
import { CustomChip } from 'src/@core/components/forms/custom-chip';
import { CustomSingleChip } from 'src/@core/components/forms/custom-single-chip';

const roles = ['Student', 'Admin'];
const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    role: yup.string().oneOf(roles).required(),
  })
  .required();

export default function RegisterPage() {
  const form = useReactHookForm(schema);

  const onSubmit = async (input) => {
    console.log({ input });

    const { data, error } = await usePostApi('user', input);

    if (error) {
      setFormErrorFromApi(form, data);

      return;
    }

    form.setError('form', {
      type: 'success',
      message: `Registered ${data.email}`,
    });
  };

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
          Register a User
        </Typography>
      </Box>
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

        <PasswordField
          label='Password'
          {...registerField(form, 'password')}
        ></PasswordField>

        <CustomSingleChip
          label='Role'
          idData={arrToIdData(roles)}
          defaultSelected='Admin'
          {...registerSelectField(form, 'role')}
        ></CustomSingleChip>

        <Button fullWidth size='large' type='submit' variant='contained'>
          Register
        </Button>
      </FormWrapper>
    </>
  );
}
