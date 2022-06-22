import { AdminRoute } from 'src/middleware/admin-route';
import Leaderboard from 'src/pages/leaderboard';
import UserLayout from 'src/layouts/UserLayout';

const ClonedLeaderboard = Leaderboard;

ClonedLeaderboard.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default ClonedLeaderboard;

export const getServerSideProps = AdminRoute();
