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
  registerField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import * as yup from 'yup';
import { PasswordField } from 'src/@core/components/forms/password-field';
import { usePostApi } from 'src/utils/api';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { tokenState } from 'src/states/token';
import { AuthRoute } from 'src/middleware/auth-route';

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}));

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const RegisterPage = () => {
  const form = useReactHookForm(schema);
  const [tokenStore, setTokenStore] = useRecoilState(tokenState);
  const router = useRouter();

  const onSubmit = async (input) => {
    console.log(input);

    const { data, error } = await usePostApi('user/register', input);

    if (error) {
      setFormErrorFromApi(form, data);

      return;
    }

    setTokenStore((_) => data);
    router.replace('/');
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
          Adventure starts here 🚀
        </Typography>
        <Typography variant='body2'>
          Make your app management easy and fun!
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

        <Button
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          sx={{ marginBottom: 7 }}
        >
          Sign up
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Typography variant='body2' sx={{ marginRight: 2 }}>
            Already have an account?
          </Typography>
          <Typography variant='body2'>
            <Link passHref href='/auth/login'>
              <LinkStyled>Sign in instead</LinkStyled>
            </Link>
          </Typography>
        </Box>
      </FormWrapper>
    </>
  );
};

RegisterPage.getLayout = (page) => <CardCenterLayout>{page}</CardCenterLayout>;

export default RegisterPage;

export const getServerSideProps = AuthRoute();
