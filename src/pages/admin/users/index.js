import { AdminRoute } from 'src/middleware/admin-route';
import router from 'next/router';
import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';

const cols = [
  { field: 'firstName', display: 'Name' },
  { field: 'role', display: 'Role' },
];

export default function UserList() {
  return (
    <>
      <CrudTable
        indexEndpoint='user'
        getSearchQuery={(search) => 'firstName=' + search}
        cols={cols}
        shouldDisplay={(_, action) => {
          if (action === 'show') {
            return true;
          }

          return OfficePerm.isSuperAdmin();
        }}
        onCreateClick={() => {
          router.push(router.asPath + '/register');
        }}
        onEditClick={(user) => {
          router.push(router.asPath + '/' + user._id);
        }}
        onShowClick={(user) => {
          router.push(router.asPath + '/' + user._id + '/detail');
        }}
        onDeleteClick={async (user) => {
          const { data, error } = await useDeleteApi('user/' + user._id);
        }}
        getNameIdentifier={(user) => user.email}
        searchLabel='Search by First Name'
      ></CrudTable>
    </>
  );
}

export const getServerSideProps = AdminRoute();
