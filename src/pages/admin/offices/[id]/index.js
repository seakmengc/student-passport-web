import { Avatar, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { CustomChip } from 'src/@core/components/forms/custom-chip';
import { CustomEditorJs } from 'src/@core/components/forms/custom-editorjs';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { AdminRoute } from 'src/middleware/admin-route';
import { useGetApi, usePatchApi, usePostApi } from 'src/utils/api';
import {
  registerEditorJsField,
  registerField,
  registerSelectField,
  useReactHookForm,
} from 'src/utils/form';
import { ssrGetToken } from 'src/utils/ssr';
import { getProfileUrl } from 'src/utils/user';
import * as yup from 'yup';

const schema = yup
  .object({
    name: yup.string().required(),
    admins: yup.array().required(),
    description: yup.string().required(),
  })
  .required();

const OfficeDetail = ({ office, admins }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saveContent, setSaveContent] = useState({});
  const inCreateMode = router.query.id === 'create';

  const form = useReactHookForm(schema, {
    name: office.name,
    admins: office.admins?.map((admin) => admin._id) ?? [],
    description: office.description,
  });

  const onSubmit = async (input) => {
    input['description'] = await saveContent.callback();

    const { data, error } = await (inCreateMode
      ? usePostApi('office', input)
      : usePatchApi('office/' + office._id, input));

    if (error) {
      enqueueSnackbar(data.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Office Saved!', { variant: 'success' });

    router.push('/admin/offices');
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
          getAvatar={(id) => {
            return (
              <Avatar
                src={getProfileUrl(admins.find((admin) => admin._id === id))}
              />
            );
          }}
          defaultSelected={office.admins?.map((admin) => admin._id)}
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

  console.log(ctx.params);
  const { data, error } = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  const admins = await useGetApi('user/admin', {}, accessToken);

  console.log(admins.data);

  return {
    props: { office: data, admins: admins.data },
  };
});

export default OfficeDetail;
