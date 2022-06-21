import router from 'next/router';
import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';
import { AdminRoute } from 'src/middleware/admin-route';

const cols = [
  { field: 'office.name', display: 'Office Name' },
  { field: 'quest.quest', display: 'Quest' },
  { field: 'user.firstName', display: 'Student Name' },
];

export default function ApprovalIndex() {
  return (
    <CrudTable
      indexEndpoint='student-quest'
      getSearchQuery={(search) => 'firstName=' + search}
      cols={cols}
      shouldDisplay={(_, action) => {
        if (action === 'show') {
          return true;
        }

        return OfficePerm.isSuperAdmin();
      }}
      onEditClick={(studentQuest) => {
        router.push(router.asPath + '/' + studentQuest._id);
      }}
      onShowClick={(studentQuest) => {
        router.push(router.asPath + '/' + studentQuest._id + '/detail');
      }}
      onDeleteClick={async (studentQuest) => {
        const { data, error } = await useDeleteApi(
          'studentQuest/' + studentQuest._id
        );
      }}
      getNameIdentifier={(studentQuest) =>
        `${studentQuest.user?.firstName}'s quest`
      }
      searchLabel='Search'
    ></CrudTable>
  );
}

export const getServerSideProps = AdminRoute();
