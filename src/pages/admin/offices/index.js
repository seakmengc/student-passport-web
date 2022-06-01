// import 'react-datepicker/dist/react-datepicker.css';
import { AdminRoute } from 'src/middleware/admin-route';
import { IconButton, Tooltip } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useRouter } from 'next/router';
import { CrudTableNoPagination } from 'src/components/crud/table-no-pagination';
import { useDeleteApi } from 'src/utils/api';

const cols = [{ field: 'name', display: 'Name' }];

export default function OfficeList() {
  const router = useRouter();

  return (
    <>
      <CrudTableNoPagination
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
          router.push(router.asPath + '/create');
        }}
        onEditClick={(office) => {
          router.push(router.asPath + '/' + office._id);
        }}
        onShowClick={(office) => {
          router.push(router.asPath + '/' + office._id + '/detail');
        }}
        onDeleteClick={async (office) => {
          const { data, error } = await useDeleteApi('office/' + office._id);
        }}
        getNameIdentifier={(office) => office.name}
        searchLabel='Search by Office Name'
      ></CrudTableNoPagination>
    </>
  );
}

export const getServerSideProps = AdminRoute();
