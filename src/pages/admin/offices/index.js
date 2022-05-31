// import 'react-datepicker/dist/react-datepicker.css';
import { AdminRoute } from 'src/middleware/admin-route';
import { CrudTable } from 'src/components/crud/table';
import { IconButton, Tooltip } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useRouter } from 'next/router';

const cols = [{ field: 'name', display: 'Name' }];

export default function OfficeList() {
  const router = useRouter();

  return (
    <>
      <CrudTable
        indexEndpoint='office'
        getSearchQuery={(search) => 'name=' + search}
        cols={cols}
        getCustomActions={(row) => {
          return (
            <Tooltip title='Quests'>
              <IconButton
                onClick={() => {
                  router.push(router.asPath + `/${row._id}/quests`);
                }}
              >
                <QuestionAnswerIcon></QuestionAnswerIcon>
              </IconButton>
            </Tooltip>
          );
        }}
        onCreateClick={() => {
          router.push('/admin/offices/create');
        }}
        onEditClick={(office) => {
          router.push('/admin/offices/' + office._id);
        }}
        onShowClick={(office) => {
          router.push('/admin/offices/' + office._id + '/detail');
        }}
        onDeleteClick={async (office) => {
          const { data, error } = await useDeleteApi('office/' + office._id);
        }}
        getNameIdentifier={(office) => office.name}
        searchLabel='Search by Office Name'
      ></CrudTable>
    </>
  );
}

export const getServerSideProps = AdminRoute();
