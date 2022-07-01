import {
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { AdminRoute } from 'src/middleware/admin-route';
import { useGetApi, usePutApi } from 'src/utils/api';
import { getArrByField } from 'src/utils/arr';
import { ssrGetToken } from 'src/utils/ssr';
import { getUploadUrl } from 'src/utils/user';
import styled from '@emotion/styled';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { ConfirmationDialog } from 'src/@core/components/alerts/confirmation-dialog';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import {
  registerField,
  registerSelectField,
  setFormErrorFromApi,
  useReactHookForm,
} from 'src/utils/form';
import { CustomSingleChip } from 'src/@core/components/forms/custom-single-chip';
import * as yup from 'yup';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#9155FD',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#9155FD',
  },
});

function BpRadio(props) {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

const schema = yup
  .object({
    isApproved: yup.boolean().required(),
    reason: yup.string(),
  })
  .required();

const QuestDetail = ({ studentQuest }) => {
  const [isApproved, setIsApproved] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const form = useReactHookForm(schema, {
    isApproved,
  });

  const onSubmit = async (input) => {
    const { data, error } = await usePutApi(
      `student-quest/${studentQuest._id}/approve`,
      input
    );

    if (error) {
      setFormErrorFromApi(form, data);
      enqueueSnackbar(data.message, { variant: 'error' });

      return;
    }

    enqueueSnackbar(`Quest ${input['isApproved'] ? 'approved' : 'rejected'}!`, {
      variant: 'success',
    });
    router.back();
  };

  const renderAnswerByType = (studentQuest) => {
    const type = studentQuest.quest.questType;

    if (type === 'input') {
      return (
        <Typography variant='h6'>
          Answered: {getArrByField(studentQuest, 'answer')}
        </Typography>
      );
    }

    if (type === 'mcq') {
      return (
        <RadioGroup value={studentQuest.answer}>
          {studentQuest.quest.possibleAnswers.map((each) => (
            <FormControlLabel
              key={each._id}
              value={each._id}
              control={<BpRadio />}
              label={each.answer}
            />
          ))}
        </RadioGroup>
      );
    }

    return (
      <img
        src={getUploadUrl(getArrByField(studentQuest, 'upload'))}
        style={{ minWidth: '500px', maxHeight: '500px' }}
      />
    );
  };

  return (
    <>
      <Typography variant='h6'>
        Office: {getArrByField(studentQuest, 'office.name')}
      </Typography>
      <br></br>
      <Card className='p-4'>
        <Typography variant='h7'>
          Quest: <br></br>
          {getArrByField(studentQuest, 'quest.quest')}
        </Typography>
        <Typography variant='h7'>
          Quest Type:{' '}
          <span className='uppercase'>
            {getArrByField(studentQuest, 'quest.questType')}
          </span>
        </Typography>
      </Card>
      <br></br>

      <Card className='p-4'>
        <Typography variant='h7'>
          Answered By: <br></br>
          <b>{getArrByField(studentQuest, 'user.firstName')}</b>
        </Typography>
        <div className='mt-4'>
          <Typography variant='h7'>
            <b>Answer:</b>
          </Typography>
          <div className='pl-3'>{renderAnswerByType(studentQuest)}</div>
        </div>
      </Card>

      <div>
        <FormWrapper form={form} onSubmit={onSubmit}>
          <CustomSingleChip
            idData={[
              { id: '1', data: 'Approve' },
              { id: '0', data: 'Reject' },
            ]}
            defaultSelected={isApproved ? '1' : '0'}
            label='Action'
            {...registerSelectField(form, 'isApproved', (val) => {
              setIsApproved(val === '1');
            })}
          ></CustomSingleChip>

          {isApproved == false && (
            <CustomTextField
              label='Reason'
              {...registerField(form, 'reason')}
            ></CustomTextField>
          )}

          <Button
            size='large'
            type='submit'
            variant='contained'
            className='mt-4'
          >
            Confirm
          </Button>
        </FormWrapper>
      </div>

      {/* <div className='my-4 flex flex-row'>
        <div className='mr-4'>
          <Button variant='contained' startIcon={<DoneIcon />} color='success'>
            Approve
          </Button>
        </div>

        <div>
          <Button variant='contained' startIcon={<CloseIcon />} color='error'>
            Reject
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default QuestDetail;

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi(
    'student-quest/' + ctx.params.id,
    {},
    accessToken
  );

  return {
    props: { studentQuest: data },
  };
});
