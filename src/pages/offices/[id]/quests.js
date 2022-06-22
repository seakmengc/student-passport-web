import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Slide,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi, usePostApi, usePostUploadApi } from 'src/utils/api';
import { ssrGetToken } from 'src/utils/ssr';
import { CustomSingleChip } from 'src/@core/components/forms/custom-single-chip';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { StudentLayout } from 'src/layouts/StudentLayout';
import {
  registerField,
  registerSelectField,
  useReactHookForm,
} from 'src/utils/form';
import { FormWrapper } from 'src/@core/components/forms/wrapper';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import { getUploadUrl } from 'src/utils/user';
import { AlertCommon } from 'src/@core/components/alerts/common';
import { forwardRef } from 'react';
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 250,
  height: 250,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const onImageChange = async (form, file, setImgSrc) => {
  const reader = new FileReader();
  const { files } = file.target;
  if (files && files.length !== 0) {
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(files[0]);

    const { data, error } = await usePostUploadApi(files[0]);
    if (error) {
      console.error(data);
      return;
    }

    form.setValue('upload', data._id);
  }
};

const getFieldBasedOnQuestType = (questType) => {
  if (questType === 'mcq') {
    return 'answer';
  } else if (questType === 'input') {
    return 'input';
  } else {
    return 'upload';
  }
};

const schema = yup
  .object({
    quest: yup.string().required(),
    // questType: yup.string().required(),
    // answer: yup.string().when('questType', (questType, schema) => {
    //   if (questType !== 'mcq') {
    //     return schema;
    //   }

    //   return schema.required();
    // }),
    // input: yup.string().when('questType', (questType, schema) => {
    //   if (questType !== 'input') {
    //     return schema;
    //   }

    //   return schema.required();
    // }),
    // upload: yup.string().when('questType', (questType, schema) => {
    //   if (questType !== 'media') {
    //     return schema;
    //   }

    //   return schema.required();
    // }),
  })
  .required();

const getColorByStatus = (status) => {
  if (status === 'approved') {
    return 'success';
  }

  if (status === 'rejected') {
    return 'error';
  }

  return 'secondary';
};

const getIconByStatus = (status) => {
  if (!status) {
    return <LockIcon />;
  }

  if (status === 'approved') {
    return <CheckIcon />;
  }

  if (status === 'rejected') {
    return <CloseIcon />;
  }

  return <AccessTimeIcon />;
};

const Transition = forwardRef((props, ref) => {
  return <Slide direction='up' ref={ref} {...props} />;
});

