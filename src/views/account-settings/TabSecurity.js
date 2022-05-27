import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import {
  registerField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { PasswordField } from 'src/@core/components/forms/password-field';
import { usePutApi } from 'src/utils/api';

const schema = yup
  .object({
    password: yup.string().required(),
    newPassword: yup.string().required(),
    newPasswordConfirmation: yup.string().required(),
  })
  .required();

const TabSecurity = () => {
  const form = useReactHookForm(schema);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (input) => {
    const { data, error } = await usePutApi('user/me/password', input);

    if (error) {
      console.log({ data, error });
      setFormErrorFromApi(form, data);
      return;
    }

    enqueueSnackbar('Password updated!');
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5} className='p-5'>
              <PasswordField
                label='Current Password'
                {...registerField(form, 'password')}
              ></PasswordField>

              <PasswordField
                label='New Password'
                {...registerField(form, 'newPassword')}
              ></PasswordField>

              <PasswordField
                label='New Password Confirmation'
                {...registerField(form, 'newPasswordConfirmation')}
              ></PasswordField>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: 'flex',
              marginTop: [7.5, 2.5],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              width={183}
              alt='avatar'
              height={256}
              src='/images/pages/pose-m-1.png'
            />
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ margin: 0 }} />

      <CardContent>
        <Box sx={{ mt: 4 }}>
          <Button variant='contained' type='submit' sx={{ marginRight: 3.5 }}>
            Save Changes
          </Button>
        </Box>
      </CardContent>
    </FormWrapper>
  );
};

export default TabSecurity;
