import { useEffect, useState } from 'react';
import { StudentRoute } from 'src/middleware/student-route';
import { useGetApi } from 'src/utils/api';

const Leaderboard = () => {
  const [myRank, setMyRank] = useState();
  const [leaderboard, setLeaderboard] = useState();

  useEffect(async () => {
    const [myRankData, leaderboardData] = await Promise.all([
      useGetApi('leaderboard/me'),
      useGetApi('leaderboard'),
    ]);

    setMyRank(myRankData.data);
    setLeaderboard(leaderboardData.data);
  }, []);

  return (
    <div>
      <p>Leaderboard</p>

      {myRank && (
        <p>
          My Rank - {myRank['score'] ?? '0'}, {myRank['rank'] ?? 'N/A'}
        </p>
      )}

      {leaderboard?.map((each) => {
        return (
          <div>
            <p>
              {each.firstName} {each.lastName} - {each.score}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;

export const getServerSideProps = StudentRoute();
