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
      const progress =
        studentOfficesData.data.find(
          (studentOffice) => studentOffice.office === office._id
        ) ?? defaultProgress;

      return {
        ...office,
        progress: {
          ...progress,
          numOfQuestsCompleted: studentOfficesData.data.reduce(
            (prevVal, currOffice) =>
              currOffice.parent === office._id
                ? prevVal + currOffice.numOfQuestsCompleted
                : prevVal,
            progress.numOfQuestsCompleted
          ),
          quests: [
            ...progress.quests,
            ...studentOfficesData.data
              .filter((each) => each.parent === office._id)
              .flatMap((each) => each.quests),
          ],
        },
      };
    });

    console.log(mappedOffices);

    setOffices(mappedOffices);
  }, []);

  return (
    <div>
      <Typography variant='h4' className='pb-4'>
        Welcome back, {auth?.firstName}!
      </Typography>

      <Grid container spacing={6} className='pb-7'>
        {offices.map((office, ind) => (
          <Grid item xs={12} sm={6} md={4} key={ind}>
            <OfficeCard office={office} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Dashboard.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default Dashboard;

export const getServerSideProps = StudentRoute();
