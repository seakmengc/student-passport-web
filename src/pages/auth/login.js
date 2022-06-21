// ** React Imports

// ** Next Imports
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import MuiFormControlLabel from '@mui/material/FormControlLabel';

// ** Icons Imports

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import {
  registerField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { setNewLogin, tokenState } from 'src/states/token';
import { PasswordField } from 'src/@core/components/forms/password-field';
import { CustomCheckbox } from 'src/@core/components/forms/custom-checkbox';
import { usePostApi, useUnauthPostApi } from 'src/utils/api';
import { CardCenterLayout } from 'src/@core/layouts/CardCenterLayout';
import { getRecoil } from 'recoil-nexus';
import { authState } from 'src/states/auth';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { AuthRoute } from 'src/middleware/auth-route';

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}));

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean().default(false),
  })
  .required();

const LoginPage = () => {
  const form = useReactHookForm(schema);

  const onSubmit = async (input) => {
    console.log(input);

    const { data, error } = await useUnauthPostApi('auth/login', input);
    if (error) {
      setFormErrorFromApi(form, data);

      return;
    }

    const auth = await setNewLogin(data);
    if (!auth) {
      setFormErrorFromApi(form, {
        message: 'Something went wrong!',
        errors: [],
      });

      return;
    }
    console.log({ auth });

    router.replace(auth.isAdmin ? '/admin' : '/');
  };

  // ** Hook
  const theme = useTheme();
  const router = useRouter();

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
        <img src='/images/logo.png' width={70} height={70} />

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
        <PasswordField label='Password' {...registerField(form, 'password')} />
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'end',
          }}
        >
          {/* <CustomCheckbox
            label='Remember Me'
            {...registerField(form, 'rememberMe')}
          /> */}
          <Link passHref href='/auth/forgot-password'>
            <LinkStyled>Forgot Password?</LinkStyled>
          </Link>
        </Box>
        <Button
          fullWidth
          type='submit'
          size='large'
          variant='contained'
          sx={{ marginBottom: 7 }}
        >
          Login
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
            New on our platform?
          </Typography>
          <Typography variant='body2'>
            <Link passHref href='/auth/register'>
              <LinkStyled>Create an account</LinkStyled>
            </Link>
          </Typography>
        </Box>
      </FormWrapper>
    </>
  );
};
LoginPage.getLayout = (page) => <CardCenterLayout>{page}</CardCenterLayout>;

export default LoginPage;

export const getServerSideProps = AuthRoute();
