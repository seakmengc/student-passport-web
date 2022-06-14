import { Card, Chip, Link, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { StudentLayout } from 'src/layouts/StudentLayout';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi } from 'src/utils/api';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import { Avatar } from '@nextui-org/react';
import { getProfileUrl } from 'src/utils/user';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';

const renderRankComponent = ({ router, user, ind, auth }) => {
  return (
    <Paper
      className='flex flex-row justify-between p-2 shadow-lg'
      elevation={7}
      id={ind + 1}
    >
      <div className='flex flex-row items-center space-x-3'>
        <Chip
          label={(ind + 1).toString().padStart(2, '0')}
          color={user._id === auth._id ? 'primary' : undefined}
        ></Chip>
        <Avatar
          size='lg'
          src={getProfileUrl(user)}
          color='gradient'
          bordered
          zoomed
          onClick={() => {
            router.push('/profile/' + user._id);
          }}
          className='hover:cursor-pointer'
        />
        <Link href={'/profile/' + user._id}>
          <Typography
            variant='h7'
            onClick={() => {
              router.push('/profile/' + user._id);
            }}
            className='hover:cursor-pointer hover:underline'
          >
            {user.firstName} {user.lastName}
          </Typography>
        </Link>
      </div>
      <Avatar.Group count={3}>
        {[...Array(Math.round(Math.random() * 5)).keys()].map((each) => {
          return <Avatar src='/images/misc/trophy.png' />;
        })}
      </Avatar.Group>
    </Paper>
  );
};

const Leaderboard = () => {
  const [myRank, setMyRank] = useState();
  const [leaderboard, setLeaderboard] = useState();
  const router = useRouter();
  const auth = useRecoilValue(authState);

  useEffect(async () => {
    const leaderboardData = await useGetApi('leaderboard');

    setLeaderboard(leaderboardData.data);

    if (auth) {
      setMyRank(
        leaderboardData.data.findIndex((user) => user._id === auth._id) + 1
      );
    }
  }, []);

  return (
    <div className='flex flex-row justify-center'>
      <div className='w-3/4'>
        <Typography variant='h4' className='pb-4'>
          Leaderboard
        </Typography>

        <div className='pb-3'>
          {myRank && (
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
          )}
        </div>

        <div className='pb-12'>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-row justify-between px-2'>
              <div className='flex flex-row items-center space-x-3'>
                <Typography variant='h6'>Rank</Typography>
                <Typography variant='h6'>Student</Typography>
              </div>
              <Typography variant='h6'>Achievements</Typography>
            </div>

            {leaderboard?.map((each, ind) =>
              renderRankComponent({ router, auth, user: each, ind })
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
