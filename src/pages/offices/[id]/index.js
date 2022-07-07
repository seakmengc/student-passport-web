import { useEffect, useState } from 'react';
import { useGetApi } from 'src/utils/api';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { StudentRoute } from 'src/middleware/student-route';
import { ssrGetToken } from 'src/utils/ssr';
import OfficeRenderer from 'src/components/offices/detail';
import { StudentLayout } from 'src/layouts/StudentLayout';
import { OfficeCard } from 'src/components/pages/office';
import { defaultProgress } from 'src/pages';

const renderChildrenCards = (office, router) => {
  return (
    <>
      <Typography variant='h4' className='pb-4'>
        {office?.name}
      </Typography>
      <Grid container spacing={6}>
        {office?.children?.map((unit) => {
          return (
            <Grid item xs={12} sm={6} md={4}>
              <OfficeCard office={unit} />
              {/* <Card>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color='text.secondary'
                    gutterBottom
                  >
                    {unit.name}
                  </Typography>
                  <Typography variant='h5' component='div'>
                    {unit.name}
                  </Typography>
                  <Typography variant='body2'>{unit.name}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => {
                      router.push(`/units/${unit._id}`);
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
    </>
  );
};

const OfficeDetail = ({ office }) => {
  const router = useRouter();

  const renderContent = (office) => {
    if (office?.children?.length > 0) {
      return renderChildrenCards(office, router);
    }

    return <OfficeRenderer office={office}></OfficeRenderer>;
  };

  return <>{renderContent(office)}</>;
};

OfficeDetail.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default OfficeDetail;

export const getServerSideProps = StudentRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const officesData = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  if (officesData.data.children.length > 0) {
    const studentOfficesData = await useGetApi(
      'student-office',
      { officeIds: officesData.data.children.map((each) => each._id) },
      accessToken
    );

    officesData.data.children = officesData.data.children.map((each) => {
      return {
        ...each,
        progress:
          studentOfficesData?.data?.find(
            (studentOffice) => studentOffice.office === each._id
          ) ?? defaultProgress,
      };
    });
  } else {
    const studentOfficesData = await useGetApi(
      'student-office',
      { officeIds: officesData.data._id },
      accessToken
    );

    officesData.data.progress = studentOfficesData.data[0] ?? defaultProgress;
  }

  return {
    props: { office: officesData.data },
  };
});
