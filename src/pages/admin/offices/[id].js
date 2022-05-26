import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { CustomChip } from 'src/@core/components/forms/custom-chip';
import { CustomEditorJs } from 'src/@core/components/forms/custom-editorjs';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { AdminRoute } from 'src/middleware/admin-route';
import { useGetApi, usePatchApi } from 'src/utils/api';
import {
  registerEditorJsField,
  registerField,
  registerSelectField,
  useReactHookForm,
} from 'src/utils/form';
import { ssrGetToken } from 'src/utils/ssr';
import * as yup from 'yup';

const OfficeDetail = ({ office, admins }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [saveContent, setSaveContent] = useState({});

  const schema = yup
    .object({
      name: yup.string().required(),
      admins: yup.array().required(),
      description: yup.string().required(),
    })
    .required();

  const form = useReactHookForm(schema, {
    name: office.name,
    admins: office.admins.map((admin) => admin._id),
    description: office.description,
  });

  const onSubmit = async (input) => {
    await saveContent.callback();

    const { data, error } = await usePatchApi('office/' + office._id, input);

    if (error) {
      enqueueSnackbar(data.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Office Saved!', { variant: 'success' });
  };

  return (
    <div>
      <div className='ml-4 mb-4 flex flex-row justify-between'>
        <Typography variant='h4'>{office.name}</Typography>
        <Button variant='contained' onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit}>
        <CustomTextField
          label='Name'
          {...registerField(form, 'name')}
        ></CustomTextField>

        <CustomChip
          label='Admins'
          idData={admins.map((admin) => ({
            id: admin._id,
            data: admin.firstName,
          }))}
          defaultSelected={office.admins.map((admin) => admin._id)}
          {...registerSelectField(form, 'admins')}
        ></CustomChip>

        <CustomEditorJs
          label='Description'
          setSaveContent={setSaveContent}
          {...registerEditorJsField(form, 'description')}
        ></CustomEditorJs>

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
    </div>
  );
};

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  const admins = await useGetApi('user/admin', {}, accessToken);

  console.log(data.admins);

  return {
    props: { office: data, admins: admins.data },
  };
});

export default OfficeDetail;
