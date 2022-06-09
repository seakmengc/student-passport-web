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

//TODO: finish
const renderChildrenCards = (office) => {
  return (
    <>
      <Typography variant='h4' className='pb-4'>
        {office?.name}
      </Typography>
      <Grid container spacing={6}>
        {office?.children?.map((unit) => {
          return (
            <Grid item xs={12} sm={6} md={4}>
              <Card>
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const OfficeDetail = ({ office }) => {
  const router = useRouter();

  const renderContent = () => {
    if (office?.children?.length > 0) {
      return renderChildrenCards(office);
    }

    return <OfficeRenderer office={office}></OfficeRenderer>;
  };

  return <>{renderContent()}</>;
};

export default OfficeDetail;

export const getServerSideProps = StudentRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  return {
    props: { office: data },
  };
});
