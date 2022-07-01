import { Chip, Link, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { StudentLayout } from 'src/layouts/StudentLayout';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi } from 'src/utils/api';
import { Avatar } from '@nextui-org/react';
import { getProfileUrl, getUploadUrl } from 'src/utils/user';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';
import { findByModelIdPredicate } from 'src/utils/model';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const renderRankComponent = ({ router, user, ind, auth, offices }) => {
  return (
    <Paper
      className='sm:align-center flex flex-col justify-between p-2 shadow-lg sm:flex-row sm:space-x-4'
      elevation={7}
      id={ind + 1}
    >
      <div className='flex flex-row items-center space-x-3'>
        <div className='flex w-16 justify-end'>
          {ind === 0 ? (
            <Chip label='01' icon={<MilitaryTechIcon />} color='success'></Chip>
          ) : (
            <Chip
              label={(ind + 1).toString().padStart(2, '0')}
              color={user._id === auth._id ? 'primary' : undefined}
            ></Chip>
          )}
        </div>
        <Avatar
          size='lg'
          src={getProfileUrl(user)}
          color={ind === 0 ? 'gradient' : ''}
          bordered
          zoomed
          onClick={() => {
            router.push('/profile/' + user._id);
          }}
          className='hover:cursor-pointer'
        />
        <Link
          href={
            (router.asPath.startsWith('/admin') ? '/admin' : '') +
            '/profile/' +
            user._id
          }
        >
          <Typography
            variant='h7'
            className='hover:cursor-pointer hover:underline'
          >
            {user.firstName} {user.lastName}
          </Typography>
        </Link>
      </div>
      <div className='flex justify-end'>
        <Avatar.Group
          count={Math.max(0, user.student.officesCompleted.length - 4)}
        >
          {user.student.officesCompleted.slice(0, 4).map((each) => {
            return (
              <Avatar
                src={getUploadUrl(
                  offices?.find((office) => office._id === each)?.stamp
                )}
              />
            );
          })}
        </Avatar.Group>
      </div>
    </Paper>
  );
};

const Leaderboard = () => {
  const [myRank, setMyRank] = useState();
  const [leaderboard, setLeaderboard] = useState();
  const [offices, setOffices] = useState();
  const router = useRouter();
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    const [leaderboardData, officesData] = await Promise.all([
      useGetApi('leaderboard'),
      useGetApi('office/ids'),
    ]);

    setLeaderboard(leaderboardData.data);
    setOffices(officesData.data);

    if (auth) {
      const ind = leaderboardData.data.findIndex(findByModelIdPredicate(auth));
      if (ind < 0) {
        setMyRank(null);
      } else {
        setMyRank(ind + 1);
      }
    }
  }, []);

  return (
    <div className='flex flex-row justify-center'>
      <div className='w-full sm:w-5/6'>
        <Typography variant='h4' className='pb-4'>
          Leaderboard
        </Typography>

        {!auth?.isAdmin && myRank !== undefined && (
          <div className='pb-3'>
            <div className='p-2'>
              <Typography variant='h6'>
                My Rank - {myRank ?? 'N/A'}
                {myRank && (
                  <Link className='pl-2' href={'#' + myRank}>
                    VIEW
                  </Link>
                )}
              </Typography>
            </div>
          </div>
        )}

        <div className='pb-12'>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-row justify-between px-2'>
              <div className='flex flex-row items-center space-x-8'>
                <Typography variant='h6'>Rank</Typography>
                <Typography variant='h6'>Student</Typography>
              </div>
              <Typography variant='h6'>Achievements</Typography>
            </div>

            {leaderboard?.map((each, ind) =>
              renderRankComponent({ router, auth, user: each, ind, offices })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Leaderboard.getLayout = (page) => <StudentLayout>{page}</StudentLayout>;

export default Leaderboard;

export const getServerSideProps = StudentRoute();
