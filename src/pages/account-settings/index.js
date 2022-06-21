import { StudentLayout } from 'src/layouts/StudentLayout';
import { AuthRoute } from 'src/middleware/auth-route';
import { StudentRoute } from 'src/middleware/student-route';
import AccountSettings from 'src/pages/admin/account-settings';

AccountSettings.getLayout = (page) => {
  return <StudentLayout>{page}</StudentLayout>;
};

export default AccountSettings;

export const getServerSideProps = StudentRoute();
