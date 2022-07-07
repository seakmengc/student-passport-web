import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { CustomChip } from 'src/@core/components/forms/custom-chip';
import { CustomEditorJs } from 'src/@core/components/forms/custom-editorjs';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import { AdminRoute } from 'src/middleware/admin-route';
import {
  useGetApi,
  usePatchApi,
  usePostApi,
  usePostUploadApi,
} from 'src/utils/api';
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
import styled from '@emotion/styled';
import { showSnackbar } from 'src/utils/snackbar';
import CustomImage from 'src/@core/components/forms/custom-image';

const schema = yup
  .object({
    name: yup.string().required(),
    admins: yup.array().required(),
    stamp: yup.string().required(),
    description: yup.string(),
    hasUnits: yup.boolean().required(),
  })
  .required();

const OfficeDetail = ({ office, admins, inCreateMode }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saveContent, setSaveContent] = useState({});

  const form = useReactHookForm(schema, {
    name: office?.name,
    admins: office?.admins?.map((admin) => admin._id) ?? [],
    description: office?.description ?? '',
    hasUnits: office?.hasUnits ?? true,
    stamp: getIdFromModel(office?.stamp) ?? '',
  });

  const onSubmit = async (input) => {
    if (saveContent?.callback) {
      input['description'] = await saveContent.callback();
    }

    const { data, error } = await (inCreateMode
      ? usePostApi('office', input)
      : usePatchApi('office/' + office._id, input));

    if (error) {
      enqueueSnackbar(data.message, { variant: 'error' });
      setFormErrorFromApi(form, data);
      return;
    }

    enqueueSnackbar('Office Saved!', { variant: 'success' });

    router.back();
  };

  return (
    <div>
      <div className='mb-4 flex flex-row justify-between'>
        <Typography variant='h4'>{office?.name}</Typography>
        {/* <Button variant='contained' onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button> */}
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
          defaultSelected={office?.admins?.map((admin) => admin._id)}
          {...registerSelectField(form, 'admins')}
        ></CustomChip>

        {inCreateMode && (
          <div>
            <CustomCheckbox
              label='Has Units'
              defaultValue={office?.hasUnits}
              {...registerField(form, 'hasUnits')}
            ></CustomCheckbox>
            <Typography variant='caption'>
              * Check to allow for units creation under the office, can't edit
              later
            </Typography>
          </div>
        )}

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

  if (shouldIgnoreId(ctx.params.id)) {
    return { props: { inCreateMode: true, admins: admins.data } };
  }

  const { data, error } = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  return {
    props: { office: data, admins: admins.data },
  };
});

export default OfficeDetail;
