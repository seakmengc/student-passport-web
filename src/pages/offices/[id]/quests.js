import {
  Box,
  Button,
  Divider,
  Grid,
  MobileStepper,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { Radio } from '@nextui-org/react';
import { useState } from 'react';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi } from 'src/utils/api';
import { ssrGetToken } from 'src/utils/ssr';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { CustomSingleChip } from 'src/@core/components/forms/custom-single-chip';
import CustomImage from 'src/@core/components/forms/custom-image';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const renderAnswer = (quest) => {
  if (quest.questType === 'input') {
    return <CustomTextField label='Type your answer here'></CustomTextField>;
  }

  if (quest.questType === 'media') {
    return (
      <Box
        className='grid place-content-center'
        variant='contained'
        htmlFor='upload'
      >
        <div>
          <ImgStyled className='p-3' />
        </div>

        <input
          hidden
          type='file'
          // onChange={onImageChange}
          accept='image/png, image/jpeg'
          id='upload'
        />

        <Typography variant='caption' sx={{ marginTop: 5 }}>
          Allowed PNG or JPEG. Max size of 1MB.
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
      register={{
        onChange: (selected) => {
          console.log(selected);
        },
      }}
    ></CustomSingleChip>
  );
};

const Quests = ({ quests, latest, office }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(2);
  const maxIndex = quests.length - 1;

  const handleNext = () => {
    setActiveIndex((prevActiveIndex) => (prevActiveIndex + 1) % maxIndex);
  };

  const handleBack = () => {
    setActiveIndex((prevActiveIndex) => (prevActiveIndex - 1) % maxIndex);
  };

  console.log(quests);

  if (maxIndex === 0) {
    return <p>No Quests Yet!</p>;
  }

  return (
    <Stack
      sx={{ minHeight: '100%' }}
      spacing={2}
      justifyContent='space-between'
      className='w-full'
    >
      <div>
        <Typography variant='h6' color='gray'>
          {office.name}
        </Typography>

        <Typography variant='h5'>
          Question {(activeIndex + 1).toString().padStart(2, '0')}
          <Typography variant='h6' color='gray' className='inline'>
            /{(maxIndex + 1).toString().padStart(2, '0')}
          </Typography>
        </Typography>
        <Divider></Divider>

        <Typography variant='h7' className='pt-7'>
          {quests[activeIndex].quest}
        </Typography>
      </div>

      <div>{renderAnswer(quests[activeIndex])}</div>

      <div className='flex flex-row justify-end'>
        <Button
          variant='contained'
          className='lg:h-18 h-12 w-1/3 rounded-md shadow-lg lg:w-1/6'
          onClick={handleNext}
        >
          Next <KeyboardArrowRightIcon />
        </Button>
      </div>
    </Stack>
    // <Box
    //   className='flex flex-row justify-start'
    //   sx={{ minHeight: '100%', maxHeight: '100%' }}
    // >
    //   <div className='w-xl flex flex-col justify-between'>
    //     <div>
    //       <Typography variant='h6' color='gray'>
    //         {office.name}
    //       </Typography>

    //       <Typography variant='h5'>
    //         Question {(activeIndex + 1).toString().padStart(2, '0')}
    //         <Typography variant='h6' color='gray' className='inline'>
    //           /{quests.length.toString().padStart(2, '0')}
    //         </Typography>
    //       </Typography>

    //       <div
    //         style={{
    //           maxHeight: '50%',
    //           overflowY: 'auto',
    //         }}
    //       >
    //         {[...Array(20).keys()].map((each) => {
    //           return (
    //             <Typography variant='h6' className='pt-7'>
    //               {quests[activeIndex].quest}
    //             </Typography>
    //           );
    //         })}
    //       </div>
    //     </div>

    //     <div>
    //       <Box sx={{ width: 300 }}>
    //         <BottomNavigation
    //           showLabels
    //           value={value}
    //           onChange={(event, newValue) => {
    //             setValue(newValue);
    //           }}
    //         >
    //           <BottomNavigationAction label='Recents' icon={<RestoreIcon />} />
    //           <BottomNavigationAction
    //             label='Favorites'
    //             icon={<FavoriteIcon />}
    //           />
    //           <BottomNavigationAction
    //             label='Nearby'
    //             icon={<LocationOnIcon />}
    //           />
    //         </BottomNavigation>
    //       </Box>
    //     </div>
    //   </div>
    // </Box>
  );
};

// const steps = [
//   {
//     label: 'Select campaign settings',
//     description: `For each ad campaign that you create, you can control how much
//                 you're willing to spend on clicks and conversions, which networks
//                 and geographical locations you want your ads to show on, and more.`,
//   },
//   {
//     label: 'Create an ad group',
//     description:
//       'An ad group contains one or more ads which target a shared set of keywords.',
//   },
//   {
//     label: 'Create an ad',
//     description: `Try out different ad text to see what brings in the most customers,
//                 and learn how to enhance your ads using features like ad extensions.
//                 If you run into any problems with your ads, find out how to tell if
//                 they're running and how to resolve approval issues.`,
//   },
// ];

//TODO: finish
// const Quests = ({ quests }) => {
//   const theme = useTheme();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const maxSteps = steps.length;

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   return (
//     <Box className='flex flex-row justify-center'>
//       <div className='max-w-xl'>
//         <Paper
//           square
//           elevation={0}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             height: 50,
//             pl: 2,
//             bgcolor: 'background.default',
//           }}
//         >
//           <Typography>{steps[activeStep].label}</Typography>
//         </Paper>
//         <Box sx={{ height: 255, maxWidth: 900, width: '100%', p: 2 }}>
//           {steps[activeStep].description}
//         </Box>
//         <MobileStepper
//           variant='text'
//           steps={maxSteps}
//           position='static'
//           activeStep={activeStep}
//           nextButton={
//             <Button
//               size='small'
//               onClick={handleNext}
//               disabled={activeStep === maxSteps - 1}
//             >
//               Next
//               {theme.direction === 'rtl' ? (
//                 <KeyboardArrowLeftIcon />
//               ) : (
//                 <KeyboardArrowRightIcon />
//               )}
//             </Button>
//           }
//           backButton={
//             <Button
//               size='small'
//               onClick={handleBack}
//               disabled={activeStep === 0}
//             >
//               {theme.direction === 'rtl' ? (
//                 <KeyboardArrowRightIcon />
//               ) : (
//                 <KeyboardArrowLeftIcon />
//               )}
//               Back
//             </Button>
//           }
//         />
//       </div>
//     </Box>
//   );
// };

export default Quests;

export const getServerSideProps = StudentRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const [quests, officeData, latestQuest] = await Promise.all([
    useGetApi('quest/office/' + ctx.params.id, {}, accessToken),
    useGetApi('office/' + ctx.params.id, {}, accessToken),
    useGetApi(
      'student-quest/office/' + ctx.params.id + '/latest',
      {},
      accessToken
    ),
  ]);

  return {
    props: {
      quests: quests.data,
      latest: latestQuest.data,
      office: officeData.data,
    },
  };
});
