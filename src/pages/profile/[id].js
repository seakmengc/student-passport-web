import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';
import { StudentRoute } from 'src/middleware/student-route';
import { getUploadUrl } from 'src/utils/user';
import { useGetApi } from 'src/utils/api';
import Image from 'next/image';
import { StudentLayout } from 'src/layouts/StudentLayout';
import { ssrGetToken } from 'src/utils/ssr';
import { Avatar, Card, Grid, Link, Text } from '@nextui-org/react';
import { Chip, Divider, Typography } from '@mui/material';
import moment from 'moment';

const ProfileDetail = () => {
  const [profile, setProfile] = useState();
  const [offices, setOffices] = useState([]);
  const router = useRouter();
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    let user = null;
    if (router.query.id === 'my') {
      setProfile(auth);
      user = auth;
    } else {
      const { data, error } = await useGetApi('user/' + router.query.id);

      setProfile(data);
      user = data;
    }

    if (user.student.officesCompleted.length === 0) {
      return;
    }

    const officesData = await useGetApi('office/ids', {
      ids: user.student.officesCompleted,
    });
    setOffices(officesData.data);
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className='grid justify-items-center space-y-2'>
        {profile.profileUrl && (
          <div className='w-1/6'>
            <Avatar
              size='0.2'
              src={profile.profileUrl}
              color='gradient'
              bordered
              zoomed
            />
          </div>
        )}

        <Typography variant='h5'>
          {profile.name} <Chip label='Master' color='primary'></Chip>
        </Typography>

        <Typography variant='h7'>
          Joined Since: {moment(profile.createdAt).format('y')}
        </Typography>
      </div>

      <Divider />
      <Typography variant='h6'>Achievements:</Typography>

      <Grid.Container gap={2} justify='flex-start'>
        {offices.map((office, index) => {
          return (
            <Grid xs={6} sm={3} key={index}>
              {/* <Link> */}
              <Card isPressable isHoverable variant='bordered'>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    src={getUploadUrl(office.stamp)}
                    objectFit='cover'
                    width='100%'
                    height={250}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: 'flex-start' }}>
                  <Text b>{office.name}</Text>
                </Card.Footer>
              </Card>
              {/* </Link> */}
            </Grid>
          );
        })}
      </Grid.Container>
    </div>
  );
};

ProfileDetail.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default ProfileDetail;

export const getServerSideProps = StudentRoute();