const Quests = ({ quests, office }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(Math.max(quests.length - 1, 0));
  const form = useReactHookForm();
  const uploadRef = useRef();
  const [imgSrc, setImgSrc] = useState('/images/no.jpeg');
  const [alert, setAlert] = useState();
  const [open, setOpen] = useState(false);
  const [streaks, setStreaks] = useState(0);
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    if (!quests) {
      return;
    }

    console.log(quests);
    const currIndex = quests.findIndex(
      (each) => !each.submission || each.submission.status === 'rejected'
    );
    if (currIndex < 0) {
      return;
    }

    const latestNew = quests.findIndex((each) => !each.submission);
    setMaxIndex(latestNew < 0 ? quests.length - 1 : latestNew);
    setActiveIndex(currIndex);
    if (quests[currIndex].submission?.status === 'rejected') {
      setAlert({ type: 'error', message: quests[currIndex].submission.reason });
    }
  }, []);

  const handleNext = (forceIndex) => {
    const next = forceIndex ?? activeIndex + 1;
    if (next >= quests.length) {
      return;
    }

    // form.setValue()

    if (quests[next].questType === 'media') {
      setImgSrc(getUploadUrl(quests[next].submission?.upload));
    }

    setMaxIndex(Math.max(next, maxIndex));
    setActiveIndex(next);
    if (quests[next].submission?.status === 'rejected') {
      setAlert({ type: 'error', message: quests[next].submission.reason });
    } else {
      setAlert(null);
    }
  };

  const handleSubmit = async (input) => {
    setAlert(null);
    const curr = quests[activeIndex];

    const submitData = { quest: curr._id };
    submitData[getFieldBasedOnQuestType(curr.questType)] =
      input[getFieldBasedOnQuestType(curr.questType)];

    const { data, error } = await usePostApi('student-quest', submitData);

    curr['submission'] = data;
    curr['canSubmit'] = data.status === 'rejected';
    if (error) {
      setAlert({ type: 'error', message: data.message });

      return;
    }

    if (curr['submission'].status === 'rejected') {
      setAlert({ type: 'error', message: curr['submission'].reason });
      setStreaks(0);

      return;
    }

    if (curr['submission'].status === 'approved') {
      setStreaks(streaks + 1);
    }

    setOpen(true);
  };

  const renderAnswer = (form, quest) => {
    if (quest.questType === 'input') {
      return (
        <CustomTextField
          label='Type your answer here'
          defaultValue={quest.submission?.input}
          {...(!quest.canSubmit ? {} : registerField(form, 'input'))}
        ></CustomTextField>
      );
    }

    if (quest.questType === 'media') {
      return (
        <Box
          className='grid place-content-center justify-center'
          variant='contained'
        >
          <div>
            <ImgStyled
              className='p-3 hover:cursor-pointer'
              src={imgSrc}
              onClick={
                quest.canSubmit
                  ? () => {
                      uploadRef.current?.click();
                    }
                  : null
              }
            />
          </div>

          <input
            ref={uploadRef}
            hidden
            type='file'
            onChange={(file) => onImageChange(form, file, setImgSrc)}
            accept='image/png, image/jpeg, image/jpg, video/mp4'
          />

          <Button
            onClick={
              quest.canSubmit
                ? () => {
                    uploadRef.current?.click();
                  }
                : null
            }
          >
            Click to Upload
          </Button>

          <Typography variant='caption' sx={{ marginTop: 5 }}>
            Max size of 1MB.
          </Typography>
        </Box>
      );
    }

    return (
      <CustomSingleChip
        idData={quest.possibleAnswers.map((possible) => ({
          id: possible._id,
          data: possible.answer,
        }))}
        label=''
        defaultSelected={quest.submission?.answer}
        {...(!quest.canSubmit ? {} : registerSelectField(form, 'answer'))}
      ></CustomSingleChip>
    );
  };

  if (!quests || quests.length === 0) {
    return <p>No Quests Yet!</p>;
  }

  return (
    <Stack
      sx={{ minHeight: '100%' }}
      spacing={2}
      justifyContent='space-between'
      className='w-full'
    >
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box className='p-4 px-8'>
          <DialogTitle>Congratulations, {auth?.firstName}! 🎉</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Keep it up, you're done a great jobs today!
            </DialogContentText>

            {streaks > 1 && (
              <div className='flex flex-col items-center pt-8'>
                <Avatar
                  sx={{
                    width: 75,
                    height: 75,
                    bgcolor: 'primary.main',
                    color: 'white',
                    mb: 2,
                    fontSize: 24,
                  }}
                >
                  {streaks}
                </Avatar>
                <Typography variant='body2'>streaks in a Row!</Typography>
              </div>
            )}

            <Player
              autoplay
              loop
              src='/anims/confetti.json'
              style={{
                height: '300px',
                width: '300px',
                position: 'absolute',
                bottom: 0,
                left: 0,
              }}
            >
              <Controls
                visible={false}
                buttons={['play', 'repeat', 'frame', 'debug']}
              />
            </Player>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                handleNext();
              }}
            >
              Next
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <div>
        <Typography variant='h6' color='gray'>
          {office.name}
        </Typography>

        <div className='flex flex-row justify-between'>
          <div>
            <Typography variant='h5' className='inline'>
              Question {(activeIndex + 1).toString().padStart(2, '0')}
            </Typography>

            <Typography variant='h6' color='gray' className='inline'>
              /{quests.length.toString().padStart(2, '0')}
            </Typography>
          </div>

          <Box>
            {/* <Button
              variant='text'
              // className='lg:h-18 h-10 w-1/3 rounded-md shadow-lg lg:w-1/6'
              onClick={handleNext}
            >
              Next <KeyboardArrowRightIcon />
            </Button> */}
            <Chip
              size='small'
              className='mx-1 my-1 capitalize shadow-sm'
              label={quests[activeIndex].submission?.status ?? 'New'}
              variant='filled'
              color={
                quests[activeIndex].submission?.status
                  ? getColorByStatus(quests[activeIndex].submission?.status)
                  : 'info'
              }
            />
          </Box>
        </div>
        <Divider></Divider>

        <div className='flex flex-wrap'>
          {quests.map((quest, ind) => {
            return (
              <span className='m-1'>
                <Chip
                  icon={getIconByStatus(quest.submission?.status)}
                  label={ind + 1}
                  variant={
                    quest.submission?.status || activeIndex === ind
                      ? 'filled'
                      : 'outlined'
                  }
                  color={
                    activeIndex === ind
                      ? 'primary'
                      : quest.submission?.status
                      ? getColorByStatus(quest.submission?.status)
                      : 'secondary'
                  }
                  onClick={() => handleNext(ind)}
                  disabled={ind > maxIndex}
                />
              </span>
            );
          })}
        </div>

        <AlertCommon
          open={alert}
          msg={alert?.message}
          error={alert?.type === 'error'}
          onClose={() => setAlert(null)}
        ></AlertCommon>

        <Typography variant='h6' className='pt-7'>
          {quests[activeIndex].quest}
        </Typography>
      </div>

      <FormWrapper form={form} onSubmit={handleSubmit}>
        <div>{renderAnswer(form, quests[activeIndex])}</div>

        <div className='flex flex-row justify-start'>
          <Button
            type='submit'
            variant='contained'
            className='lg:h-18 h-10 w-1/3 rounded-md shadow-sm lg:w-1/6'
            disabled={!quests[activeIndex].canSubmit}
          >
            Submit
          </Button>
        </div>
      </FormWrapper>
    </Stack>
  );
};

Quests.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default Quests;

export const getServerSideProps = StudentRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  // const [quests, officeData, myQuests, latestQuest] = await Promise.all([
  //   useGetApi('quest/office/' + ctx.params.id, {}, accessToken),
  //   useGetApi('office/' + ctx.params.id, {}, accessToken),
  //   useGetApi('student-quest/office/' + ctx.params.id, {}, accessToken),
  //   useGetApi(
  //     'student-quest/office/' + ctx.params.id + '/latest',
  //     {},
  //     accessToken
  //   ),
  // ]);

  const myQuests = await useGetApi(
    'student-quest/office/' + ctx.params.id,
    {},
    accessToken
  );

  console.log(myQuests);

  return {
    props: {
      quests: myQuests.data.quests,
      office: myQuests.data.office,
    },
  };
});
