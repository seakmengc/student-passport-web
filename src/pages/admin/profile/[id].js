import { AdminRoute } from 'src/middleware/admin-route';
import UserProfile from 'src/pages/profile/[id]';
import UserLayout from 'src/layouts/UserLayout';

const ClonedUserProfile = UserProfile;

ClonedUserProfile.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default ClonedUserProfile;

export const getServerSideProps = AdminRoute();
