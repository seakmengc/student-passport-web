// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline';
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline';

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table';
import Trophy from 'src/views/dashboard/Trophy';
import TotalEarning from 'src/views/dashboard/TotalEarning';
import StatisticsCard from 'src/views/dashboard/StatisticsCard';
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview';
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw';
import SalesByCountries from 'src/views/dashboard/SalesByCountries';
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
} from '@mui/material';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [offices, setOffices] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    const { data, error } = await useGetApi('office');

    setOffices(data);
  }, []);

  return (
    <Grid container spacing={6}>
      {offices.map((office) => {
        return (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  {office.name}
                </Typography>
                <Typography variant='h5' component='div'>
                  {office.name}
                </Typography>
                <Typography variant='body2'>{office.name}</Typography>
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
