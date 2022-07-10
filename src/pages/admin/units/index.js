// import 'react-datepicker/dist/react-datepicker.css';
import { AdminRoute } from 'src/middleware/admin-route';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useRouter } from 'next/router';
import { CrudTableNoPagination } from 'src/components/crud/table-no-pagination';
import { useDeleteApi } from 'src/utils/api';
import { OfficePerm } from 'src/perms/office';

const cols = [
  { field: 'name', display: 'Name' },
  { field: 'parent.name', display: 'Office Name' },
  // {
  //   field: 'hasUnits',
  //   display: 'Has Units',
  //   getCell: (row) => (
  //     <Checkbox
  //       color={row.hasUnits ? 'success' : 'info'}
  //       checked={row.hasUnits}
  //     ></Checkbox>
  //   ),
  // },
];

export default function OfficeList() {
  const router = useRouter();

  return (
    <>
      <CrudTableNoPagination
        indexEndpoint='office/unit'
        getSearchQuery={(search) => 'name=' + search}
        cols={cols}
        getCustomActions={(row) => {
          if (row?.hasUnits) {
            return <></>;
          }

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
        shouldDisplay={(unit, action) => {
          if (action === 'show') {
            return true;
          }

          return OfficePerm.isAdminOfUnit(unit);
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
