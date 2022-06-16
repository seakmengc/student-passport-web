// ** MUI Imports
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Progress } from '@nextui-org/react';

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute',
});

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute',
});

export const OfficeCard = ({ office }) => {
  // ** Hook
  const theme = useTheme();
  const router = useRouter();
  const imageSrc =
    theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png';

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {office.parent ? 'Unit' : 'Office'}
        </Typography>
        {/* <Typography variant='h6'>
          {office.progress.default ? 'Welcome back!' : 'Try me out!'}
        </Typography> */}
        <Typography variant='h5' sx={{ my: 4 }}>
          {office.name}
        </Typography>
        {/* <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {office.progress.numOfQuestsCompleted}
        </Typography> */}
        <div className='my-6 flex w-4/6 flex-row items-center space-x-2'>
          <Progress
            value={
              office.progress?.quests?.length > 0
                ? (office.progress.numOfQuestsCompleted /
                    office.progress.quests.length) *
                  100
                : 0
            }
            striped
            color='success'
            status='success'
            className='inline-block w-3/4'
          />
          <Typography variant='caption'>
            {office.progress?.quests?.length > 0
              ? Math.round(
                  (office.progress.numOfQuestsCompleted /
                    office.progress.quests.length) *
                    10000
                ) / 100
              : 0}
            %
          </Typography>
        </div>
        <Button
          size='small'
          variant='contained'
          onClick={() => {
            router.push(
              `/${office.parent ? 'units' : 'offices'}/${office._id}`
            );
          }}
        >
          View More
        </Button>
        <TriangleImg
          alt='triangle background'
          src={`/images/misc/${imageSrc}`}
        />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  );
};
