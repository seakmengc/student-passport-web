import { AdminRoute } from 'src/middleware/admin-route';
import { useRouter } from 'next/router';
import { CrudTableNoPagination } from 'src/components/crud/table-no-pagination';
import { useDeleteApi, useGetApi } from 'src/utils/api';
import { Chip, Typography } from '@mui/material';
import { ssrGetToken } from 'src/utils/ssr';
import { OfficePerm } from 'src/perms/office';

const cols = [
  { field: 'quest', display: 'Quest' },
  {
    field: 'questType',
    display: 'Type',
    format: { className: 'uppercase' },
    getCell: (row) => {
      return (
        <Chip
          label={row.questType}
          color={row.questType === 'mcq' ? 'success' : 'info'}
          variant='filled'
        />
      );
    },
  },
];

export default function QuestList({ office }) {
  const router = useRouter();
  const officeId = router.query.id;

  return (
    <>
      <Typography variant='h5'>Quests of {office?.name}</Typography>
      <CrudTableNoPagination
        indexEndpoint={`quest/office/${officeId}`}
        cols={cols}
        getNameIdentifier={(quest) => quest.quest}
        shouldDisplay={(quest, action) => {
          if (action === 'show') {
            return false;
          }

          if (action === 'create') {
            return OfficePerm.isAdminOfOffice(office);
          }

          return OfficePerm.isAdminOfOffice(quest?.office);
        }}
        onCreateClick={() => {
          router.push(router.asPath + '/create');
        }}
        onEditClick={(quest) => {
          router.push(router.asPath + '/' + quest._id);
        }}
        // onShowClick={(quest) => {
        //   router.push(router.asPath + `/${quest._id}/detail`);
        // }}
        onDeleteClick={async (quest) => {
          const { data, error } = await useDeleteApi('quest/' + quest._id);
        }}
      ></CrudTableNoPagination>
    </>
  );
}

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi(
    'office/' + ctx.params.id,
    {},
    accessToken
  );

  data.admins = data.admins.map((admin) => admin._id);

  return {
    props: { office: data },
  };
});
