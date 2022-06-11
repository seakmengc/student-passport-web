import { StudentLayout } from 'src/layouts/StudentLayout';
import AccountSettings from 'src/pages/admin/account-settings';

AccountSettings.getLayout = (page) => {
  return <StudentLayout>{page}</StudentLayout>;
};

export default AccountSettings;
