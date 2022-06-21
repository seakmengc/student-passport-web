import { useGetApi } from 'src/utils/api';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';
import { StudentRoute } from 'src/middleware/student-route';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import { StudentLayout } from 'src/layouts/StudentLayout';
import { OfficeCard } from 'src/components/pages/office';

export const defaultProgress = {
  completed: false,
  numOfQuestsCompleted: 0,
  quests: [],
  default: true,
};

const Dashboard = () => {
  const [offices, setOffices] = useState([]);
  const router = useRouter();
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    const [officesData, studentOfficesData] = await Promise.all([
      useGetApi('office'),
      useGetApi('student-office'),
    ]);

    const mappedOffices = officesData.data.map((office) => {
      return {
        ...office,
        progress:
          studentOfficesData.data.find(
            (studentOffice) => studentOffice.office === office._id
          ) ?? defaultProgress,
      };
    });

    setOffices(mappedOffices);
  }, []);

  return (
    <div>
      <Typography variant='h4' className='pb-4'>
        Welcome back, {auth?.firstName}!
      </Typography>

      <Grid container spacing={6} className='pb-7'>
        {offices.map((office) => {
          return (
            <Grid item xs={12} sm={6} md={4}>
              <OfficeCard office={office} />
              {/* <Card hov>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  {office.progress.numOfQuestsCompleted}
                  {'/'}
                  {office.progress.quests.length}
                </Typography>
                <Typography variant='h5' component='div'>
                  {office.name}
                </Typography>
                <Typography variant='body2'>
                  {office.progress.completed ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  variant='contained'
                  onClick={() => {
                    router.push(`/offices/${office._id}`);
                  }}
                >
                  Detail
                </Button>
              </CardActions>
            </Card> */}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

Dashboard.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default Dashboard;

export const getServerSideProps = StudentRoute();
