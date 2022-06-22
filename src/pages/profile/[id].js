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
import { Avatar, Card, Link, Row, Text } from '@nextui-org/react';
import {
  Button,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import moment from 'moment';
import { Player } from '@lottiefiles/react-lottie-player';

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
          <Box>
            <Avatar
              src={profile.profileUrl}
              color='gradient'
              bordered
              zoomed
              css={{ width: 200, height: 200 }}
            />
          </Box>
        )}

        <Typography variant='h5'>
          {profile.name}
          {/* <Chip label={offices.length} color='primary'></Chip> */}
        </Typography>

        <Typography variant='h7'>
          Joined Since: {moment(profile.createdAt).format('y')}
        </Typography>
      </div>

      <Divider />
      <Typography variant='h6'>Achievements:</Typography>

      {offices.length > 0 ? (
        <div className='flex flex-wrap justify-items-center'>
          {offices.map((office, index) => {
            return (
              <div
                key={index}
                style={{ height: '350px', maxWidth: '250px' }}
                className='my-3 mx-4'
              >
                <Card
                  className='my-3 mx-4 hover:cursor-pointer'
                  onClick={() => {
                    router.push(
                      `/${office.parent ? 'units' : 'offices'}/${office._id}`
                    );
                  }}
                >
                  <CardActionArea>
                    <Typography
                      variant='caption'
                      sx={{ letterSpacing: '0.25px' }}
                      className='whitespace-nowrap pb-2'
                    >
                      {/* {office.parent
                        ? 'Unit Stamp of ' + office.parent.name
                        : 'Office Stamp'} */}

                      {office.parent ? 'Unit Stamp' : 'Office Stamp'}
                    </Typography>
                    <img src={getUploadUrl(office.stamp)} height='100px' />
                    <Typography variant='h5' sx={{ my: 4 }}>
                      {office.name}
                    </Typography>
                  </CardActionArea>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <Player
            autoplay
            loop
            src='/anims/empty.json'
            style={{
              height: '300px',
              width: '300px',
            }}
          ></Player>
          <Typography>No achievement yet. Come back later!</Typography>
        </div>
      )}
    </div>
  );
};

ProfileDetail.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default ProfileDetail;

export const getServerSideProps = StudentRoute();
