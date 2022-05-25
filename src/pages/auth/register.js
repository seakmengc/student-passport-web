// ** React Imports
import { useState, Fragment } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MuiFormControlLabel from '@mui/material/FormControlLabel';

// ** Icons Imports
import Google from 'mdi-material-ui/Google';
import Github from 'mdi-material-ui/Github';
import Twitter from 'mdi-material-ui/Twitter';
import Facebook from 'mdi-material-ui/Facebook';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import { CardCenterLayout } from 'src/@core/layouts/CardCenterLayout';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { registerField, useReactHookForm } from 'src/utils/form';
import * as yup from 'yup';
import { PasswordField } from 'src/@core/components/forms/password-field';
import { usePostApi } from 'src/utils/api';

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
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
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
  // ** States
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  // ** Hook
  const theme = useTheme();
  const form = useReactHookForm(schema);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (input) => {
    console.log(input);

    const { data, error } = await usePostApi('user/register', input);

    if (error) {
      setFormErrorFromApi(form, data);

      return;
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
