// ** React Imports

// ** MUI Imports
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

// ** Icons Imports
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
