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
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import { ssrGetToken } from 'src/utils/ssr';
import { getProfileUrl, getUploadUrl } from 'src/utils/user';
import * as yup from 'yup';
import { getIdFromModel, shouldIgnoreId } from 'src/utils/model';
import { CustomCheckbox } from 'src/@core/components/forms/custom-checkbox';
import CustomImage from 'src/@core/components/forms/custom-image';

const schema = yup
  .object({
    name: yup.string().required(),
    admins: yup.array().required(),
    description: yup.string(),
  })
  .required();

const OfficeDetail = ({ office, parents, admins, inCreateMode }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saveContent, setSaveContent] = useState({});

  const form = useReactHookForm(schema, {
    name: office?.name,
    admins: office?.admins?.map((admin) => admin._id) ?? [],
    description: office?.description ?? '',
    parent: office?.parent,
  });

  const onSubmit = async (input) => {
    input['description'] = await saveContent.callback();

    if (typeof input['parent'] !== 'string') {
      input['parent'] = input['parent']['_id'];
    }

    const { data, error } = await (inCreateMode
      ? usePostApi('office', input)
      : usePatchApi('office/' + office._id, input));

    if (error) {
      enqueueSnackbar(data.message, { variant: 'error' });
      setFormErrorFromApi(form, data);
      return;
    }

    enqueueSnackbar('Unit Saved!', { variant: 'success' });

    router.back();
  };

  return (
    <div>
      <div className='mb-4 flex flex-row justify-between'>
        <Typography variant='h4'>{office?.name}</Typography>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit}>
        <CustomTextField
          label='Name'
          {...registerField(form, 'name')}
        ></CustomTextField>

        <CustomChip
          label='Office'
          placeholder='Select Office'
          multiple={false}
          idData={parents.map((parent) => ({
            id: parent._id,
            data: parent.name,
          }))}
          defaultSelected={getIdFromModel(office?.parent)}
          {...registerSelectField(form, 'parent')}
        ></CustomChip>

        <CustomChip
          label='Admins'
          placeholder='Select Admins'
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
          defaultSelected={office?.admins?.map((admin) => admin._id)}
          {...registerSelectField(form, 'admins')}
        ></CustomChip>

        <CustomImage
          form={form}
          label='Upload Stamp'
          enqueueSnackbar={enqueueSnackbar}
          field='stamp'
          defaultImageSrc={getUploadUrl(getIdFromModel(office?.stamp))}
        ></CustomImage>

        <CustomEditorJs
          label='Description'
          setSaveContent={setSaveContent}
          {...registerEditorJsField(form, 'description')}
        ></CustomEditorJs>

        <div className='flex flex-row justify-end'>
          <Button
            size='large'
            type='submit'
            variant='contained'
            sx={{ marginBottom: 7 }}
          >
            Save
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
};

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);
  const admins = await useGetApi('user/admin', {}, accessToken);
  const parents = await useGetApi(
    'office',
    { onlyHasUnits: true },
    accessToken
  );

  const rtn = {
    props: { inCreateMode: false, admins: admins.data, parents: parents.data },
  };
  if (shouldIgnoreId(ctx.params.id)) {
    rtn.props.inCreateMode = true;

    return rtn;
  }

  const office = await useGetApi('office/' + ctx.params.id, {}, accessToken);

  rtn.props.office = office.data;

  return rtn;
});

export default OfficeDetail;
