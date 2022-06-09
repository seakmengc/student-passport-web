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

const defaultProgress = {
  completed: false,
  numOfQuestsCompleted: 0,
  quests: [],
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

    setOffices(
      officesData.data.map((office) => {
        return {
          ...office,
          progress:
            studentOfficesData.data.find(
              (studentOffice) => studentOffice.office === office._id
            ) ?? defaultProgress,
        };
      })
    );

    console.log(officesData.data);
  }, []);

  return (
    <Grid container spacing={6}>
      {offices.map((office) => {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <Card hov>
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
            </Card>
          </Grid>
        );
      })}
    </Grid>
    // <ApexChartWrapper>
    //   <Grid container spacing={6}>
    //     <Grid item xs={12} md={4}>
    //       <Trophy />
    //     </Grid>
    //     <Grid item xs={12} md={8}>
    //       <StatisticsCard />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <WeeklyOverview />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <TotalEarning />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <Grid container spacing={6}>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='$25.6k'
    //             icon={<Poll />}
    //             color='success'
    //             trendNumber='+42%'
    //             title='Total Profit'
    //             subtitle='Weekly Profit'
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='$78'
    //             title='Refunds'
    //             trend='negative'
    //             color='secondary'
    //             trendNumber='-15%'
    //             subtitle='Past Month'
    //             icon={<CurrencyUsd />}
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='862'
    //             trend='negative'
    //             trendNumber='-18%'
    //             title='New Project'
    //             subtitle='Yearly Project'
    //             icon={<BriefcaseVariantOutline />}
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='15'
    //             color='warning'
    //             trend='negative'
    //             trendNumber='-18%'
    //             subtitle='Last Week'
    //             title='Sales Queries'
    //             icon={<HelpCircleOutline />}
    //           />
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <SalesByCountries />
    //     </Grid>
    //     <Grid item xs={12} md={12} lg={8}>
    //       <DepositWithdraw />
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Table />
    //     </Grid>
    //   </Grid>
    // </ApexChartWrapper>
  );
};

export default Dashboard;

export const getServerSideProps = StudentRoute();
