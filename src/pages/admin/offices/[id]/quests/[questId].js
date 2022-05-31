import { Avatar, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { CustomCheckbox } from 'src/@core/components/forms/custom-checkbox';
import { CustomChip } from 'src/@core/components/forms/custom-chip';
import { CustomDynamicNFields } from 'src/@core/components/forms/custom-dynamic-n-fields';
import { CustomEditorJs } from 'src/@core/components/forms/custom-editorjs';
import { CustomSingleChip } from 'src/@core/components/forms/custom-single-chip';
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
import { shouldIgnoreId } from 'src/utils/model';
import { ssrGetToken } from 'src/utils/ssr';
import { getProfileUrl } from 'src/utils/user';
import * as yup from 'yup';

const questTypes = [
  { id: 'input', data: 'Input' },
  { id: 'mcq', data: 'MCQ' },
  { id: 'media', data: 'Media' },
];

const answerSchema = yup.object({
  answer: yup.string().required(),
  correct: yup.boolean().required(),
});

const schema = yup
  .object({
    // office: yup.string().required(),
    // quest: yup.string().required(),
    // questType: yup
    //   .string()
    //   .oneOf(questTypes.map((each) => each.id))
    //   .required(),
    // possibleAnswers: yup
    //   .array()
    //   .min(1)
    //   .of(answerSchema)
    //   .when('questType', (questType, schema) => {
    //     if (questType !== 'mcq') {
    //       return schema;
    //     }
    //     return schema.required();
    //   }),
    // // order: yup.number().positive().required(),
    // autoGrading: yup.boolean().required(),
  })
  .required();

const QuestEdit = ({ quest, inCreateMode }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saveContent, setSaveContent] = useState({});
  const [questType, setQuestType] = useState(quest?.questType);

  const form = useReactHookForm(schema, {
    office: quest?.office ?? router.query.id,
    quest: quest?.quest ?? '',
    questType: quest?.questType ?? 'mcq',
    possibleAnswers: quest?.possibleAnswers,
    autoGrading: quest?.autoGrading,
  });

  const onSubmit = async (input) => {
    input['quest'] = await saveContent.callback();
    input['possibleAnswers'] = input['possibleAnswers']?.filter(
      (each) => each.answer !== ''
    );
    console.log(input['possibleAnswers']);

    const { data, error } = await (inCreateMode
      ? usePostApi('quest', input)
      : usePatchApi('quest/' + quest._id, input));

    if (error) {
      enqueueSnackbar(data.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Quest Saved!', { variant: 'success' });

    router.back();
  };

  return (
    <div>
      <div className='ml-4 mb-4 flex flex-row justify-between'>
        <Typography variant='h4'>{quest?.name}</Typography>
        <Button variant='contained' onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit}>
        <CustomEditorJs
          label='Quest'
          setSaveContent={setSaveContent}
          minHeight={100}
          {...registerEditorJsField(form, 'quest')}
        ></CustomEditorJs>

        <CustomSingleChip
          label='Type'
          idData={questTypes}
          defaultSelected='mcq'
          {...registerSelectField(form, 'questType', (val) => {
            setQuestType(val);
          })}
        ></CustomSingleChip>

        {questType === 'mcq' && (
          <CustomDynamicNFields
            label='Possible Answers'
            form={form}
            field='possibleAnswers'
          ></CustomDynamicNFields>
        )}

        <CustomCheckbox
          label='Auto Grading'
          {...registerField(form, 'autoGrading')}
        />

        {/* 
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
        ></CustomChip> */}

        <Button
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          sx={{ marginTop: 3, marginBottom: 3 }}
        >
          Save
        </Button>
      </FormWrapper>
    </div>
  );
};

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);
  if (shouldIgnoreId(ctx.params.questId)) {
    return { props: { inCreateMode: true } };
  }

  const { data, error } = await useGetApi(
    'quest/' + ctx.params.questId,
    {},
    accessToken
  );

  return {
    props: { quest: data, inCreateMode: false },
  };
});

export default QuestEdit;
